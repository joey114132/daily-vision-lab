import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle } from "./shared/i18n";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const overlay = document.getElementById("overlay") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const start = document.getElementById("start") as HTMLButtonElement;
const balEl = document.getElementById("star-count") as HTMLElement;
const mirEl = document.getElementById("hand-count") as HTMLElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

let landmarker: FaceLandmarker | null = null;
let running = false;

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
  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
  loading.classList.add("hidden");
  running = true;
  loop();
});

function loop() {
  if (!running || !landmarker) return;
  const res = landmarker.detectForVideo(video, performance.now());
  const lm = res.faceLandmarks?.[0];
  const ctx = overlay.getContext("2d")!;
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  if (lm) {
    const w = overlay.width;
    const h = overlay.height;
    const cx = lm[1].x * w;
    let err = 0;
    const pairs: [number, number][] = [
      [33, 263],
      [133, 362],
      [61, 291],
    ];
    for (const [a, b] of pairs) {
      const dx = lm[a].x * w - cx;
      const bx = lm[b].x * w - cx;
      err += Math.abs(dx + bx);
      ctx.strokeStyle = "rgba(255,180,200,0.4)";
      ctx.beginPath();
      ctx.moveTo(lm[a].x * w, lm[a].y * h);
      ctx.lineTo(w - lm[a].x * w, lm[a].y * h);
      ctx.stroke();
    }
    const balance = Math.max(0, 100 - err * 2);
    balEl.textContent = `${Math.round(balance)}%`;
    mirEl.textContent = balance > 85 ? "ON" : "DRIFT";
  }
  requestAnimationFrame(loop);
}
