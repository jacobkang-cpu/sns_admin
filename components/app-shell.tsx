import Link from "next/link";
import { LogOut, ShieldCheck } from "lucide-react";

import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { logoutAction } from "@/app/actions";
import type { AdminUser } from "@/types/domain";

export function AppShell({
  user,
  children,
}: {
  user: AdminUser;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
      <Card className="data-grid h-fit bg-dashboard-grid p-4 lg:sticky lg:top-6">
        <div className="space-y-6">
          <div className="space-y-3 rounded-[1.4rem] bg-white/90 p-5">
            <Link href="/dashboard" className="block space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Hospital SNS
              </p>
              <h1 className="text-xl font-semibold">Content Desk</h1>
            </Link>
            <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3 text-sm">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
          <SidebarNav />
          <form action={logoutAction}>
            <Button type="submit" variant="outline" className="w-full justify-center">
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </form>
        </div>
      </Card>
      <main className="space-y-6">{children}</main>
    </div>
  );
}
