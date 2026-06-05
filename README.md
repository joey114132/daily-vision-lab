# Daily Vision Lab / 데일리 비전 랩

**EN:** One niche, passive, vision-AI web experiment per day — bilingual (KO/EN), automated via GitHub Actions.  
**KO:** 매일 하나씩 — 한영 지원, 패시브 비전 AI 실험. GitHub Actions로 자동 생성·배포.

## Live demo / 라이브 데모

**[Latest app on GitHub Pages](https://joey114132.github.io/daily-vision-lab/)** — webcam + HTTPS required.

## Days / 일차 목록

<!-- DAYS_TABLE_START -->
| Date | Folder | Title EN / KO |
|------|--------|----------------|
| 2026-06-04 | [microclimate](./days/2026-06-04-microclimate/) | Microclimate / 2026-06-04-microclimate |
| 2026-06-05 | [gesture-constellation](./days/2026-06-05-gesture-constellation/) | Gesture Constellation / 제스처 별자리 |
| 2026-06-06 | [blink-tide](./days/2026-06-06-blink-tide/) | Blink Tide / 깜빡임 조수 |
| 2026-06-07 | [cooked-scanner](./days/2026-06-07-cooked-scanner/) | Cooked Scanner / 요리됨 스캐너 |
<!-- DAYS_TABLE_END -->

## Run today's app / 오늘 앱 실행

```zsh
cd days/2026-06-06-blink-tide
npm install
npm run dev
```

Open **http://localhost:5174** · Chrome/Edge recommended.

## Automation / 자동화

- **Daily cron:** `00:00 KST` — `.github/workflows/daily-automation.yml` builds the next catalog app, commits, pushes.
- **Deploy:** every push to `main` deploys the **latest** `days/*` folder to Pages.
- **Manual:** `npm run generate` or `node scripts/generate-next-day.mjs`

## Requirements

- Webcam · Modern Chromium · No API keys · All inference on-device
