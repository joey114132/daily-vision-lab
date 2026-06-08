# Test plan · __TITLE_EN__ / __TITLE_KO__

**Date:** __DATE__ · **Day __DAY_NUM__**

Every item must pass before merge/deploy. Mark `[x]` only with evidence.

## Automated (CI + `npm run validate`)

- [ ] `npm run build` exits 0
- [ ] `dist/index.html` exists
- [ ] `scripts/validate-day.mjs` passes
- [ ] `npm run preview` serves HTTP 200
- [ ] `npm run verify:dev` — localhost:5174 serves this day (after ship)

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

## Design / 디자인

- [ ] `DESIGN.md` filled; frontend-design skill applied
- [ ] Distinctive typography (not Inter/Roboto defaults)
- [ ] One memorable visual detail (texture, stamp, ring, etc.)
- [ ] Hover/active/empty states polished
- [ ] `prefers-reduced-motion` respected

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
