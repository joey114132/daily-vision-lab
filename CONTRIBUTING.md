# Daily commit workflow / 일일 작업 규칙

## Privacy first / 프라이버시 우선

**No camera. No microphone. No permission prompts.**

- Do **not** use `getUserMedia`, screen capture, or cloud uploads.
- Data: `localStorage` / in-memory only unless user explicitly exports.
- Useful + productive apps are still the goal — timers, focus tools, local dashboards, text UX.

Legacy camera days (`microclimate`, `gesture-constellation`, etc.) stay in repo history but **new days must not use vision/camera**.

## Mandatory gate / 필수 게이트

1. `templates/TEST_PLAN.md` → each `days/*/TEST_PLAN.md`
2. `npm run validate` must exit 0 (includes privacy grep)
3. Every TEST_PLAN checkbox `[x]` with evidence
4. CI validates on generate and deploy

## Every new day

1. Thesis scan (privacy-preserving productivity / local-first UX).
2. `npm run generate` or scaffold `generators/<slug>/` without MediaPipe.
3. Manual: EN/KO, core flow, refresh persistence.
4. Commit (Korean) and push.

## App direction

- **Useful & productive** — focus, breaks, planning, niche desk tools.
- **Zero sensors** — respect privacy-sensitive users.
- Bilingual EN/KO required.
- No API keys unless explicitly required (avoid when possible).

## Scope guardrails

- ≤ 1 day of work per folder.
- No `@mediapipe` in new generators.
