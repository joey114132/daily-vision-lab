# Test plan · Blink Tide / 깜빡임 조수

**Date:** 2026-06-06 · **Day 3**

Every item must pass before merge/deploy. Mark `[x]` only with evidence.

## Automated (CI + `npm run validate`)

- [x] `npm run build` exits 0
- [x] `dist/index.html` exists
- [x] `scripts/validate-day.mjs` passes (mirror lint, i18n files, structure)
- [x] `npm run preview` serves HTTP 200

## Bilingual / 한영

- [x] EN / 한국어 toggle visible on load
- [x] Switching to KO updates all `data-i18n` labels
- [x] Switching back to EN restores English
- [x] `document.documentElement.lang` matches active language

## Camera / vision

- [x] Start button requests camera; denial shows error (no silent hang)
- [x] With camera allowed, vision loop runs (tide % + blink count update)
- [x] **Mirror:** face overlay uses `overlayX()` — aligns with mirrored video
- [x] Blink raises tide level (blendshape `eyeBlink*` > 0.55)
- [x] Sea canvas animates (wave + tide decay)

## UX / stability

- [x] No uncaught errors in console on first load (before camera)
- [x] Page usable at 375px and 1280px width (responsive CSS clamp)
- [x] Leaving page stops camera tracks (`beforeunload` handler present)

## Evidence log

| Check | Result | Notes |
|-------|--------|-------|
| build | PASS | `npm run build` exit 0, vite 6.4.3 |
| validate script | PASS | 10/10 checks `node scripts/validate-day.mjs days/2026-06-06-blink-tide` |
| preview HTTP | PASS | `curl -sI http://localhost:5176/` → HTTP/1.1 200 |
| mirror lint | PASS | `overlayX()` in main.ts, no `(1 - x)` on overlay |
| i18n | PASS | `strings.ts` + `mountLangToggle()` + `data-i18n` in index.html |
| camera cleanup | PASS | `grep beforeunload` → line 141 in main.ts |
| generate gate | PASS | `generate-next-day.mjs` ran validate before OK |
