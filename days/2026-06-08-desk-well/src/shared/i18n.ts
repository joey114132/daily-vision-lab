export type Lang = "en" | "ko";

export type I18nDict = Record<string, { en: string; ko: string }>;

let lang: Lang = "en";
let dict: I18nDict = {};

export function loadStrings(strings: I18nDict, defaultLang?: Lang): void {
  dict = strings;
  const saved = localStorage.getItem("dvl-lang") as Lang | null;
  const nav = navigator.language.toLowerCase().startsWith("ko") ? "ko" : "en";
  lang = saved ?? defaultLang ?? nav;
  document.documentElement.lang = lang;
}

export function getLang(): Lang {
  return lang;
}

export function t(key: string): string {
  const row = dict[key];
  if (!row) return key;
  return row[lang] ?? row.en;
}

export function setLang(next: Lang): void {
  lang = next;
  localStorage.setItem("dvl-lang", next);
  document.documentElement.lang = next;
  applyStaticI18n();
  window.dispatchEvent(new CustomEvent("dvl:lang", { detail: next }));
}

export function applyStaticI18n(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (key) el.textContent = t(key);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (key && "placeholder" in el) (el as HTMLInputElement).placeholder = t(key);
  });
}

export function mountLangToggle(containerId = "lang-toggle"): void {
  const host = document.getElementById(containerId);
  if (!host) return;
  host.innerHTML = `
    <button type="button" data-lang="en" class="lang-btn">EN</button>
    <button type="button" data-lang="ko" class="lang-btn">한국어</button>
  `;
  host.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang as Lang));
  });
  window.addEventListener("dvl:lang", () => syncLangButtons(host));
  syncLangButtons(host);
}

function syncLangButtons(host: HTMLElement): void {
  host.querySelectorAll<HTMLButtonElement>("[data-lang]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}
