import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface StatsOverrides {
  tools?: number;
  linesOfCode?: number;
  commitsShipped?: number;
  agentsLive?: number;
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
    return data.totalDays ?? 143;
  } catch {
    return 143;
  }
}

const TOOLS_FALLBACK = 170;
const LOC_FALLBACK = 1300000;
const COMMITS_FALLBACK = 3200;
const AGENTS_FALLBACK = 31;

async function timed<T>(promise: Promise<T>, fallback: T, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

async function fetchGitHubStats(): Promise<{
  tools: number;
  linesOfCode: number;
  commitsShipped: number;
  agentsLive: number;
  dayStreak: number;
}> {
  const token = process.env.GITHUB_TOKEN;
  const dayStreak = loadDayStreak();

  if (!token) {
    return {
      tools: TOOLS_FALLBACK,
      linesOfCode: LOC_FALLBACK,
      commitsShipped: COMMITS_FALLBACK,
      agentsLive: AGENTS_FALLBACK,
      dayStreak,
    };
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    // Repos list + code search in parallel (first round)
    const [reposRes, searchRes] = await Promise.all([
      fetch("https://api.github.com/user/repos?per_page=100&type=all", { headers }),
      fetch(
        "https://api.github.com/search/code?q=user%3Aninjaforhire+language%3APython&per_page=1",
        { headers }
      ),
    ]);

    const repos = await reposRes.json();
    const searchData = await searchRes.json();

    if (!Array.isArray(repos)) {
      return {
        tools: TOOLS_FALLBACK,
        linesOfCode: LOC_FALLBACK,
        commitsShipped: COMMITS_FALLBACK,
        agentsLive: AGENTS_FALLBACK,
        dayStreak,
      };
    }

    const repoCount = repos.length;
    const toolsShipped = typeof searchData.total_count === "number"
      ? searchData.total_count
      : TOOLS_FALLBACK;

    // Language bytes + commit counts per repo in parallel (second round)
    const perRepoData = await timed(
      Promise.all(
        repos.map(async (repo: { name: string }) => {
          const [langRes, commitRes] = await Promise.all([
            fetch(
              `https://api.github.com/repos/ninjaforhire/${repo.name}/languages`,
              { headers }
            ),
            fetch(
              `https://api.github.com/repos/ninjaforhire/${repo.name}/commits?per_page=1`,
              { headers }
            ),
          ]);

          const langs: Record<string, number> = await langRes.json().catch(() => ({}));
          const totalBytes = Object.values(langs).reduce(
            (a, b) => a + (typeof b === "number" ? b : 0),
            0
          );

          const link = commitRes.headers.get("link") ?? "";
          const match = link.match(/page=(\d+)>; rel="last"/);
          const commits = match ? parseInt(match[1]) : 1;

          return { bytes: totalBytes, commits };
        })
      ),
      [] as { bytes: number; commits: number }[]
    );

    const totalBytes = perRepoData.reduce((sum, r) => sum + r.bytes, 0);
    const linesOfCode = totalBytes > 0 ? Math.round(totalBytes / 40) : LOC_FALLBACK;
    const commitsShipped = perRepoData.reduce((sum, r) => sum + r.commits, 0) || COMMITS_FALLBACK;

    return { tools: toolsShipped, linesOfCode, commitsShipped, agentsLive: repoCount, dayStreak };
  } catch {
    return {
      tools: TOOLS_FALLBACK,
      linesOfCode: LOC_FALLBACK,
      commitsShipped: COMMITS_FALLBACK,
      agentsLive: AGENTS_FALLBACK,
      dayStreak,
    };
  }
}

export async function GET() {
  const overrides = loadOverrides();
  const github = await fetchGitHubStats();

  const stats = {
    tools: overrides.tools ?? github.tools,
    linesOfCode: overrides.linesOfCode ?? github.linesOfCode,
    commitsShipped: overrides.commitsShipped ?? github.commitsShipped,
    agentsLive: overrides.agentsLive ?? github.agentsLive,
    dayStreak: github.dayStreak,
  };

  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
