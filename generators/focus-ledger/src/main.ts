import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle, t } from "./shared/i18n";
import {
  appendEntry,
  exportMarkdown,
  loadDay,
  minutesInMode,
  type DayState,
  type Mode,
} from "./storage";
import "./style.css";

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

const modeEl = document.getElementById("mode") as HTMLElement;
const timerEl = document.getElementById("timer") as HTMLElement;
const ringProgress = document.getElementById("ring-progress") as unknown as SVGCircleElement;
const statFocus = document.getElementById("stat-focus") as HTMLElement;
const statBreak = document.getElementById("stat-break") as HTMLElement;
const statDrift = document.getElementById("stat-drift") as HTMLElement;
const entriesEl = document.getElementById("entries") as HTMLUListElement;
const exportBtn = document.getElementById("export") as HTMLButtonElement;
const pomoEl = document.getElementById("pomo") as HTMLInputElement;
const toast = document.getElementById("toast") as HTMLElement;
const chips = document.querySelectorAll<HTMLButtonElement>("[data-mode]");

const RING_LEN = 2 * Math.PI * 54;

let state: DayState = loadDay();
let current: Mode | null = state.entries.at(-1)?.mode ?? null;
let blockStart = state.entries.at(-1)?.at ?? Date.now();
let pomoEnd = 0;

ringProgress.style.strokeDasharray = `${RING_LEN}`;
ringProgress.style.strokeDashoffset = `${RING_LEN}`;

chips.forEach((btn) => {
  btn.addEventListener("click", () => switchMode(btn.dataset.mode as Mode));
});

exportBtn.addEventListener("click", async () => {
  const md = exportMarkdown(state, {
    statFocus: t("statFocus"),
    statBreak: t("statBreak"),
    statDrift: t("statDrift"),
    logTitle: t("logTitle"),
  });
  await navigator.clipboard.writeText(md);
  showToast("copied");
});

pomoEl.addEventListener("change", () => {
  if (pomoEl.checked && current === "focus") {
    pomoEnd = blockStart + 25 * 60 * 1000;
  } else {
    pomoEnd = 0;
  }
});

function switchMode(mode: Mode) {
  state = appendEntry(state, mode);
  current = mode;
  blockStart = Date.now();
  if (pomoEl.checked && mode === "focus") {
    pomoEnd = blockStart + 25 * 60 * 1000;
  } else {
    pomoEnd = 0;
  }
  render();
}

function modeLabel(m: Mode | null): string {
  if (!m) return t("modeIdle");
  if (m === "focus") return t("modeFocus");
  if (m === "break") return t("modeBreak");
  return t("modeDrift");
}

function formatTimer(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function setActiveChip() {
  chips.forEach((b) => b.classList.toggle("active", b.dataset.mode === current));
  document.body.dataset.mode = current ?? "idle";
}

function render() {
  modeEl.textContent = modeLabel(current);
  statFocus.textContent = `${minutesInMode(state, "focus")}m`;
  statBreak.textContent = `${minutesInMode(state, "break")}m`;
  statDrift.textContent = String(state.driftTaps);
  setActiveChip();

  entriesEl.innerHTML = "";
  const recent = [...state.entries].reverse().slice(0, 14);
  if (recent.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = t("emptyLedger");
    entriesEl.append(li);
    return;
  }
  recent.forEach((e, i) => {
    const li = document.createElement("li");
    li.style.animationDelay = `${i * 40}ms`;
    li.innerHTML = `<span class="dot ${e.mode}"></span><time>${new Date(e.at).toLocaleTimeString()}</time><span class="entry-mode">${modeLabel(e.mode)}</span>`;
    entriesEl.append(li);
  });
}

function showToast(key: keyof typeof STRINGS) {
  toast.textContent = t(key);
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2200);
}

function tick() {
  const now = Date.now();
  const elapsed = now - blockStart;
  timerEl.textContent = formatTimer(elapsed);

  if (pomoEnd && current === "focus") {
    const total = 25 * 60 * 1000;
    const left = Math.max(0, pomoEnd - now);
    const pct = 1 - left / total;
    ringProgress.style.strokeDashoffset = `${RING_LEN * (1 - pct)}`;
  } else {
    ringProgress.style.strokeDashoffset = `${RING_LEN}`;
  }

  if (pomoEnd && now >= pomoEnd && current === "focus") {
    pomoEnd = 0;
    showToast("pomoDone");
    switchMode("break");
  }
  statFocus.textContent = `${minutesInMode(state, "focus", now)}m`;
  statBreak.textContent = `${minutesInMode(state, "break", now)}m`;
  requestAnimationFrame(tick);
}

render();
tick();
