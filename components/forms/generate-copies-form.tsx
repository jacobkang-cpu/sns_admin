"use client";

import { useActionState } from "react";
import { Sparkles } from "lucide-react";

import { generateCopiesAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";

export function GenerateCopiesForm({ contentId }: { contentId: string }) {
  const [state, formAction] = useActionState(
    generateCopiesAction,
    initialActionState,
  );
  useActionToast(state);

  return (
    <form action={formAction}>
      <input type="hidden" name="contentId" value={contentId} />
      <SubmitButton variant="secondary" pendingLabel="생성 중...">
        <Sparkles className="h-4 w-4" />
        채널 문안 생성
      </SubmitButton>
    </form>
  );
}
