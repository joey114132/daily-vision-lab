export type DayState = {
  date: string;
  cycles: number;
  seconds: number;
};

const KEY = "dvl-breath-cadence";

export function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function loadDay(date = todayKey()): DayState {
  const raw = localStorage.getItem(KEY);
  const all: Record<string, DayState> = raw ? JSON.parse(raw) : {};
  return all[date] ?? { date, cycles: 0, seconds: 0 };
}

export function saveDay(state: DayState): void {
  const raw = localStorage.getItem(KEY);
  const all: Record<string, DayState> = raw ? JSON.parse(raw) : {};
  all[state.date] = state;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function recordCycle(state: DayState, durationSec: number): DayState {
  const next = {
    ...state,
    cycles: state.cycles + 1,
    seconds: state.seconds + durationSec,
  };
  saveDay(next);
  return next;
}
