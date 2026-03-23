import type { GeneratedDraftInput, GenerationSettings } from "@/types/domain";

const supportedFormats = [
  "carousel",
  "single_image",
  "short_video",
  "article",
  "infographic",
] as const;

type AIResponsePayload = {
  drafts: GeneratedDraftInput[];
};

function buildPrompt(settings: GenerationSettings) {
  return [
    "Create 3 hospital social media content drafts for an internal admin tool.",
    "Store-ready constraints:",
    "- Each draft must be suitable for a hospital marketing/admin workflow.",
    "- Each draft must be educational and cautious, not diagnostic.",
    "- Status is always draft. Do not mention posting automation.",
    "- Include title, targetAudience, formatType, coreMessage, 3 hooks, bodyDraft, 2 ctas, productionGuide, 3-5 tags, expectedReactionPoints.",
    `Tone of voice: ${settings.toneOfVoice}`,
    `Default audience: ${settings.defaultAudience}`,
    `Preferred channels: ${settings.targetChannels.join(", ")}`,
    `Guardrails: ${settings.promptGuardrails.join(" | ")}`,
    "Return exactly 3 drafts in valid JSON matching the schema.",
  ].join("\n");
}

function sanitizeDraft(input: GeneratedDraftInput): GeneratedDraftInput {
  const hooks = input.hooks
    .map((hook) => hook.trim())
    .filter(Boolean)
    .slice(0, 3);
  const ctas = input.ctas
    .map((cta) => cta.trim())
    .filter(Boolean)
    .slice(0, 2);
  const tags = input.tags
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean)
    .slice(0, 5);
  const formatType = supportedFormats.includes(input.formatType)
    ? input.formatType
    : "carousel";

  if (hooks.length !== 3 || ctas.length !== 2 || tags.length < 3) {
    throw new Error("AI 응답 형식이 요구사항과 맞지 않습니다.");
  }

  return {
    title: input.title.trim(),
    targetAudience: input.targetAudience.trim(),
    formatType,
    coreMessage: input.coreMessage.trim(),
    hooks,
    bodyDraft: input.bodyDraft.trim(),
    ctas,
    productionGuide: input.productionGuide.trim(),
    tags,
    expectedReactionPoints: input.expectedReactionPoints.trim(),
  };
}

export async function generateHospitalContentDrafts(
  settings: GenerationSettings,
): Promise<GeneratedDraftInput[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY가 설정되어 있어야 AI 초안을 생성할 수 있습니다.");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-5-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: "You generate structured hospital SNS content drafts for an internal admin tool.",
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildPrompt(settings),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "hospital_sns_drafts",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              drafts: {
                type: "array",
                minItems: 3,
                maxItems: 3,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    targetAudience: { type: "string" },
                    formatType: {
                      type: "string",
                      enum: [...supportedFormats],
                    },
                    coreMessage: { type: "string" },
                    hooks: {
                      type: "array",
                      minItems: 3,
                      maxItems: 3,
                      items: { type: "string" },
                    },
                    bodyDraft: { type: "string" },
                    ctas: {
                      type: "array",
                      minItems: 2,
                      maxItems: 2,
                      items: { type: "string" },
                    },
                    productionGuide: { type: "string" },
                    tags: {
                      type: "array",
                      minItems: 3,
                      maxItems: 5,
                      items: { type: "string" },
                    },
                    expectedReactionPoints: { type: "string" },
                  },
                  required: [
                    "title",
                    "targetAudience",
                    "formatType",
                    "coreMessage",
                    "hooks",
                    "bodyDraft",
                    "ctas",
                    "productionGuide",
                    "tags",
                    "expectedReactionPoints",
                  ],
                },
              },
            },
            required: ["drafts"],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI 호출에 실패했습니다: ${errorText}`);
  }

  const data = (await response.json()) as {
    output_text?: string;
    output?: Array<{
      content?: Array<{
        type?: string;
        text?: string;
      }>;
    }>;
  };

  const outputText =
    data.output_text ??
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((item) => item.text ?? "")
      .join("")
      .trim();

  if (!outputText) {
    throw new Error("OpenAI 응답에서 초안 텍스트를 찾을 수 없습니다.");
  }

  const parsed = JSON.parse(outputText) as AIResponsePayload;

  if (!Array.isArray(parsed.drafts) || parsed.drafts.length !== 3) {
    throw new Error("AI 응답 초안 개수가 3개가 아닙니다.");
  }

  return parsed.drafts.map(sanitizeDraft);
}

