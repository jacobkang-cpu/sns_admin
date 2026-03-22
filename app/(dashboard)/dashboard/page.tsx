import { ContentCard } from "@/components/content-card";
import { EmptyState } from "@/components/empty-state";
import { MetricsSummary } from "@/components/metrics-summary";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/repositories/content-repository";
import { formatNumber } from "@/lib/utils";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const statCards = [
    {
      label: "전체 콘텐츠",
      value: formatNumber(summary.totals.totalContents),
      helper: "누적 초안 및 운영 콘텐츠",
    },
    {
      label: "검토 대기",
      value: formatNumber(summary.totals.pendingApprovals),
      helper: "승인/보류/수정 요청 필요",
    },
    {
      label: "게시 준비",
      value: formatNumber(summary.totals.approvedReadyToPublish),
      helper: "approved 상태의 게시 가능 콘텐츠",
    },
    {
      label: "게시 완료",
      value: formatNumber(summary.totals.postedContents),
      helper: "성과 기록 입력 가능 상태",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations Overview"
        title="콘텐츠 승인부터 게시 준비까지 한 화면에서 관리합니다"
        description="초안 상태, 승인 대기 수, 게시 준비 큐, 누적 성과를 함께 확인할 수 있는 운영 대시보드입니다."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{card.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{card.helper}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <MetricsSummary summary={summary.metrics} />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">승인 대기 큐</h3>
            <p className="text-sm text-muted-foreground">
              현재 검토가 필요한 콘텐츠입니다.
            </p>
          </div>
          {summary.approvalQueue.length ? (
            <div className="grid gap-4">
              {summary.approvalQueue.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="승인 대기 콘텐츠가 없습니다"
              description="현재 검토가 필요한 콘텐츠가 없어 운영 큐가 비어 있습니다."
            />
          )}
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">게시 준비 큐</h3>
            <p className="text-sm text-muted-foreground">
              승인 완료 후 채널별 문안 생성 및 게시 완료 처리가 필요한 콘텐츠입니다.
            </p>
          </div>
          {summary.publishingQueue.length ? (
            <div className="grid gap-4">
              {summary.publishingQueue.map((content) => (
                <ContentCard key={content.id} content={content} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="게시 준비 큐가 비어 있습니다"
              description="승인된 콘텐츠가 생성되면 여기에 표시됩니다."
            />
          )}
        </section>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">최근 업데이트</h3>
          <p className="text-sm text-muted-foreground">
            최근 수정된 콘텐츠 4건입니다.
          </p>
        </div>
        {summary.recentContents.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {summary.recentContents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="업데이트된 콘텐츠가 없습니다"
            description="초안 생성 후 이 영역에 최근 작업 내역이 표시됩니다."
          />
        )}
      </section>
    </div>
  );
}

