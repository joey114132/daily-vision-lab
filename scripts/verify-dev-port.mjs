#!/usr/bin/env node
/**
 * Ensure localhost:5174 serves the latest day (kill stale Vite if needed).
 * Usage: node scripts/verify-dev-port.mjs [--no-start]
 */
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const noStart = process.argv.includes("--no-start");
const PORT = 5174;

const dayDir = execSync("node scripts/resolve-latest-day.mjs --print-path", {
  cwd: root,
  encoding: "utf8",
}).trim();

const indexHtml = path.join(dayDir, "index.html");
const titleMatch = fs.existsSync(indexHtml)
  ? fs.readFileSync(indexHtml, "utf8").match(/<title>([^<]+)<\/title>/i)
  : null;
const expectedTitle = titleMatch?.[1] ?? path.basename(dayDir);

function freePort() {
  for (const cmd of [
    `fuser -k ${PORT}/tcp 2>/dev/null`,
    `lsof -ti:${PORT} | xargs -r kill -9 2>/dev/null`,
  ]) {
    try {
      execSync(cmd, { stdio: "ignore", shell: true });
    } catch {
      /* already free */
    }
  }
}

function fetchTitle() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${PORT}/`, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        const m = body.match(/<title>([^<]+)<\/title>/i);
        resolve({ ok: res.statusCode === 200, title: m?.[1] ?? "", status: res.statusCode ?? 0 });
      });
    });
    req.on("error", () => resolve({ ok: false, title: "", status: 0 }));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ ok: false, title: "", status: 0 });
    });
  });
}

async function waitForServe(maxMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    const r = await fetchTitle();
    if (r.ok) return r;
    await new Promise((r) => setTimeout(r, 400));
  }
  return fetchTitle();
}

let child = null;

async function main() {
  console.log(`Latest: ${path.basename(dayDir)}`);
  console.log(`Expected title: ${expectedTitle}`);

  let result = await fetchTitle();
  if (result.ok && result.title === expectedTitle) {
    console.log(`PASS: :${PORT} already serving correct app (HTTP ${result.status})`);
    process.exit(0);
  }

  if (result.ok && result.title !== expectedTitle) {
    console.log(`Stale: :${PORT} shows "${result.title}" — freeing port`);
  } else {
    console.log(`Down: :${PORT} not reachable (HTTP ${result.status}) — starting dev`);
  }

  if (noStart) {
    console.error("FAIL: port wrong/down and --no-start set");
    process.exit(1);
  }

  freePort();
  child = spawn("npm", ["run", "dev"], {
    cwd: dayDir,
    stdio: "ignore",
    shell: true,
    detached: true,
  });
  child.unref();

  result = await waitForServe();
  if (result.ok && result.title === expectedTitle) {
    console.log(`PASS: :${PORT} now serving (HTTP ${result.status})`);
    console.log(`URL: http://localhost:${PORT}/`);
    process.exit(0);
  }

  console.error(`FAIL: expected "${expectedTitle}", got "${result.title}" (HTTP ${result.status})`);
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
