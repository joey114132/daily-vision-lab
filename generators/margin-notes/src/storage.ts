export type MarginNote = {
  id: string;
  text: string;
  at: number;
  parked: boolean;
};

export type DayState = {
  date: string;
  notes: MarginNote[];
};

const KEY = "dvl-margin-notes";

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function loadDay(date = todayKey()): DayState {
  const raw = localStorage.getItem(KEY);
  const all: Record<string, DayState> = raw ? JSON.parse(raw) : {};
  return all[date] ?? { date, notes: [] };
}

export function saveDay(state: DayState): void {
  const raw = localStorage.getItem(KEY);
  const all: Record<string, DayState> = raw ? JSON.parse(raw) : {};
  all[state.date] = state;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function addNote(state: DayState, text: string): DayState {
  const note: MarginNote = {
    id: crypto.randomUUID(),
    text: text.trim(),
    at: Date.now(),
    parked: false,
  };
  const next = { ...state, notes: [note, ...state.notes] };
  saveDay(next);
  return next;
}

export function parkNote(state: DayState, id: string): DayState {
  const next = {
    ...state,
    notes: state.notes.map((n) => (n.id === id ? { ...n, parked: true } : n)),
  };
  saveDay(next);
  return next;
}

export function activeCount(state: DayState): number {
  return state.notes.filter((n) => !n.parked).length;
}

export function exportMarkdown(state: DayState, labels: Record<string, string>): string {
  const active = state.notes.filter((n) => !n.parked);
  const parked = state.notes.filter((n) => n.parked);
  return [
    `# Margin Notes — ${state.date}`,
    ``,
    `${labels.statActive}: ${active.length}`,
    `${labels.statParked}: ${parked.length}`,
    ``,
    `## ${labels.sectionActive}`,
    ...active.map((n) => `- ${new Date(n.at).toLocaleTimeString()} · ${n.text}`),
    ``,
    `## ${labels.sectionParked}`,
    ...parked.map((n) => `- ${new Date(n.at).toLocaleTimeString()} · ${n.text}`),
  ].join("\n");
}
