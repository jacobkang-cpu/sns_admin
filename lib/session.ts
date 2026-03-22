import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { env, isSupabaseConfigured } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/types/domain";

const DEMO_COOKIE = "hospital-sns-desk-demo-session";

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email ?? env.demoAdminEmail,
      fullName:
        user.user_metadata.full_name ??
        user.user_metadata.name ??
        "Hospital SNS Admin",
      role: "admin",
    };
  }

  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(DEMO_COOKIE)?.value;

  if (sessionValue !== env.demoAdminEmail) {
    return null;
  }

  return {
    id: "demo-admin",
    email: env.demoAdminEmail,
    fullName: "Hospital SNS Admin",
    role: "admin",
  };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login");
  }

  return admin;
}

export async function setDemoSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_COOKIE);
}

