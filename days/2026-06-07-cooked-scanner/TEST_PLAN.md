# Test plan · Cooked Scanner / 요리됨 스캐너

**Date:** 2026-06-07 · **Day 4**

## Automated

- [x] `npm run build` exits 0
- [x] `dist/index.html` exists
- [x] `scripts/validate-day.mjs` — 10/10 PASS
- [x] `npm run preview` HTTP 200

## Bilingual / 한영

- [x] EN / 한국어 toggle on load
- [x] Meme tiers translate (GOATED / 요리됨 etc.)
- [x] `document.documentElement.lang` updates

## Camera / meme logic

- [x] Scan button → camera permission
- [x] Cooked index updates live (chaos heuristic)
- [x] Verdict tier changes with score bands
- [x] Meme cards spawn every ~7s
- [x] `overlayX()` face box — mirror correct

## UX

- [x] Disclaimer visible (not medical / not useful)
- [x] `beforeunload` stops camera
- [x] Responsive layout ≤800px

## Evidence log

| Check | Result |
|-------|--------|
| validate | 10/10 PASS |
| build | vite 6.4.3 exit 0 |
| mirror | overlayX, no double-flip |
