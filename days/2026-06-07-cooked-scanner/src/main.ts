import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { STRINGS, type TierKey } from "./strings";
import { applyStaticI18n, getLang, loadStrings, mountLangToggle, t } from "./shared/i18n";
import { overlayX } from "./shared/mirror";
import "./style.css";

const video = document.getElementById("video") as HTMLVideoElement;
const overlay = document.getElementById("overlay") as HTMLCanvasElement;
const loading = document.getElementById("loading") as HTMLDivElement;
const start = document.getElementById("start") as HTMLButtonElement;
const scoreEl = document.getElementById("score") as HTMLElement;
const barFill = document.getElementById("bar-fill") as HTMLElement;
const verdictEl = document.getElementById("verdict") as HTMLElement;
const subverdictEl = document.getElementById("subverdict") as HTMLElement;
const feed = document.getElementById("feed") as HTMLElement;

loadStrings(STRINGS);
mountLangToggle();
applyStaticI18n();

let landmarker: FaceLandmarker | null = null;
let running = false;
let cooked = 42;
let lastCard = 0;
const lines = ["line1", "line2", "line3", "line4", "line5", "line6"] as const;

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
      err instanceof Error ? err.message : "Camera failed lol";
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
  const res = landmarker.detectForVideo(video, performance.now());
  const cats = res.faceBlendshapes?.[0]?.categories ?? [];
  const map: Record<string, number> = {};
  for (const c of cats) map[c.categoryName] = c.score;

  const blink = ((map.eyeBlinkLeft ?? 0) + (map.eyeBlinkRight ?? 0)) / 2;
  const jaw = map.jawOpen ?? 0;
  const smile = ((map.mouthSmileLeft ?? 0) + (map.mouthSmileRight ?? 0)) / 2;
  const brow = ((map.browDownLeft ?? 0) + (map.browDownRight ?? 0)) / 2;

  const chaos = blink * 0.35 + jaw * 0.3 + brow * 0.2 + (1 - smile) * 0.15;
  cooked = cooked * 0.9 + (chaos * 100 + Math.random() * 8) * 0.1;
  cooked = Math.max(3, Math.min(99, cooked));

  const tier = pickTier(cooked);
  scoreEl.textContent = `${Math.round(cooked)}%`;
  barFill.style.width = `${cooked}%`;
  verdictEl.textContent = t(tier);
  verdictEl.dataset.tier = tier;
  subverdictEl.textContent = t(lines[Math.floor(Math.random() * lines.length)]);

  drawFace(res.faceLandmarks?.[0]);
  maybeMemeCard(tier);

  requestAnimationFrame(loop);
}

function pickTier(n: number): TierKey {
  if (n > 88) return "tierCooked";
  if (n > 76) return "tierGrass";
  if (n > 64) return "tierRatio";
  if (n > 48) return "tierNpc";
  if (n > 28) return "tierMid";
  return "tierGoated";
}

function drawFace(lm: { x: number; y: number }[] | undefined) {
  const ctx = overlay.getContext("2d")!;
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  if (!lm) return;
  const w = overlay.width;
  const h = overlay.height;
  ctx.strokeStyle = "rgba(180, 255, 80, 0.7)";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(
    overlayX(lm[234].x, w) - 40,
    lm[10].y * h - 20,
    80,
    (lm[152].y - lm[10].y) * h + 40,
  );
  ctx.setLineDash([]);
}

function maybeMemeCard(tier: TierKey) {
  const now = performance.now();
  if (now - lastCard < 7000) return;
  lastCard = now;
  const card = document.createElement("article");
  card.className = "meme-card";
  card.innerHTML = `<time>${new Date().toLocaleTimeString(getLang() === "ko" ? "ko-KR" : "en-US")}</time><h3>${t(tier)}</h3><p>${t(lines[Math.floor(Math.random() * lines.length)])}</p>`;
  feed.prepend(card);
  while (feed.children.length > 6) feed.lastElementChild?.remove();
  requestAnimationFrame(() => card.classList.add("pop"));
}

window.addEventListener("beforeunload", () => {
  running = false;
  (video.srcObject as MediaStream | null)?.getTracks().forEach((tr) => tr.stop());
});

window.addEventListener("resize", () => {
  if (video.videoWidth) fitCanvas();
});
