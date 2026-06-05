#!/usr/bin/env node
import { execSync, spawn } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dayDir = execSync("node scripts/resolve-latest-day.mjs --print-path", {
  cwd: root,
  encoding: "utf8",
}).trim();

const indexHtml = path.join(dayDir, "index.html");
const titleMatch = fs.existsSync(indexHtml)
  ? fs.readFileSync(indexHtml, "utf8").match(/<title>([^<]+)<\/title>/i)
  : null;
const title = titleMatch?.[1] ?? path.basename(dayDir);

// Always free 5174 — stale Vite from an older day is a common footgun.
for (const cmd of ["fuser -k 5174/tcp 2>/dev/null", "lsof -ti:5174 | xargs -r kill -9 2>/dev/null"]) {
  try {
    execSync(cmd, { stdio: "ignore", shell: true });
  } catch {
    /* port may already be free */
  }
}

console.log(`Dev server: ${dayDir}`);
console.log(`App title: ${title}`);
console.log(`URL: http://localhost:5174/`);
const child = spawn("npm", ["run", "dev"], {
  cwd: dayDir,
  stdio: "inherit",
  shell: true,
});
child.on("exit", (code) => process.exit(code ?? 0));
