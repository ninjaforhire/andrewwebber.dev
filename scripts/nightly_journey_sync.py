#!/usr/bin/env python3
"""Nightly journey sync — 11:59pm daily.

Pipeline:
  1. queue_to_ll_sync.py    — graduate completed CONTENT QUEUE items → LEARNING LIBRARY
  2. export-journey-json.py — LEARNING LIBRARY → src/data/journey-2026.json
  3. sync-courses.py        — LEARNING LIBRARY → src/data/courses.json
  4. sync-queue.py          — CONTENT QUEUE → src/data/queue.json
  5. git commit + push      — if data files changed
  6. vercel --prod          — deploy to production

Usage:
    python3 scripts/nightly_journey_sync.py
    python3 scripts/nightly_journey_sync.py --dry-run
"""
from __future__ import annotations

import argparse
import logging
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
LOG = logging.getLogger("nightly-journey")

DATA_FILES = [
    "src/data/journey-2026.json",
    "src/data/courses.json",
    "src/data/queue.json",
]

GIT = "/usr/bin/git"
PYTHON = "/usr/bin/python3"
PYTHON_BREW = "/opt/homebrew/bin/python3.14"
_vercel = shutil.which("vercel") or "/opt/homebrew/bin/vercel"
VERCEL = _vercel


def run(cmd: list[str], *, label: str, dry_run: bool = False) -> bool:
    LOG.info("[%s] %s", label, " ".join(cmd))
    if dry_run:
        LOG.info("[%s] DRY RUN — skipped", label)
        return True
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if r.stdout.strip():
        LOG.info("[%s] stdout: %s", label, r.stdout.strip()[:500])
    if r.stderr.strip():
        LOG.warning("[%s] stderr: %s", label, r.stderr.strip()[:500])
    if r.returncode != 0:
        LOG.error("[%s] FAILED (exit %d)", label, r.returncode)
        return False
    return True


def data_files_changed() -> bool:
    result = subprocess.run(
        [GIT, "status", "--porcelain"] + DATA_FILES,
        cwd=ROOT, capture_output=True, text=True,
    )
    return bool(result.stdout.strip())


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    LOG.info("=== nightly journey sync START ===")
    errors: list[str] = []

    steps = [
        ([PYTHON, str(SCRIPTS / "queue_to_ll_sync.py")], "graduate-to-ll"),
        ([PYTHON_BREW, str(SCRIPTS / "export-journey-json.py"), "--no-push"], "export-journey"),
        ([PYTHON, str(SCRIPTS / "sync-courses.py")], "sync-courses"),
        ([PYTHON, str(SCRIPTS / "sync-queue.py")], "sync-queue"),
    ]

    for cmd, label in steps:
        if not run(cmd, label=label, dry_run=args.dry_run):
            errors.append(label)

    if errors:
        LOG.error("Steps failed: %s — aborting git/deploy", errors)
        sys.exit(1)

    if args.dry_run:
        LOG.info("DRY RUN — skipping git + vercel")
        LOG.info("=== nightly journey sync END (dry run) ===")
        return

    if not data_files_changed():
        LOG.info("No data file changes — skipping commit + deploy")
        LOG.info("=== nightly journey sync END (no changes) ===")
        return

    if not run(
        [GIT, "add"] + DATA_FILES,
        label="git-add",
    ):
        errors.append("git-add")

    if not run(
        [GIT, "commit", "-m", "chore(data): nightly journey sync"],
        label="git-commit",
    ):
        errors.append("git-commit")

    if not run([GIT, "push", "origin", "main"], label="git-push"):
        errors.append("git-push")

    if not run([VERCEL, "--prod", "--yes"], label="vercel-deploy"):
        errors.append("vercel-deploy")

    if errors:
        LOG.error("Post-sync steps failed: %s", errors)
        sys.exit(1)

    LOG.info("=== nightly journey sync END ===")


if __name__ == "__main__":
    main()
