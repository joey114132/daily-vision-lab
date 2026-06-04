# Daily commit workflow

## One-time GitHub setup

```zsh
gh auth login
cd ~/daily-vision-lab
gh repo create daily-vision-lab --public --source=. --remote=origin --push
```

## Every new day

1. Web search: latest thesis on vision AI / ambient UI / generative interfaces.
2. `mkdir days/YYYY-MM-DD-<slug>` — copy `package.json` pattern from the previous day.
3. Ship a **single focused demo** (passive, browser-first when possible).
4. Update root `README.md` table.
5. Commit (Korean message) and push.

## Scope guardrails

- **≤ 1 day of work** — if bigger, split across days.
- **No API keys** unless the day explicitly needs it.
- **UI matters** — one bold aesthetic direction per app.
- **Thesis note** in each day's `README.md` (2–4 citations).
