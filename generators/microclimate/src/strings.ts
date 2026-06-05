import type { I18nDict } from "./shared/i18n";

export const STRINGS: I18nDict = {
  brandTag: {
    en: "daily vision lab · day __DAY_NUM__",
    ko: "데일리 비전 랩 · __DAY_NUM__일차",
  },
  lede: { en: "__TAGLINE_EN__", ko: "__TAGLINE_KO__" },
  innerWeather: { en: "Inner weather", ko: "내면 날씨" },
  confidence: { en: "Confidence", ko: "신뢰도" },
  warmth: { en: "Warmth", ko: "온기" },
  tension: { en: "Tension", ko: "긴장" },
  drift: { en: "Drift", ko: "표류" },
  forecastDrift: { en: "Forecast drift", ko: "예보 표류" },
  oracleNote: {
    en: "Cards appear on their own. Tap to pin — you write nothing unless you want to.",
    ko: "카드는 저절로 떠다닙니다. 고정만 선택 — 쓰고 싶을 때만.",
  },
  loading: { en: "Loading vision models…", ko: "비전 모델 불러오는 중…" },
  loadingHint: {
    en: "First visit downloads ~6MB once, then caches.",
    ko: "첫 방문 시 약 6MB 다운로드 후 캐시됩니다.",
  },
  cta: { en: "Open the observatory", ko: "관측소 열기" },
  thesisFoot: { en: "__THESIS_EN__", ko: "__THESIS_KO__" },
  privacyBtn: { en: "How privacy works", ko: "프라이버시 안내" },
  privacyTitle: { en: "On-device only", ko: "기기 안에서만" },
  privacyBody: {
    en: "Webcam frames never leave this tab. MediaPipe runs locally. No API keys.",
    ko: "웹캠 영상은 이 탭을 벗어나지 않습니다. MediaPipe 로컬 실행. API 키 없음.",
  },
  privacyOk: { en: "Got it", ko: "확인" },
  pin: { en: "Pin reflection", ko: "성찰 고정" },
  pinned: { en: "Pinned", ko: "고정됨" },
  weatherGolden: { en: "Golden hour", ko: "골든아워" },
  weatherCalm: { en: "High pressure calm", ko: "고기압 고요" },
  weatherStorm: { en: "Distant storm line", ko: "먼 폭풍선" },
  weatherFog: { en: "Sea fog", ko: "해안 안개" },
  weatherAurora: { en: "Aurora shear", ko: "오로라 전단" },
  weatherShimmer: { en: "Heat shimmer", ko: "열기 흔림" },
};
