import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle, t } from "./shared/i18n";
import { cycleDuration, PATTERNS, type PatternId, type Phase } from "./patterns";
import { loadDay, recordCycle, type DayState } from "./storage";
import "./style.css";

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

const countdownEl = document.getElementById("countdown") as HTMLElement;
const phaseEl = document.getElementById("phase-label") as HTMLElement;
const toggleBtn = document.getElementById("toggle") as HTMLButtonElement;
const guideEl = document.getElementById("guide-text") as HTMLElement;
const statCycles = document.getElementById("stat-cycles") as HTMLElement;
const statMinutes = document.getElementById("stat-minutes") as HTMLElement;
const toast = document.getElementById("toast") as HTMLElement;
const patternChips = document.querySelectorAll<HTMLButtonElement>("[data-pattern]");

let patternId: PatternId = "box";
let running = false;
let phaseIndex = 0;
let phaseStart = 0;
let state: DayState = loadDay();
let raf = 0;

function phaseKey(phase: Phase): keyof typeof STRINGS {
  if (phase === "inhale") return "phaseInhale";
  if (phase === "hold1") return "phaseHold1";
  if (phase === "exhale") return "phaseExhale";
  return "phaseHold2";
}

function currentPattern() {
  return PATTERNS[patternId];
}

function setPattern(id: PatternId) {
  if (running) return;
  patternId = id;
  patternChips.forEach((c) => c.classList.toggle("active", c.dataset.pattern === id));
  guideEl.dataset.i18n = id === "box" ? "guideBox" : "guideCalm";
  guideEl.textContent = t(id === "box" ? "guideBox" : "guideCalm");
  resetIdle();
}

function resetIdle() {
  const first = currentPattern().phases.find((p) => p.seconds > 0);
  countdownEl.textContent = String(first?.seconds ?? 4);
  phaseEl.textContent = "—";
  document.body.dataset.phase = "idle";
  document.body.dataset.running = "false";
}

function startCadence() {
  running = true;
  phaseIndex = 0;
  const phases = currentPattern().phases.filter((p) => p.seconds > 0);
  phaseStart = performance.now();
  document.body.dataset.running = "true";
  toggleBtn.dataset.i18n = "btnStop";
  toggleBtn.textContent = t("btnStop");
  applyPhase(phases[0]?.phase ?? "inhale", phases[0]?.seconds ?? 4);
  tick();
}

function stopCadence() {
  running = false;
  cancelAnimationFrame(raf);
  toggleBtn.dataset.i18n = "btnStart";
  toggleBtn.textContent = t("btnStart");
  resetIdle();
}

function applyPhase(phase: Phase, remaining: number) {
  document.body.dataset.phase = phase;
  phaseEl.textContent = t(phaseKey(phase));
  countdownEl.textContent = String(Math.ceil(remaining));
}

function tick() {
  if (!running) return;
  const now = performance.now();
  const elapsed = (now - phaseStart) / 1000;
  const phases = currentPattern().phases.filter((p) => p.seconds > 0);
  const current = phases[phaseIndex];
  if (!current) {
    stopCadence();
    return;
  }

  const left = Math.max(0, current.seconds - elapsed);
  applyPhase(current.phase, left);

  if (left <= 0) {
    phaseIndex++;
    if (phaseIndex >= phases.length) {
      const dur = cycleDuration(currentPattern());
      state = recordCycle(state, dur);
      renderStats();
      showToast("cycleDone");
      phaseIndex = 0;
    }
    const next = phases[phaseIndex];
    phaseStart = now;
    if (next) applyPhase(next.phase, next.seconds);
  }

  raf = requestAnimationFrame(tick);
}

function renderStats() {
  statCycles.textContent = String(state.cycles);
  statMinutes.textContent =
    state.seconds < 60 ? `${state.seconds}s` : `${Math.round(state.seconds / 60)}m`;
}

function showToast(key: keyof typeof STRINGS) {
  toast.textContent = t(key);
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1800);
}

toggleBtn.addEventListener("click", () => {
  if (running) stopCadence();
  else startCadence();
});

patternChips.forEach((chip) => {
  chip.addEventListener("click", () => setPattern(chip.dataset.pattern as PatternId));
});

window.addEventListener("dvl:lang", () => {
  if (running) {
    toggleBtn.textContent = t("btnStop");
  } else {
    toggleBtn.textContent = t("btnStart");
    resetIdle();
  }
  guideEl.textContent = t(patternId === "box" ? "guideBox" : "guideCalm");
});

renderStats();
resetIdle();
