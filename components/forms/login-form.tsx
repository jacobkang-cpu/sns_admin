"use client";

import { useActionState } from "react";

import { loginAction } from "@/app/actions";
import { FieldError } from "@/components/forms/field-error";
import { SubmitButton } from "@/components/forms/submit-button";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";

export function LoginForm({ demoMode }: { demoMode: boolean }) {
  const [state, formAction] = useActionState(loginAction, initialActionState);
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          관리자 이메일
        </label>
        <Input id="email" name="email" type="email" placeholder="admin@hospital-desk.local" />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          비밀번호
        </label>
        <Input id="password" name="password" type="password" placeholder="비밀번호 입력" />
        <FieldError errors={state.fieldErrors?.password} />
      </div>
      {demoMode ? (
        <div className="rounded-2xl bg-secondary/70 p-4 text-sm text-secondary-foreground">
          Demo mode: `admin@hospital-desk.local` / `demo1234`
        </div>
      ) : null}
      <SubmitButton className="w-full" pendingLabel="로그인 중...">
        로그인
      </SubmitButton>
    </form>
  );
}
