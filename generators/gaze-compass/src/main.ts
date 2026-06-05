import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle } from "./shared/i18n";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const sky = document.getElementById("sky") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const start = document.getElementById("start") as HTMLButtonElement;
const headEl = document.getElementById("star-count") as HTMLElement;
const leanEl = document.getElementById("hand-count") as HTMLElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

const ctx = sky.getContext("2d")!;
let landmarker: FaceLandmarker | null = null;
let running = false;
let angle = 0;

const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

start.addEventListener("click", async () => {
  start.classList.add("hidden");
  loading.classList.remove("hidden");
  landmarker = await FaceLandmarker.createFromOptions(
    await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm",
    ),
    {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numFaces: 1,
    },
  );
  video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  await video.play();
  loading.classList.add("hidden");
  running = true;
  loop();
});

function loop() {
  if (!running || !landmarker) return;
  sky.width = innerWidth;
  sky.height = innerHeight;
  const res = landmarker.detectForVideo(video, performance.now());
  const lm = res.faceLandmarks?.[0];
  if (lm) {
    const left = lm[33];
    const right = lm[263];
    const dx = right.x - left.x;
    const dy = (lm[159].y + lm[386].y) / 2 - (lm[145].y + lm[374].y) / 2;
    angle = Math.atan2(dy, dx);
    const idx = Math.round(((angle + Math.PI) / (2 * Math.PI)) * 8) % 8;
    headEl.textContent = dirs[idx];
    leanEl.textContent = `${Math.round(Math.hypot(dx, dy) * 100)}%`;
  }
  ctx.fillStyle = "rgba(0,0,0,0.12)";
  ctx.fillRect(0, 0, sky.width, sky.height);
  const cx = sky.width / 2;
  const cy = sky.height / 2;
  const r = Math.min(cx, cy) * 0.35;
  ctx.strokeStyle = "rgba(255,200,120,0.5)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
  ctx.stroke();
  requestAnimationFrame(loop);
}
