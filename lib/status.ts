import { type ContentStatus } from "@/types/domain";

export const statusLabelMap: Record<ContentStatus, string> = {
  draft: "Draft",
  approved: "Approved",
  hold: "Hold",
  needs_revision: "Needs Revision",
  posted: "Posted",
  archived: "Archived",
};

export const statusToneMap: Record<
  ContentStatus,
  "neutral" | "success" | "warning" | "danger" | "accent"
> = {
  draft: "neutral",
  approved: "success",
  hold: "warning",
  needs_revision: "danger",
  posted: "accent",
  archived: "neutral",
};

