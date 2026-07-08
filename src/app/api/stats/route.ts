import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface StatsOverrides {
  tools?: number;
  linesOfCode?: number;
  commitsShipped?: number;
  agentsLive?: number;
  claudeHours?: number;
  claudeTokens?: number;
  aiTokens?: number;
  skills?: number;
  repos?: number;
}

function loadOverrides(): StatsOverrides {
  const overridePath = path.join(process.cwd(), "overrides.json");
  if (fs.existsSync(overridePath)) {
    return JSON.parse(fs.readFileSync(overridePath, "utf-8"));
  }
  return {};
}

function loadDayStreak(): number {
  try {
    const journeyPath = path.join(process.cwd(), "src", "data", "journey-2026.json");
    const data = JSON.parse(fs.readFileSync(journeyPath, "utf-8"));
    return data.totalDays ?? 0;
  } catch {
    return 0;
  }
}

// Single source of truth: overrides.json, written by scripts/refresh-stats.py.
// That script uses one honest methodology (gh clone + wc -l on tracked files)
// and ratchets against its own prior readings. The API does not mix methods.
export async function GET() {
  const overrides = loadOverrides();
  const dayStreak = loadDayStreak();

  const stats = {
    tools: overrides.tools ?? 0,
    linesOfCode: overrides.linesOfCode ?? 0,
    commitsShipped: overrides.commitsShipped ?? 0,
    agentsLive: overrides.agentsLive ?? 0,
    claudeHours: overrides.claudeHours ?? 0,
    claudeTokens: overrides.claudeTokens ?? 0,
    aiTokens: overrides.aiTokens ?? overrides.claudeTokens ?? 0,
    skills: overrides.skills ?? 0,
    repos: overrides.repos ?? 0,
    dayStreak,
  };

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
