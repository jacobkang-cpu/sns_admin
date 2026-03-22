import { Badge } from "@/components/ui/badge";
import { statusLabelMap, statusToneMap } from "@/lib/status";
import type { ContentStatus } from "@/types/domain";

export function StatusBadge({ status }: { status: ContentStatus }) {
  return <Badge tone={statusToneMap[status]}>{statusLabelMap[status]}</Badge>;
}

