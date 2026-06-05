import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle } from "./shared/i18n";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const sky = document.getElementById("sky") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const start = document.getElementById("start") as HTMLButtonElement;
const orbEl = document.getElementById("star-count") as HTMLElement;
const ptEl = document.getElementById("hand-count") as HTMLElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

const ctx = sky.getContext("2d")!;
const trail: { x: number; y: number }[] = [];
let landmarker: FaceLandmarker | null = null;
let running = false;
let orbits = 0;

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
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  ctx.fillRect(0, 0, sky.width, sky.height);
  const res = landmarker.detectForVideo(video, performance.now());
  const nose = res.faceLandmarks?.[0]?.[1];
  if (nose) {
    const x = (1 - nose.x) * sky.width;
    const y = nose.y * sky.height;
    trail.push({ x, y });
    if (trail.length > 2) {
      const a = trail[trail.length - 2];
      const b = trail[trail.length - 1];
      if (Math.hypot(a.x - b.x, a.y - b.y) > 80) orbits++;
    }
  }
  ctx.strokeStyle = "rgba(255, 210, 140, 0.45)";
  ctx.beginPath();
  for (let i = 0; i < trail.length; i++) {
    const p = trail[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  if (trail.length > 500) trail.splice(0, trail.length - 500);
  orbEl.textContent = String(orbits);
  ptEl.textContent = String(trail.length);
  requestAnimationFrame(loop);
}
