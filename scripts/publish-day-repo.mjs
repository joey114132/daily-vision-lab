#!/usr/bin/env node
/**
 * Publish a day folder to its own GitHub repo (dvl-<slug>).
 * Usage: node scripts/publish-day-repo.mjs [path-to-day-folder] [--dry-run] [--force]
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const flags = new Set(process.argv.slice(2).filter((a) => a.startsWith("--")));
const dryRun = flags.has("--dry-run");
const force = flags.has("--force");
const positional = process.argv.slice(2).filter((a) => !a.startsWith("--"));

function sh(cmd, opts = {}) {
  execSync(cmd, { encoding: "utf8", stdio: opts.silent ? "pipe" : "inherit", shell: true, ...opts });
}

function shQuiet(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: "pipe", shell: true }).trim();
  } catch {
    return "";
  }
}

function parseFolder(folderName) {
  const m = folderName.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  if (!m) throw new Error(`Invalid day folder name: ${folderName}`);
  return { date: m[1], slug: m[2] };
}

function applyTemplate(text, vars) {
  let out = text;
  for (const [key, val] of Object.entries(vars)) {
    out = out.split(`__${key}__`).join(val);
  }
  return out;
}

function copyTree(src, dest, skip = new Set(["node_modules", "dist", ".git"])) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(s, d, skip);
    else fs.copyFileSync(s, d);
  }
}

function resolveDayDir() {
  if (positional[0]) {
    return path.isAbsolute(positional[0]) ? positional[0] : path.join(root, positional[0]);
  }
  return execSync("node scripts/resolve-latest-day.mjs --print-path", {
    cwd: root,
    encoding: "utf8",
  }).trim();
}

function publish(srcDayDir) {
  if (!fs.existsSync(srcDayDir)) {
    console.error(`Day folder not found: ${srcDayDir}`);
    process.exit(1);
  }

  const folderName = path.basename(srcDayDir);
  const { date, slug } = parseFolder(folderName);
  const publishCfg = JSON.parse(fs.readFileSync(path.join(root, "catalog/publish.json"), "utf8"));
  const reposPath = path.join(root, "state/repos.json");
  const reposState = JSON.parse(fs.readFileSync(reposPath, "utf8"));

  const readme = fs.existsSync(path.join(srcDayDir, "README.md"))
    ? fs.readFileSync(path.join(srcDayDir, "README.md"), "utf8")
    : "";
  const titleEn = readme.match(/^# (.+?) ·/m)?.[1] ?? slug;
  const titleKo = readme.match(/\*\*([^*]+)\*\*/)?.[1] ?? slug;

  const repoName = `${publishCfg.repoPrefix}${slug}`;
  const owner = publishCfg.owner;
  const fullName = `${owner}/${repoName}`;
  const repoUrl = `https://github.com/${fullName}`;
  const pagesUrl = `https://${owner}.github.io/${repoName}/`;

  if (reposState.apps[slug]?.repo === fullName && !force) {
    console.log(`Skip: ${fullName} already recorded (use --force to republish)`);
    process.exit(0);
  }

  console.log(`Publish: ${folderName} → ${fullName}`);

  if (dryRun) {
    console.log(`Pages URL would be: ${pagesUrl}`);
    process.exit(0);
  }

  const hasTestPlan = fs.existsSync(path.join(srcDayDir, "TEST_PLAN.md"));
  if (hasTestPlan) {
    sh(`node scripts/validate-day.mjs "${srcDayDir}"`, { cwd: root });
  } else {
    console.log("Legacy day (no TEST_PLAN.md) — build-only check");
    sh("npm run build", { cwd: srcDayDir });
  }

  const staging = fs.mkdtempSync(path.join(os.tmpdir(), `dvl-publish-${slug}-`));
  try {
    copyTree(srcDayDir, staging);

    const workflowDir = path.join(staging, ".github/workflows");
    fs.mkdirSync(workflowDir, { recursive: true });
    fs.copyFileSync(
      path.join(root, "templates/pages-deploy.yml"),
      path.join(workflowDir, "pages-deploy.yml"),
    );

    if (!fs.existsSync(path.join(staging, ".gitignore"))) {
      fs.copyFileSync(path.join(root, ".gitignore"), path.join(staging, ".gitignore"));
    }

    const desc = applyTemplate(publishCfg.descriptionEn, { TITLE_EN: titleEn, TITLE_KO: titleKo });
    const commitMsgPath = path.join(os.tmpdir(), `dvl-commit-${slug}.txt`);
    fs.writeFileSync(
      commitMsgPath,
      `${titleKo} / ${titleEn}\n\n${date} · standalone niche app repo.\n`,
    );

    sh("git init -b main", { cwd: staging });
    sh("git add -A", { cwd: staging });
    sh(
      `git -c user.name="daily-vision-lab" -c user.email="41898282+github-actions[bot]@users.noreply.github.com" commit -F "${commitMsgPath}"`,
      { cwd: staging },
    );
    fs.unlinkSync(commitMsgPath);

    const exists = shQuiet(`gh repo view ${fullName} --json name -q .name`);
    if (exists) {
      console.log(`Repo exists — pushing update to ${fullName}`);
      sh("git remote add origin " + `git@github.com:${fullName}.git`, { cwd: staging });
      sh("git push -u origin main --force", { cwd: staging });
    } else {
      console.log(`Creating repo ${fullName}`);
      sh(
        `gh repo create ${repoName} --${publishCfg.visibility} --source="${staging}" --remote=origin --push --description "${desc.replace(/"/g, '\\"')}"`,
      );
    }

    shQuiet(
      `gh api repos/${fullName}/pages -X POST -f build_type=workflow -f source[branch]=main -f source[path]=/`,
    );
    shQuiet(`gh workflow run pages-deploy.yml --repo ${fullName}`);

    reposState.apps[slug] = {
      date,
      folder: folderName,
      repo: fullName,
      repoUrl,
      pagesUrl,
      titleEn,
      titleKo,
      publishedAt: new Date().toISOString(),
    };
    fs.writeFileSync(reposPath, JSON.stringify(reposState, null, 2) + "\n");

    execSync("node scripts/update-root-readme.mjs", { cwd: root, stdio: "inherit" });

    console.log("OK:", repoUrl);
    console.log("Pages:", pagesUrl);
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}

publish(resolveDayDir());
