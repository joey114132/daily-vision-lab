#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const daysDir = path.join(root, "days");

const folders = fs
  .readdirSync(daysDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const latest = folders.at(-1);
if (!latest) {
  console.error("No day folders in days/");
  process.exit(1);
}

const out = path.join(daysDir, latest);
if (process.argv.includes("--print-path")) {
  process.stdout.write(out);
} else {
  process.stdout.write(latest);
}
