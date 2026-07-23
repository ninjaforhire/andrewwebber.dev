#!/usr/bin/env python3
"""GitHub-sourced stats refresher with honest ratchet.

Counts:
  - linesOfCode: shallow-clones every repo owned by ninjaforhire, runs
    `wc -l` against tracked code files (lockfiles/minified/binaries excluded)
  - commitsShipped: GitHub commits authored by ninjaforhire across all repos
  - agentsLive: exact active/production entries in the local dispatch registry
  - skills: largest complete local skill surface, without adding mirrored roots
  - tools: larger of the public build inventory and Jimbo's live tool registry

Ratchet rule: only ratchets against PRIOR readings from this same script
(`stats-checkpoint.json` with methodology=github_clone_wc_l).
Never mixes methodologies — preserves honesty.
"""

from __future__ import annotations

import json
import pathlib
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
from datetime import datetime, timezone

OWNER = "ninjaforhire"
AUTHOR_EMAILS = {
    "andrew@mightyphotobooths.com",
    "andrew@andrewwebber.dev",
    "andrewwebber@users.noreply.github.com",
    "ninjaforhire@users.noreply.github.com",
}
AUTHOR_NAMES = {"Andrew Webber", "ninjaforhire", "andrew"}
ROOT = pathlib.Path(__file__).resolve().parent.parent
OVERRIDES = ROOT / "overrides.json"
CHECKPOINT = ROOT / "scripts" / "stats-checkpoint.json"
METHOD = "github_clone_wc_l"

CODE_EXTS = {
    ".py", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".go", ".rs", ".rb", ".swift", ".kt", ".java", ".c", ".cc", ".cpp", ".h", ".hpp",
    ".sh", ".bash", ".zsh", ".fish",
    ".sql", ".lua", ".pl", ".php",
    ".css", ".scss", ".sass", ".less",
    ".html", ".htm", ".vue", ".svelte", ".astro",
    ".yaml", ".yml", ".toml", ".json", ".jsonc",
    ".md", ".mdx",
}
SKIP_BASENAMES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", "poetry.lock",
    "Gemfile.lock", "Cargo.lock", "go.sum", "composer.lock", "uv.lock",
}
SKIP_DIR_PARTS = {
    "node_modules", "__pycache__", "dist", "build", ".next", ".turbo",
    "vendor", "venv", ".venv", "site-packages", ".tmp", ".cache",
    "graphify-out", "out", "coverage",
}
MIN_LINE_LEN = 0
MAX_FILE_BYTES = 5 * 1024 * 1024


def gh(args: list[str]) -> str:
    return subprocess.check_output(["gh", *args], text=True)


def list_repos() -> list[str]:
    out = gh([
        "api",
        "user/repos?per_page=100&affiliation=owner&visibility=all",
        "--paginate",
        "--jq", ".[] | .full_name",
    ])
    return [r.strip() for r in out.splitlines() if r.strip().startswith(f"{OWNER}/")]


def shallow_clone(full_name: str, dest: pathlib.Path) -> bool:
    """Treeless clone: full commit history (cheap), no blobs until checkout."""
    try:
        subprocess.run(
            [
                "gh", "repo", "clone", full_name, str(dest),
                "--", "--filter=blob:none", "--quiet",
            ],
            check=True,
            stderr=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
        )
        return True
    except subprocess.CalledProcessError:
        return False


def is_skippable(rel_path: str) -> bool:
    parts = pathlib.PurePosixPath(rel_path).parts
    if any(p in SKIP_DIR_PARTS for p in parts):
        return True
    if parts and parts[-1] in SKIP_BASENAMES:
        return True
    if parts and parts[-1].endswith(".min.js"):
        return True
    if parts and parts[-1].endswith(".min.css"):
        return True
    if parts and parts[-1].endswith(".map"):
        return True
    return False


