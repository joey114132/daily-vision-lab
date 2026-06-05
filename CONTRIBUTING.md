# Daily commit workflow / 일일 작업 규칙

## Mandatory gate / 필수 게이트

**No day ships without a passing test plan.**  
**테스트 플랜 전체 통과 없이 배포·머지 금지.**

1. `templates/TEST_PLAN.md` → copied to each `days/*/TEST_PLAN.md` on generate.
2. `npm run validate` (or `node scripts/validate-day.mjs <day-folder>`) must exit 0.
3. Every checkbox in `TEST_PLAN.md` must be `[x]` with evidence in the Evidence log.
4. CI runs validate on generate and deploy.

## Mirror convention / 미러 규칙

When `#video` and `#overlay` use CSS `transform: scaleX(-1)`:

- Draw with **raw** `landmark.x * width` via `overlayX()` from `src/shared/mirror.ts`.
- **Never** `(1 - x)` on overlay canvas — that double-flips and swaps left/right hands.

## Every new day

1. Thesis scan (vision AI / ambient UI / generative interfaces).
2. `npm run generate` — scaffolds, builds, validates.
3. Manual checks: mirror hands, EN/KO toggle, camera flow.
4. Mark `TEST_PLAN.md` complete.
5. Commit (Korean message) and push.

## App direction (from Day 5+)

- **Useful & productive** — desk health, focus, ergonomics, niche tooling.
- Research thesis required (SitCoach, PosturePlus, JMIR, etc.).
- Meme/entertainment days are optional one-offs, not the default.

## Scope guardrails

- ≤ 1 day of work per folder.
- Bilingual EN/KO required.
- No API keys unless the day explicitly needs them.
- On-device vision preferred.
