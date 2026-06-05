import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { STRINGS } from "./strings";
import { applyStaticI18n, loadStrings, mountLangToggle, t } from "./shared/i18n";
import { overlayX } from "./shared/mirror";
import {
  formatBreakCountdown,
  formatSession,
  leanIndex,
  signalsFromLandmarks,
  smooth,
  wellnessScore,
  type Baseline,
} from "./wellness";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const overlay = document.getElementById("overlay") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const startBtn = document.getElementById("start") as HTMLButtonElement;
const calibrateBtn = document.getElementById("calibrate") as HTMLButtonElement;
const wellnessEl = document.getElementById("wellness") as HTMLElement;
const leanEl = document.getElementById("lean") as HTMLElement;
const blinkEl = document.getElementById("blink-rate") as HTMLElement;
const sessionEl = document.getElementById("session-time") as HTMLElement;
const wellnessBar = document.getElementById("wellness-bar") as HTMLElement;
const statusEl = document.getElementById("status") as HTMLElement;
const breakTimerEl = document.getElementById("break-timer") as HTMLElement;
const breaksCountEl = document.getElementById("breaks-count") as HTMLElement;
const nudges = document.getElementById("nudges") as HTMLElement;
const breakDialog = document.getElementById("break-dialog") as HTMLDialogElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

let landmarker: FaceLandmarker | null = null;
let running = false;
let baseline: Baseline | null = null;
let calibrating = false;
let calibSamples: ReturnType<typeof signalsFromLandmarks>[] = [];
let calibUntil = 0;
let leanSm = 20;
let wellnessSm = 90;
let blinks = 0;
let blinkWindowStart = performance.now();
let lastBlink = 0;
let leanSince = 0;
let sessionStart = 0;
let breakDueAt = 0;
let breaksDone = 0;
const BREAK_MS = 20 * 60 * 1000;

startBtn.addEventListener("click", boot);
calibrateBtn.addEventListener("click", beginCalibration);
breakDialog.addEventListener("close", () => {
  breaksDone++;
  breaksCountEl.textContent = String(breaksDone);
  breakDueAt = performance.now() + BREAK_MS;
  addNudge("nudgeBreak", true);
});

async function boot() {
  startBtn.classList.add("hidden");
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
    calibrateBtn.classList.remove("hidden");
    running = true;
    sessionStart = performance.now();
    breakDueAt = sessionStart + BREAK_MS;
    loop();
  } catch (err) {
    loading.querySelector("p")!.textContent =
      err instanceof Error ? err.message : "Camera failed";
  }
}

function beginCalibration() {
  calibrating = true;
  calibSamples = [];
  calibUntil = performance.now() + 5000;
  setStatus("calibrating", "ok");
  addNudge("calibrating", false);
}

function loop() {
  if (!running || !landmarker) return;
  const now = performance.now();
  const res = landmarker.detectForVideo(video, now);
  const lm = res.faceLandmarks?.[0];

  if (lm) {
    let sig = signalsFromLandmarks(lm);
    const cats = res.faceBlendshapes?.[0]?.categories ?? [];
    const blink =
      (((cats.find((c) => c.categoryName === "eyeBlinkLeft")?.score ?? 0) +
        (cats.find((c) => c.categoryName === "eyeBlinkRight")?.score ?? 0)) /
        2);
    sig = { ...sig, blink };

    if (calibrating) {
      calibSamples.push(sig);
      if (now >= calibUntil) finishCalibration();
    } else if (baseline) {
      track(sig, blink, now);
    }
    drawGuide(lm, baseline !== null);
  }

  sessionEl.textContent = formatSession(now - sessionStart);
  breakTimerEl.textContent = formatBreakCountdown(breakDueAt - now);
  if (baseline && now >= breakDueAt && !breakDialog.open) {
    breakDialog.showModal();
    if (Notification.permission === "granted") {
      new Notification(t("breakTitle"), { body: t("breakBody") });
    }
  }

  requestAnimationFrame(loop);
}

function finishCalibration() {
  calibrating = false;
  if (calibSamples.length < 10) return;
  const avg = (key: keyof Baseline) =>
    calibSamples.reduce((s, x) => s + x[key], 0) / calibSamples.length;
  baseline = { eyeSpan: avg("eyeSpan"), chinY: avg("chinY"), noseY: avg("noseY") };
  setStatus("calibrated", "ok");
  addNudge("calibrated", false);
  if (Notification.permission === "default") Notification.requestPermission();
}

function track(sig: ReturnType<typeof signalsFromLandmarks>, blink: number, now: number) {
  if (!baseline) return;
  const lean = leanIndex(baseline, sig);
  leanSm = smooth(leanSm, lean);
  wellnessSm = smooth(wellnessSm, wellnessScore(leanSm));

  if (blink > 0.55 && now - lastBlink > 250) {
    lastBlink = now;
    blinks++;
  }
  if (now - blinkWindowStart > 60_000) {
    blinkEl.textContent = String(blinks);
    if (blinks < 8) {
      setStatus("statusBlink", "warn");
      addNudge("nudgeBlink", false);
    }
    blinks = 0;
    blinkWindowStart = now;
  }

  wellnessEl.textContent = `${Math.round(wellnessSm)}`;
  leanEl.textContent = `${Math.round(leanSm)}`;
  wellnessBar.style.width = `${wellnessSm}%`;

  if (leanSm > 42) {
    if (!leanSince) leanSince = now;
    if (now - leanSince > 3000) {
      setStatus("statusLean", "warn");
      addNudge("nudgeLean", false);
      leanSince = now;
    }
  } else {
    leanSince = 0;
    setStatus("statusGood", "ok");
  }
}

function setStatus(key: keyof typeof STRINGS, tone: "ok" | "warn") {
  statusEl.textContent = t(key);
  statusEl.className = `status ${tone}`;
}

function addNudge(key: keyof typeof STRINGS, save: boolean) {
  const p = document.createElement("p");
  p.textContent = `${new Date().toLocaleTimeString()} — ${t(key)}`;
  nudges.prepend(p);
  while (nudges.children.length > 6) nudges.lastChild?.remove();
  if (save) localStorage.setItem("dvl-deskwell-last", t(key));
}

function drawGuide(lm: { x: number; y: number }[], active: boolean) {
  const ctx = overlay.getContext("2d")!;
  const w = overlay.width;
  const h = overlay.height;
  ctx.clearRect(0, 0, w, h);
  if (!active) return;
  ctx.strokeStyle = "rgba(72, 160, 140, 0.55)";
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(overlayX(lm[234].x, w) - 50, lm[10].y * h - 15, 100, (lm[152].y - lm[10].y) * h + 30);
  ctx.setLineDash([]);
}

function fitCanvas() {
  const r = video.getBoundingClientRect();
  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
  overlay.style.width = `${r.width}px`;
  overlay.style.height = `${r.height}px`;
}

window.addEventListener("beforeunload", () => {
  running = false;
  (video.srcObject as MediaStream | null)?.getTracks().forEach((tr) => tr.stop());
});
window.addEventListener("resize", () => {
  if (video.videoWidth) fitCanvas();
});
