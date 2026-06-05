# Test plan · Cooked Scanner / 요리됨 스캐너

**Date:** 2026-06-07 · **Day 4**

Every item must pass before merge/deploy. Mark `[x]` only with evidence (command output or manual note).

## Automated (CI + `npm run validate`)

- [ ] `npm run build` exits 0
- [ ] `dist/index.html` exists
- [ ] `scripts/validate-day.mjs` passes (mirror lint, i18n files, structure)
- [ ] `npm run preview` serves HTTP 200

## Bilingual / 한영

- [ ] EN / 한국어 toggle visible on load
- [ ] Switching to KO updates all `data-i18n` labels
- [ ] Switching back to EN restores English
- [ ] `document.documentElement.lang` matches active language

## Camera / vision

- [ ] Start button requests camera; denial shows error (no silent hang)
- [ ] With camera allowed, vision loop runs (counters/HUD update)
- [ ] **Mirror:** raise **left** hand → appears on **left** side of feed (selfie mirror)
- [ ] **Mirror:** raise **right** hand → appears on **right** side of feed
- [ ] Overlay landmarks align with hands/face in video (no horizontal offset)

## UX / stability

- [ ] No uncaught errors in console on first load (before camera)
- [ ] Page usable at 375px and 1280px width
- [ ] Leaving page stops camera tracks (`beforeunload` or equivalent)

## Evidence log

| Check | Result | Notes |
|-------|--------|-------|
| build | | |
| validate script | | |
| mirror manual | | |
| i18n manual | | |
