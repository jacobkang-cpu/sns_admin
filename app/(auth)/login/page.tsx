import { LockKeyhole, Sparkles } from "lucide-react";

import { AuthForm } from "@/components/forms/auth-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/env";

export default function LoginPage() {
  const demoMode = !isSupabaseConfigured;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10">
      <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-sky-900 via-sky-800 to-cyan-600 text-white">
          <CardContent className="flex h-full flex-col justify-between p-8 md:p-10">
            <div className="space-y-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
                <Sparkles className="h-3.5 w-3.5" />
                Internal Workflow
              </div>
              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold leading-tight">
                  Hospital SNS Content Desk
                </h1>
                <p className="max-w-xl text-sm leading-7 text-white/80">
                  주 3회 생성되는 병원 SNS 초안을 검토하고 승인한 뒤, 채널별 게시
                  문안을 복사해 수동 게시할 수 있도록 설계된 내부 운영 화면입니다.
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Workflow
                </p>
                <p className="mt-2 text-sm font-medium">Draft → Approval → Posting</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Channels
                </p>
                <p className="mt-2 text-sm font-medium">
                  Instagram, Threads, LinkedIn, Blog
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                  Review
                </p>
                <p className="mt-2 text-sm font-medium">상태 로그 및 성과 기록 연동</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="self-center">
          <CardHeader className="space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <CardTitle>로그인 / 회원가입</CardTitle>
              <p className="text-sm text-muted-foreground">
                {demoMode
                  ? "Supabase 미연결 상태에서는 데모 계정 로그인과 로컬 회원가입을 모두 사용할 수 있습니다."
                  : "Supabase Auth 기반으로 관리자 계정을 생성하고 로그인할 수 있습니다."}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <AuthForm demoMode={demoMode} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

