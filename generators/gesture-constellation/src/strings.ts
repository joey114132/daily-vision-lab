import type { I18nDict } from "./shared/i18n";

export const STRINGS: I18nDict = {
  brandTag: {
    en: "daily vision lab · day __DAY_NUM__",
    ko: "데일리 비전 랩 · __DAY_NUM__일차",
  },
  lede: { en: "__TAGLINE_EN__", ko: "__TAGLINE_KO__" },
  starsLabel: { en: "Stars traced", ko: "그린 별" },
  handsLabel: { en: "Hands visible", ko: "보이는 손" },
  loading: { en: "Loading hand model…", ko: "손 모델 불러오는 중…" },
  cta: { en: "Open the sky map", ko: "하늘 지도 열기" },
  thesisFoot: { en: "__THESIS_EN__", ko: "__THESIS_KO__" },
  whisper1: {
    en: "A constellation forms between intention and idle fingers.",
    ko: "의도와 멍한 손가락 사이에 별자리가 생깁니다.",
  },
  whisper2: {
    en: "The map needs no keyboard — only presence.",
    ko: "이 지도엔 키보드가 필요 없습니다 — 존재만 있으면 됩니다.",
  },
  whisper3: {
    en: "Two hands: binary stars in a shared orbit.",
    ko: "두 손: 공유 궤도의 쌍별.",
  },
};
