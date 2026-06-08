# Daily commit workflow / 일일 작업 규칙

## Repo model / 저장소 구조

| Repo | Role |
|------|------|
| **`daily-vision-lab`** | Studio hub — generators, catalog, automation, local `days/` copies |
| **`dvl-<slug>`** | **One standalone repo per shipped app** — own Pages demo |

Example: `dvl-breath-cadence` → https://github.com/joey114132/dvl-breath-cadence  
Pages: https://joey114132.github.io/dvl-breath-cadence/

Publish: `npm run publish:day days/YYYY-MM-DD-slug` or auto after `npm run generate`.

## Privacy first / 프라이버시 우선

**No camera. No microphone. No permission prompts.**

- Do **not** use `getUserMedia`, screen capture, or cloud uploads.
- Data: `localStorage` / in-memory only unless user explicitly exports.
- Useful + productive apps are still the goal — timers, focus tools, local dashboards, text UX.

Legacy camera days stay in studio history; **new days must not use vision/camera**.

## Mandatory gate / 필수 게이트

1. `templates/TEST_PLAN.md` → each day folder
2. `npm run validate` must exit 0
3. Every TEST_PLAN checkbox `[x]` with evidence
4. `npm run publish:day` → separate `dvl-<slug>` repo + Pages
5. `npm run verify:dev` — port 5174 serves latest local copy

## Design & skills (required)

Before coding each day:

1. **Superpowers** → relevant skills in order.
2. **frontend-design** — bold aesthetic; fill `DESIGN.md`.
3. **verification-before-completion** — validate + TEST_PLAN before ship.

## Every new day

1. Thesis scan (privacy-preserving productivity / local-first UX).
2. Read **frontend-design** skill; write DESIGN.md.
3. `npm run generate` (validates, publishes to `dvl-<slug>`, updates hub README).
4. Visual QA at 375px + 1280px.
5. Commit hub changes (Korean) and push `daily-vision-lab`.

## App direction

- **Useful & productive** — focus, breaks, planning, niche desk tools.
- **Zero sensors** — respect privacy-sensitive users.
- Bilingual EN/KO required.
- No API keys unless explicitly required.

## Scope guardrails

- ≤ 1 day of work per app.
- No `@mediapipe` in new generators.
