import type { I18nDict } from "./shared/i18n";

export const STRINGS: I18nDict = {
  brandTag: { en: "daily vision lab · day 5", ko: "데일리 비전 랩 · 5일차" },
  lede: { en: "Calibrated desk wellness — lean, blink rate, and 20-20-20 breaks.", ko: "교정 기반 데스크 웰니스 — 거리·깜빡임·20-20-20 휴식." },
  loading: { en: "Loading vision model…", ko: "비전 모델 불러오는 중…" },
  ctaStart: { en: "Start monitoring", ko: "모니터링 시작" },
  ctaCalibrate: { en: "Calibrate posture (5s)", ko: "자세 교정 (5초)" },
  metricsTitle: { en: "Live metrics", ko: "실시간 지표" },
  wellnessLabel: { en: "Wellness score", ko: "웰니스 점수" },
  leanLabel: { en: "Lean / closeness", ko: "전방 기울기·거리" },
  blinkLabel: { en: "Blink rate", ko: "깜빡임 빈도" },
  sessionLabel: { en: "Session time", ko: "세션 시간" },
  statusIdle: { en: "Calibrate to begin", ko: "교정 후 시작" },
  statusGood: { en: "Posture stable", ko: "자세 안정" },
  statusLean: { en: "Lean detected — sit back", ko: "전방 기울기 — 뒤로 앉으세요" },
  statusBlink: { en: "Low blink rate — rest eyes", ko: "깜빡임 적음 — 눈 쉬세요" },
  breaksTitle: { en: "20-20-20 breaks", ko: "20-20-20 휴식" },
  breaksHint: {
    en: "Every 20 minutes, look 20 feet away for 20 seconds.",
    ko: "20분마다 6m(20ft) 밖을 20초간 바라보세요.",
  },
  breaksTaken: { en: "Breaks completed", ko: "완료한 휴식" },
  breakTitle: { en: "Eye break time", ko: "눈 휴식 시간" },
  breakBody: {
    en: "Look at something far away for 20 seconds. No screen.",
    ko: "20초간 먼 곳을 보세요. 화면은 피하세요.",
  },
  breakDone: { en: "Break complete", ko: "휴식 완료" },
  privacyNote: {
    en: "All processing on-device. No video upload. Not a medical device.",
    ko: "온디바이스 처리. 영상 업로드 없음. 의료기기 아님.",
  },
  nudgeLean: { en: "Sustained lean — reset shoulders.", ko: "기울기 지속 — 어깨를 정렬하세요." },
  nudgeBlink: { en: "Blink rate low this minute.", ko: "이번 분 깜빡임이 적습니다." },
  nudgeBreak: { en: "20-20-20 break due.", ko: "20-20-20 휴식 시간입니다." },
  calibrating: { en: "Hold good posture…", ko: "좋은 자세 유지…" },
  calibrated: { en: "Baseline saved.", ko: "기준선 저장됨." },
};
