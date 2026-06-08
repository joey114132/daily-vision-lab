#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const dateArg = process.argv.find((a) => a.startsWith("--date="))?.split("=")[1];

function kstDateString(d = new Date()) {
  const kst = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, "0");
  const day = String(kst.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function replaceInTree(dir, vars) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInTree(p, vars);
      continue;
    }
    if (!/\.(html|ts|css|json|md)$/.test(entry.name)) continue;
    let text = fs.readFileSync(p, "utf8");
    for (const [key, val] of Object.entries(vars)) {
      text = text.split(`__${key}__`).join(val);
    }
    fs.writeFileSync(p, text);
  }
}

const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog/days.json"), "utf8"));
const progressPath = path.join(root, "state/progress.json");
const progress = JSON.parse(fs.readFileSync(progressPath, "utf8"));
const date = dateArg ?? kstDateString();
const daysDir = path.join(root, "days");

if (!fs.existsSync(daysDir)) fs.mkdirSync(daysDir, { recursive: true });

const existingToday = fs
  .readdirSync(daysDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name.startsWith(`${date}-`));

if (existingToday.length > 0 && !force && !dateArg) {
  console.log(`Skip: ${date} already has ${existingToday.map((d) => d.name).join(", ")}`);
  process.exit(0);
}

let index = progress.nextIndex;
if (index >= catalog.days.length) {
  console.log("Catalog exhausted — cycling to index 8 (variants)");
  index = 8;
}

function generatorUsesCamera(generatorId) {
  const pkgPath = path.join(root, "generators", generatorId, "package.json");
  if (!fs.existsSync(pkgPath)) return false;
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  return Boolean(pkg.dependencies?.["@mediapipe/tasks-vision"]);
}

while (index < catalog.days.length) {
  const candidate = catalog.days[index];
  if (!candidate.skipAuto && !generatorUsesCamera(candidate.generator)) break;
  console.log(`Skip camera/legacy catalog index ${index}: ${candidate.slug}`);
  index++;
}
if (index >= catalog.days.length) {
  console.error("No privacy-safe generator left in catalog");
  process.exit(1);
}

const entry = catalog.days[index];
const folderName = `${date}-${entry.slug}`;
const dest = path.join(daysDir, folderName);

if (fs.existsSync(dest) && !force) {
  console.log(`Skip: ${folderName} already exists`);
  process.exit(0);
}

const genDir = path.join(root, "generators", entry.generator);

if (!fs.existsSync(genDir)) {
  console.error(`Missing generator: ${entry.generator}`);
  process.exit(1);
}

const dayNum = fs.readdirSync(daysDir, { withFileTypes: true }).filter((d) => d.isDirectory()).length + 1;

const vars = {
  DATE: date,
  SLUG: entry.slug,
  DAY_NUM: String(dayNum),
  TITLE_EN: entry.title.en,
  TITLE_KO: entry.title.ko,
  TAGLINE_EN: entry.tagline.en,
  TAGLINE_KO: entry.tagline.ko,
  THESIS_EN: entry.thesis.en,
  THESIS_KO: entry.thesis.ko,
};

console.log(`Generate: ${folderName} (${entry.generator}, index ${index})`);

if (dryRun) process.exit(0);

copyDir(genDir, dest);
copyDir(path.join(root, "shared/runtime"), path.join(dest, "src/shared"));
replaceInTree(dest, vars);

function applyVars(text, v) {
  let out = text;
  for (const [key, val] of Object.entries(v)) {
    out = out.split(`__${key}__`).join(val);
  }
  return out;
}

const readmeTpl = fs.readFileSync(path.join(root, "templates/day-README.md"), "utf8");
fs.writeFileSync(path.join(dest, "README.md"), applyVars(readmeTpl, vars));

const testPlanTpl = fs.readFileSync(path.join(root, "templates/TEST_PLAN.md"), "utf8");
fs.writeFileSync(path.join(dest, "TEST_PLAN.md"), applyVars(testPlanTpl, vars));

const designTpl = path.join(root, "templates/DESIGN.md");
if (fs.existsSync(designTpl)) {
  fs.writeFileSync(path.join(dest, "DESIGN.md"), applyVars(fs.readFileSync(designTpl, "utf8"), vars));
}

execSync("npm install", { cwd: dest, stdio: "inherit" });
execSync("npm run build", { cwd: dest, stdio: "inherit" });
execSync(`node scripts/validate-day.mjs "${dest}"`, { cwd: root, stdio: "inherit" });

progress.nextIndex = index + 1;
progress.lastGenerated = { date, folder: folderName, index };
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2) + "\n");

execSync("node scripts/update-root-readme.mjs", { cwd: root, stdio: "inherit" });
execSync(`node scripts/publish-day-repo.mjs "${dest}"`, { cwd: root, stdio: "inherit" });

const commitSubject = `Day ${dayNum}: ${entry.title.ko} / ${entry.title.en}`;
const commitBody = `${entry.tagline.ko}\n\n${entry.tagline.en}\n\nThesis KO: ${entry.thesis.ko}\nThesis EN: ${entry.thesis.en}`;

fs.writeFileSync(
  path.join(root, ".git/COMMIT_MSG_DAILY"),
  `${commitSubject}\n\n${commitBody}\n`,
);

console.log("OK:", dest);
console.log("Commit message written to .git/COMMIT_MSG_DAILY");
