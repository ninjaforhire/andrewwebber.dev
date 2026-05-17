import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface StatsOverrides {
  tools?: number;
  linesOfCode?: number;
  dayStreak?: number;
  agentsLive?: number;
}

function loadOverrides(): StatsOverrides {
  const overridePath = path.join(process.cwd(), "overrides.json");
  if (fs.existsSync(overridePath)) {
    return JSON.parse(fs.readFileSync(overridePath, "utf-8"));
  }
  return {};
}

const TOOLS_BASELINE = 170;

function loadDayStreak(): number {
  try {
    const journeyPath = path.join(process.cwd(), "src", "data", "journey-2026.json");
    const data = JSON.parse(fs.readFileSync(journeyPath, "utf-8"));
    return data.totalDays ?? 143;
  } catch {
    return 143;
  }
}

async function fetchGitHubStats(): Promise<{
  tools: number;
  linesOfCode: number;
  dayStreak: number;
  agentsLive: number;
}> {
  const token = process.env.GITHUB_TOKEN;
  const dayStreak = loadDayStreak();

  if (!token) {
    return { tools: TOOLS_BASELINE, linesOfCode: 377000, dayStreak, agentsLive: 31 };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const reposRes = await fetch(
      "https://api.github.com/orgs/ninjaforhire/repos?per_page=100",
      { headers }
    );
    const repos = await reposRes.json();
    const repoCount = Array.isArray(repos) ? repos.length : 31;

    return {
      tools: TOOLS_BASELINE,
      linesOfCode: 377000,
      dayStreak,
      agentsLive: repoCount,
    };
  } catch {
    return { tools: TOOLS_BASELINE, linesOfCode: 377000, dayStreak, agentsLive: 31 };
  }
}

export async function GET() {
  const overrides = loadOverrides();
  const github = await fetchGitHubStats();

  const stats = {
    tools: overrides.tools ?? github.tools,
    linesOfCode: overrides.linesOfCode ?? github.linesOfCode,
    dayStreak: overrides.dayStreak ?? github.dayStreak,
    agentsLive: overrides.agentsLive ?? github.agentsLive,
  };

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
