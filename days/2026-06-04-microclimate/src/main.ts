import {
  FaceLandmarker,
  FilesetResolver,
  type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { Atmosphere } from "./atmosphere";
import {
  classifyWeather,
  smoothVector,
  vectorFromBlendshapes,
  type MoodVector,
  type WeatherState,
} from "./moodEngine";
import { formatTimestamp, pickOracleLine } from "./oracle";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const overlay = document.getElementById("overlay") as HTMLCanvasElement;
const sky = document.getElementById("sky") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const cardStream = document.getElementById("card-stream") as HTMLDivElement;
const weatherName = document.getElementById("weather-name") as HTMLSpanElement;
const weatherConf = document.getElementById("weather-conf") as HTMLSpanElement;
const warmthBar = document.getElementById("warmth-bar") as HTMLDivElement;
const tensionBar = document.getElementById("tension-bar") as HTMLDivElement;
const driftBar = document.getElementById("drift-bar") as HTMLDivElement;
const privacyBtn = document.getElementById("privacy-btn") as HTMLButtonElement;
const privacyDialog = document.getElementById("privacy-dialog") as HTMLDialogElement;

const atmosphere = new Atmosphere(sky);
let landmarker: FaceLandmarker | null = null;
let mood: MoodVector = { warmth: 0.5, tension: 0.3, drift: 0.2, surprise: 0.1 };
let weather: WeatherState = classifyWeather(mood);
let lastCardAt = 0;
let running = false;
let raf = 0;

privacyBtn.addEventListener("click", () => privacyDialog.showModal());

startBtn.addEventListener("click", async () => {
  startBtn.classList.add("hidden");
  loading.classList.remove("hidden");
  await boot();
});

async function boot() {
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

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    video.srcObject = stream;
    await video.play();
    fitOverlay();
    loading.classList.add("hidden");
    running = true;
    loop();
  } catch (err) {
    loading.querySelector("p")!.textContent =
      err instanceof Error ? err.message : "Camera or model failed to start.";
  }
}

function fitOverlay() {
  const rect = video.getBoundingClientRect();
  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
}

function loop() {
  if (!running || !landmarker) return;
  atmosphere.setWeather(weather.kind);
  atmosphere.frame();

  if (video.readyState >= 2) {
    const now = performance.now();
    const result = landmarker.detectForVideo(video, now);
    ingest(result);
    drawOverlay(result);
    maybeSpawnCard(now);
  }

  raf = requestAnimationFrame(loop);
}

function ingest(result: FaceLandmarkerResult) {
  const blends = result.faceBlendshapes?.[0]?.categories;
  if (!blends) return;

  const map: Record<string, number> = {};
  for (const c of blends) map[c.categoryName] = c.score;

  const next = vectorFromBlendshapes(map);
  mood = smoothVector(mood, next, 0.12);
  weather = classifyWeather(mood);
  updateHud();
}

function updateHud() {
  weatherName.textContent = weather.label;
  weatherConf.textContent = `${Math.round(weather.confidence * 100)}%`;
  warmthBar.style.width = `${mood.warmth * 100}%`;
  tensionBar.style.width = `${mood.tension * 100}%`;
  driftBar.style.width = `${mood.drift * 100}%`;
}

function drawOverlay(result: FaceLandmarkerResult) {
  const ctx = overlay.getContext("2d");
  if (!ctx || !result.faceLandmarks?.[0]) return;
  const w = overlay.width;
  const h = overlay.height;
  ctx.clearRect(0, 0, w, h);

  const pts = result.faceLandmarks[0];
  ctx.strokeStyle = "rgba(255, 210, 140, 0.35)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  const ring = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
  for (let i = 0; i < ring.length; i++) {
    const p = pts[ring[i]];
    const x = p.x * w;
    const y = p.y * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = "rgba(255, 210, 140, 0.85)";
  for (const idx of [33, 263, 1, 13]) {
    const p = pts[idx];
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function maybeSpawnCard(now: number) {
  if (now - lastCardAt < 9000) return;
  lastCardAt = now;
  const card = document.createElement("article");
  card.className = "forecast-card";
  card.innerHTML = `
    <time>${formatTimestamp()}</time>
    <h3>${weather.label}</h3>
    <p class="line">${pickOracleLine(weather.kind)}</p>
    <button type="button" class="pin">Pin reflection</button>
  `;
  const pin = card.querySelector(".pin") as HTMLButtonElement;
  pin.addEventListener("click", () => {
    card.classList.toggle("pinned");
    pin.textContent = card.classList.contains("pinned") ? "Pinned" : "Pin reflection";
  });
  cardStream.prepend(card);
  while (cardStream.children.length > 8) {
    cardStream.lastElementChild?.remove();
  }
  requestAnimationFrame(() => card.classList.add("visible"));
}

function tickSky() {
  atmosphere.frame();
  requestAnimationFrame(tickSky);
}

// Idle sky animation before camera starts
tickSky();
startBtn.classList.remove("hidden");
loading.classList.add("hidden");

window.addEventListener("beforeunload", () => {
  running = false;
  cancelAnimationFrame(raf);
  const stream = video.srcObject as MediaStream | null;
  stream?.getTracks().forEach((t) => t.stop());
});
