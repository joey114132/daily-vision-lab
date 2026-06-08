#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const daysDir = path.join(root, "days");
const readmePath = path.join(root, "README.md");
const reposPath = path.join(root, "state/repos.json");

const reposState = fs.existsSync(reposPath)
  ? JSON.parse(fs.readFileSync(reposPath, "utf8"))
  : { apps: {} };

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
    const text = fs.readFileSync(readme, "utf8");
    const m = text.match(/^# (.+?) ·/m);
    if (m) titleEn = m[1];
    const ko = text.match(/\*\*([^*]+)\*\*/);
    if (ko) titleKo = ko[1];
  }
  const date = folder.slice(0, 10);
  const slug = folder.slice(11);
  const pub = reposState.apps[slug];
  const repoCell = pub
    ? `[${pub.repo}](${pub.repoUrl})`
    : "—";
  const liveCell = pub
    ? `[demo](${pub.pagesUrl})`
    : "—";
  return `| ${date} | ${titleEn} / ${titleKo} | ${repoCell} | ${liveCell} | [source](./days/${folder}/) |`;
});

const table = [
  "| Date | Title EN / KO | Repo | Live | Studio copy |",
  "|------|----------------|------|------|-------------|",
  ...rows,
].join("\n");

let readme = fs.readFileSync(readmePath, "utf8");
const start = "<!-- DAYS_TABLE_START -->";
const end = "<!-- DAYS_TABLE_END -->";
const block = `${start}\n${table}\n${end}`;

if (readme.includes(start)) {
  readme = readme.replace(new RegExp(`${start}[\\s\\S]*?${end}`), block);
} else {
  readme = readme.replace("## Days", `## Days\n\n${block}`);
}

const latest = folders.at(-1);
const latestSlug = latest?.slice(11);
const latestPub = latestSlug ? reposState.apps[latestSlug] : null;
const liveLine = latestPub
  ? `**[${latestPub.titleEn}](${latestPub.pagesUrl})** — latest standalone app.`
  : "**[Studio index on Pages](https://joey114132.github.io/daily-vision-lab/)** — republish apps to separate repos for per-app demos.";

readme = readme.replace(
  /\*\*\[.*?\]\(.*?\)\*\* —[^\n]*/,
  liveLine,
);

fs.writeFileSync(readmePath, readme);
