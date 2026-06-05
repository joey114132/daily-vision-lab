#!/usr/bin/env node
import { execSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dayDir = execSync("node scripts/resolve-latest-day.mjs --print-path", {
  cwd: root,
  encoding: "utf8",
}).trim();

try {
  execSync("fuser -k 5174/tcp 2>/dev/null", { stdio: "ignore" });
} catch {
  /* port may already be free */
}

console.log(`Dev server: ${dayDir}`);
const child = spawn("npm", ["run", "dev"], {
  cwd: dayDir,
  stdio: "inherit",
  shell: true,
});
child.on("exit", (code) => process.exit(code ?? 0));
