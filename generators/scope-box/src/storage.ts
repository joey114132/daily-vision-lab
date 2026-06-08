export type ScopeItem = {
  id: string;
  text: string;
  done: boolean;
};

export type DayState = {
  date: string;
  items: ScopeItem[];
  locked: boolean;
};

const KEY = "dvl-scope-box";
const MAX = 3;

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function loadDay(date = todayKey()): DayState {
  const raw = localStorage.getItem(KEY);
  const all: Record<string, DayState> = raw ? JSON.parse(raw) : {};
  return all[date] ?? { date, items: [], locked: false };
}

export function saveDay(state: DayState): void {
  const raw = localStorage.getItem(KEY);
  const all: Record<string, DayState> = raw ? JSON.parse(raw) : {};
  all[state.date] = state;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function maxItems(): number {
  return MAX;
}

export function addItem(state: DayState, text: string): DayState | null {
  if (state.items.length >= MAX) return null;
  const next = {
    ...state,
    items: [...state.items, { id: crypto.randomUUID(), text: text.trim(), done: false }],
  };
  saveDay(next);
  return next;
}

export function toggleItem(state: DayState, id: string): DayState {
  const next = {
    ...state,
    items: state.items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)),
  };
  saveDay(next);
  return next;
}

export function removeItem(state: DayState, id: string): DayState {
  if (state.locked) return state;
  const next = { ...state, items: state.items.filter((i) => i.id !== id) };
  saveDay(next);
  return next;
}

export function lockScope(state: DayState): DayState {
  if (state.items.length === 0) return state;
  const next = { ...state, locked: true };
  saveDay(next);
  return next;
}

export function doneCount(state: DayState): number {
  return state.items.filter((i) => i.done).length;
}

export function exportMarkdown(state: DayState, labels: Record<string, string>): string {
  return [
    `# Scope Box — ${state.date}`,
    ``,
    `${labels.statDone}: ${doneCount(state)}/${state.items.length}`,
    `${labels.lockedLabel}: ${state.locked ? labels.yes : labels.no}`,
    ``,
    ...state.items.map((i) => `- [${i.done ? "x" : " "}] ${i.text}`),
  ].join("\n");
}
