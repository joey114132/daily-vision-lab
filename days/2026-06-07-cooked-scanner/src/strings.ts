import type { I18nDict } from "./shared/i18n";

export const STRINGS: I18nDict = {
  badge: { en: "UNNECESSARY LAB · DAY 4", ko: "불필요 연구소 · 4일차" },
  lede: { en: "Totally unnecessary clinical meme diagnosis from your face.", ko: "얼굴로 하는 완전 불필요한 임상 밈 진단." },
  loading: { en: "Calibrating meme sensors…", ko: "밈 센서 교정 중…" },
  cta: { en: "RUN DIAGNOSIS (why?)", ko: "진단 실행 (왜?)" },
  cookedLabel: { en: "Cooked index™", ko: "요리됨 지수™" },
  verdictIdle: { en: "Awaiting specimen", ko: "표본 대기 중" },
  disclaimer: {
    en: "Not medical. Not scientific. Not useful. Peer-reviewed by nobody.",
    ko: "의학 아님. 과학 아님. 쓸모 없음. 검수: 아무도 안 함.",
  },
  tierGoated: { en: "GOATED (sus)", ko: "레전드 (의심됨)" },
  tierMid: { en: "MID ENERGY", ko: "그냥 그럼" },
  tierCooked: { en: "FULLY COOKED 💀", ko: "완전 요리됨 💀" },
  tierRatio: { en: "RATIO INCOMING", ko: "반박 각" },
  tierNpc: { en: "NPC SIDE QUEST", ko: "NPC 서브퀘스트" },
  tierGrass: { en: "TOUCH GRASS (NOW)", ko: "풀 좀 만지세요 (지금)" },
  line1: { en: "Brainrot coefficient spiking.", ko: "브레인롯 계수 급등." },
  line2: { en: "Sigma aura unverified.", ko: "시그마 아우라 미검증." },
  line3: { en: "Clinically online.", ko: "임상적으로 온라인 상태." },
  line4: { en: "No cap detected (lying).", ko: "노캡 감지 (거짓말)." },
  line5: { en: "Ohio migration risk: elevated.", ko: "오하이오 이주 위험: 상승." },
  line6: { en: "Main character delusion: positive.", ko: "주인공 착각: 양성." },
};

export type TierKey =
  | "tierGoated"
  | "tierMid"
  | "tierCooked"
  | "tierRatio"
  | "tierNpc"
  | "tierGrass";

export const TIER_KEYS: TierKey[] = [
  "tierGoated",
  "tierMid",
  "tierCooked",
  "tierRatio",
  "tierNpc",
  "tierGrass",
];
