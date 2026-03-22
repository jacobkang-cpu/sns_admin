import { GenerateCopiesForm } from "@/components/forms/generate-copies-form";
import { MarkPostedForm } from "@/components/forms/mark-posted-form";
import { CopyButton } from "@/components/copy-button";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublishingQueue } from "@/lib/repositories/content-repository";
import { formatDate } from "@/lib/utils";

export default async function PublishingPage() {
  const items = await getPublishingQueue();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Publishing Desk"
        title="게시 준비"
        description="approved 콘텐츠의 채널별 문안을 생성하고, 복사 후 게시 완료 처리합니다. 자동 업로드는 제공하지 않습니다."
      />

      {items.length ? (
        <div className="grid gap-6">
          {items.map((content) => (
            <Card key={content.id}>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-2">
                    <CardTitle>{content.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {content.targetAudience} · {formatDate(content.updatedAt)}
                    </p>
                  </div>
                  <StatusBadge status={content.status} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {content.coreMessage}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {content.status === "approved" ? (
                    <GenerateCopiesForm contentId={content.id} />
                  ) : null}
                  {content.status === "approved" && content.channelCopies.length ? (
                    <MarkPostedForm contentId={content.id} />
                  ) : null}
                </div>
                {content.channelCopies.length ? (
                  <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
                    {content.channelCopies.map((copy) => (
                      <Card key={copy.id} className="border bg-white">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between gap-3">
                            <CardTitle className="text-base capitalize">
                              {copy.channel}
                            </CardTitle>
                            <CopyButton
                              value={`${copy.copyText}\n\n${copy.hashtags.join(" ")}\n\n${copy.callToAction}`}
                              label="복사"
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="max-h-[9rem] overflow-hidden whitespace-pre-line text-sm leading-6">
                            {copy.copyText}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {copy.hashtags.map((tag) => (
                              <Badge key={tag} className="bg-muted text-muted-foreground">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="아직 채널 문안이 없습니다"
                    description="approved 상태에서 채널 문안을 생성한 후 복사 버튼으로 수동 게시하세요."
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="게시 가능한 콘텐츠가 없습니다"
          description="approved 또는 posted 상태의 콘텐츠가 생성되면 이 화면에 표시됩니다."
        />
      )}
    </div>
  );
}
