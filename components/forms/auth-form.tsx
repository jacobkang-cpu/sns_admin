"use client";

import { useState } from "react";

import { LoginForm } from "@/components/forms/login-form";
import { SignUpForm } from "@/components/forms/sign-up-form";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

export function AuthForm({ demoMode }: { demoMode: boolean }) {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 rounded-2xl bg-muted p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={cn(
            "rounded-[0.95rem] px-4 py-2.5 text-sm font-medium transition",
            mode === "login"
              ? "bg-white text-foreground shadow-soft"
              : "text-muted-foreground",
          )}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "rounded-[0.95rem] px-4 py-2.5 text-sm font-medium transition",
            mode === "signup"
              ? "bg-white text-foreground shadow-soft"
              : "text-muted-foreground",
          )}
        >
          회원가입
        </button>
      </div>

      {mode === "login" ? (
        <LoginForm demoMode={demoMode} />
      ) : (
        <SignUpForm demoMode={demoMode} />
      )}
    </div>
  );
}