def count_loc_in_repo(repo_path: pathlib.Path) -> tuple[int, int]:
    try:
        files = subprocess.check_output(
            ["git", "-C", str(repo_path), "ls-files"],
            text=True,
            stderr=subprocess.DEVNULL,
        )
    except subprocess.CalledProcessError:
        return 0, 0

    loc = 0
    files_counted = 0
    for rel in files.splitlines():
        rel = rel.strip()
        if not rel or is_skippable(rel):
            continue
        ext = pathlib.PurePosixPath(rel).suffix.lower()
        if ext not in CODE_EXTS:
            continue
        full = repo_path / rel
        try:
            if full.stat().st_size > MAX_FILE_BYTES:
                continue
            with full.open("rb") as fh:
                for _ in fh:
                    loc += 1
            files_counted += 1
        except OSError:
            continue
    return loc, files_counted


def count_commits_for_repo(repo_path: pathlib.Path) -> int:
    """Count commits authored by Andrew across ALL branches, dedup by SHA."""
    try:
        out = subprocess.check_output(
            ["git", "-C", str(repo_path), "log", "--all", "--format=%H%x09%ae%x09%an"],
            text=True,
            stderr=subprocess.DEVNULL,
        )
    except subprocess.CalledProcessError:
        return 0
    seen: set[str] = set()
    for line in out.splitlines():
        parts = line.split("\t")
        if len(parts) < 3:
            continue
        sha, email, name = parts[0], parts[1].lower(), parts[2]
        if email in {e.lower() for e in AUTHOR_EMAILS} or name in AUTHOR_NAMES:
            seen.add(sha)
    return len(seen)


def _claude_intervals(blocks: list[dict]) -> list[tuple[datetime, datetime]]:
    """Return valid, non-gap Claude usage intervals scoped to 2026."""
    intervals: list[tuple[datetime, datetime]] = []
    for block in blocks:
        if block.get("isGap") or not block.get("actualEndTime"):
            continue
        try:
            start = datetime.fromisoformat(
                str(block["startTime"]).replace("Z", "+00:00")
            )
            end = datetime.fromisoformat(
                str(block["actualEndTime"]).replace("Z", "+00:00")
            )
        except (KeyError, TypeError, ValueError):
            continue
        if start.year == 2026 and end > start:
            intervals.append((start, end))
    return intervals


def _merged_seconds(intervals: list[tuple[datetime, datetime]]) -> int:
    """Count interval seconds once even if usage blocks overlap."""
    if not intervals:
        return 0
    merged: list[tuple[datetime, datetime]] = []
    for start, end in sorted(intervals):
        if merged and start <= merged[-1][1]:
            prior_start, prior_end = merged[-1]
            merged[-1] = (prior_start, max(prior_end, end))
        else:
            merged.append((start, end))
    return round(sum((end - start).total_seconds() for start, end in merged))


def _incremental_claude_seconds(blocks: list[dict], after: str | None) -> int:
    """Count only usage newer than the persisted high-water timestamp."""
    if not after:
        return 0
    try:
        cutoff = datetime.fromisoformat(after.replace("Z", "+00:00"))
    except ValueError:
        return 0
    clipped = [
        (max(start, cutoff), end)
        for start, end in _claude_intervals(blocks)
        if end > cutoff
    ]
    return _merged_seconds(clipped)


def fetch_claude_2026() -> dict:
    """Read the visible 2026 window and retain its incremental boundary."""
    empty = {
        "hours": 0,
        "seconds": 0,
        "tokens": 0,
        "sessions": 0,
        "latest_end": None,
        "blocks": [],
    }
    try:
        out = subprocess.check_output(
            ["npx", "-y", "ccusage@latest", "blocks", "--offline", "--json"],
            text=True,
            stderr=subprocess.DEVNULL,
            timeout=120,
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError):
        return empty
    try:
        data = json.loads(out)
    except json.JSONDecodeError:
        return empty

    blocks = data.get("blocks", [])
    if not isinstance(blocks, list):
        return empty
    intervals = _claude_intervals(blocks)
    total_seconds = _merged_seconds(intervals)
    total_tokens = sum(
        int(block.get("totalTokens") or 0)
        for block in blocks
        if isinstance(block, dict)
        and not block.get("isGap")
        and block.get("actualEndTime")
        and str(block.get("startTime", "")).startswith("2026-")
    )
    return {
        "hours": round(total_seconds / 3600),
        "seconds": total_seconds,
        "tokens": total_tokens,
        "sessions": len(intervals),
        "latest_end": max((end for _, end in intervals), default=None),
        "blocks": blocks,
    }


