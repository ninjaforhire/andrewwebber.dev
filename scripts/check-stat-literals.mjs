#!/usr/bin/env node
// Portfolio accuracy guard. Any hardcoded "<N> tools|agents|skills" number in
// src/app or src/components must equal the live value in overrides.json (the
// same source /api/stats serves and scripts/refresh-stats.py keeps current).
// Fails (exit 1) on a MISMATCH only — correct literals (e.g. the SEO meta that
// refresh-stats auto-patches) pass, stale ones do not.
//
// Best practice is still to import SITE_STATS from '@/lib/site-stats' so there
// is no literal to go stale; this guard is the backstop that catches anything
// hardcoded or auto-patched that falls behind.
//
// Interpolated copy like `${SITE_STATS.tools}+ tools` never matches (no leading
// digit), so it always passes. Editorial content (src/content/**) is not
// scanned — that is dated narrative, not a live stat.
//
// Run: npm run check:stats   (also a fatal step in the nightly sync, after
// refresh-stats, so a drifted number blocks the deploy).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["src/app", "src/components", "src/lib"];
const EXTS = new Set([".tsx", ".ts", ".jsx", ".js"]);

// metric word in copy -> key in overrides.json
const METRIC_KEY = { tools: "tools", agents: "agentsLive", skills: "skills" };

// <2-4 digit number><optional +/space><optional "AI "/"autonomous ">< metric >.
// 2-digit floor avoids incidental copy ("5 tools"); the global flag finds every
// occurrence on a line.
const LITERAL = /\b(\d{2,4})\s*\+?\s*(?:AI\s+|autonomous\s+)?(tools|agents|skills)\b/gi;
const APPROX_DYNAMIC =
  /\$\{SITE_STATS\.(tools|agentsLive|skills|repos|commitsShipped|claudeHours|linesOfCode)\}\+\s*(tools|agents|skills|repos|commits|hours|lines)/g;

const canonical = JSON.parse(readFileSync(join(ROOT, "overrides.json"), "utf8"));

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (EXTS.has(name.slice(name.lastIndexOf(".")))) out.push(full);
  }
  return out;
}

const offenders = [];
for (const dir of SCAN_DIRS) {
  let files = [];
  try { files = walk(join(ROOT, dir)); } catch { continue; }
  for (const file of files) {
    readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const m of line.matchAll(LITERAL)) {
        const got = Number(m[1]);
        const key = METRIC_KEY[m[2].toLowerCase()];
        const want = canonical[key];
        if (typeof want === "number" && got !== want) {
          offenders.push(
            `${file.replace(ROOT + "/", "")}:${i + 1}: "${m[0]}" -> live ${key} is ${want}`
          );
        }
      }
      for (const m of line.matchAll(APPROX_DYNAMIC)) {
        offenders.push(
          `${file.replace(ROOT + "/", "")}:${i + 1}: "${m[0]}" uses an approximate + on a live stat`
        );
      }
    });
  }
}

if (offenders.length) {
  console.error(
    "\n✗ Stale stat number(s) found (portfolio must match the live count).\n" +
      "  Import SITE_STATS from '@/lib/site-stats' (build-time) or fetch /api/stats (runtime):\n"
  );
  offenders.forEach((o) => console.error("  " + o));
  console.error("");
  process.exit(1);
}

console.log(
  `✓ All stat literals match live values (tools ${canonical.tools}, ` +
    `agents ${canonical.agentsLive}, skills ${canonical.skills}).`
);
