"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createDemoAuthUser, getDemoAuthUserByEmail } from "@/lib/demo-auth-store";
import { env, isSupabaseConfigured } from "@/lib/env";
import {
  generateChannelCopiesForContent,
  markContentPosted,
  saveGenerationSettings,
  savePerformanceMetric,
  updateContentStatus,
} from "@/lib/repositories/content-repository";
import { clearDemoSession, requireAdmin, setDemoSession } from "@/lib/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  approvalSchema,
  generateCopiesSchema,
  generationSettingsSchema,
  loginSchema,
  markPostedSchema,
  metricSchema,
  signUpSchema,
} from "@/lib/validators";
import type { ActionState } from "@/types/domain";

function validationErrorToActionState(error: {
  flatten: () => { fieldErrors: Record<string, string[]> };
}): ActionState {
  return {
    status: "error",
    message: "입력값을 확인해 주세요.",
    fieldErrors: error.flatten().fieldErrors,
  };
}

function revalidateContentPaths(contentId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/contents");
  revalidatePath("/approvals");
  revalidatePath("/publishing");
  revalidatePath("/metrics");
  if (contentId) {
    revalidatePath(`/contents/${contentId}`);
  }
}

export async function loginAction(
  _prevState: ActionState<"email" | "password">,
  formData: FormData,
): Promise<ActionState<"email" | "password">> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return validationErrorToActionState(parsed.error);
  }

  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      return {
        status: "error",
        message: "로그인에 실패했습니다. 계정을 확인해 주세요.",
      };
    }
  } else {
    const demoUser = await getDemoAuthUserByEmail(parsed.data.email);

    if (!demoUser || demoUser.password !== parsed.data.password) {
      return {
        status: "error",
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      };
    }

    await setDemoSession(demoUser.email);
  }

  redirect("/dashboard");
}

export async function signUpAction(
  _prevState: ActionState<"fullName" | "email" | "password" | "confirmPassword">,
  formData: FormData,
): Promise<ActionState<"fullName" | "email" | "password" | "confirmPassword">> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return validationErrorToActionState(parsed.error);
  }

  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${env.appUrl}/login`,
        data: {
          full_name: parsed.data.fullName,
          role: "admin",
        },
      },
    });

    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }

    if (data.session) {
      redirect("/dashboard");
    }

    return {
      status: "success",
      message:
        "회원가입이 완료되었습니다. 이메일 인증이 켜져 있다면 메일 확인 후 로그인해 주세요.",
    };
  }

  try {
    const demoUser = await createDemoAuthUser({
      email: parsed.data.email,
      fullName: parsed.data.fullName,
      password: parsed.data.password,
    });
    await setDemoSession(demoUser.email);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } else {
    await clearDemoSession();
  }

  redirect("/login");
}

export async function updateContentStatusAction(
  _prevState: ActionState<"nextStatus" | "note">,
  formData: FormData,
): Promise<ActionState<"nextStatus" | "note">> {
  const admin = await requireAdmin();
  const parsed = approvalSchema.safeParse({
    contentId: formData.get("contentId"),
    nextStatus: formData.get("nextStatus"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return validationErrorToActionState(parsed.error);
  }

  const nextStatus = parsed.data.nextStatus;

  if (!["approved", "hold", "needs_revision", "archived"].includes(nextStatus)) {
    return {
      status: "error",
      message: "승인 단계에서 사용할 수 없는 상태값입니다.",
    };
  }

  try {
    await updateContentStatus({
      contentId: parsed.data.contentId,
      nextStatus,
      note: parsed.data.note,
      adminId: admin.id,
    });
    revalidateContentPaths(parsed.data.contentId);
    return {
      status: "success",
      message: "콘텐츠 상태를 업데이트했습니다.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "상태 업데이트에 실패했습니다.",
    };
  }
}

export async function generateCopiesAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = generateCopiesSchema.safeParse({
    contentId: formData.get("contentId"),
  });

  if (!parsed.success) {
    return validationErrorToActionState(parsed.error);
  }

  try {
    await generateChannelCopiesForContent(parsed.data.contentId);
    revalidateContentPaths(parsed.data.contentId);
    return {
      status: "success",
      message: "채널별 게시 문안을 생성했습니다.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "채널 문안 생성에 실패했습니다.",
    };
  }
}

export async function markPostedAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = markPostedSchema.safeParse({
    contentId: formData.get("contentId"),
  });

  if (!parsed.success) {
    return validationErrorToActionState(parsed.error);
  }

  try {
    await markContentPosted(parsed.data.contentId, admin.id);
    revalidateContentPaths(parsed.data.contentId);
    return {
      status: "success",
      message: "게시 완료 처리되었습니다.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "게시 완료 처리에 실패했습니다.",
    };
  }
}

export async function saveMetricAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = metricSchema.safeParse({
    contentId: formData.get("contentId"),
    channel: formData.get("channel"),
    impressions: formData.get("impressions"),
    clicks: formData.get("clicks"),
    saves: formData.get("saves"),
    shares: formData.get("shares"),
    comments: formData.get("comments"),
    conversions: formData.get("conversions"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return validationErrorToActionState(parsed.error);
  }

  try {
    await savePerformanceMetric(parsed.data);
    revalidateContentPaths(parsed.data.contentId);
    return {
      status: "success",
      message: "성과 지표를 저장했습니다.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "성과 저장에 실패했습니다.",
    };
  }
}

export async function saveGenerationSettingsAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = generationSettingsSchema.safeParse({
    id: formData.get("id"),
    toneOfVoice: formData.get("toneOfVoice"),
    contentCadencePerWeek: formData.get("contentCadencePerWeek"),
    targetChannels: formData.getAll("targetChannels"),
    hashtagsPerPost: formData.get("hashtagsPerPost"),
    defaultAudience: formData.get("defaultAudience"),
    approvalRequired: formData.get("approvalRequired") === "on",
    promptGuardrails: String(formData.get("promptGuardrails") ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  });

  if (!parsed.success) {
    return validationErrorToActionState(parsed.error);
  }

  try {
    await saveGenerationSettings(parsed.data);
    revalidatePath("/settings/generation");
    revalidatePath("/dashboard");
    return {
      status: "success",
      message: "생성 설정을 저장했습니다.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "설정 저장에 실패했습니다.",
    };
  }
}
