# Test plan · Focus Ledger / 포커스 원장

**Date:** 2026-06-09 · **Day 6** · **No camera**

## Privacy / 프라이버시

- [x] **No camera** — no `getUserMedia` in source
- [x] **No microphone**
- [x] Data in **localStorage** only
- [x] No permission dialogs on load

## Automated

- [x] `npm run build` exit 0
- [x] `validate-day.mjs` **12/12 PASS** (privacy checks included)
- [x] `npm run preview` HTTP 200

## Bilingual

- [x] EN / 한국어 toggle
- [x] Mode labels translate

## Design

- [x] `DESIGN.md` filled — editorial ledger aesthetic
- [x] Newsreader + JetBrains Mono (not Inter/Roboto)
- [x] Red margin line, grain texture, pomodoro ring, privacy stamp
- [x] Staggered reveal + `prefers-reduced-motion` in CSS
- [x] EN/KO layout OK at 375px + 1280px

## Functional

- [x] Focus / Break / Drift buttons log entries
- [x] Timer runs for current block
- [x] Today stats update
- [x] Copy summary → clipboard
- [x] 25 min pomo auto-switches to break
- [x] Refresh persists ledger (localStorage)

## Evidence log

| Check | Result |
|-------|--------|
| privacy grep | PASS — no getUserMedia, no MediaPipe |
| validate | 12/12 PASS |
| build | vite 6.4.3 OK |
