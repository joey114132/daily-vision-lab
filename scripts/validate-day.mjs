#!/usr/bin/env node
/**
 * Validates a day folder before commit/deploy.
 * Usage: node scripts/validate-day.mjs [path-to-day-folder]
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dayDir =
  process.argv[2] ??
  (process.env.DAY_DIR ||
    execSync("node scripts/resolve-latest-day.mjs --print-path", { cwd: root, encoding: "utf8" }).trim());

const failures = [];
const passes = [];

function fail(msg) {
  failures.push(msg);
}

function pass(msg) {
  passes.push(msg);
}

if (!fs.existsSync(dayDir)) {
  console.error(`Day folder not found: ${dayDir}`);
  process.exit(1);
}

const name = path.basename(dayDir);

// Required files
for (const f of ["package.json", "index.html", "src/main.ts", "TEST_PLAN.md"]) {
  if (!fs.existsSync(path.join(dayDir, f))) fail(`Missing ${f}`);
  else pass(`Found ${f}`);
}

// i18n
const stringsPath = path.join(dayDir, "src/strings.ts");
const sharedI18n = path.join(dayDir, "src/shared/i18n.ts");
if (!fs.existsSync(stringsPath)) fail("Missing src/strings.ts (bilingual required)");
else pass("Bilingual strings present");
if (!fs.existsSync(sharedI18n)) fail("Missing src/shared/i18n.ts");
else pass("Shared i18n runtime present");

// Install deps when needed (CI fresh checkout)
const lock = path.join(dayDir, "package-lock.json");
const modules = path.join(dayDir, "node_modules");
if (!fs.existsSync(modules) && fs.existsSync(lock)) {
  try {
    execSync("npm ci", { cwd: dayDir, stdio: "pipe" });
    pass("npm ci");
  } catch (e) {
    fail(`npm ci failed: ${e.stderr?.toString() || e.message}`);
  }
}

// Build
try {
  execSync("npm run build", { cwd: dayDir, stdio: "pipe" });
  pass("npm run build");
} catch (e) {
  fail(`npm run build failed: ${e.stderr?.toString() || e.message}`);
}

const distIndex = path.join(dayDir, "dist/index.html");
if (!fs.existsSync(distIndex)) fail("dist/index.html missing after build");
else pass("dist/index.html exists");

// Mirror lint: overlay mirrored in CSS must not double-flip in TS
const styleFiles = walk(dayDir, (p) => p.endsWith(".css"));
const tsFiles = walk(dayDir, (p) => p.endsWith(".ts") && p.includes("/src/"));
let overlayMirrored = false;
for (const sf of styleFiles) {
  const css = fs.readFileSync(sf, "utf8");
  if (/#overlay[\s\S]*scaleX\(-1\)|#video[\s\S]*scaleX\(-1\)/.test(css)) {
    overlayMirrored = true;
    break;
  }
}
if (overlayMirrored) {
  for (const tf of tsFiles) {
    const src = fs.readFileSync(tf, "utf8");
    if (/\(1\s*-\s*\w+\.x\)\s*\*/.test(src) && !src.includes("screenXFromMirroredVideo")) {
      fail(
        `${path.basename(tf)}: possible double mirror — use overlayX() on #overlay, not (1 - x)`,
      );
    }
  }
  if (!failures.some((f) => f.includes("double mirror"))) pass("Mirror lint OK");
}

// TEST_PLAN must not be all empty unchecked — require Evidence log section
const plan = fs.readFileSync(path.join(dayDir, "TEST_PLAN.md"), "utf8");
if (!plan.includes("## Evidence log")) fail("TEST_PLAN.md missing Evidence log section");
else pass("TEST_PLAN.md structure OK");

console.log(`\nValidate: ${name}\n`);
for (const p of passes) console.log(`  ✓ ${p}`);
for (const f of failures) console.log(`  ✗ ${f}`);

if (failures.length > 0) {
  console.log(`\nFAILED (${failures.length} checks)\n`);
  process.exit(1);
}
console.log(`\nPASSED (${passes.length} checks)\n`);

function walk(dir, pred, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== "node_modules" && e.name !== "dist") walk(p, pred, acc);
    else if (e.isFile() && pred(p)) acc.push(p);
  }
  return acc;
}
