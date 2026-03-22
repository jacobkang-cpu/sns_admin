"use client";

import { useActionState } from "react";

import { signUpAction } from "@/app/actions";
import { FieldError } from "@/components/forms/field-error";
import { SubmitButton } from "@/components/forms/submit-button";
import { useActionToast } from "@/components/forms/use-action-toast";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/input";

export function SignUpForm({ demoMode }: { demoMode: boolean }) {
  const [state, formAction] = useActionState(signUpAction, initialActionState);
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">
          이름
        </label>
        <Input id="fullName" name="fullName" placeholder="홍길동" />
        <FieldError errors={state.fieldErrors?.fullName} />
      </div>
      <div className="space-y-2">
        <label htmlFor="signUpEmail" className="text-sm font-medium">
          이메일
        </label>
        <Input
          id="signUpEmail"
          name="email"
          type="email"
          placeholder="name@hospital.com"
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="signUpPassword" className="text-sm font-medium">
            비밀번호
          </label>
          <Input
            id="signUpPassword"
            name="password"
            type="password"
            placeholder="8자 이상 입력"
          />
          <FieldError errors={state.fieldErrors?.password} />
        </div>
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            비밀번호 확인
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 다시 입력"
          />
          <FieldError errors={state.fieldErrors?.confirmPassword} />
        </div>
      </div>
      <div className="rounded-2xl bg-secondary/70 p-4 text-sm text-secondary-foreground">
        {demoMode
          ? "Demo mode에서는 로컬 미리보기용 계정이 바로 생성됩니다."
          : "Supabase Auth로 관리자 계정을 생성하고, 설정에 따라 이메일 인증 후 로그인할 수 있습니다."}
      </div>
      <SubmitButton className="w-full" pendingLabel="가입 중...">
        회원가입
      </SubmitButton>
    </form>
  );
}

