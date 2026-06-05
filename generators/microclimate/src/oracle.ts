import type { WeatherKind } from "./moodEngine";
import type { Lang } from "./shared/i18n";

const LINES: Record<WeatherKind, Record<Lang, string[]>> = {
  "golden-hour": {
    en: [
      "Light pools behind the eyes — a quiet front is passing.",
      "Warmth without urgency; the horizon holds its breath.",
    ],
    ko: [
      "눈 뒤로 빛이 고이고 — 조용한 전선이 지나갑니다.",
      "급하지 않은 온기, 지평선이 숨을 참습니다.",
    ],
  },
  "high-pressure": {
    en: ["Sky locked. Thoughts arranged like isobars.", "Still air carries detail farther than noise."],
    ko: ["하늘이 잠김. 생각이 등압선처럼 정렬됩니다.", "고요한 공기가 소음보다 멀리 디테일을 실어 나릅니다."],
  },
  "distant-storm": {
    en: ["Pressure drops behind the brow.", "Clouds gather at the edge of focus."],
    ko: ["눈썹 뒤로 기압이 떨어집니다.", "구름이 초점의 가장자리에 모입니다."],
  },
  "sea-fog": {
    en: ["Horizon erased in soft increments.", "Drift is a different kind of presence."],
    ko: ["지평선이 부드럽게 지워집니다.", "표류는 또 다른 종류의 존재입니다."],
  },
  aurora: {
    en: ["Magnetic restlessness — color without heat.", "The night side of the face auroras quietly."],
    ko: ["자기적 불안 — 열 없는 색.", "얼굴의 어두운 쪽에서 오로라가 조용히 일어납니다."],
  },
  "heat-shimmer": {
    en: ["Edges wobble; certainty becomes mirage.", "You shimmer — readable only at a slant."],
    ko: ["가장자리가 흔들립니다. 확실함이 신기루가 됩니다.", "비스듬히만 읽히는 당신의 흔림."],
  },
};

export function pickOracleLine(kind: WeatherKind, lang: Lang): string {
  const pool = LINES[kind][lang];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function formatTimestamp(lang: Lang, d = new Date()): string {
  return d.toLocaleTimeString(lang === "ko" ? "ko-KR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
