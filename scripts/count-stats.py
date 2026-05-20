#!/usr/bin/env python3
"""Count LOC + commits across all local repos and update overrides.json."""

import json
import pathlib
import subprocess
import sys
from datetime import datetime, timezone

CODE_ROOT = pathlib.Path.home() / "Desktop/_Code"
OVERRIDES = pathlib.Path(__file__).parent.parent / "overrides.json"
CHECKPOINT = pathlib.Path(__file__).parent / "stats-checkpoint.json"

CODE_EXTS = {".py", ".ts", ".tsx", ".js", ".jsx", ".go", ".sh", ".rb", ".rs", ".swift"}
SKIP_DIRS = {
    "node_modules", "__pycache__", ".git", "dist", "build", ".next",
    "vendor", "venv", ".venv", "site-packages", ".archive", ".worktrees",
    "_Code 2.bak",
}

AUTHOR_EMAIL = "andrew@mightyphotobooths.com"


def count_loc() -> int:
    total = 0
    scanned = 0
    for f in CODE_ROOT.rglob("*"):
        if f.suffix not in CODE_EXTS:
            continue
        if any(s in f.parts for s in SKIP_DIRS):
            continue
        try:
            total += sum(1 for _ in f.open("rb"))
            scanned += 1
        except Exception:
            pass
    print(f"  LOC: {total:,} across {scanned:,} files", file=sys.stderr)
    return total


def count_commits() -> int:
    total = 0
    seen_commits: set[str] = set()
    for git_dir in CODE_ROOT.rglob(".git"):
        if not git_dir.is_dir():
            continue
        repo = git_dir.parent
        try:
            out = subprocess.check_output(
                ["git", "-C", str(repo), "log", f"--author={AUTHOR_EMAIL}", "--format=%H"],
                stderr=subprocess.DEVNULL,
                text=True,
            )
            hashes = {h.strip() for h in out.splitlines() if h.strip()}
            new = hashes - seen_commits
            seen_commits.update(new)
            if new:
                print(f"  {repo.name}: {len(new)} commits", file=sys.stderr)
            total += len(new)
        except Exception:
            pass
    print(f"  Commits total: {total:,}", file=sys.stderr)
    return total


def main():
    print("Counting LOC...", file=sys.stderr)
    loc = count_loc()

    print("Counting commits...", file=sys.stderr)
    commits = count_commits()

    checkpoint = {
        "linesOfCode": loc,
        "commitsShipped": commits,
        "countedAt": datetime.now(timezone.utc).isoformat(),
    }
    CHECKPOINT.parent.mkdir(exist_ok=True)
    CHECKPOINT.write_text(json.dumps(checkpoint, indent=2) + "\n")
    print(f"\nCheckpoint saved to {CHECKPOINT}", file=sys.stderr)

    overrides = json.loads(OVERRIDES.read_text()) if OVERRIDES.exists() else {}
    overrides["linesOfCode"] = loc
    overrides["commitsShipped"] = commits
    OVERRIDES.write_text(json.dumps(overrides, indent=2) + "\n")
    print(f"overrides.json updated", file=sys.stderr)

    print(json.dumps({"linesOfCode": loc, "commitsShipped": commits}))


if __name__ == "__main__":
    main()
