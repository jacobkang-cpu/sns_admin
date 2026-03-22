import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ContentListItem } from "@/types/domain";
import { formatDate } from "@/lib/utils";

export function ContentCard({
  content,
  showDescription = true,
}: {
  content: ContentListItem;
  showDescription?: boolean;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="text-base leading-6">{content.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={content.status} />
              <Badge>{content.formatType}</Badge>
            </div>
          </div>
        </div>
        {showDescription ? (
          <CardDescription className="max-h-[4.8rem] overflow-hidden">
            {content.coreMessage}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {content.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} className="bg-muted text-muted-foreground">
              #{tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          {formatDate(content.updatedAt)}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Link
          href={`/contents/${content.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          상세 보기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
