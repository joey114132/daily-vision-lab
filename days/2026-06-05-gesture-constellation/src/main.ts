import {
  HandLandmarker,
  FilesetResolver,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle, t } from "./shared/i18n";
import { overlayX } from "./shared/mirror";
import "./style.css";

const TIPS = [4, 8, 12, 16, 20];
const video = document.getElementById("video") as HTMLVideoElement;
const overlay = document.getElementById("overlay") as HTMLCanvasElement;
const sky = document.getElementById("sky") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const start = document.getElementById("start") as HTMLButtonElement;
const starCount = document.getElementById("star-count") as HTMLElement;
const handCountEl = document.getElementById("hand-count") as HTMLElement;
const log = document.getElementById("log") as HTMLElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

const skyCtx = sky.getContext("2d")!;
const trails: { x: number; y: number; life: number }[] = [];
let landmarker: HandLandmarker | null = null;
let running = false;
let stars = 0;
let lastWhisper = 0;

start.addEventListener("click", async () => {
  start.classList.add("hidden");
  loading.classList.remove("hidden");
  landmarker = await HandLandmarker.createFromOptions(
    await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
    ),
    {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    },
  );
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false,
  });
  video.srcObject = stream;
  await video.play();
  fitCanvas();
  loading.classList.add("hidden");
  running = true;
  loop();
});

function fitCanvas() {
  const r = video.getBoundingClientRect();
  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
  overlay.style.width = `${r.width}px`;
  overlay.style.height = `${r.height}px`;
}

function loop() {
  if (!running || !landmarker) return;
  resizeSky();
  paintSky();
  if (video.readyState >= 2) {
    const res = landmarker.detectForVideo(video, performance.now());
    drawHands(res);
    handCountEl.textContent = String(res.landmarks.length);
    if (performance.now() - lastWhisper > 12000 && res.landmarks.length > 0) {
      lastWhisper = performance.now();
      const keys = ["whisper1", "whisper2", "whisper3"] as const;
      const key = keys[Math.floor(Math.random() * keys.length)];
      const p = document.createElement("p");
      p.textContent = t(key);
      log.prepend(p);
      while (log.children.length > 5) log.lastChild?.remove();
    }
  }
  requestAnimationFrame(loop);
}

function drawHands(res: HandLandmarkerResult) {
  const ctx = overlay.getContext("2d")!;
  const w = overlay.width;
  const h = overlay.height;
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(180, 220, 255, 0.5)";
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";

  for (const hand of res.landmarks) {
    const points = TIPS.map((i) => hand[i]);
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const px = overlayX(points[i].x, w);
      const py = points[i].y * h;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      trails.push({ x: px / w, y: py / h, life: 1 });
      stars++;
    }
    ctx.stroke();
  }
  starCount.textContent = String(stars);
}

function resizeSky() {
  sky.width = window.innerWidth;
  sky.height = window.innerHeight;
}

function paintSky() {
  skyCtx.fillStyle = "rgba(4, 6, 18, 0.22)";
  skyCtx.fillRect(0, 0, sky.width, sky.height);
  for (const t of trails) {
    t.life -= 0.004;
    if (t.life <= 0) continue;
    skyCtx.beginPath();
    skyCtx.fillStyle = `rgba(200, 220, 255, ${t.life * 0.35})`;
    skyCtx.arc(t.x * sky.width, t.y * sky.height, 2 + t.life * 3, 0, Math.PI * 2);
    skyCtx.fill();
  }
  trails.splice(0, trails.length - 400);
}

window.addEventListener("resize", resizeSky);
resizeSky();
paintSky();
requestAnimationFrame(function anim() {
  if (!running) paintSky();
  requestAnimationFrame(anim);
});
