import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle } from "./shared/i18n";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const sky = document.getElementById("sky") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const start = document.getElementById("start") as HTMLButtonElement;
const stillEl = document.getElementById("star-count") as HTMLElement;
const rippleEl = document.getElementById("hand-count") as HTMLElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

let landmarker: FaceLandmarker | null = null;
let running = false;
let prev: { x: number; y: number }[] | null = null;
let stillness = 1;
let ripples = 0;
const ctx = sky.getContext("2d")!;

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
    const nose = lm[1];
    const curr = lm.map((p) => ({ x: p.x, y: p.y }));
    if (prev) {
      let d = 0;
      for (let i = 0; i < curr.length; i += 8) {
        d += Math.hypot(curr[i].x - prev[i].x, curr[i].y - prev[i].y);
      }
      stillness = stillness * 0.92 + (1 - Math.min(1, d * 40)) * 0.08;
      if (d > 0.012) {
        ripples++;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(120, 255, 200, ${0.25 * (1 - stillness)})`;
        ctx.arc((1 - nose.x) * sky.width, nose.y * sky.height, 20 + d * 800, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    prev = curr;
  }
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, sky.width, sky.height);
  stillEl.textContent = `${Math.round(stillness * 100)}%`;
  rippleEl.textContent = String(ripples);
  requestAnimationFrame(loop);
}
