import type { WeatherKind } from "./moodEngine";

const LINES: Record<WeatherKind, string[]> = {
  "golden-hour": [
    "Light pools behind the eyes — a quiet front is passing.",
    "Warmth without urgency; the horizon holds its breath.",
    "You are the late sun: low, patient, still broadcasting.",
  ],
  "high-pressure": [
    "Sky locked. Thoughts arranged like isobars.",
    "Still air carries detail farther than noise ever could.",
    "A clear dome — nothing to chase, only to notice.",
  ],
  "distant-storm": [
    "Pressure drops somewhere behind the brow.",
    "Clouds gather at the edge of focus, not the center.",
    "Lightning withheld — the charge is organizational.",
  ],
  "sea-fog": [
    "Horizon erased in soft increments.",
    "Sound dampened; the world narrows to arm's length.",
    "Drift is not absence — it's a different kind of presence.",
  ],
  aurora: [
    "Magnetic restlessness — color without heat.",
    "Shear between what you feel and what you show.",
    "The night side of the face auroras quietly.",
  ],
  "heat-shimmer": [
    "Edges wobble; certainty becomes mirage.",
    "Warmth and friction share the same wavelength.",
    "You shimmer — readable only at a slant.",
  ],
};

export function pickOracleLine(kind: WeatherKind): string {
  const pool = LINES[kind];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function formatTimestamp(d = new Date()): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
