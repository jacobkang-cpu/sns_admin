"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";

import { markPostedAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";

export function MarkPostedForm({ contentId }: { contentId: string }) {
  const [state, formAction] = useActionState(
    markPostedAction,
    initialActionState,
  );
  useActionToast(state);

  return (
    <form action={formAction}>
      <input type="hidden" name="contentId" value={contentId} />
      <SubmitButton pendingLabel="처리 중...">
        <Send className="h-4 w-4" />
        게시 완료 처리
      </SubmitButton>
    </form>
  );
}
