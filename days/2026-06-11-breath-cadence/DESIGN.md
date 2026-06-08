# Design brief · Breath Cadence

**Aesthetic direction:** Aquatic zen — abyss blue depths, bioluminescent cyan orb, caustic light drift, concentric ripple rings.

## frontend-design checklist

- [x] **Typography** — Cormorant Garamond (phase labels) + Cutive Mono (data) + Noto Sans KR
- [x] **Color** — deep `#061018` abyss + cyan `#3ee7d6` glow; dark theme, no purple gradients
- [x] **Layout** — centered orb stage + side rhythm/stats panels
- [x] **Motion** — ripple pulse, orb scale per inhale/exhale, caustic drift; `prefers-reduced-motion`
- [x] **Texture** — depth-field gradients, SVG caustics noise overlay
- [x] **States** — idle/running, phase-driven `body[data-phase]`, pattern chips, toast
- [x] **Bilingual** — EN/KO toggle; mobile stack at 720px

## Remember

Memorable detail: bioluminescent orb that breathes — expands on inhale, contracts on exhale with ripple rings.
