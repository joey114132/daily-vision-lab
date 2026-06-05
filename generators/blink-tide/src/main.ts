import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle, t } from "./shared/i18n";
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
const skyCtx = sky.getContext("2d")!;

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
      outputFaceBlendshapes: true,
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
  sky.width = window.innerWidth;
  sky.height = window.innerHeight;
  const res = landmarker.detectForVideo(video, performance.now());
  const cats = res.faceBlendshapes?.[0]?.categories ?? [];
  const blink =
    ((cats.find((c) => c.categoryName === "eyeBlinkLeft")?.score ?? 0) +
      (cats.find((c) => c.categoryName === "eyeBlinkRight")?.score ?? 0)) /
    2;
  if (blink > 0.55 && performance.now() - lastBlink > 250) {
    lastBlink = performance.now();
    blinks++;
    tide = Math.min(1, tide + 0.12);
    const p = document.createElement("p");
    p.textContent = t(blinks % 2 ? "whisper2" : "whisper3");
    log.prepend(p);
  }
  tide = Math.max(0.08, tide - 0.0015);
  tideEl.textContent = `${Math.round(tide * 100)}%`;
  blinkEl.textContent = String(blinks);
  paintSea(tide);
  const ctx = overlay.getContext("2d")!;
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  requestAnimationFrame(loop);
}

function paintSea(level: number) {
  const h = sky.height * (1 - level * 0.65);
  const g = skyCtx.createLinearGradient(0, h, 0, sky.height);
  g.addColorStop(0, "rgba(30, 120, 180, 0.15)");
  g.addColorStop(1, "rgba(10, 40, 90, 0.55)");
  skyCtx.fillStyle = "rgba(2, 5, 15, 0.25)";
  skyCtx.fillRect(0, 0, sky.width, sky.height);
  skyCtx.fillStyle = g;
  skyCtx.fillRect(0, h, sky.width, sky.height - h);
}

overlay.width = 640;
overlay.height = 480;
