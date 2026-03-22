import { z } from "zod";

const contentStatusValues = [
  "draft",
  "approved",
  "hold",
  "needs_revision",
  "posted",
  "archived",
] as const;

const channelValues = [
  "instagram",
  "threads",
  "linkedin",
  "blog",
] as const;

export const loginSchema = z.object({
  email: z.string().email("유효한 이메일을 입력해 주세요."),
  password: z.string().min(6, "비밀번호를 6자 이상 입력해 주세요."),
});

export const signUpSchema = z
  .object({
    fullName: z.string().min(2, "이름을 2자 이상 입력해 주세요."),
    email: z.string().email("유효한 이메일을 입력해 주세요."),
    password: z.string().min(8, "비밀번호를 8자 이상 입력해 주세요."),
    confirmPassword: z.string().min(8, "비밀번호 확인을 입력해 주세요."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "비밀번호가 일치하지 않습니다.",
  });

export const approvalSchema = z.object({
  contentId: z.string().min(1),
  nextStatus: z.enum(contentStatusValues),
  note: z.string().max(500, "메모는 500자 이하로 입력해 주세요.").optional(),
});

export const generateCopiesSchema = z.object({
  contentId: z.string().min(1),
});

export const markPostedSchema = z.object({
  contentId: z.string().min(1),
});

export const metricSchema = z.object({
  contentId: z.string().min(1),
  channel: z.enum(channelValues),
  impressions: z.coerce.number().int().min(0),
  clicks: z.coerce.number().int().min(0),
  saves: z.coerce.number().int().min(0),
  shares: z.coerce.number().int().min(0),
  comments: z.coerce.number().int().min(0),
  conversions: z.coerce.number().int().min(0),
  notes: z.string().max(1000, "메모는 1,000자 이하로 입력해 주세요.").optional(),
});

export const generationSettingsSchema = z.object({
  id: z.string().min(1),
  toneOfVoice: z.string().min(10, "톤 가이드를 조금 더 구체적으로 작성해 주세요."),
  contentCadencePerWeek: z.coerce.number().int().min(1).max(7),
  targetChannels: z
    .array(z.enum(channelValues))
    .min(1, "최소 1개 채널을 선택해 주세요."),
  hashtagsPerPost: z.coerce.number().int().min(0).max(15),
  defaultAudience: z.string().min(2, "기본 타깃을 입력해 주세요."),
  approvalRequired: z.boolean(),
  promptGuardrails: z
    .array(z.string().min(2))
    .min(1, "최소 1개 이상의 가드레일을 입력해 주세요."),
});
