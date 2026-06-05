export type MoodVector = {
  warmth: number;
  tension: number;
  drift: number;
  surprise: number;
};

export type WeatherKind =
  | "golden-hour"
  | "high-pressure"
  | "distant-storm"
  | "sea-fog"
  | "aurora"
  | "heat-shimmer";

export type WeatherState = {
  kind: WeatherKind;
  confidence: number;
  vector: MoodVector;
};

export const WEATHER_LABEL_KEYS: Record<WeatherKind, string> = {
  "golden-hour": "weatherGolden",
  "high-pressure": "weatherCalm",
  "distant-storm": "weatherStorm",
  "sea-fog": "weatherFog",
  aurora: "weatherAurora",
  "heat-shimmer": "weatherShimmer",
};

const BLEND = {
  smile: ["mouthSmileLeft", "mouthSmileRight"] as const,
  brow: ["browDownLeft", "browDownRight"] as const,
  blink: ["eyeBlinkLeft", "eyeBlinkRight"] as const,
  jaw: ["jawOpen"] as const,
};

function avg(
  categories: Record<string, number>,
  keys: readonly string[],
): number {
  let sum = 0;
  for (const k of keys) {
    sum += categories[k] ?? 0;
  }
  return sum / keys.length;
}

export function vectorFromBlendshapes(
  categories: Record<string, number>,
): MoodVector {
  const smile = avg(categories, BLEND.smile);
  const brow = avg(categories, BLEND.brow);
  const blink = avg(categories, BLEND.blink);
  const jaw = avg(categories, BLEND.jaw);

  return {
    warmth: clamp01(smile * 1.4 - brow * 0.35),
    tension: clamp01(brow * 1.25 + (1 - smile) * 0.15),
    drift: clamp01(blink * 1.1 + brow * 0.2),
    surprise: clamp01(jaw * 1.35),
  };
}

export function smoothVector(prev: MoodVector, next: MoodVector, alpha: number): MoodVector {
  return {
    warmth: lerp(prev.warmth, next.warmth, alpha),
    tension: lerp(prev.tension, next.tension, alpha),
    drift: lerp(prev.drift, next.drift, alpha),
    surprise: lerp(prev.surprise, next.surprise, alpha),
  };
}

export function classifyWeather(v: MoodVector): WeatherState {
  const candidates: { kind: WeatherKind; score: number }[] = [
    { kind: "golden-hour", score: v.warmth * 1.2 - v.tension * 0.5 - v.drift * 0.2 },
    { kind: "high-pressure", score: (1 - v.tension) * 0.9 + (1 - v.drift) * 0.4 - v.surprise * 0.3 },
    { kind: "distant-storm", score: v.tension * 1.15 + v.drift * 0.25 - v.warmth * 0.35 },
    { kind: "sea-fog", score: v.drift * 1.1 + (1 - v.warmth) * 0.35 - v.surprise * 0.2 },
    { kind: "aurora", score: v.surprise * 1.2 + v.warmth * 0.35 - v.tension * 0.15 },
    { kind: "heat-shimmer", score: v.warmth * 0.7 + v.tension * 0.45 + v.surprise * 0.25 },
  ];

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates[0];
  const second = candidates[1];
  const spread = top.score - second.score;
  const confidence = clamp01(0.45 + spread * 0.9);

  return { kind: top.kind, confidence, vector: v };
}

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
