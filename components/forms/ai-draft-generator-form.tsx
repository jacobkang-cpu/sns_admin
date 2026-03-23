"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WandSparkles } from "lucide-react";

import { generateAiDraftsAction } from "@/app/actions";
import { SubmitButton } from "@/components/forms/submit-button";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";

export function AiDraftGeneratorForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(
    generateAiDraftsAction,
    initialActionState,
  );

  useActionToast(state);

  useEffect(() => {
    if (state.status === "success") {
      router.refresh();
    }
  }, [router, state.status]);

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton pendingLabel="AI 초안 생성 중...">
        <WandSparkles className="h-4 w-4" />
        AI 초안 생성
      </SubmitButton>
      <p className="text-xs text-muted-foreground">
        GPT가 3개의 병원 SNS 초안을 생성해 draft로만 저장합니다.
      </p>
    </form>
  );
}

