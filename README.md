# Daily Vision Lab / 데일리 비전 랩

**EN:** One niche web app per day — each app ships to its **own repo** (`dvl-<slug>`). This repo is the **studio hub** (generators, catalog, automation).  
**KO:** 매일 니치 웹앱 하나 — **앱마다 별도 저장소** (`dvl-<slug>`). 이 repo는 **스튜디오 허브**입니다.

## Live demo / 라이브 데모

**[Breath Cadence](https://joey114132.github.io/dvl-breath-cadence/)** — latest standalone app.

## Days / 일차 목록

<!-- DAYS_TABLE_START -->
| Date | Title EN / KO | Repo | Live | Studio copy |
|------|----------------|------|------|-------------|
| 2026-06-04 | Microclimate / Sit still. Your face becomes the forecast. | [joey114132/dvl-microclimate](https://github.com/joey114132/dvl-microclimate) | [demo](https://joey114132.github.io/dvl-microclimate/) | [source](./days/2026-06-04-microclimate/) |
| 2026-06-05 | Gesture Constellation / 제스처 별자리 | [joey114132/dvl-gesture-constellation](https://github.com/joey114132/dvl-gesture-constellation) | [demo](https://joey114132.github.io/dvl-gesture-constellation/) | [source](./days/2026-06-05-gesture-constellation/) |
| 2026-06-06 | Blink Tide / 깜빡임 조수 | [joey114132/dvl-blink-tide](https://github.com/joey114132/dvl-blink-tide) | [demo](https://joey114132.github.io/dvl-blink-tide/) | [source](./days/2026-06-06-blink-tide/) |
| 2026-06-07 | Cooked Scanner / 요리됨 스캐너 | [joey114132/dvl-cooked-scanner](https://github.com/joey114132/dvl-cooked-scanner) | [demo](https://joey114132.github.io/dvl-cooked-scanner/) | [source](./days/2026-06-07-cooked-scanner/) |
| 2026-06-08 | DeskWell / 데스크웰 | [joey114132/dvl-desk-well](https://github.com/joey114132/dvl-desk-well) | [demo](https://joey114132.github.io/dvl-desk-well/) | [source](./days/2026-06-08-desk-well/) |
| 2026-06-09 | Focus Ledger / 포커스 원장 | [joey114132/dvl-focus-ledger](https://github.com/joey114132/dvl-focus-ledger) | [demo](https://joey114132.github.io/dvl-focus-ledger/) | [source](./days/2026-06-09-focus-ledger/) |
| 2026-06-10 | Margin Notes / 여백 메모 | [joey114132/dvl-margin-notes](https://github.com/joey114132/dvl-margin-notes) | [demo](https://joey114132.github.io/dvl-margin-notes/) | [source](./days/2026-06-10-margin-notes/) |
| 2026-06-11 | Breath Cadence / 호흡 박자 | [joey114132/dvl-breath-cadence](https://github.com/joey114132/dvl-breath-cadence) | [demo](https://joey114132.github.io/dvl-breath-cadence/) | [source](./days/2026-06-11-breath-cadence/) |
<!-- DAYS_TABLE_END -->

## Run today's app / 오늘 앱 실행

```zsh
cd days/2026-06-09-focus-ledger
npm install
npm run dev
```

Open **http://localhost:5174** · Chrome/Edge recommended.

## Automation / 자동화

- **Daily cron:** `00:00 KST` — generates app, publishes to `dvl-<slug>`, updates hub.
- **Per-app Pages:** each `dvl-<slug>` repo deploys its own demo on push.
- **Manual:** `npm run generate` · `npm run publish:day days/…` · `npm run publish:all`

## Requirements

- No camera · No API keys · Data stays in your browser
