"use client";

import { useActionState } from "react";

import { saveMetricAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ChannelKey } from "@/types/domain";

const channels: ChannelKey[] = ["instagram", "threads", "linkedin", "blog"];

export function MetricsForm({ contentId }: { contentId: string }) {
  const [state, formAction] = useActionState(saveMetricAction, initialActionState);
  useActionToast(state);

  return (
    <form action={formAction} className="grid gap-4 rounded-2xl bg-muted/40 p-4 md:grid-cols-2 xl:grid-cols-4">
      <input type="hidden" name="contentId" value={contentId} />
      <div className="space-y-2">
        <label className="text-sm font-medium">채널</label>
        <Select name="channel" defaultValue="instagram">
          {channels.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Impressions</label>
        <Input name="impressions" type="number" min="0" defaultValue="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Clicks</label>
        <Input name="clicks" type="number" min="0" defaultValue="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Saves</label>
        <Input name="saves" type="number" min="0" defaultValue="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Shares</label>
        <Input name="shares" type="number" min="0" defaultValue="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Comments</label>
        <Input name="comments" type="number" min="0" defaultValue="0" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Conversions</label>
        <Input name="conversions" type="number" min="0" defaultValue="0" />
      </div>
      <div className="space-y-2 xl:col-span-4">
        <label className="text-sm font-medium">메모</label>
        <Textarea name="notes" placeholder="성과 해석 또는 다음 개선 포인트를 기록합니다." />
      </div>
      <div className="xl:col-span-4">
        <SubmitButton pendingLabel="저장 중...">성과 저장</SubmitButton>
      </div>
    </form>
  );
}
