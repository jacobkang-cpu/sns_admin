import {
  type AdminUser,
  type ChannelCopy,
  type ContentDetail,
  type DemoDatabase,
  type GenerationSettings,
  type PerformanceMetric,
} from "@/types/domain";
import { CHANNELS } from "@/types/domain";

type SeedInput = {
  id: string;
  title: string;
  targetAudience: string;
  formatType: ContentDetail["formatType"];
  coreMessage: string;
  bodyDraft: string;
  productionGuide: string;
  expectedReactionPoints: string;
  hooks: string[];
  ctas: string[];
  tags: string[];
  status: ContentDetail["status"];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
};

const adminUser: AdminUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "admin@hospital-desk.local",
  fullName: "Hospital SNS Admin",
  role: "admin",
};

const settings: GenerationSettings = {
  id: "default",
  toneOfVoice: "친절하지만 의료 정보는 정확하게 설명하는 전문적 톤",
  contentCadencePerWeek: 3,
  targetChannels: CHANNELS,
  hashtagsPerPost: 4,
  defaultAudience: "20~50대 환자 및 보호자",
  approvalRequired: true,
  promptGuardrails: [
    "과장 표현 대신 의료진 검수 전제 문구 사용",
    "진단 및 처방으로 오해될 수 있는 직접 조언 금지",
    "채널별 목적에 맞게 길이와 문체 조정",
  ],
};

