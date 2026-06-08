# Daily Vision Lab / 데일리 비전 랩

**EN:** One niche web app per day — **useful, productive, privacy-first** (no camera). Bilingual (KO/EN), automated via GitHub Actions.  
**KO:** 매일 하나 — **실용·생산성**, **카메라 없음** 프라이버시 우선. 한영 지원, 자동 생성·배포.

## Live demo / 라이브 데모

**[Latest app on GitHub Pages](https://joey114132.github.io/daily-vision-lab/)** — no permissions required.

## Days / 일차 목록

<!-- DAYS_TABLE_START -->
| Date | Folder | Title EN / KO |
|------|--------|----------------|
| 2026-06-04 | [microclimate](./days/2026-06-04-microclimate/) | Microclimate / 2026-06-04-microclimate |
| 2026-06-05 | [gesture-constellation](./days/2026-06-05-gesture-constellation/) | Gesture Constellation / 제스처 별자리 |
| 2026-06-06 | [blink-tide](./days/2026-06-06-blink-tide/) | Blink Tide / 깜빡임 조수 |
| 2026-06-07 | [cooked-scanner](./days/2026-06-07-cooked-scanner/) | Cooked Scanner / 요리됨 스캐너 |
| 2026-06-08 | [desk-well](./days/2026-06-08-desk-well/) | DeskWell / 데스크웰 |
| 2026-06-09 | [focus-ledger](./days/2026-06-09-focus-ledger/) | Focus Ledger / 포커스 원장 |
| 2026-06-10 | [margin-notes](./days/2026-06-10-margin-notes/) | Margin Notes / 여백 메모 |
| 2026-06-11 | [breath-cadence](./days/2026-06-11-breath-cadence/) | Breath Cadence / 호흡 박자 |
<!-- DAYS_TABLE_END -->

## Run today's app / 오늘 앱 실행

```zsh
cd days/2026-06-09-focus-ledger
npm install
npm run dev
```

Open **http://localhost:5174** · Chrome/Edge recommended.

## Automation / 자동화

- **Daily cron:** `00:00 KST` — `.github/workflows/daily-automation.yml` builds the next catalog app, commits, pushes.
- **Deploy:** every push to `main` deploys the **latest** `days/*` folder to Pages.
- **Manual:** `npm run generate` or `node scripts/generate-next-day.mjs`

## Requirements

- No camera · No API keys · Data stays in your browser