def fetch_codex_2026() -> dict:
    """Codex CLI usage for calendar year 2026.

    Source: ~/.codex/usage.db (sqlite), maintained by the claude-usage
    dashboard's Codex ingester over ~/.codex/sessions/**.jsonl. Tokens =
    input + output + cache_read + cache_creation, same accounting ccusage
    uses for Claude Code (totalTokens includes cache).
    """
    db = pathlib.Path.home() / ".codex" / "usage.db"
    if not db.exists():
        return {"tokens": 0, "sessions": 0}
    query = (
        "SELECT COUNT(*), COALESCE(SUM(total_input_tokens + total_output_tokens "
        "+ total_cache_read + total_cache_creation), 0) FROM sessions "
        "WHERE first_timestamp >= '2026-01-01' AND first_timestamp < '2027-01-01'"
    )
    try:
        out = subprocess.check_output(
            ["sqlite3", str(db), query],
            text=True,
            stderr=subprocess.DEVNULL,
            timeout=30,
        )
        sessions_s, tokens_s = out.strip().split("|")
        return {"tokens": int(tokens_s), "sessions": int(sessions_s)}
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError, ValueError):
        return {"tokens": 0, "sessions": 0}


def count_tools() -> int:
    """Return the larger complete tool inventory without adding mirrors.

    Public build inventory rule (also documented in scan-tools.py):
      - Walk ~/_Code/ subtrees Andrew authored.
      - mighty/** = photo-booth (agents + skills + apps, recursive).
      - forge/ = design-forge (parent + each wing in execution/wings/).
      - hotfixops/security/** = spectre (each suite tool + each aisec sub).
      - general-tools/** + andrewwebber.dev = global.
      - SKIP downloaded/upstream stuff (huashu-design, _archive, _reference,
        .worktrees, vendor/, etc.).
      - One discrete thing built by Andrew = one row.

    Jimbo exposes its complete runtime registry at /health. Some capabilities
    appear in both surfaces, so compare the totals and use the larger value
    rather than adding them.
    """
    scan = ROOT / "scripts" / "scan-tools.py"
    if scan.exists():
        try:
            subprocess.run(
                ["python3", str(scan)],
                check=True,
                stderr=subprocess.DEVNULL,
                stdout=subprocess.DEVNULL,
            )
        except subprocess.CalledProcessError:
            pass
    p = ROOT / "src" / "data" / "mighty-tools.json"
    public_count = 0
    if p.exists():
        try:
            data = json.loads(p.read_text())
            public_count = len(data) if isinstance(data, list) else 0
        except json.JSONDecodeError:
            pass

    jimbo_count = 0
    try:
        with urllib.request.urlopen("http://127.0.0.1:8324/health", timeout=3) as response:
            health = json.loads(response.read())
        jimbo_count = int(
            health.get("tools")
            or health.get("tool_count")
            or health.get("tools_loaded")
            or 0
        )
    except (
        OSError,
        ValueError,
        json.JSONDecodeError,
        urllib.error.URLError,
    ):
        pass

    return max(public_count, jimbo_count)


def count_skills() -> int:
    """Return the largest complete local skill surface without double-counting.

    Claude, Codex, the shared agent catalog, and source repositories mirror many
    of the same skills. Count each surface independently and take the largest
    total, per Andrew's rule, rather than adding mirrored copies together.
    """
    home = pathlib.Path.home()
    skip_parts = {".git", "node_modules"}

    def count_skill_files(root: pathlib.Path) -> int:
        if not root.exists():
            return 0
        return sum(
            1
            for path in root.rglob("SKILL.md")
            if not any(part in skip_parts for part in path.parts)
        )

    surface_counts = [
        count_skill_files(home / ".claude" / "skills"),
        count_skill_files(home / ".agents" / "skills"),
        count_skill_files(home / ".codex" / "skills"),
        count_skill_files(home / ".codex" / "plugins" / "cache"),
        count_skill_files(home / "_Code" / "mighty" / "skills"),
        count_skill_files(home / "_Code" / "general-tools"),
    ]

    registry = (
        home
        / "_Code"
        / "mighty"
        / "agents"
        / "_shared"
        / "dispatch"
        / "skills_registry.json"
    )
    if registry.exists():
        try:
            data = json.loads(registry.read_text())
            if isinstance(data, dict):
                skills = data.get("skills", data)
                if isinstance(skills, (dict, list)):
                    surface_counts.append(len(skills))
            elif isinstance(data, list):
                surface_counts.append(len(data))
        except json.JSONDecodeError:
            pass

    return max(surface_counts, default=0)


