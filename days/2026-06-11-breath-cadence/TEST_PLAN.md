# Test plan · Breath Cadence / 호흡 박자

**Date:** 2026-06-11 · **Day 8** · **No camera / No mic**

## Privacy / 프라이버시

- [x] **No camera** — no `getUserMedia` in source
- [x] **No microphone**
- [x] Data in **localStorage** only
- [x] No permission dialogs on load

## Design

- [x] `DESIGN.md` filled — aquatic zen aesthetic
- [x] Cormorant Garamond + Cutive Mono (not Inter/Roboto)
- [x] Bioluminescent orb + ripple rings + caustics
- [x] Phase-driven scale + `prefers-reduced-motion`
- [x] EN/KO layout OK at 375px + 1280px

## Automated

- [x] `npm run build` exit 0
- [x] `validate-day.mjs` **12/12 PASS**

## Bilingual

- [x] EN / 한국어 toggle
- [x] Phase labels, patterns, guide translate

## Functional

- [x] Begin cadence → countdown + phase labels cycle
- [x] Box 4·4·4·4 and Calm 4·7·8 patterns switch when idle
- [x] Pause stops mid-cycle
- [x] Cycle completion increments stats + toast
- [x] Refresh persists today's cycle count (localStorage)

## Evidence log

| Check | Result |
|-------|--------|
| privacy grep | PASS |
| validate | 12/12 PASS |
| build | vite 6.4.3 OK |
