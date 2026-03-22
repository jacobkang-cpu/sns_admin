export type ContentStatus =
  | "draft"
  | "approved"
  | "hold"
  | "needs_revision"
  | "posted"
  | "archived";

export type ChannelKey = "instagram" | "threads" | "linkedin" | "blog";

export type ChannelCopyStatus = "generated" | "posted";

export type FormatType =
  | "carousel"
  | "single_image"
  | "short_video"
  | "article"
  | "infographic";

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin";
}

export interface ContentItemRecord {
  id: string;
  title: string;
  targetAudience: string;
  formatType: FormatType;
  coreMessage: string;
  bodyDraft: string;
  productionGuide: string;
  expectedReactionPoints: string;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  createdBy: string | null;
}

export interface ContentHook {
  id: string;
  contentItemId: string;
  hookText: string;
  position: number;
}

export interface ContentCta {
  id: string;
  contentItemId: string;
  ctaText: string;
  position: number;
}

export interface ContentTag {
  id: string;
  contentItemId: string;
  tag: string;
}

export interface ContentAsset {
  id: string;
  contentItemId: string;
  label: string;
  assetType: "image" | "video" | "document";
  url: string;
  createdAt: string;
}

export interface ChannelCopy {
  id: string;
  contentItemId: string;
  channel: ChannelKey;
  copyText: string;
  hashtags: string[];
  callToAction: string;
  status: ChannelCopyStatus;
  generatedAt: string;
  postedAt: string | null;
}

export interface ApprovalLog {
  id: string;
  contentItemId: string;
  fromStatus: ContentStatus | null;
  toStatus: ContentStatus;
  note: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface PerformanceMetric {
  id: string;
  contentItemId: string;
  channel: ChannelKey;
  impressions: number;
  clicks: number;
  saves: number;
  shares: number;
  comments: number;
  conversions: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationSettings {
  id: string;
  toneOfVoice: string;
  contentCadencePerWeek: number;
  targetChannels: ChannelKey[];
  hashtagsPerPost: number;
  defaultAudience: string;
  approvalRequired: boolean;
  promptGuardrails: string[];
}

export interface DemoDatabase {
  users: AdminUser[];
  contentItems: ContentItemRecord[];
  contentHooks: ContentHook[];
  contentCtas: ContentCta[];
  contentTags: ContentTag[];
  channelCopies: ChannelCopy[];
  contentAssets: ContentAsset[];
  approvalLogs: ApprovalLog[];
  performanceMetrics: PerformanceMetric[];
  generationSettings: GenerationSettings;
}

export interface ContentListItem extends ContentItemRecord {
  hooks: string[];
  ctas: string[];
  tags: string[];
  channelCopies: ChannelCopy[];
  metrics: PerformanceMetric[];
}

export interface ContentDetail extends ContentListItem {
  assets: ContentAsset[];
  approvalLogs: ApprovalLog[];
}

export interface DashboardSummary {
  totals: {
    totalContents: number;
    pendingApprovals: number;
    approvedReadyToPublish: number;
    postedContents: number;
  };
  metrics: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgEngagementRate: number;
  };
  recentContents: ContentListItem[];
  approvalQueue: ContentListItem[];
  publishingQueue: ContentListItem[];
}

export interface ContentFilters {
  query?: string;
  status?: ContentStatus | "all";
  formatType?: FormatType | "all";
}

export interface ActionState<TField extends string = string> {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors?: Partial<Record<TField, string[]>>;
}

export const CONTENT_STATUSES: ContentStatus[] = [
  "draft",
  "approved",
  "hold",
  "needs_revision",
  "posted",
  "archived",
];

export const CHANNELS: ChannelKey[] = [
  "instagram",
  "threads",
  "linkedin",
  "blog",
];
