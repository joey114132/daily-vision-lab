import type { WeatherKind } from "./moodEngine";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  hue: number;
};

const PALETTES: Record<
  WeatherKind,
  { hue: number; sat: number; particles: number; wind: number }
> = {
  "golden-hour": { hue: 38, sat: 72, particles: 90, wind: 0.15 },
  "high-pressure": { hue: 205, sat: 35, particles: 40, wind: 0.05 },
  "distant-storm": { hue: 248, sat: 45, particles: 120, wind: 0.55 },
  "sea-fog": { hue: 195, sat: 18, particles: 160, wind: 0.08 },
  aurora: { hue: 145, sat: 68, particles: 100, wind: 0.35 },
  "heat-shimmer": { hue: 18, sat: 55, particles: 70, wind: 0.25 },
};

export class Atmosphere {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private kind: WeatherKind = "high-pressure";
  private w = 0;
  private h = 0;
  private tick = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2d unavailable");
    this.ctx = ctx;
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  setWeather(kind: WeatherKind) {
    if (kind === this.kind) return;
    this.kind = kind;
    this.seed();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = `${this.w}px`;
    this.canvas.style.height = `${this.h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.seed();
  }

  private seed() {
    const palette = PALETTES[this.kind];
    this.particles = Array.from({ length: palette.particles }, () => this.spawn(palette));
  }

  private spawn(palette: (typeof PALETTES)[WeatherKind]): Particle {
    return {
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * palette.wind,
      vy: (Math.random() - 0.5) * palette.wind * 0.6,
      life: Math.random(),
      size: 1 + Math.random() * 2.8,
      hue: palette.hue + (Math.random() - 0.5) * 18,
    };
  }

  frame() {
    const palette = PALETTES[this.kind];
    this.tick += 0.016;
    const g = this.ctx.createLinearGradient(0, 0, 0, this.h);
    g.addColorStop(0, `hsla(${palette.hue}, ${palette.sat}%, 8%, 0.92)`);
    g.addColorStop(0.55, `hsla(${palette.hue + 20}, ${palette.sat * 0.6}%, 4%, 0.95)`);
    g.addColorStop(1, "hsla(220, 30%, 2%, 0.98)");
    this.ctx.fillStyle = g;
    this.ctx.fillRect(0, 0, this.w, this.h);

    for (const p of this.particles) {
      p.x += p.vx + Math.sin(this.tick + p.life * 10) * 0.08;
      p.y += p.vy + Math.cos(this.tick * 0.7 + p.x * 0.002) * 0.05;
      p.life += 0.002;
      if (p.x < -20 || p.x > this.w + 20 || p.y < -20 || p.y > this.h + 20) {
        Object.assign(p, this.spawn(palette));
      }
      const alpha = 0.08 + Math.sin(p.life * 6) * 0.04;
      this.ctx.beginPath();
      this.ctx.fillStyle = `hsla(${p.hue}, ${palette.sat}%, 72%, ${alpha})`;
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    if (this.kind === "distant-storm" && Math.random() < 0.004) {
      this.ctx.fillStyle = "rgba(255,255,255,0.06)";
      this.ctx.fillRect(0, 0, this.w, this.h);
    }
  }
}
