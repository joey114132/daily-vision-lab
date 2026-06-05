import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle } from "./shared/i18n";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const sky = document.getElementById("sky") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const start = document.getElementById("start") as HTMLButtonElement;
const minEl = document.getElementById("star-count") as HTMLElement;
const presEl = document.getElementById("hand-count") as HTMLElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

const ctx = sky.getContext("2d")!;
let landmarker: FaceLandmarker | null = null;
let running = false;
let t0 = 0;
let horizon = 0.5;
let present = false;

start.addEventListener("click", async () => {
  start.classList.add("hidden");
  loading.classList.remove("hidden");
  t0 = performance.now();
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
  present = (res.faceLandmarks?.length ?? 0) > 0;
  const mins = Math.floor((performance.now() - t0) / 60000);
  horizon = present
    ? Math.min(0.92, horizon + 0.0008)
    : Math.max(0.12, horizon - 0.003);
  const y = sky.height * (1 - horizon);
  const g = ctx.createLinearGradient(0, y, 0, sky.height);
  g.addColorStop(0, "rgba(255, 160, 90, 0.35)");
  g.addColorStop(1, "rgba(20, 30, 60, 0.9)");
  ctx.fillStyle = "#050810";
  ctx.fillRect(0, 0, sky.width, sky.height);
  ctx.fillStyle = g;
  ctx.fillRect(0, y, sky.width, sky.height - y);
  minEl.textContent = String(mins);
  presEl.textContent = present ? "YES" : "—";
  requestAnimationFrame(loop);
}
