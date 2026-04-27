#!/usr/bin/env node
/**
 * Reads ccusage output + counts agents/skills/LOC across Andrew's repos.
 * Writes to public/claude-stats.json — committed to repo so Vercel reads it.
 *
 * Run locally before deploy: npm run sync-stats
 */
import { spawnSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const CODE_ROOT = resolve(process.env.HOME, "Desktop/_Code");
const OUT = resolve(process.cwd(), "public/claude-stats.json");

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024, ...opts });
  if (r.status !== 0) throw new Error(`${cmd} failed: ${r.stderr}`);
  return r.stdout;
}

function getClaudeUsage() {
  const raw = run("npx", ["-y", "ccusage@latest", "blocks", "--offline", "--json"]);
  const data = JSON.parse(raw);
  const blocks = data.blocks.filter((b) => !b.isGap);
  let totalMs = 0;
  let totalCost = 0;
  let totalTokens = 0;
  for (const b of blocks) {
    const start = new Date(b.startTime).getTime();
    const end = new Date(b.actualEndTime).getTime();
    totalMs += end - start;
    totalCost += b.costUSD;
    totalTokens += b.totalTokens;
  }
  return {
    hours: Math.round((totalMs / 1000 / 60 / 60) * 10) / 10,
    sessions: blocks.length,
    tokens: totalTokens,
    costSaved: Math.round(totalCost),
    firstSession: blocks[0]?.startTime,
    lastSession: blocks[blocks.length - 1]?.actualEndTime,
  };
}

function walk(dir, fn, skip = /node_modules|\.next|\.git|\.venv|__pycache__|\.archive|\.tmp|\.worktrees|dist|build/) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const e of entries) {
    if (skip.test(e)) continue;
    const p = join(dir, e);
    let s;
    try { s = statSync(p); } catch { continue; }
    if (s.isDirectory()) walk(p, fn, skip);
    else fn(p);
  }
}

function countAgents() {
  let n = 0;
  walk(CODE_ROOT, (p) => { if (p.endsWith("/manifest.json")) n++; });
  return n;
}

function countSkills() {
  let n = 0;
  walk(CODE_ROOT, (p) => { if (p.endsWith("/SKILL.md")) n++; });
  return n;
}

function countLines(path) {
  try {
    const content = readFileSync(path, "utf8");
    return content.split("\n").length;
  } catch { return 0; }
}

function countLOC() {
  let py = 0, ts = 0;
  walk(CODE_ROOT, (p) => {
    if (/\.py$/.test(p)) py += countLines(p);
    else if (/\.(ts|tsx|js|jsx)$/.test(p)) ts += countLines(p);
  });
  return { python: py, jsts: ts, total: py + ts };
}

console.log("Reading Claude usage...");
const claude = getClaudeUsage();
console.log(`  Hours: ${claude.hours} · Sessions: ${claude.sessions} · Tokens: ${claude.tokens.toLocaleString()}`);

console.log("Counting agents (manifest.json files)...");
const agents = countAgents();
console.log(`  Agents: ${agents}`);

console.log("Counting skills (SKILL.md files)...");
const skills = countSkills();
console.log(`  Skills: ${skills}`);

console.log("Counting lines of code (this takes ~30s)...");
const loc = countLOC();
console.log(`  LOC: ${loc.total.toLocaleString()} (py: ${loc.python.toLocaleString()}, ts/js: ${loc.jsts.toLocaleString()})`);

const out = {
  generated: new Date().toISOString(),
  claude,
  agents,
  skills,
  linesOfCode: loc.total,
  loc,
};

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`\nWritten: ${OUT}`);
