import type { I18nDict } from "./shared/i18n";

export const STRINGS: I18nDict = {
  brandTag: { en: "daily vision lab · day 9", ko: "데일리 비전 랩 · 9일차" },
  lede: { en: "Three tasks max today — lock scope before you drift.", ko: "오늘은 세 가지만 — 벗어나기 전에 범위를 잠그세요." },
  slotsTitle: { en: "Today's scope", ko: "오늘의 범위" },
  slotLabel: { en: "Slot", ko: "슬롯" },
  inputPlaceholder: { en: "One scoped task", ko: "범위 안의 작업 하나" },
  btnAdd: { en: "Add to box", ko: "상자에 추가" },
  btnLock: { en: "Lock scope", ko: "범위 잠금" },
  btnCopy: { en: "Copy scope", ko: "범위 복사" },
  lockedBanner: { en: "Scope locked — finish or uncheck only.", ko: "범위 잠김 — 완료 체크만 가능합니다." },
  emptyHint: { en: "Add up to three tasks, then lock.", ko: "최대 세 가지를 넣고 잠그세요." },
  statDone: { en: "Done", ko: "완료" },
  statSlots: { en: "Slots used", ko: "사용 슬롯" },
  lockedLabel: { en: "Locked", ko: "잠금" },
  yes: { en: "yes", ko: "예" },
  no: { en: "no", ko: "아니오" },
  privacyShort: { en: "Local only · No camera", ko: "로컬만 · 카메라 없음" },
  privacyNote: {
    en: "No camera. No account. Scope stays in your browser only.",
    ko: "카메라 없음. 계정 없음. 범위는 브라우저에만 저장됩니다.",
  },
  full: { en: "Three slots full", ko: "세 슬롯 모두 사용 중" },
  copied: { en: "Scope copied", ko: "범위 복사됨" },
  locked: { en: "Scope locked for today", ko: "오늘 범위가 잠겼습니다" },
};