def count_live_agents() -> int:
    """Canonical 'live agents' = registry entries with status active or production.

    Source: mighty/agents/_shared/dispatch/registry.json (the agent dispatcher's
    own registry). Excludes early-stage/in-development/unknown — those aren't
    shipping. Honest count of agents currently in service.
    """
    registry = pathlib.Path.home() / "_Code" / "mighty" / "agents" / "_shared" / "dispatch" / "registry.json"
    if not registry.exists():
        return 0
    try:
        data = json.loads(registry.read_text())
    except json.JSONDecodeError:
        return 0
    if not isinstance(data, dict):
        return 0
    live_statuses = {"active", "production"}
    return sum(1 for entry in data.values() if isinstance(entry, dict) and entry.get("status") in live_statuses)


def load_prev() -> dict:
    if not CHECKPOINT.exists():
        return {}
    try:
        return json.loads(CHECKPOINT.read_text())
    except json.JSONDecodeError:
        return {}


def load_overrides() -> dict:
    if not OVERRIDES.exists():
        return {}
    try:
        data = json.loads(OVERRIDES.read_text())
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def newer_timestamp(current: str | None, candidate: str | None) -> str | None:
    """Return the later valid ISO timestamp without moving backward."""
    if not candidate:
        return current
    if not current:
        return candidate
    try:
        current_dt = datetime.fromisoformat(current.replace("Z", "+00:00"))
        candidate_dt = datetime.fromisoformat(candidate.replace("Z", "+00:00"))
    except ValueError:
        return current
    return candidate if candidate_dt > current_dt else current


def _patch_source_fallbacks(*, loc: int, agents: int, skills: int, repos: int) -> None:
    """Keep JourneyTeaser's no-JS fallback in lockstep with overrides.json.

    SEO metadata and other build-time copy import ``SITE_STATS`` directly.
    JourneyTeaser keeps a literal fallback because it hydrates from /api/stats.
    This rewrite is idempotent and ensures its first paint stays exact.
    """
    journey = ROOT / "src" / "data" / "journey-2026.json"
    try:
        day_streak = int(json.loads(journey.read_text()).get("totalDays", 0))
    except (OSError, json.JSONDecodeError, ValueError):
        day_streak = 0

    teaser = ROOT / "src" / "components" / "sections" / "JourneyTeaser.tsx"
    if teaser.exists():
        block = (
            "const STATS_FALLBACK: Stats = {\n"
            f"  agentsLive: {agents},\n"
            f"  dayStreak: {day_streak},\n"
            f"  skills: {skills},\n"
            f"  repos: {repos},\n"
            f"  linesOfCode: {loc},\n"
            "};"
        )
        text = teaser.read_text()
        new = re.sub(
            r"const STATS_FALLBACK: Stats = \{.*?\};",
            block,
            text,
            count=1,
            flags=re.DOTALL,
        )
        if new != text:
            teaser.write_text(new)
            print(
                f"Patched STATS_FALLBACK -> agents={agents} days={day_streak} "
                f"skills={skills} repos={repos} loc={loc}"
            )


