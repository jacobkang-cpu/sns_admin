import { AppShell } from "@/components/app-shell";
import { requireAdmin } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return <AppShell user={admin}>{children}</AppShell>;
}

