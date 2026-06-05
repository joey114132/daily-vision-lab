export type Baseline = {
  eyeSpan: number;
  chinY: number;
  noseY: number;
};

export type FrameSignals = {
  eyeSpan: number;
  chinY: number;
  noseY: number;
  blink: number;
};

export function signalsFromLandmarks(lm: { x: number; y: number }[]): FrameSignals {
  const left = lm[33];
  const right = lm[263];
  const eyeSpan = Math.hypot(right.x - left.x, right.y - left.y);
  return {
    eyeSpan,
    chinY: lm[152].y,
    noseY: lm[1].y,
    blink: 0,
  };
}

export function leanIndex(b: Baseline, s: FrameSignals): number {
  const scale = s.eyeSpan / b.eyeSpan;
  const drop = (s.chinY - b.chinY) * 100;
  const forward = (s.noseY - b.noseY) * 100;
  return clamp(scale * 55 + Math.max(0, drop) * 1.2 + Math.max(0, forward) * 0.8, 0, 100);
}

export function wellnessScore(lean: number): number {
  return Math.round(clamp(100 - lean * 0.95, 5, 100));
}

export function smooth(prev: number, next: number, alpha = 0.12): number {
  return prev + (next - prev) * alpha;
}

export function formatSession(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatBreakCountdown(ms: number): string {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
