import { FaceLandmarker, FilesetResolver, type FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle, t } from "./shared/i18n";
import { overlayX } from "./shared/mirror";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const overlay = document.getElementById("overlay") as HTMLCanvasElement;
const sky = document.getElementById("sky") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const start = document.getElementById("start") as HTMLButtonElement;
const tideEl = document.getElementById("star-count") as HTMLElement;
const blinkEl = document.getElementById("hand-count") as HTMLElement;
const log = document.getElementById("log") as HTMLElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

let landmarker: FaceLandmarker | null = null;
let running = false;
let tide = 0.35;
let blinks = 0;
let lastBlink = 0;
let wave = 0;
const skyCtx = sky.getContext("2d")!;

start.addEventListener("click", async () => {
  start.classList.add("hidden");
  loading.classList.remove("hidden");
  try {
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
        outputFaceBlendshapes: true,
      },
    );
    video.srcObject = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });
    await video.play();
    fitCanvas();
    loading.classList.add("hidden");
    running = true;
    loop();
  } catch (err) {
    loading.querySelector("p")!.textContent =
      err instanceof Error ? err.message : "Camera or model failed.";
  }
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
  sky.width = window.innerWidth;
  sky.height = window.innerHeight;
  wave += 0.04;
  const res = landmarker.detectForVideo(video, performance.now());
  ingestBlink(res);
  drawFace(res);
  tide = Math.max(0.08, tide - 0.0012);
  tideEl.textContent = `${Math.round(tide * 100)}%`;
  blinkEl.textContent = String(blinks);
  paintSea(tide);
  requestAnimationFrame(loop);
}

function ingestBlink(res: FaceLandmarkerResult) {
  const cats = res.faceBlendshapes?.[0]?.categories ?? [];
  const blink =
    ((cats.find((c) => c.categoryName === "eyeBlinkLeft")?.score ?? 0) +
      (cats.find((c) => c.categoryName === "eyeBlinkRight")?.score ?? 0)) /
    2;
  if (blink > 0.55 && performance.now() - lastBlink > 280) {
    lastBlink = performance.now();
    blinks++;
    tide = Math.min(1, tide + 0.14);
    const p = document.createElement("p");
    p.textContent = t(blinks % 2 ? "whisper2" : "whisper3");
    log.prepend(p);
    while (log.children.length > 5) log.lastChild?.remove();
  }
}

function drawFace(res: FaceLandmarkerResult) {
  const ctx = overlay.getContext("2d")!;
  const w = overlay.width;
  const h = overlay.height;
  ctx.clearRect(0, 0, w, h);
  const lm = res.faceLandmarks?.[0];
  if (!lm) return;
  ctx.strokeStyle = "rgba(80, 220, 200, 0.45)";
  ctx.lineWidth = 1.5;
  for (const [a, b] of [
    [33, 133],
    [263, 362],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(overlayX(lm[a].x, w), lm[a].y * h);
    ctx.lineTo(overlayX(lm[b].x, w), lm[b].y * h);
    ctx.stroke();
  }
  for (const idx of [33, 263, 1]) {
    const p = lm[idx];
    ctx.fillStyle = "rgba(120, 255, 230, 0.9)";
    ctx.beginPath();
    ctx.arc(overlayX(p.x, w), p.y * h, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function paintSea(level: number) {
  const base = sky.height * (1 - level * 0.68);
  const h = base + Math.sin(wave) * 8;
  const g = skyCtx.createLinearGradient(0, h, 0, sky.height);
  g.addColorStop(0, "rgba(40, 180, 200, 0.2)");
  g.addColorStop(1, "rgba(8, 50, 80, 0.6)");
  skyCtx.fillStyle = "rgba(2, 8, 18, 0.18)";
  skyCtx.fillRect(0, 0, sky.width, sky.height);
  skyCtx.fillStyle = g;
  skyCtx.fillRect(0, h, sky.width, sky.height - h);
}

window.addEventListener("beforeunload", () => {
  running = false;
  const stream = video.srcObject as MediaStream | null;
  stream?.getTracks().forEach((tr) => tr.stop());
});

window.addEventListener("resize", () => {
  if (video.videoWidth) fitCanvas();
});
