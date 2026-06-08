import type { I18nDict } from "./shared/i18n";

export const STRINGS: I18nDict = {
  brandTag: { en: "daily vision lab · day 8", ko: "데일리 비전 랩 · 8일차" },
  lede: { en: "Box breathing between tasks — visual rhythm, no mic, local only.", ko: "작업 사이 박스 호흡 — 시각적 리듬, 마이크 없음, 로컬만." },
  phaseInhale: { en: "Inhale", ko: "들이쉬기" },
  phaseHold1: { en: "Hold", ko: "멈춤" },
  phaseExhale: { en: "Exhale", ko: "내쉬기" },
  phaseHold2: { en: "Hold", ko: "멈춤" },
  btnStart: { en: "Begin cadence", ko: "박자 시작" },
  btnStop: { en: "Pause", ko: "일시정지" },
  patternBox: { en: "Box 4·4·4·4", ko: "박스 4·4·4·4" },
  patternCalm: { en: "Calm 4·7·8", ko: "차분 4·7·8" },
  statsTitle: { en: "Today", ko: "오늘" },
  statCycles: { en: "Cycles", ko: "사이클" },
  statMinutes: { en: "Breathing", ko: "호흡 시간" },
  guideTitle: { en: "Rhythm guide", ko: "리듬 안내" },
  guideBox: {
    en: "Equal four-count phases — reset between focus blocks.",
    ko: "네 박자가 같습니다 — 집중 블록 사이 리셋용.",
  },
  guideCalm: {
    en: "Longer exhale — downshift before the next task.",
    ko: "긴 내쉬기 — 다음 작업 전 각성을 낮춥니다.",
  },
  privacyShort: { en: "Local only · No mic", ko: "로컬만 · 마이크 없음" },
  privacyNote: {
    en: "No camera. No microphone. Session counts stay in your browser.",
    ko: "카메라 없음. 마이크 없음. 기록은 브라우저에만 저장됩니다.",
  },
  cycleDone: { en: "Cycle complete", ko: "사이클 완료" },
};
