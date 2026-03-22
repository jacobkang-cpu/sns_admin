import Link from "next/link";

import { ApprovalForm } from "@/components/forms/approval-form";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApprovalsQueue } from "@/lib/repositories/content-repository";
import { formatDate } from "@/lib/utils";

export default async function ApprovalsPage() {
  const queue = await getApprovalsQueue();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Approval Workflow"
        title="승인 대기 콘텐츠"
        description="초안, 보류, 수정 요청 상태의 콘텐츠를 검토하고 승인 상태를 전환합니다."
      />

      {queue.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {queue.map((content) => (
            <Card key={content.id}>
              <CardHeader className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{content.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {content.targetAudience} · {content.formatType}
                    </p>
                  </div>
                  <StatusBadge status={content.status} />
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {content.coreMessage}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-muted/40 p-4 text-sm">
                  <p className="font-medium">최근 수정일</p>
                  <p className="mt-1 text-muted-foreground">{formatDate(content.updatedAt)}</p>
                </div>
                <ApprovalForm contentId={content.id} />
                <Link
                  href={`/contents/${content.id}`}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  상세 페이지 열기
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="승인 대기 항목이 없습니다"
          description="현재 즉시 검토해야 할 초안이 없어 승인 큐가 비어 있습니다."
        />
      )}
    </div>
  );
}