const seedInputs: SeedInput[] = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    title: "위내시경 전날 식사, 어디까지 가능한가요?",
    targetAudience: "소화기 검진 예약 환자",
    formatType: "carousel",
    coreMessage: "검사 정확도를 위해 검사 전 준비 수칙을 쉽고 명확하게 안내한다.",
    bodyDraft:
      "위내시경 검사 전날은 자극적인 음식과 늦은 야식을 피하고, 병원에서 안내한 금식 시간을 지키는 것이 중요합니다. 환자가 가장 많이 묻는 질문인 물 섭취 가능 여부와 약 복용 여부를 함께 정리하면 문의를 줄일 수 있습니다.",
    productionGuide:
      "1장 질문형 타이틀, 2~4장 금식/약 복용/주의사항, 마지막 장 예약 문의 CTA 배치",
    expectedReactionPoints:
      "검사 전 불안 감소, 문의 전화 감소, 저장 증가",
    hooks: [
      "검사 전날, 커피 한 잔도 안 될까요?",
      "위내시경 준비 때문에 가장 많이 오는 질문 3가지",
      "검사 정확도를 높이는 가장 쉬운 준비법",
    ],
    ctas: ["검사 안내문을 다시 확인하고 궁금한 점은 병원에 문의해 주세요.", "보호자와 함께 체크리스트를 공유해 보세요."],
    tags: ["건강검진", "위내시경", "검사준비"],
    status: "approved",
    createdAt: "2026-03-18T09:00:00.000Z",
    updatedAt: "2026-03-21T02:10:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    title: "봄철 알레르기 비염, 병원에 와야 하는 신호",
    targetAudience: "비염 증상으로 내원 고민 중인 환자",
    formatType: "short_video",
    coreMessage: "자가 관리와 진료가 필요한 상황을 구분해 내원 판단을 돕는다.",
    bodyDraft:
      "계절성 비염은 생활 습관 관리로 완화될 수 있지만, 수면을 방해하거나 집중력을 떨어뜨릴 정도라면 정확한 평가가 필요합니다. 단순히 참는 것이 아니라 증상의 빈도와 강도를 기록하는 습관을 안내합니다.",
    productionGuide:
      "15초 릴스 구성. 도입 3초 훅, 중간 체크리스트, 마지막 진료 권유 CTA",
    expectedReactionPoints:
      "공감 댓글 증가, 릴스 재생 유지율 상승, 신규 문의",
    hooks: [
      "재채기만 문제라면 괜찮을까요?",
      "비염이 일상을 방해하는 순간, 진료가 필요합니다",
      "봄마다 반복된다면 관리 전략을 바꿔야 합니다",
    ],
    ctas: ["증상이 반복된다면 진료 예약으로 원인을 확인해 보세요.", "증상 기록 후 상담 시 보여주시면 도움이 됩니다."],
    tags: ["비염", "알레르기", "이비인후과"],
    status: "draft",
    createdAt: "2026-03-17T05:00:00.000Z",
    updatedAt: "2026-03-20T10:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    title: "도수치료 후 통증, 정상 반응일까요?",
    targetAudience: "재활치료 환자",
    formatType: "single_image",
    coreMessage: "치료 후 나타날 수 있는 일반 반응과 재진이 필요한 경고 신호를 구분한다.",
    bodyDraft:
      "도수치료 후 근육통처럼 묵직한 느낌이 하루 이틀 남을 수 있습니다. 다만 통증이 급격히 심해지거나 감각 이상이 동반된다면 즉시 의료진과 상담해야 합니다. 환자가 집에서 확인할 체크 포인트를 안내합니다.",
    productionGuide:
      "단일 카드뉴스. 정상 반응 3개, 경고 신호 3개를 좌우 대비 구조로 배치",
    expectedReactionPoints:
      "치료 후 불안 완화, 저장 증가, 보호자 공유",
    hooks: [
      "치료 후 더 뻐근한데 괜찮은 걸까요?",
      "좋은 통증과 위험 신호는 다릅니다",
      "재활치료 후 꼭 체크해야 할 3가지",
    ],
    ctas: ["통증이 심해지면 다음 예약일을 기다리지 말고 바로 문의해 주세요.", "가정에서 체크한 증상을 기록해 오시면 진료에 도움이 됩니다."],
    tags: ["재활치료", "도수치료", "통증관리"],
    status: "needs_revision",
    createdAt: "2026-03-15T07:30:00.000Z",
    updatedAt: "2026-03-21T08:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000104",
    title: "건강검진 결과표에서 먼저 볼 숫자 4개",
    targetAudience: "검진 결과를 받은 직장인",
    formatType: "carousel",
    coreMessage: "복잡한 결과표를 처음 보는 환자도 핵심 수치를 우선 이해할 수 있게 돕는다.",
    bodyDraft:
      "건강검진 결과표는 항목이 많아 어디부터 봐야 할지 막막합니다. 혈압, 공복혈당, 간수치, 콜레스테롤처럼 추적 관리가 필요한 핵심 수치를 먼저 읽는 방법을 알려주면 이해도가 높아집니다.",
    productionGuide:
      "숫자 카드 중심 5장 구성. 각 지표별 의미와 추가 상담 필요 기준 표기",
    expectedReactionPoints:
      "저장 증가, 검진 결과 상담 예약 유도",
    hooks: [
      "결과표를 받았는데 뭐부터 봐야 할지 모르겠다면",
      "정상/주의 구간을 먼저 읽는 법",
      "검진 결과 해석, 이 4개 숫자부터 확인하세요",
    ],
    ctas: ["수치 해석이 어렵다면 결과표를 가지고 상담을 예약해 주세요.", "가족과 함께 결과를 확인하며 생활 습관 목표를 세워보세요."],
    tags: ["건강검진", "결과해석", "내과"],
    status: "posted",
    createdAt: "2026-03-10T03:00:00.000Z",
    updatedAt: "2026-03-19T04:00:00.000Z",
    publishedAt: "2026-03-20T00:30:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000105",
    title: "소아 야간기침, 그냥 감기일까요?",
    targetAudience: "소아 환자 보호자",
    formatType: "article",
    coreMessage: "야간기침 패턴을 통해 병원 진료가 필요한 시점을 설명한다.",
    bodyDraft:
      "밤에만 기침이 심해지는 경우는 단순 감기 외에도 알레르기, 천식, 후비루 등 여러 원인이 숨어 있을 수 있습니다. 보호자가 체크할 수 있는 증상 패턴과 내원 시 전달하면 좋은 정보를 정리합니다.",
    productionGuide:
      "블로그형 문안. 증상 패턴, 체크리스트, 내원 준비 팁 순서로 전개",
    expectedReactionPoints:
      "보호자 공감 댓글, 블로그 체류 시간 증가",
    hooks: [
      "낮에는 괜찮은데 밤만 되면 기침이 심해진다면",
      "야간기침은 패턴이 중요합니다",
      "소아 기침, 병원에 설명해야 할 핵심 포인트",
    ],
    ctas: ["기침 양상을 기록해 오시면 진료에 도움이 됩니다.", "보호자 혼자 판단하기 어렵다면 진료 예약을 권합니다."],
    tags: ["소아과", "야간기침", "보호자체크"],
    status: "approved",
    createdAt: "2026-03-11T01:20:00.000Z",
    updatedAt: "2026-03-21T05:10:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000106",
    title: "치과 스케일링, 얼마나 자주 받아야 하나요?",
    targetAudience: "치주 관리 관심 환자",
    formatType: "infographic",
    coreMessage: "스케일링 주기와 개인별 차이를 쉽게 이해시키는 교육형 콘텐츠다.",
    bodyDraft:
      "스케일링은 무조건 6개월 또는 1년으로 고정되는 것이 아니라, 잇몸 상태와 관리 습관에 따라 달라질 수 있습니다. 개인별 권장 주기를 소개하고 정기 검진의 의미를 함께 설명합니다.",
    productionGuide:
      "인포그래픽. 구강 상태별 권장 주기 표와 자가 체크 항목 배치",
    expectedReactionPoints:
      "예약 문의 증가, 저장 및 공유",
    hooks: [
      "스케일링은 무조건 1년에 한 번일까요?",
      "내 잇몸 상태에 맞는 관리 주기",
      "치과가 말하는 정기 스케일링 기준",
    ],
    ctas: ["최근 스케일링 시기를 기억하기 어렵다면 검진 예약으로 확인해 보세요.", "잇몸 출혈이 잦다면 관리 주기를 상담해 보세요."],
    tags: ["치과", "스케일링", "구강관리"],
    status: "hold",
    createdAt: "2026-03-13T11:00:00.000Z",
    updatedAt: "2026-03-20T11:30:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000107",
    title: "허리 MRI가 꼭 필요한 순간은 언제일까",
    targetAudience: "허리 통증 환자",
    formatType: "single_image",
    coreMessage: "영상 검사가 필요한 경우와 그렇지 않은 경우를 균형 있게 설명한다.",
    bodyDraft:
      "허리 통증이 있다고 모두 MRI가 필요한 것은 아닙니다. 통증 기간, 신경학적 증상, 외상 여부 등 판단 기준을 환자 관점에서 풀어 설명하면 과도한 검사 기대를 줄이고 필요한 상황에는 빠르게 내원하도록 도울 수 있습니다.",
    productionGuide:
      "질문형 썸네일 + MRI 필요 신호 4개 정리 카드",
    expectedReactionPoints:
      "댓글 상담 유도, 저장 증가",
    hooks: [
      "허리 아프면 바로 MRI 찍어야 할까요?",
      "영상 검사가 필요한 허리 통증은 따로 있습니다",
      "검사보다 먼저 봐야 할 신호",
    ],
    ctas: ["통증 양상이 갑자기 달라졌다면 진료를 통해 확인해 보세요.", "증상 발생 시점과 악화 요인을 기록해 오시면 좋습니다."],
    tags: ["정형외과", "허리통증", "MRI"],
    status: "approved",
    createdAt: "2026-03-12T02:30:00.000Z",
    updatedAt: "2026-03-21T07:20:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000108",
    title: "산부인과 첫 내원 전, 준비하면 좋은 질문들",
    targetAudience: "초진 환자",
    formatType: "carousel",
    coreMessage: "초진 전 준비 질문을 제시해 진료 효율과 환자 만족도를 높인다.",
    bodyDraft:
      "첫 진료를 앞둔 환자는 무엇을 말해야 할지, 무엇을 물어봐야 할지 어려움을 느낍니다. 증상 시작 시점, 생리 주기, 복용 중인 약 등을 메모하면 상담이 훨씬 수월해집니다.",
    productionGuide:
      "체크리스트형 카드 6장 구성. 방문 전 체크 항목을 한 장씩 분리",
    expectedReactionPoints:
      "초진 환자 불안 감소, 저장 증가",
    hooks: [
      "첫 진료 전, 무엇을 준비하면 좋을까요?",
      "메모만 해도 상담이 쉬워집니다",
      "산부인과 초진 체크리스트",
    ],
    ctas: ["예약 전 궁금한 점이 있다면 접수팀에 문의해 주세요.", "초진 전 메모를 준비하면 진료 시간이 더 효율적입니다."],
    tags: ["산부인과", "초진", "체크리스트"],
    status: "draft",
    createdAt: "2026-03-19T01:10:00.000Z",
    updatedAt: "2026-03-21T11:15:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000109",
    title: "수술 후 흉터 관리, 언제부터 시작해야 하나요?",
    targetAudience: "외과 수술 후 환자",
    formatType: "article",
    coreMessage: "흉터 관리 시작 시점과 주의사항을 단계별로 안내한다.",
    bodyDraft:
      "수술 후 흉터 관리는 상처 상태에 따라 시작 시점이 다를 수 있습니다. 무리한 자가 관리는 회복을 늦출 수 있으므로 의료진 안내를 기준으로 보습, 자외선 차단, 내원 시점 등을 설명해야 합니다.",
    productionGuide:
      "블로그와 링크드인 겸용 장문 포맷. 회복 단계별 관리법 정리",
    expectedReactionPoints:
      "블로그 검색 유입, 상담 문의 전환",
    hooks: [
      "흉터 관리는 빠를수록 좋을까요?",
      "회복 단계에 맞는 관리가 중요합니다",
      "수술 후 환자가 가장 많이 묻는 흉터 질문",
    ],
    ctas: ["상처 상태를 사진으로 기록해 경과 상담 시 보여주세요.", "관리 시작 시점은 담당 의료진 안내를 우선해 주세요."],
    tags: ["외과", "흉터관리", "수술후관리"],
    status: "posted",
    createdAt: "2026-03-09T12:20:00.000Z",
    updatedAt: "2026-03-18T06:40:00.000Z",
    publishedAt: "2026-03-19T01:40:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000110",
    title: "당뇨 초기 관리, 식단보다 먼저 해야 할 기록",
    targetAudience: "당뇨 진단 초기 환자",
    formatType: "carousel",
    coreMessage: "식단 조절만 강조하지 않고 생활 기록의 중요성을 전한다.",
    bodyDraft:
      "당뇨 초기 환자에게는 단순히 무엇을 먹지 말아야 하는지보다 혈당 변화와 생활 패턴을 기록하는 방법이 더 중요할 수 있습니다. 기록 습관을 만들면 이후 상담과 맞춤 계획 수립이 쉬워집니다.",
    productionGuide:
      "기록 템플릿 소개형 카드. 식사/운동/수면/혈당 칸 구성",
    expectedReactionPoints:
      "저장 증가, 상담 예약 전환",
    hooks: [
      "식단 조절보다 먼저 해야 할 일이 있습니다",
      "당뇨 초기, 기록 습관이 치료를 돕습니다",
      "혈당 관리가 쉬워지는 첫 단계",
    ],
    ctas: ["기록표를 일주일만 작성해도 진료 상담이 훨씬 구체적이 됩니다.", "초기 관리 계획이 필요하면 상담을 예약해 주세요."],
    tags: ["당뇨", "내분비내과", "혈당관리"],
    status: "archived",
    createdAt: "2026-03-01T01:00:00.000Z",
    updatedAt: "2026-03-15T09:00:00.000Z",
    publishedAt: "2026-03-08T02:00:00.000Z",
  },
];

