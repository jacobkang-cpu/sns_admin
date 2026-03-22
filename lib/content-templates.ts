import { type ChannelKey, type ContentDetail } from "@/types/domain";

function buildHashtags(content: ContentDetail, limit = 4) {
  const baseTags = [...content.tags];
  const audienceTag = content.targetAudience.replace(/\s+/g, "");
  const formatTag = content.formatType.replace(/_/g, "");
  const tags = [
    ...baseTags,
    audienceTag,
    formatTag,
    "병원SNS",
    "의료콘텐츠",
  ];

  return Array.from(new Set(tags))
    .slice(0, limit)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
}

export function generateChannelCopy(
  content: ContentDetail,
  channel: ChannelKey,
) {
  const primaryHook = content.hooks[0] ?? content.title;
  const callToAction = content.ctas[0] ?? "상담이 필요하면 문의해 주세요.";
  const hashtags = buildHashtags(content);

  switch (channel) {
    case "instagram":
      return {
        copyText: `${primaryHook}\n\n${content.coreMessage}\n\n${content.bodyDraft.slice(0, 120)}...`,
        hashtags,
        callToAction,
      };
    case "threads":
      return {
        copyText: [
          primaryHook,
          content.coreMessage,
          content.bodyDraft.slice(0, 90),
          callToAction,
        ].join("\n\n"),
        hashtags: hashtags.slice(0, 3),
        callToAction,
      };
    case "linkedin":
      return {
        copyText: `${content.title}\n\n${content.coreMessage}\n\n${content.bodyDraft}\n\n실무 포인트: ${content.expectedReactionPoints}`,
        hashtags: hashtags.slice(0, 4),
        callToAction,
      };
    case "blog":
      return {
        copyText: `${content.title}\n\n대상: ${content.targetAudience}\n\n${content.bodyDraft}\n\n실행 가이드\n${content.productionGuide}`,
        hashtags: hashtags.slice(0, 5),
        callToAction,
      };
  }
}

