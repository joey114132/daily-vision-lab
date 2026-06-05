import type { I18nDict } from "./shared/i18n";

export const STRINGS: I18nDict = {
  brandTag: { en: "daily vision lab · day __DAY_NUM__", ko: "데일리 비전 랩 · __DAY_NUM__일차" },
  lede: { en: "__TAGLINE_EN__", ko: "__TAGLINE_KO__" },
  captureLabel: { en: "What pulled you away?", ko: "무엇이 당신을 끌어당겼나요?" },
  capturePlaceholder: { en: "One line — park it here first", ko: "한 줄만 — 먼저 여기에 적어두세요" },
  btnCapture: { en: "Park urge", ko: "욕구 적기" },
  statsTitle: { en: "Today's margin", ko: "오늘의 여백" },
  statActive: { en: "Open urges", ko: "열린 욕구" },
  statParked: { en: "Parked", ko: "보관됨" },
  statTotal: { en: "Captured", ko: "기록됨" },
  listTitle: { en: "Receipt stack", ko: "영수증 스택" },
  sectionActive: { en: "Open", ko: "열림" },
  sectionParked: { en: "Parked", ko: "보관" },
  btnPark: { en: "Park", ko: "보관" },
  btnExport: { en: "Copy stack", ko: "스택 복사" },
  emptyList: { en: "No urges yet — that's a clean margin.", ko: "아직 없음 — 깨끗한 여백입니다." },
  privacyShort: { en: "Local only · No camera", ko: "로컬만 · 카메라 없음" },
  privacyNote: {
    en: "No camera. No account. Urges stay in your browser only.",
    ko: "카메라 없음. 계정 없음. 기록은 브라우저에만 저장됩니다.",
  },
  captured: { en: "Urge parked on the stack", ko: "욕구가 스택에 적혔습니다" },
  copied: { en: "Stack copied", ko: "스택 복사됨" },
  parkedLabel: { en: "parked", ko: "보관됨" },
};