def main() -> None:
    print("Listing repos...", file=sys.stderr)
    repos = list_repos()
    print(f"  {len(repos)} repos", file=sys.stderr)

    total_loc = 0
    total_commits = 0
    per_repo: dict[str, dict] = {}

    with tempfile.TemporaryDirectory(prefix="awd-stats-") as td:
        workdir = pathlib.Path(td)
        for full_name in repos:
            short = full_name.split("/", 1)[1]
            dest = workdir / short
            print(f"  {short}: cloning...", file=sys.stderr, end="", flush=True)
            cloned = shallow_clone(full_name, dest)
            if not cloned:
                print(" FAILED", file=sys.stderr)
                continue
            loc, files_counted = count_loc_in_repo(dest)
            commits = count_commits_for_repo(dest)
            per_repo[full_name] = {"loc": loc, "files": files_counted, "commits": commits}
            total_loc += loc
            total_commits += commits
            print(f" loc={loc:,} files={files_counted} commits={commits}", file=sys.stderr)

    live_agents = count_live_agents()
    agents_live_now = live_agents

    skills_now = count_skills()
    tools_now = count_tools()
    if len(repos) <= 0 or live_agents <= 0 or skills_now <= 0 or tools_now <= 0:
        raise RuntimeError(
            "Live inventory count failed; refusing to publish zero or stale stats"
        )

    print("Reading Claude 2026 usage...", file=sys.stderr)
    claude = fetch_claude_2026()
    print(f"  hours={claude['hours']} sessions={claude['sessions']} tokens={claude['tokens']:,}", file=sys.stderr)

    print("Reading Codex 2026 usage...", file=sys.stderr)
    codex = fetch_codex_2026()
    print(f"  sessions={codex['sessions']} tokens={codex['tokens']:,}", file=sys.stderr)
    ai_tokens_now = claude["tokens"] + codex["tokens"]

    prev = load_prev()
    overrides = load_overrides()
    prev_method = prev.get("methodology")
    if prev_method == METHOD:
        # Read ratchet_* (the high-water marks), not raw measurement fields.
        # Otherwise a partial-failure run that wrote a lower raw value would
        # let the next run regress past the previously ratcheted floor.
        prev_loc = max(
            int(prev.get("ratchet_loc", prev.get("github_loc", 0))),
            int(overrides.get("linesOfCode", 0)),
        )
        prev_commits = max(
            int(prev.get("ratchet_commits", prev.get("github_commits", 0))),
            int(overrides.get("commitsShipped", 0)),
        )
        prev_agents = int(prev.get("ratchet_agents", prev.get("agents_live", 0)))
        checkpoint_hours = int(
            prev.get("ratchet_claude_hours", prev.get("claude_hours", 0))
        )
        override_hours = int(overrides.get("claudeHours", 0))
        prev_hours = max(checkpoint_hours, override_hours)
        stored_seconds = prev.get("ratchet_claude_seconds")
        if stored_seconds is None:
            prev_claude_seconds = prev_hours * 3600
        else:
            prev_claude_seconds = int(stored_seconds)
            if override_hours > checkpoint_hours:
                prev_claude_seconds = max(
                    prev_claude_seconds,
                    override_hours * 3600,
                )
        prev_hours_through = prev.get("claude_hours_through")
        can_accumulate_hours = (
            isinstance(prev_hours_through, str)
            and checkpoint_hours >= override_hours
        )
        prev_tokens = max(
            int(prev.get("ratchet_claude_tokens", prev.get("claude_tokens", 0))),
            int(overrides.get("claudeTokens", 0)),
        )
        # First combined run has no ratchet_ai_tokens; seed from the Claude-only
        # ratchet (combined >= claude-only, so the floor stays honest).
        prev_ai_tokens = max(
            int(prev.get("ratchet_ai_tokens", prev.get("ratchet_claude_tokens", 0))),
            int(overrides.get("aiTokens", 0)),
        )
        prev_skills = int(prev.get("ratchet_skills", prev.get("skills", 0)))
        prev_repos = int(prev.get("ratchet_repos", prev.get("repos_count", 0)))
        prev_tools = int(prev.get("ratchet_tools", prev.get("tools", 0)))
    else:
        prev_loc = prev_commits = prev_agents = prev_hours = prev_tokens = 0
        prev_skills = prev_repos = prev_tools = prev_ai_tokens = 0
        prev_claude_seconds = 0
        prev_hours_through = None
        can_accumulate_hours = False

    final_loc = max(total_loc, prev_loc)
    final_commits = max(total_commits, prev_commits)
    final_agents = agents_live_now
    latest_end = claude["latest_end"]
    latest_end_iso = (
        latest_end.isoformat().replace("+00:00", "Z")
        if isinstance(latest_end, datetime)
        else None
    )
    incremental_seconds = (
        _incremental_claude_seconds(claude["blocks"], prev_hours_through)
        if can_accumulate_hours
        else 0
    )
    final_claude_seconds = max(
        claude["seconds"],
        prev_claude_seconds + incremental_seconds,
    )
    final_hours = max(final_claude_seconds // 3600, prev_hours)
    final_hours_through = newer_timestamp(prev_hours_through, latest_end_iso)
    final_tokens = max(claude["tokens"], prev_tokens)
    final_ai_tokens = max(ai_tokens_now, prev_ai_tokens)
    final_skills = skills_now
    final_repos = len(repos)
    final_tools = tools_now
    previous_per_repo = prev.get("per_repo", {})
    preserved_per_repo = (
        dict(previous_per_repo) if isinstance(previous_per_repo, dict) else {}
    )
    preserved_per_repo.update(per_repo)
    full_github_refresh = len(per_repo) == len(repos)
    checkpoint_github_loc = (
        total_loc if full_github_refresh else int(prev.get("github_loc", 0))
    )
    checkpoint_github_commits = (
        total_commits
        if full_github_refresh
        else int(prev.get("github_commits", 0))
    )

    checkpoint = {
        "methodology": METHOD,
        "countedAt": datetime.now(timezone.utc).isoformat(),
        "github_loc": checkpoint_github_loc,
        "github_commits": checkpoint_github_commits,
        "live_agents_registry": live_agents,
        "repos_count": len(repos),
        "agents_live": agents_live_now,
        "ratchet_loc": final_loc,
        "ratchet_commits": final_commits,
        "ratchet_agents": final_agents,
        "claude_hours": claude["hours"],
        "claude_tokens": claude["tokens"],
        "claude_sessions": claude["sessions"],
        "ratchet_claude_hours": final_hours,
        "ratchet_claude_seconds": final_claude_seconds,
        "claude_hours_through": final_hours_through,
        "claude_incremental_seconds": incremental_seconds,
        "ratchet_claude_tokens": final_tokens,
        "codex_tokens": codex["tokens"],
        "codex_sessions": codex["sessions"],
        "ai_tokens": ai_tokens_now,
        "ratchet_ai_tokens": final_ai_tokens,
        "skills": skills_now,
        "ratchet_skills": final_skills,
        "ratchet_repos": final_repos,
        "tools": tools_now,
        "ratchet_tools": final_tools,
        "per_repo": preserved_per_repo,
    }
    CHECKPOINT.write_text(json.dumps(checkpoint, indent=2) + "\n")

    overrides["linesOfCode"] = final_loc
    overrides["commitsShipped"] = final_commits
    overrides["agentsLive"] = final_agents
    overrides["claudeHours"] = final_hours
    overrides["claudeTokens"] = final_tokens
    overrides["aiTokens"] = final_ai_tokens
    overrides["skills"] = final_skills
    overrides["repos"] = final_repos
    overrides["tools"] = final_tools
    OVERRIDES.write_text(json.dumps(overrides, indent=2) + "\n")

    # Keep JourneyTeaser's no-JS/pre-hydration fallback honest. Other build-time
    # stat copy imports SITE_STATS directly from overrides.json.
    _patch_source_fallbacks(
        loc=final_loc,
        agents=final_agents,
        skills=final_skills,
        repos=final_repos,
    )

    # Sync CONTENT QUEUE → queue.json so AWD Reading Queue stays fresh
    sync_queue = ROOT / "scripts" / "sync-queue.py"
    if sync_queue.exists():
        try:
            subprocess.run(["python3", str(sync_queue)], check=True, stderr=subprocess.DEVNULL)
        except subprocess.CalledProcessError as e:
            print(f"Warning: sync-queue.py failed: {e}", file=sys.stderr)

    summary = {
        "linesOfCode": final_loc,
        "commitsShipped": final_commits,
        "agentsLive": final_agents,
        "claudeHours": final_hours,
        "claudeTokens": final_tokens,
        "aiTokens": final_ai_tokens,
        "repos": len(repos),
        "registry_live": live_agents,
        "skills": final_skills,
        "tools": final_tools,
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
