"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { updateContentStatusAction } from "@/app/actions";
import { FieldError } from "@/components/forms/field-error";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ApprovalQuickActionsForm({
  contentId,
}: {
  contentId: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    updateContentStatusAction,
    initialActionState,
  );

  useActionToast(state);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl bg-muted/40 p-4">
      <input type="hidden" name="contentId" value={contentId} />
      <div className="space-y-2">
        <label htmlFor={`detail-note-${contentId}`} className="text-sm font-medium">
          메모
        </label>
        <Textarea
          id={`detail-note-${contentId}`}
          name="note"
          placeholder="승인 사유나 보류/수정 요청 사유를 남겨 주세요."
        />
        <FieldError errors={state.fieldErrors?.note} />
      </div>
      <div className="grid gap-3">
        <Button type="submit" name="nextStatus" value="approved">
          승인
        </Button>
        <Button type="submit" name="nextStatus" value="hold" variant="outline">
          보류
        </Button>
        <Button
          type="submit"
          name="nextStatus"
          value="needs_revision"
          variant="secondary"
        >
          수정 요청
        </Button>
      </div>
    </form>
  );
}

