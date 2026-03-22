import { randomUUID } from "node:crypto";

import { generateChannelCopy } from "@/lib/content-templates";
import { readDemoDatabase, writeDemoDatabase } from "@/lib/demo-store";
import { isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ApprovalLog,
  ChannelCopy,
  ChannelKey,
  ContentDetail,
  ContentFilters,
  ContentItemRecord,
  ContentListItem,
  ContentStatus,
  DashboardSummary,
  DemoDatabase,
  GenerationSettings,
  PerformanceMetric,
} from "@/types/domain";
import { CHANNELS } from "@/types/domain";

function sortByNewest<T extends { updatedAt?: string; createdAt?: string }>(
  items: T[],
) {
  return items.sort((a, b) => {
    const left = new Date(a.updatedAt ?? a.createdAt ?? 0).getTime();
    const right = new Date(b.updatedAt ?? b.createdAt ?? 0).getTime();
    return right - left;
  });
}

function hydrateContent(
  db: DemoDatabase,
  item: ContentItemRecord,
): ContentDetail {
  const hooks = db.contentHooks
    .filter((hook) => hook.contentItemId === item.id)
    .sort((a, b) => a.position - b.position)
    .map((hook) => hook.hookText);
  const ctas = db.contentCtas
    .filter((cta) => cta.contentItemId === item.id)
    .sort((a, b) => a.position - b.position)
    .map((cta) => cta.ctaText);
  const tags = db.contentTags
    .filter((tag) => tag.contentItemId === item.id)
    .map((tag) => tag.tag);

  return {
    ...item,
    hooks,
    ctas,
    tags,
    channelCopies: db.channelCopies.filter((copy) => copy.contentItemId === item.id),
    metrics: db.performanceMetrics.filter(
      (metric) => metric.contentItemId === item.id,
    ),
    assets: db.contentAssets.filter((asset) => asset.contentItemId === item.id),
    approvalLogs: db.approvalLogs
      .filter((log) => log.contentItemId === item.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
  };
}

function applyFilters<T extends ContentListItem>(items: T[], filters?: ContentFilters) {
  if (!filters) {
    return items;
  }

  return items.filter((item) => {
    const matchesQuery = filters.query
      ? [item.title, item.targetAudience, item.coreMessage, item.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(filters.query.toLowerCase())
      : true;
    const matchesStatus =
      !filters.status || filters.status === "all"
        ? true
        : item.status === filters.status;
    const matchesFormat =
      !filters.formatType || filters.formatType === "all"
        ? true
        : item.formatType === filters.formatType;

    return matchesQuery && matchesStatus && matchesFormat;
  });
}

function buildDashboardSummary(contents: ContentListItem[]): DashboardSummary {
  const metrics = contents.flatMap((content) => content.metrics);
  const totalEngagements = metrics.reduce(
    (acc, metric) =>
      acc + metric.clicks + metric.saves + metric.shares + metric.comments,
    0,
  );
  const totalImpressions = metrics.reduce(
    (acc, metric) => acc + metric.impressions,
    0,
  );

  return {
    totals: {
      totalContents: contents.length,
      pendingApprovals: contents.filter((item) =>
        ["draft", "hold", "needs_revision"].includes(item.status),
      ).length,
      approvedReadyToPublish: contents.filter((item) => item.status === "approved")
        .length,
      postedContents: contents.filter((item) => item.status === "posted").length,
    },
    metrics: {
      totalImpressions,
      totalClicks: metrics.reduce((acc, metric) => acc + metric.clicks, 0),
      totalConversions: metrics.reduce(
        (acc, metric) => acc + metric.conversions,
        0,
      ),
      avgEngagementRate: totalImpressions
        ? Number(((totalEngagements / totalImpressions) * 100).toFixed(1))
        : 0,
    },
    recentContents: sortByNewest([...contents]).slice(0, 4),
    approvalQueue: sortByNewest(
      contents.filter((item) =>
        ["draft", "hold", "needs_revision"].includes(item.status),
      ),
    ).slice(0, 4),
    publishingQueue: sortByNewest(
      contents.filter((item) => item.status === "approved"),
    ).slice(0, 4),
  };
}

async function getDemoContents(filters?: ContentFilters) {
  const db = await readDemoDatabase();
  const hydrated = db.contentItems.map((item) => hydrateContent(db, item));
  return applyFilters(sortByNewest(hydrated), filters);
}

async function getSupabaseContents(filters?: ContentFilters) {
  const supabase = (await createServerSupabaseClient()) as any;
  let query: any = supabase
    .from("content_items")
    .select(
      "*, content_hooks(*), content_ctas(*), content_tags(*), channel_copies(*), content_assets(*), approval_logs(*), performance_metrics(*)",
    )
    .order("updated_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.formatType && filters.formatType !== "all") {
    query = query.eq("format_type", filters.formatType);
  }

  if (filters?.query) {
    query = query.or(
      `title.ilike.%${filters.query}%,target_audience.ilike.%${filters.query}%,core_message.ilike.%${filters.query}%`,
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const mapped = (data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    targetAudience: item.target_audience,
    formatType: item.format_type,
    coreMessage: item.core_message,
    bodyDraft: item.body_draft,
    productionGuide: item.production_guide,
    expectedReactionPoints: item.expected_reaction_points,
    status: item.status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    publishedAt: item.published_at,
    createdBy: item.created_by,
    hooks: (item.content_hooks ?? [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((hook: any) => hook.hook_text),
    ctas: (item.content_ctas ?? [])
      .sort((a: any, b: any) => a.position - b.position)
      .map((cta: any) => cta.cta_text),
    tags: (item.content_tags ?? []).map((tag: any) => tag.tag),
    channelCopies: (item.channel_copies ?? []).map((copy: any) => ({
      id: copy.id,
      contentItemId: copy.content_item_id,
      channel: copy.channel,
      copyText: copy.copy_text,
      hashtags: copy.hashtags,
      callToAction: copy.call_to_action,
      status: copy.status,
      generatedAt: copy.generated_at,
      postedAt: copy.posted_at,
    })),
    metrics: (item.performance_metrics ?? []).map((metric: any) => ({
      id: metric.id,
      contentItemId: metric.content_item_id,
      channel: metric.channel,
      impressions: metric.impressions,
      clicks: metric.clicks,
      saves: metric.saves,
      shares: metric.shares,
      comments: metric.comments,
      conversions: metric.conversions,
      notes: metric.notes,
      createdAt: metric.created_at,
      updatedAt: metric.updated_at,
    })),
    assets: (item.content_assets ?? []).map((asset: any) => ({
      id: asset.id,
      contentItemId: asset.content_item_id,
      label: asset.label,
      assetType: asset.asset_type,
      url: asset.url,
      createdAt: asset.created_at,
    })),
    approvalLogs: (item.approval_logs ?? []).map((log: any) => ({
      id: log.id,
      contentItemId: log.content_item_id,
      fromStatus: log.from_status,
      toStatus: log.to_status,
      note: log.note,
      createdBy: log.created_by,
      createdAt: log.created_at,
    })),
  }));

  return mapped as ContentDetail[];
}

export async function listContents(filters?: ContentFilters) {
  return isSupabaseConfigured
    ? getSupabaseContents(filters)
    : getDemoContents(filters);
}

export async function getContentDetail(contentId: string) {
  const contents = await listContents();
  return contents.find((item) => item.id === contentId) ?? null;
}

export async function getDashboardSummary() {
  const contents = await listContents();
  return buildDashboardSummary(contents);
}

export async function getApprovalsQueue() {
  const contents = await listContents({
    status: "all",
  });

  return contents.filter((item) =>
    ["draft", "hold", "needs_revision"].includes(item.status),
  );
}

export async function getPublishingQueue() {
  const contents = await listContents();
  return contents.filter((item) =>
    item.status === "approved" || item.status === "posted",
  );
}

export async function getMetricsItems() {
  const contents = await listContents();
  return contents.filter((item) => item.status === "posted");
}

export async function getGenerationSettings() {
  if (isSupabaseConfigured) {
    const supabase = (await createServerSupabaseClient()) as any;
    const { data, error } = await supabase
      .from("generation_settings")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return {
      id: data.id,
      toneOfVoice: data.tone_of_voice,
      contentCadencePerWeek: data.content_cadence_per_week,
      targetChannels: data.target_channels as ChannelKey[],
      hashtagsPerPost: data.hashtags_per_post,
      defaultAudience: data.default_audience,
      approvalRequired: data.approval_required,
      promptGuardrails: data.prompt_guardrails,
    } satisfies GenerationSettings;
  }

  const db = await readDemoDatabase();
  return db.generationSettings;
}

async function updateDemoDb(
  updater: (database: DemoDatabase) => Promise<void> | void,
) {
  const db = await readDemoDatabase();
  await updater(db);
  await writeDemoDatabase(db);
}

async function logSupabaseStatusChange(
  contentId: string,
  fromStatus: ContentStatus | null,
  toStatus: ContentStatus,
  note: string | null,
  adminId: string,
) {
  const supabase = (await createServerSupabaseClient()) as any;
  const { error } = await supabase.from("approval_logs").insert({
    id: randomUUID(),
    content_item_id: contentId,
    from_status: fromStatus,
    to_status: toStatus,
    note,
    created_by: adminId,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateContentStatus(params: {
  contentId: string;
  nextStatus: ContentStatus;
  note?: string;
  adminId: string;
}) {
  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    const existing = await getContentDetail(params.contentId);

    if (!existing) {
      throw new Error("콘텐츠를 찾을 수 없습니다.");
    }

    const supabase = (await createServerSupabaseClient()) as any;
    const { error } = await supabase
      .from("content_items")
      .update({
        status: params.nextStatus,
        updated_at: now,
        published_at:
          params.nextStatus === "posted"
            ? existing.publishedAt ?? now
            : existing.publishedAt,
      })
      .eq("id", params.contentId);

    if (error) {
      throw new Error(error.message);
    }

    await logSupabaseStatusChange(
      params.contentId,
      existing.status,
      params.nextStatus,
      params.note ?? null,
      params.adminId,
    );

    return;
  }

  await updateDemoDb((db) => {
    const item = db.contentItems.find((content) => content.id === params.contentId);

    if (!item) {
      throw new Error("콘텐츠를 찾을 수 없습니다.");
    }

    const previousStatus = item.status;
    item.status = params.nextStatus;
    item.updatedAt = now;
    if (params.nextStatus === "posted" && !item.publishedAt) {
      item.publishedAt = now;
    }

    db.approvalLogs.unshift({
      id: randomUUID(),
      contentItemId: item.id,
      fromStatus: previousStatus,
      toStatus: params.nextStatus,
      note: params.note ?? null,
      createdBy: params.adminId,
      createdAt: now,
    });
  });
}

export async function generateChannelCopiesForContent(contentId: string) {
  const content = await getContentDetail(contentId);

  if (!content) {
    throw new Error("콘텐츠를 찾을 수 없습니다.");
  }

  if (content.status !== "approved") {
    throw new Error("Approved 상태의 콘텐츠만 채널 문안을 생성할 수 있습니다.");
  }

  const now = new Date().toISOString();
  const copies: ChannelCopy[] = CHANNELS.map((channel) => {
    const generated = generateChannelCopy(content, channel);
    return {
      id: `${contentId}-${channel}`,
      contentItemId: contentId,
      channel,
      copyText: generated.copyText,
      hashtags: generated.hashtags,
      callToAction: generated.callToAction,
      status: "generated",
      generatedAt: now,
      postedAt: null,
    };
  });

  if (isSupabaseConfigured) {
    const supabase = (await createServerSupabaseClient()) as any;
    const { error } = await supabase.from("channel_copies").upsert(
      copies.map((copy) => ({
        id: copy.id,
        content_item_id: copy.contentItemId,
        channel: copy.channel,
        copy_text: copy.copyText,
        hashtags: copy.hashtags,
        call_to_action: copy.callToAction,
        status: copy.status,
        generated_at: copy.generatedAt,
        posted_at: copy.postedAt,
      })),
    );

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  await updateDemoDb((db) => {
    db.channelCopies = db.channelCopies.filter((copy) => copy.contentItemId !== contentId);
    db.channelCopies.push(...copies);
  });
}

export async function markContentPosted(contentId: string, adminId: string) {
  const content = await getContentDetail(contentId);

  if (!content) {
    throw new Error("콘텐츠를 찾을 수 없습니다.");
  }

  if (content.status !== "approved" && content.status !== "posted") {
    throw new Error("Approved 상태의 콘텐츠만 게시 완료 처리할 수 있습니다.");
  }

  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    const supabase = (await createServerSupabaseClient()) as any;
    const { error: contentError } = await supabase
      .from("content_items")
      .update({
        status: "posted",
        published_at: content.publishedAt ?? now,
        updated_at: now,
      })
      .eq("id", contentId);

    if (contentError) {
      throw new Error(contentError.message);
    }

    const { error: copyError } = await supabase
      .from("channel_copies")
      .update({
        status: "posted",
        posted_at: now,
      })
      .eq("content_item_id", contentId);

    if (copyError) {
      throw new Error(copyError.message);
    }

    await logSupabaseStatusChange(
      contentId,
      content.status,
      "posted",
      "수동 게시 완료",
      adminId,
    );

    return;
  }

  await updateDemoDb((db) => {
    const item = db.contentItems.find((entry) => entry.id === contentId);

    if (!item) {
      throw new Error("콘텐츠를 찾을 수 없습니다.");
    }

    item.status = "posted";
    item.updatedAt = now;
    item.publishedAt = item.publishedAt ?? now;

    db.channelCopies = db.channelCopies.map((copy) =>
      copy.contentItemId === contentId
        ? {
            ...copy,
            status: "posted",
            postedAt: now,
          }
        : copy,
    );

    db.approvalLogs.unshift({
      id: randomUUID(),
      contentItemId: contentId,
      fromStatus: content.status,
      toStatus: "posted",
      note: "수동 게시 완료",
      createdBy: adminId,
      createdAt: now,
    });
  });
}

export async function savePerformanceMetric(params: {
  contentId: string;
  channel: ChannelKey;
  impressions: number;
  clicks: number;
  saves: number;
  shares: number;
  comments: number;
  conversions: number;
  notes?: string;
}) {
  const content = await getContentDetail(params.contentId);

  if (!content) {
    throw new Error("콘텐츠를 찾을 수 없습니다.");
  }

  if (content.status !== "posted") {
    throw new Error("게시 완료된 콘텐츠만 성과를 기록할 수 있습니다.");
  }

  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    const supabase = (await createServerSupabaseClient()) as any;
    const { error } = await supabase.from("performance_metrics").upsert({
      id: `${params.contentId}-${params.channel}-metric`,
      content_item_id: params.contentId,
      channel: params.channel,
      impressions: params.impressions,
      clicks: params.clicks,
      saves: params.saves,
      shares: params.shares,
      comments: params.comments,
      conversions: params.conversions,
      notes: params.notes ?? null,
      created_at: now,
      updated_at: now,
    });

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  await updateDemoDb((db) => {
    const metricId = `${params.contentId}-${params.channel}-metric`;
    const existing = db.performanceMetrics.find((metric) => metric.id === metricId);

    if (existing) {
      existing.impressions = params.impressions;
      existing.clicks = params.clicks;
      existing.saves = params.saves;
      existing.shares = params.shares;
      existing.comments = params.comments;
      existing.conversions = params.conversions;
      existing.notes = params.notes ?? null;
      existing.updatedAt = now;
      return;
    }

    db.performanceMetrics.unshift({
      id: metricId,
      contentItemId: params.contentId,
      channel: params.channel,
      impressions: params.impressions,
      clicks: params.clicks,
      saves: params.saves,
      shares: params.shares,
      comments: params.comments,
      conversions: params.conversions,
      notes: params.notes ?? null,
      createdAt: now,
      updatedAt: now,
    });
  });
}

export async function saveGenerationSettings(
  settings: GenerationSettings,
) {
  const now = new Date().toISOString();

  if (isSupabaseConfigured) {
    const supabase = (await createServerSupabaseClient()) as any;
    const { error } = await supabase.from("generation_settings").upsert({
      id: settings.id,
      tone_of_voice: settings.toneOfVoice,
      content_cadence_per_week: settings.contentCadencePerWeek,
      target_channels: settings.targetChannels,
      hashtags_per_post: settings.hashtagsPerPost,
      default_audience: settings.defaultAudience,
      approval_required: settings.approvalRequired,
      prompt_guardrails: settings.promptGuardrails,
      updated_at: now,
    });

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  await updateDemoDb((db) => {
    db.generationSettings = settings;
  });
}

export async function getRecentMetrics(): Promise<PerformanceMetric[]> {
  const contents = await listContents();
  return contents
    .flatMap((content) => content.metrics)
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

export async function getApprovalLogs(): Promise<ApprovalLog[]> {
  if (isSupabaseConfigured) {
    const supabase = (await createServerSupabaseClient()) as any;
    const { data, error } = await supabase
      .from("approval_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map((log: any) => ({
      id: log.id,
      contentItemId: log.content_item_id,
      fromStatus: log.from_status,
      toStatus: log.to_status,
      note: log.note,
      createdBy: log.created_by,
      createdAt: log.created_at,
    }));
  }

  const db = await readDemoDatabase();
  return db.approvalLogs.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
