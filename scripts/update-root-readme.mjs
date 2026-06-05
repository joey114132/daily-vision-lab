#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const daysDir = path.join(root, "days");
const readmePath = path.join(root, "README.md");

const folders = fs
  .readdirSync(daysDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const rows = folders.map((folder) => {
  const readme = path.join(daysDir, folder, "README.md");
  let titleEn = folder;
  let titleKo = folder;
  if (fs.existsSync(readme)) {
    const m = fs.readFileSync(readme, "utf8").match(/^# (.+?) ·/m);
    if (m) titleEn = m[1];
    const ko = fs.readFileSync(readme, "utf8").match(/\*\*([^*]+)\*\* —/);
    if (ko) titleKo = ko[1];
  }
  const date = folder.slice(0, 10);
  const slug = folder.slice(11);
  return `| ${date} | [${slug}](./days/${folder}/) | ${titleEn} / ${titleKo} |`;
});

const table = ["| Date | Folder | Title EN / KO |", "|------|--------|----------------|", ...rows].join("\n");

let readme = fs.readFileSync(readmePath, "utf8");
const start = "<!-- DAYS_TABLE_START -->";
const end = "<!-- DAYS_TABLE_END -->";
const block = `${start}\n${table}\n${end}`;

if (readme.includes(start)) {
  readme = readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), block);
} else {
  readme = readme.replace("## Days", `## Days\n\n${block}`);
}

fs.writeFileSync(readmePath, readme);