function createChannelCopies(
  contentItemId: string,
  title: string,
  coreMessage: string,
  cta: string,
  status: "generated" | "posted",
  generatedAt: string,
  postedAt: string | null,
): ChannelCopy[] {
  return CHANNELS.map((channel, index) => ({
    id: `${contentItemId}-${channel}`,
    contentItemId,
    channel,
    copyText:
      channel === "threads"
        ? `${title}\n\n${coreMessage}\n\n핵심 포인트를 한 문장씩 정리해 환자가 빠르게 이해하도록 구성합니다.\n\n${cta}`
        : `${title}\n\n${coreMessage}\n\n${cta}`,
    hashtags: [
      "#병원SNS",
      `#${title.split(" ")[0].replace(/[^\w가-힣]/g, "")}`,
      "#의료콘텐츠",
      `#${channel}`,
    ],
    callToAction: cta,
    status: postedAt && index < 2 ? "posted" : status,
    generatedAt,
    postedAt: postedAt && index < 2 ? postedAt : null,
  }));
}

function createMetrics(
  contentItemId: string,
  createdAt: string,
): PerformanceMetric[] {
  return [
    {
      id: `${contentItemId}-instagram-metric`,
      contentItemId,
      channel: "instagram",
      impressions: 4800,
      clicks: 142,
      saves: 87,
      shares: 31,
      comments: 16,
      conversions: 9,
      notes: "검진 예약 링크 클릭률이 높았습니다.",
      createdAt,
      updatedAt: createdAt,
    },
    {
      id: `${contentItemId}-blog-metric`,
      contentItemId,
      channel: "blog",
      impressions: 2100,
      clicks: 188,
      saves: 0,
      shares: 14,
      comments: 4,
      conversions: 12,
      notes: "검색 유입이 많아 블로그 체류 시간이 높았습니다.",
      createdAt,
      updatedAt: createdAt,
    },
  ];
}

