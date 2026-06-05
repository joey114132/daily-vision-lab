# Test plan · Focus Ledger / 포커스 원장

**Date:** 2026-06-09 · **Day 6**

Every item must pass before merge/deploy. Mark `[x]` only with evidence.

## Automated (CI + `npm run validate`)

- [ ] `npm run build` exits 0
- [ ] `dist/index.html` exists
- [ ] `scripts/validate-day.mjs` passes
- [ ] `npm run preview` serves HTTP 200

## Privacy / 프라이버시

- [ ] **No camera** — app never calls `getUserMedia`
- [ ] **No microphone** — app never calls audio capture APIs
- [ ] Data stays in **localStorage** or memory only (no external API)
- [ ] Works fully after hard refresh without permissions dialogs

## Bilingual / 한영

- [ ] EN / 한국어 toggle visible on load
- [ ] Switching to KO updates all `data-i18n` labels
- [ ] Switching back to EN restores English
- [ ] `document.documentElement.lang` matches active language

## Functional / UX

- [ ] Core feature works without login or API keys
- [ ] No uncaught console errors on first load
- [ ] Page usable at 375px and 1280px width
- [ ] State persists across refresh (if app uses storage)

## Evidence log

| Check | Result | Notes |
|-------|--------|-------|
| build | | |
| validate | | |
| privacy grep | | |
| i18n | | |
