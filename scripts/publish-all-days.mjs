#!/usr/bin/env node
/**
 * Publish every days/* folder to its own dvl-<slug> repo.
 * Usage: node scripts/publish-all-days.mjs [--dry-run] [--force]
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const daysDir = path.join(root, "days");
const extra = process.argv.slice(2).join(" ");

const folders = fs
  .readdirSync(daysDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let failed = 0;
for (const folder of folders) {
  console.log(`\n=== ${folder} ===`);
  try {
    execSync(`node scripts/publish-day-repo.mjs "days/${folder}" ${extra}`, {
      cwd: root,
      stdio: "inherit",
    });
  } catch {
    failed++;
    console.error(`FAILED: ${folder}`);
  }
}
if (failed > 0) process.exit(1);
