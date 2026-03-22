import { Activity, BarChart3, MousePointerClick, Target } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

export function MetricsSummary({
  summary,
}: {
  summary: {
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    avgEngagementRate: number;
  };
}) {
  const cards = [
    {
      title: "총 노출",
      value: formatNumber(summary.totalImpressions),
      icon: Activity,
    },
    {
      title: "총 클릭",
      value: formatNumber(summary.totalClicks),
      icon: MousePointerClick,
    },
    {
      title: "총 전환",
      value: formatNumber(summary.totalConversions),
      icon: Target,
    },
    {
      title: "평균 반응률",
      value: `${summary.avgEngagementRate}%`,
      icon: BarChart3,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

