import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface StatsOverrides {
  tools?: number;
  linesOfCode?: number;
  skills?: number;
  yearsBuilding?: number;
}

function loadOverrides(): StatsOverrides {
  const overridePath = path.join(process.cwd(), "overrides.json");
  if (fs.existsSync(overridePath)) {
    return JSON.parse(fs.readFileSync(overridePath, "utf-8"));
  }
  return {};
}

async function fetchGitHubStats(): Promise<{
  tools: number;
  linesOfCode: number;
  skills: number;
}> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    // Fallback to static defaults when no token
    return { tools: 170, linesOfCode: 377000, skills: 71 };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    // Count repos in the org
    const reposRes = await fetch(
      "https://api.github.com/orgs/ninjaforhire/repos?per_page=100",
      { headers }
    );
    const repos = await reposRes.json();

    // Use repo count as a proxy multiplier
    const repoCount = Array.isArray(repos) ? repos.length : 0;

    // Rough estimates based on known data
    return {
      tools: Math.max(170, repoCount * 10),
      linesOfCode: 377000,
      skills: 71,
    };
  } catch {
    return { tools: 170, linesOfCode: 377000, skills: 71 };
  }
}

export async function GET() {
  const overrides = loadOverrides();
  const github = await fetchGitHubStats();

  const stats = {
    tools: overrides.tools ?? github.tools,
    linesOfCode: overrides.linesOfCode ?? github.linesOfCode,
    skills: overrides.skills ?? github.skills,
    yearsBuilding: overrides.yearsBuilding ?? 20,
  };

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
