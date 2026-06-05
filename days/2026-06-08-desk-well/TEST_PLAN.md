# Test plan · DeskWell / 데스크웰

**Date:** 2026-06-08 · **Day 5** · **Productivity / useful**

## Research basis

- SitCoach: local webcam slouch feedback, no upload
- PosturePlus: temporal sustained drift (not single-frame)
- Ergonomiq / ErgoSense: blink rate + 20-20-20 rule
- JMIR 2024: forward-head detection need for desk workers

## Automated

- [x] `npm run build` exit 0
- [x] `validate-day.mjs` 10/10 PASS
- [x] `npm run preview` HTTP 200
- [x] Mirror lint (`overlayX`, no double-flip)

## Functional / useful

- [x] Start → camera permission flow
- [x] Calibrate 5s → baseline saved message
- [x] Wellness + lean metrics update live post-calibration
- [x] Sustained lean >3s → warning status + nudge
- [x] Blink/min resets each minute
- [x] 20-20-20 countdown visible (20:00 format)
- [x] Break modal opens when timer hits 0
- [x] EN/KO toggle updates labels

## Privacy / safety

- [x] Footer: on-device, not medical
- [x] `beforeunload` stops camera tracks

## Evidence log

| Check | Result |
|-------|--------|
| generate+validate | 10/10 PASS |
| build | tsc + vite OK |
| thesis | SitCoach, PosturePlus, Ergonomiq, JMIR FHP |
