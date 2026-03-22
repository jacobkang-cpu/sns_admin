import { MetricsForm } from "@/components/forms/metrics-form";
import { EmptyState } from "@/components/empty-state";
import { MetricsSummary } from "@/components/metrics-summary";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getDashboardSummary,
  getMetricsItems,
} from "@/lib/repositories/content-repository";
import { formatNumber } from "@/lib/utils";

export default async function MetricsPage() {
  const [summary, items] = await Promise.all([
    getDashboardSummary(),
    getMetricsItems(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Performance Tracking"
        title="성과 기록"
        description="posted 처리된 콘텐츠의 채널별 성과를 입력하고, 입력 결과를 대시보드 요약에 반영합니다."
      />

      <MetricsSummary summary={summary.metrics} />

      {items.length ? (
        <div className="grid gap-6">
          {items.map((content) => (
            <Card key={content.id}>
              <CardHeader className="space-y-3">
                <div className="space-y-2">
                  <CardTitle>{content.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{content.targetAudience}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {content.metrics.map((metric) => (
                    <Badge key={metric.id} className="bg-secondary text-secondary-foreground">
                      {metric.channel}: {formatNumber(metric.impressions)} impressions
                    </Badge>
                  ))}
                </div>
                <MetricsForm contentId={content.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="성과 입력 대상이 없습니다"
          description="posted 상태로 전환된 콘텐츠가 있어야 성과를 기록할 수 있습니다."
        />
      )}
    </div>
  );
}

