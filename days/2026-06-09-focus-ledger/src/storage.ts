export type Mode = "focus" | "break" | "drift";

export type LedgerEntry = {
  mode: Mode;
  at: number;
  note?: string;
};

export type DayState = {
  date: string;
  entries: LedgerEntry[];
  driftTaps: number;
};

const KEY = "dvl-focus-ledger";

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function loadDay(date = todayKey()): DayState {
  const raw = localStorage.getItem(KEY);
  const all: Record<string, DayState> = raw ? JSON.parse(raw) : {};
  return all[date] ?? { date, entries: [], driftTaps: 0 };
}

export function saveDay(state: DayState): void {
  const raw = localStorage.getItem(KEY);
  const all: Record<string, DayState> = raw ? JSON.parse(raw) : {};
  all[state.date] = state;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function appendEntry(state: DayState, mode: Mode): DayState {
  const next = {
    ...state,
    entries: [...state.entries, { mode, at: Date.now() }],
    driftTaps: mode === "drift" ? state.driftTaps + 1 : state.driftTaps,
  };
  saveDay(next);
  return next;
}

export function minutesInMode(state: DayState, mode: Mode, now = Date.now()): number {
  let total = 0;
  const entries = state.entries.filter((e) => e.mode === mode);
  for (let i = 0; i < state.entries.length; i++) {
    const e = state.entries[i];
    if (e.mode !== mode) continue;
    const end = state.entries[i + 1]?.at ?? now;
    total += Math.max(0, end - e.at);
  }
  if (entries.length === 0) return 0;
  return Math.round(total / 60000);
}

export function exportMarkdown(state: DayState, labels: Record<string, string>): string {
  const focus = minutesInMode(state, "focus");
  const brk = minutesInMode(state, "break");
  return [
    `# Focus Ledger — ${state.date}`,
    ``,
    `- ${labels.statFocus}: ${focus}m`,
    `- ${labels.statBreak}: ${brk}m`,
    `- ${labels.statDrift}: ${state.driftTaps}`,
    ``,
    `## ${labels.logTitle}`,
    ...state.entries.map((e) => `- ${new Date(e.at).toLocaleTimeString()} · ${e.mode}`),
  ].join("\n");
}
