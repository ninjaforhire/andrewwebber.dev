#!/usr/bin/env python3
"""GitHub-sourced stats refresher with honest ratchet.

Counts:
  - linesOfCode: shallow-clones every repo owned by ninjaforhire, runs
    `wc -l` against tracked code files (lockfiles/minified/binaries excluded)
  - commitsShipped: GitHub commits authored by ninjaforhire across all repos
  - agentsLive: max(local manifest.json count, GitHub repo count) — user choice

Ratchet rule: only ratchets against PRIOR readings from this same script
(`stats-checkpoint.json` with methodology=github_clone_wc_l).
Never mixes methodologies — preserves honesty.
"""

from __future__ import annotations

import json
import pathlib
import subprocess
import sys
import tempfile
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


def fetch_claude_2026() -> dict:
    """Scoped to calendar year 2026. Honest sum across non-gap blocks."""
    try:
        out = subprocess.check_output(
            ["npx", "-y", "ccusage@latest", "blocks", "--offline", "--json"],
            text=True,
            stderr=subprocess.DEVNULL,
            timeout=120,
        )
    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError):
        return {"hours": 0, "tokens": 0, "sessions": 0}
    try:
        data = json.loads(out)
    except json.JSONDecodeError:
        return {"hours": 0, "tokens": 0, "sessions": 0}

    total_ms = 0
    total_tokens = 0
    sessions = 0
    for b in data.get("blocks", []):
        if b.get("isGap") or not b.get("actualEndTime"):
            continue
        start = datetime.fromisoformat(b["startTime"].replace("Z", "+00:00"))
        if start.year != 2026:
            continue
        end = datetime.fromisoformat(b["actualEndTime"].replace("Z", "+00:00"))
        total_ms += int((end - start).total_seconds() * 1000)
        total_tokens += int(b.get("totalTokens") or 0)
        sessions += 1
    return {
        "hours": round(total_ms / 1000 / 60 / 60),
        "tokens": total_tokens,
        "sessions": sessions,
    }


def count_tools() -> int:
    """Tools = entries in src/data/mighty-tools.json, written by scan-tools.py.

    The rule (also documented in scripts/scan-tools.py docstring):
      - Walk ~/Desktop/_Code/ subtrees Andrew authored.
      - mighty/** = photo-booth (agents + skills + apps, recursive).
      - forge/ = design-forge (parent + each wing in execution/wings/).
      - hotfixops/security/** = spectre (each suite tool + each aisec sub).
      - general-tools/** + andrewwebber.dev = global.
      - SKIP downloaded/upstream stuff (huashu-design, _archive, _reference,
        .worktrees, vendor/, etc.).
      - One discrete thing built by Andrew = one row.

    refresh-stats.py invokes scan-tools.py before counting so the number is
    always current.
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
    if not p.exists():
        return 0
    try:
        data = json.loads(p.read_text())
    except json.JSONDecodeError:
        return 0
    return len(data) if isinstance(data, list) else 0


def count_skills() -> int:
    """Skills registry sibling to agent registry. One row = one skill."""
    registry = pathlib.Path.home() / "Desktop" / "_Code" / "mighty" / "agents" / "_shared" / "dispatch" / "skills_registry.json"
    if not registry.exists():
        return 0
    try:
        data = json.loads(registry.read_text())
    except json.JSONDecodeError:
        return 0
    if isinstance(data, dict):
        return len(data)
    if isinstance(data, list):
        return len(data)
    return 0


def count_live_agents() -> int:
    """Canonical 'live agents' = registry entries with status active or production.

    Source: mighty/agents/_shared/dispatch/registry.json (the agent dispatcher's
    own registry). Excludes early-stage/in-development/unknown — those aren't
    shipping. Honest count of agents currently in service.
    """
    registry = pathlib.Path.home() / "Desktop" / "_Code" / "mighty" / "agents" / "_shared" / "dispatch" / "registry.json"
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
    # User-confirmed methodology: max of canonical registry-active and GitHub repo count.
    agents_live_now = max(live_agents, len(repos))

    skills_now = count_skills()
    tools_now = count_tools()

    print("Reading Claude 2026 usage...", file=sys.stderr)
    claude = fetch_claude_2026()
    print(f"  hours={claude['hours']} sessions={claude['sessions']} tokens={claude['tokens']:,}", file=sys.stderr)

    prev = load_prev()
    prev_method = prev.get("methodology")
    if prev_method == METHOD:
        # Read ratchet_* (the high-water marks), not raw measurement fields.
        # Otherwise a partial-failure run that wrote a lower raw value would
        # let the next run regress past the previously ratcheted floor.
        prev_loc = int(prev.get("ratchet_loc", prev.get("github_loc", 0)))
        prev_commits = int(prev.get("ratchet_commits", prev.get("github_commits", 0)))
        prev_agents = int(prev.get("ratchet_agents", prev.get("agents_live", 0)))
        prev_hours = int(prev.get("ratchet_claude_hours", prev.get("claude_hours", 0)))
        prev_tokens = int(prev.get("ratchet_claude_tokens", prev.get("claude_tokens", 0)))
        prev_skills = int(prev.get("ratchet_skills", prev.get("skills", 0)))
        prev_repos = int(prev.get("ratchet_repos", prev.get("repos_count", 0)))
        prev_tools = int(prev.get("ratchet_tools", prev.get("tools", 0)))
    else:
        prev_loc = prev_commits = prev_agents = prev_hours = prev_tokens = 0
        prev_skills = prev_repos = prev_tools = 0

    final_loc = max(total_loc, prev_loc)
    final_commits = max(total_commits, prev_commits)
    final_agents = max(agents_live_now, prev_agents)
    final_hours = max(claude["hours"], prev_hours)
    final_tokens = max(claude["tokens"], prev_tokens)
    final_skills = max(skills_now, prev_skills)
    final_repos = max(len(repos), prev_repos)
    final_tools = max(tools_now, prev_tools)

    checkpoint = {
        "methodology": METHOD,
        "countedAt": datetime.now(timezone.utc).isoformat(),
        "github_loc": total_loc,
        "github_commits": total_commits,
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
        "ratchet_claude_tokens": final_tokens,
        "skills": skills_now,
        "ratchet_skills": final_skills,
        "ratchet_repos": final_repos,
        "tools": tools_now,
        "ratchet_tools": final_tools,
        "per_repo": per_repo,
    }
    CHECKPOINT.write_text(json.dumps(checkpoint, indent=2) + "\n")

    overrides: dict = {}
    if OVERRIDES.exists():
        try:
            overrides = json.loads(OVERRIDES.read_text())
        except json.JSONDecodeError:
            overrides = {}
    overrides["linesOfCode"] = final_loc
    overrides["commitsShipped"] = final_commits
    overrides["agentsLive"] = final_agents
    overrides["claudeHours"] = final_hours
    overrides["claudeTokens"] = final_tokens
    overrides["skills"] = final_skills
    overrides["repos"] = final_repos
    overrides["tools"] = final_tools
    OVERRIDES.write_text(json.dumps(overrides, indent=2) + "\n")

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
        "repos": len(repos),
        "registry_live": live_agents,
    }
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
