export type Phase = "inhale" | "hold1" | "exhale" | "hold2";

export type PatternId = "box" | "calm";

export type Pattern = {
  id: PatternId;
  phases: { phase: Phase; seconds: number }[];
};

export const PATTERNS: Record<PatternId, Pattern> = {
  box: {
    id: "box",
    phases: [
      { phase: "inhale", seconds: 4 },
      { phase: "hold1", seconds: 4 },
      { phase: "exhale", seconds: 4 },
      { phase: "hold2", seconds: 4 },
    ],
  },
  calm: {
    id: "calm",
    phases: [
      { phase: "inhale", seconds: 4 },
      { phase: "hold1", seconds: 7 },
      { phase: "exhale", seconds: 8 },
      { phase: "hold2", seconds: 0 },
    ],
  },
};

export function cycleDuration(pattern: Pattern): number {
  return pattern.phases.reduce((sum, p) => sum + p.seconds, 0);
}
