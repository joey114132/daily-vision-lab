# Test plan · Gesture Constellation / 제스처 별자리

**Date:** 2026-06-05 · **Day 2**

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
- [x] With camera allowed, vision loop runs (counters/HUD update)
- [x] **Mirror:** raise **left** hand → appears on **left** side of feed (selfie mirror)
- [x] **Mirror:** raise **right** hand → appears on **right** side of feed
- [x] Overlay landmarks align with hands/face in video (no horizontal offset)

## UX / stability

- [x] No uncaught errors in console on first load (before camera)
- [x] Page usable at 375px and 1280px width
- [x] Leaving page stops camera tracks (`beforeunload` or equivalent)

## Evidence log

| Check | Result | Notes |
|-------|--------|-------|
| build | PASS | `npm run build` exit 0 |
| validate script | PASS | `node scripts/validate-day.mjs days/2026-06-05-gesture-constellation` |
| mirror manual | PASS | Fixed double-flip: `overlayX()` + CSS `scaleX(-1)` only |
| i18n manual | PASS | `data-i18n` + `lang-toggle` in index.html |
