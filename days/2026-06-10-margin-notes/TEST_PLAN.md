# Test plan · Margin Notes / 여백 메모

**Date:** 2026-06-10 · **Day 7** · **No camera**

## Privacy / 프라이버시

- [x] **No camera** — no `getUserMedia` in source
- [x] **No microphone**
- [x] Data in **localStorage** only
- [x] No permission dialogs on load

## Design

- [x] `DESIGN.md` filled — thermal receipt aesthetic
- [x] Fraunces + Sometype Mono (not Inter/Roboto)
- [x] Perforated edges, print button, receipt stack tilt
- [x] Staggered reveal + `prefers-reduced-motion` in CSS
- [x] EN/KO layout OK at 375px + 1280px

## Automated

- [x] `npm run build` exit 0
- [x] `validate-day.mjs` **12/12 PASS**
- [x] `npm run preview` HTTP 200

## Bilingual

- [x] EN / 한국어 toggle
- [x] Capture labels, stats, buttons translate

## Functional

- [x] Type urge + submit → appears on stack
- [x] Park button marks note as parked (strikethrough)
- [x] Stats update (open / parked / total)
- [x] Copy stack → clipboard markdown
- [x] Refresh persists notes (localStorage)
- [x] Empty state when no notes

## Evidence log

| Check | Result |
|-------|--------|
| privacy grep | PASS — no getUserMedia, no MediaPipe |
| validate | 12/12 PASS |
| build | vite 6.4.3 OK |
