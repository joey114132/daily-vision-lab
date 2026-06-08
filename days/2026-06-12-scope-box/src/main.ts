import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle, t } from "./shared/i18n";
import {
  addItem,
  doneCount,
  exportMarkdown,
  loadDay,
  lockScope,
  maxItems,
  removeItem,
  toggleItem,
  type DayState,
} from "./storage";
import "./style.css";

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

const slotsEl = document.getElementById("slots") as HTMLUListElement;
const form = document.getElementById("add-form") as HTMLFormElement;
const input = document.getElementById("task-input") as HTMLInputElement;
const lockBtn = document.getElementById("lock") as HTMLButtonElement;
const copyBtn = document.getElementById("copy") as HTMLButtonElement;
const statDone = document.getElementById("stat-done") as HTMLElement;
const statSlots = document.getElementById("stat-slots") as HTMLElement;
const slotMeter = document.getElementById("slot-meter") as HTMLElement;
const lockedBanner = document.getElementById("locked-banner") as HTMLElement;
const toast = document.getElementById("toast") as HTMLElement;

let state: DayState = loadDay();
const MAX = maxItems();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (state.locked) return;
  const text = input.value.trim();
  if (!text) return;
  const next = addItem(state, text);
  if (!next) {
    showToast("full");
    return;
  }
  state = next;
  input.value = "";
  render();
});

lockBtn.addEventListener("click", () => {
  if (state.locked || state.items.length === 0) return;
  state = lockScope(state);
  showToast("locked");
  render();
});

copyBtn.addEventListener("click", async () => {
  const md = exportMarkdown(state, {
    statDone: t("statDone"),
    lockedLabel: t("lockedLabel"),
    yes: t("yes"),
    no: t("no"),
  });
  await navigator.clipboard.writeText(md);
  showToast("copied");
});

window.addEventListener("dvl:lang", () => render());

function render() {
  document.body.dataset.locked = String(state.locked);
  statDone.textContent = String(doneCount(state));
  statSlots.textContent = `${state.items.length}/${MAX}`;
  slotMeter.textContent = `${state.items.length} / ${MAX}`;
  lockedBanner.classList.toggle("hidden", !state.locked);
  lockBtn.disabled = state.locked || state.items.length === 0;
  input.disabled = state.locked || state.items.length >= MAX;
  form.querySelector<HTMLButtonElement>(".btn-add")!.disabled =
    state.locked || state.items.length >= MAX;

  slotsEl.innerHTML = "";
  if (state.items.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = t("emptyHint");
    slotsEl.append(li);
    return;
  }

  state.items.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = `slot ${item.done ? "done" : ""}`;
    li.style.animationDelay = `${i * 50}ms`;

    const check = document.createElement("button");
    check.type = "button";
    check.className = "check";
    check.setAttribute("aria-pressed", String(item.done));
    check.addEventListener("click", () => {
      state = toggleItem(state, item.id);
      render();
    });

    const label = document.createElement("span");
    label.className = "slot-text";
    label.textContent = item.text;

    const idx = document.createElement("span");
    idx.className = "slot-idx";
    idx.textContent = `${t("slotLabel")} ${i + 1}`;

    li.append(check, label, idx);

    if (!state.locked) {
      const del = document.createElement("button");
      del.type = "button";
      del.className = "remove";
      del.textContent = "×";
      del.addEventListener("click", () => {
        state = removeItem(state, item.id);
        render();
      });
      li.append(del);
    }

    slotsEl.append(li);
  });
}

function showToast(key: keyof typeof STRINGS) {
  toast.textContent = t(key);
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

render();
