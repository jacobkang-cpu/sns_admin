"use client";

import { useActionState } from "react";

import { saveGenerationSettingsAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { GenerationSettings } from "@/types/domain";

const channels: GenerationSettings["targetChannels"] = [
  "instagram",
  "threads",
  "linkedin",
  "blog",
];

export function GenerationSettingsForm({
  settings,
}: {
  settings: GenerationSettings;
}) {
  const [state, formAction] = useActionState(
    saveGenerationSettingsAction,
    initialActionState,
  );
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={settings.id} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">톤 가이드</label>
          <Textarea
            name="toneOfVoice"
            defaultValue={settings.toneOfVoice}
            className="min-h-32"
          />
        </div>
        <div className="space-y-4 rounded-2xl bg-muted/40 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">주간 생성 횟수</label>
            <Input
              name="contentCadencePerWeek"
              type="number"
              min="1"
              max="7"
              defaultValue={settings.contentCadencePerWeek}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">기본 타깃</label>
            <Input name="defaultAudience" defaultValue={settings.defaultAudience} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">채널별 해시태그 수</label>
            <Input
              name="hashtagsPerPost"
              type="number"
              min="0"
              max="15"
              defaultValue={settings.hashtagsPerPost}
            />
          </div>
          <label className="flex items-center gap-3 text-sm font-medium">
            <Checkbox
              name="approvalRequired"
              defaultChecked={settings.approvalRequired}
            />
            승인 전 게시 불가 유지
          </label>
        </div>
      </div>
      <div className="rounded-2xl bg-muted/40 p-4">
        <p className="text-sm font-medium">기본 생성 채널</p>
        <div className="mt-3 flex flex-wrap gap-4">
          {channels.map((channel) => (
            <label key={channel} className="flex items-center gap-2 text-sm">
              <Checkbox
                name="targetChannels"
                value={channel}
                defaultChecked={settings.targetChannels.includes(channel)}
              />
              {channel}
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">프롬프트 가드레일</label>
        <Textarea
          name="promptGuardrails"
          defaultValue={settings.promptGuardrails.join("\n")}
          className="min-h-36"
        />
      </div>
      <SubmitButton pendingLabel="저장 중...">설정 저장</SubmitButton>
    </form>
  );
}
