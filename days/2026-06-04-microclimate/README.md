# Microclimate · Day 1

**Sit still. Your face becomes the forecast.**

Microclimate is a passive ambient experience: webcam on, no typing, no server. MediaPipe Face Landmarker reads expression blendshapes locally and maps them to poetic “inner weather” — golden hour, sea fog, distant storm, aurora, and more. Particle sky and drifting forecast cards respond in real time.

## Thesis anchors (2025–2026)

| Source | Idea used here |
|--------|----------------|
| [Flint: Standing in the loop of thought](https://openresearch.ocadu.ca/id/eprint/5126/) (Zhang & Kasper, 2026) | AI offers **scaffolding** (weather metaphors, cards), not finished answers; you stay the author — optional “pin reflection” only if you want agency. |
| Ambient computing + multimodal AI | Passive observation: vision + mood inference without chat or commands. |
| On-device vision (MediaPipe, WebGPU ecosystem) | Privacy-first: frames never leave the browser. |
| Generative UI / spatial canvases (PMX, Saorsa, CopilotKit discourse) | Forecast **drift** as spatial cards, not a linear chat log. |

## Stack

- Vite + TypeScript
- [@mediapipe/tasks-vision](https://www.npmjs.com/package/@mediapipe/tasks-vision) Face Landmarker (blendshapes)
- Canvas particle atmosphere
- Template oracle lines (no LLM API — fully offline)

## Commands

```zsh
npm install
npm run dev      # http://localhost:5174
npm run build
npm run preview
```

## Privacy

All inference runs in-tab. Models load from Google CDN / storage on first visit and cache in the browser. No analytics, no accounts.

## Mood → weather mapping (heuristic)

Blendshape averages → warmth, tension, drift, surprise → classified weather with confidence meter. This is **expressive metaphor**, not medical or biometric truth.

## Deploy to GitHub Pages

```zsh
npm run build
# Publish dist/ — base is relative (./) for project pages
```
