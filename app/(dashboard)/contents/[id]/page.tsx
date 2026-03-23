import { notFound } from "next/navigation";

import { ApprovalQuickActionsForm } from "@/components/forms/approval-quick-actions-form";
import { GenerateCopiesForm } from "@/components/forms/generate-copies-form";
import { MarkPostedForm } from "@/components/forms/mark-posted-form";
import { CopyButton } from "@/components/copy-button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getContentDetail } from "@/lib/repositories/content-repository";
import { formatDate, formatNumber } from "@/lib/utils";

type Params = Promise<{ id: string }>;

export default async function ContentDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const content = await getContentDetail(id);

  if (!content) {
    notFound();
  }

  const hasCopies = content.channelCopies.length > 0;
  const instagramCopy = content.channelCopies.find(
    (copy) => copy.channel === "instagram",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content Detail"
        title={content.title}
        description={content.coreMessage}
        action={<StatusBadge status={content.status} />}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>콘텐츠 개요</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Target Audience
                </p>
                <p className="font-medium">{content.targetAudience}</p>
              </div>
              <div className="space-y-2 rounded-2xl bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Format Type
                </p>
                <p className="font-medium">{content.formatType}</p>
              </div>
              <div className="space-y-2 rounded-2xl bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Updated
                </p>
                <p className="font-medium">{formatDate(content.updatedAt)}</p>
              </div>
              <div className="space-y-2 rounded-2xl bg-muted/40 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Tags
                </p>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <Badge key={tag} className="bg-white text-foreground">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hooks & CTA</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3">
                {content.hooks.map((hook, index) => (
                  <div key={hook} className="rounded-2xl bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      Hook {index + 1}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6">{hook}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {content.ctas.map((cta, index) => (
                  <div key={cta} className="rounded-2xl bg-secondary/60 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      CTA {index + 1}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6">{cta}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Draft & Production Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Body Draft
                </h3>
                <p className="whitespace-pre-line text-sm leading-7">{content.bodyDraft}</p>
              </section>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Production Guide
                </h3>
                <p className="whitespace-pre-line text-sm leading-7">
                  {content.productionGuide}
                </p>
              </section>
              <Separator />
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Expected Reaction Points
                </h3>
                <p className="whitespace-pre-line text-sm leading-7">
                  {content.expectedReactionPoints}
                </p>
              </section>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>채널별 게시 문안</CardTitle>
            </CardHeader>
            <CardContent>
              {hasCopies ? (
                <div className="grid gap-4 lg:grid-cols-2">
                  {content.channelCopies.map((copy) => (
                    <Card key={copy.id} className="border bg-white">
                      <CardHeader className="flex flex-row items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-base capitalize">
                            {copy.channel}
                          </CardTitle>
                          <p className="mt-1 text-xs text-muted-foreground">
                            생성일 {formatDate(copy.generatedAt)}
                          </p>
                        </div>
                        <CopyButton
                          value={`${copy.copyText}\n\n${copy.hashtags.join(" ")}\n\n${copy.callToAction}`}
                        />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="whitespace-pre-line text-sm leading-7">
                          {copy.copyText}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {copy.hashtags.map((tag) => (
                            <Badge key={tag} className="bg-muted text-muted-foreground">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="rounded-2xl bg-secondary/60 p-4 text-sm">
                          <p className="font-medium">CTA</p>
                          <p className="mt-2">{copy.callToAction}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="생성된 채널 문안이 없습니다"
                  description="approved 상태에서 채널 문안을 생성하면 Instagram, Threads, LinkedIn, Blog용 카피가 여기에 표시됩니다."
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>성과 기록</CardTitle>
            </CardHeader>
            <CardContent>
              {content.metrics.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>Conversions</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {content.metrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell className="capitalize">{metric.channel}</TableCell>
                        <TableCell>{formatNumber(metric.impressions)}</TableCell>
                        <TableCell>{formatNumber(metric.clicks)}</TableCell>
                        <TableCell>{formatNumber(metric.conversions)}</TableCell>
                        <TableCell>{metric.notes ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <EmptyState
                  title="아직 기록된 성과가 없습니다"
                  description="게시 완료 후 Metrics 화면에서 채널별 성과를 입력하면 대시보드 요약에 반영됩니다."
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>검토 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ApprovalQuickActionsForm contentId={content.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>게시 준비</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.status === "approved" ? (
                <GenerateCopiesForm contentId={content.id} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  approved 상태에서만 채널 문안 생성이 가능합니다.
                </p>
              )}
              {content.status === "approved" && hasCopies ? (
                <MarkPostedForm contentId={content.id} />
              ) : null}
              {instagramCopy ? (
                <CopyButton
                  label="인스타 캡션 복사"
                  value={`${instagramCopy.copyText}\n\n${instagramCopy.hashtags.join(" ")}\n\n${instagramCopy.callToAction}`}
                />
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>로그 이력</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.approvalLogs.length ? (
                content.approvalLogs.map((log) => (
                  <div key={log.id} className="rounded-2xl bg-muted/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">
                        {log.fromStatus ?? "new"} → {log.toStatus}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                    {log.note ? (
                      <p className="mt-2 text-sm text-muted-foreground">{log.note}</p>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">기록된 로그가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
