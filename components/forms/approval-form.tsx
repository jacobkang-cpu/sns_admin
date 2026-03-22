"use client";

import { useActionState } from "react";

import { updateContentStatusAction } from "@/app/actions";
import { FieldError } from "@/components/forms/field-error";
import { SubmitButton } from "@/components/forms/submit-button";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ApprovalForm({ contentId }: { contentId: string }) {
  const [state, formAction] = useActionState(
    updateContentStatusAction,
    initialActionState,
  );
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-muted/40 p-4">
      <input type="hidden" name="contentId" value={contentId} />
      <div className="space-y-2">
        <label htmlFor={`status-${contentId}`} className="text-sm font-medium">
          검토 결과
        </label>
        <Select id={`status-${contentId}`} name="nextStatus" defaultValue="approved">
          <option value="approved">approved</option>
          <option value="hold">hold</option>
          <option value="needs_revision">needs_revision</option>
          <option value="archived">archived</option>
        </Select>
        <FieldError errors={state.fieldErrors?.nextStatus} />
      </div>
      <div className="space-y-2">
        <label htmlFor={`note-${contentId}`} className="text-sm font-medium">
          메모
        </label>
        <Textarea
          id={`note-${contentId}`}
          name="note"
          placeholder="승인 사유 또는 수정 요청 내용을 남겨 주세요."
        />
        <FieldError errors={state.fieldErrors?.note} />
      </div>
      <SubmitButton className="w-full" pendingLabel="상태 변경 중...">
        상태 저장
      </SubmitButton>
    </form>
  );
}
