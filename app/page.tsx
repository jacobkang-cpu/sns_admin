import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/session";

export default async function HomePage() {
  const admin = await getCurrentAdmin();
  redirect(admin ? "/dashboard" : "/login");
}