export function createSeedDatabase(): DemoDatabase {
  const contentItems = seedInputs.map((item) => ({
    id: item.id,
    title: item.title,
    targetAudience: item.targetAudience,
    formatType: item.formatType,
    coreMessage: item.coreMessage,
    bodyDraft: item.bodyDraft,
    productionGuide: item.productionGuide,
    expectedReactionPoints: item.expectedReactionPoints,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt ?? null,
    createdBy: adminUser.id,
  }));

  const contentHooks = seedInputs.flatMap((item) =>
    item.hooks.map((hook, index) => ({
      id: `${item.id}-hook-${index + 1}`,
      contentItemId: item.id,
      hookText: hook,
      position: index + 1,
    })),
  );

  const contentCtas = seedInputs.flatMap((item) =>
    item.ctas.map((cta, index) => ({
      id: `${item.id}-cta-${index + 1}`,
      contentItemId: item.id,
      ctaText: cta,
      position: index + 1,
    })),
  );

  const contentTags = seedInputs.flatMap((item) =>
    item.tags.map((tag) => ({
      id: `${item.id}-${tag}`,
      contentItemId: item.id,
      tag,
    })),
  );

  const channelCopies = seedInputs.flatMap((item) => {
    if (item.status === "approved" || item.status === "posted" || item.status === "archived") {
      return createChannelCopies(
        item.id,
        item.title,
        item.coreMessage,
        item.ctas[0],
        item.status === "posted" || item.status === "archived" ? "posted" : "generated",
        item.updatedAt,
        item.publishedAt ?? null,
      );
    }

    return [];
  });

  const approvalLogs = seedInputs.flatMap((item) => [
    {
      id: `${item.id}-approval-log-1`,
      contentItemId: item.id,
      fromStatus: null,
      toStatus: "draft" as const,
      note: "초기 초안 생성",
      createdBy: adminUser.id,
      createdAt: item.createdAt,
    },
    ...(item.status !== "draft"
      ? [
          {
            id: `${item.id}-approval-log-2`,
            contentItemId: item.id,
            fromStatus: "draft" as const,
            toStatus: item.status,
            note:
              item.status === "approved"
                ? "게시 가능 상태로 승인"
                : item.status === "posted"
                  ? "게시 완료 처리"
                  : item.status === "archived"
                    ? "캠페인 종료 후 보관"
                    : item.status === "hold"
                      ? "추가 검토 필요"
                      : "메시지 보완 요청",
            createdBy: adminUser.id,
            createdAt: item.updatedAt,
          },
        ]
      : []),
  ]);

  const performanceMetrics = seedInputs.flatMap((item) =>
    item.status === "posted" || item.status === "archived"
      ? createMetrics(item.id, item.publishedAt ?? item.updatedAt)
      : [],
  );

  return {
    users: [adminUser],
    contentItems,
    contentHooks,
    contentCtas,
    contentTags,
    channelCopies,
    contentAssets: [],
    approvalLogs,
    performanceMetrics,
    generationSettings: settings,
  };
}

