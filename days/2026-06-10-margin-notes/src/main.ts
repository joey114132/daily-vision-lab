import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle, t } from "./shared/i18n";
import { addNote, exportMarkdown, loadDay, parkNote, type DayState } from "./storage";
import "./style.css";

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

const form = document.getElementById("capture-form") as HTMLFormElement;
const input = document.getElementById("urge-input") as HTMLInputElement;
const notesEl = document.getElementById("notes") as HTMLUListElement;
const statActive = document.getElementById("stat-active") as HTMLElement;
const statParked = document.getElementById("stat-parked") as HTMLElement;
const statTotal = document.getElementById("stat-total") as HTMLElement;
const stackCount = document.getElementById("stack-count") as HTMLElement;
const exportBtn = document.getElementById("export") as HTMLButtonElement;
const toast = document.getElementById("toast") as HTMLElement;

let state: DayState = loadDay();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  state = addNote(state, text);
  input.value = "";
  render();
  showToast("captured");
  input.focus();
});

exportBtn.addEventListener("click", async () => {
  const md = exportMarkdown(state, {
    statActive: t("statActive"),
    statParked: t("statParked"),
    sectionActive: t("sectionActive"),
    sectionParked: t("sectionParked"),
  });
  await navigator.clipboard.writeText(md);
  showToast("copied");
});

window.addEventListener("dvl:lang", () => render());

function render() {
  const active = state.notes.filter((n) => !n.parked);
  const parked = state.notes.filter((n) => n.parked);

  statActive.textContent = String(active.length);
  statParked.textContent = String(parked.length);
  statTotal.textContent = String(state.notes.length);
  stackCount.textContent = String(state.notes.length);

  notesEl.innerHTML = "";
  if (state.notes.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = t("emptyList");
    notesEl.append(li);
    return;
  }

  state.notes.forEach((note, i) => {
    const li = document.createElement("li");
    li.className = `receipt ${note.parked ? "parked" : ""}`;
    li.style.setProperty("--tilt", `${((i % 5) - 2) * 0.35}deg`);
    li.style.animationDelay = `${i * 45}ms`;

    const time = document.createElement("time");
    time.dateTime = new Date(note.at).toISOString();
    time.textContent = new Date(note.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const text = document.createElement("p");
    text.className = "receipt-text";
    text.textContent = note.text;

    const actions = document.createElement("div");
    actions.className = "receipt-actions";

    if (!note.parked) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "park-btn";
      btn.textContent = t("btnPark");
      btn.addEventListener("click", () => {
        state = parkNote(state, note.id);
        render();
      });
      actions.append(btn);
    } else {
      const tag = document.createElement("span");
      tag.className = "parked-tag";
      tag.textContent = t("parkedLabel");
      actions.append(tag);
    }

    li.append(time, text, actions);
    notesEl.append(li);
  });
}

function showToast(key: keyof typeof STRINGS) {
  toast.textContent = t(key);
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2200);
}

render();
input.focus();
