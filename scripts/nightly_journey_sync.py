#!/usr/bin/env python3
"""Nightly auto-updating portfolio sync — 11:59pm daily via LaunchAgent.

Goal: andrewwebber.dev keeps itself current with zero manual work.

Pipeline (each step self-anneals up to 3x with backoff):
  SOURCES  (pull new content from every upstream, flag any that disconnect)
    1. youtube_history_scrape.py  — scrape YouTube watch history (Playwright auth)
    2. youtube_enrich.py          — enrich scraped videos (titles/runtime/topics)
    3. youtube_to_ll.py           — push enriched videos -> LEARNING LIBRARY (Notion)
    4. queue_to_ll_sync.py        — graduate CONTENT QUEUE -> LEARNING LIBRARY
  RENDER   (LEARNING LIBRARY -> site data files)
    5. export-journey-json.py     -> src/data/journey-2026.json
    6. sync-courses.py            -> src/data/courses.json
    7. sync-queue.py              -> src/data/queue.json
  PUBLISH
    8. git commit + push (only if data changed)
    9. vercel --prod

Reliability:
  - Self-anneal: every step retried up to RETRIES times, exponential backoff.
  - Source-disconnect detection: a SOURCE that fails all retries is flagged
    DISCONNECTED. Sources are best-effort — the render+publish still run on
    whatever made it through, so the site never goes stale because one feed broke.
  - RENDER failure is fatal (no point publishing broken data).
  - Alerting: on ANY disconnect or failure -> macOS notification + failures log
    + best-effort Telegram (TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID env).

Usage:
    python3 scripts/nightly_journey_sync.py
    python3 scripts/nightly_journey_sync.py --dry-run
    python3 scripts/nightly_journey_sync.py --skip-youtube   # Notion-only pass
"""
from __future__ import annotations

import argparse
import logging
import os
import shutil
import subprocess
import sys
import time
import urllib.request
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
LOG = logging.getLogger("nightly-journey")
FAILURES_LOG = Path.home() / ".claude" / "hooks" / "logs" / "journey-nightly.failures.log"

DATA_FILES = [
    "src/data/journey-2026.json",
    "src/data/courses.json",
    "src/data/queue.json",
    "overrides.json",
]

GIT = "/usr/bin/git"
PYTHON = "/usr/bin/python3"
PYTHON_BREW = shutil.which("python3.14") or "/opt/homebrew/bin/python3.14"
VERCEL = shutil.which("vercel") or "/opt/homebrew/bin/vercel"

RETRIES = 3
BACKOFF_BASE = 5  # seconds: 5, 10, 20
# Deploy gets patient retries: midnight thrash windows last 30+ min (2026-06-12
# failure: refresh-stats took 33 min, vercel died 3x in 40s with errno -11).
DEPLOY_RETRIES = 4
DEPLOY_BACKOFF = 120  # seconds: 120, 240, 480
DEPLOY_PENDING = Path.home() / ".claude" / "daemon-registry" / "journey-deploy-pending"


def notify(title: str, message: str) -> None:
    """Best-effort multi-channel alert. Never raises."""
    short = message.strip().replace('"', "'")[:400]
    # 1. macOS banner
    try:
        subprocess.run(
            ["osascript", "-e",
             f'display notification "{short}" with title "{title}" sound name "Basso"'],
            capture_output=True, timeout=10,
        )
    except Exception:  # noqa: BLE001
        pass
    # 2. persistent failures log
    try:
        FAILURES_LOG.parent.mkdir(parents=True, exist_ok=True)
        with FAILURES_LOG.open("a") as f:
            f.write(f"{time.strftime('%Y-%m-%d %H:%M:%S')} | {title} | {short}\n")
    except Exception:  # noqa: BLE001
        pass
    # 3. best-effort Telegram push (only if configured)
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat = os.getenv("TELEGRAM_CHAT_ID")
    if token and chat:
        try:
            data = urllib.parse.urlencode(
                {"chat_id": chat, "text": f"{title}\n{short}"}
            ).encode()
            urllib.request.urlopen(
                f"https://api.telegram.org/bot{token}/sendMessage", data=data, timeout=15
            )
        except Exception:  # noqa: BLE001
            pass


def run(cmd: list[str], *, label: str, dry_run: bool, retries: int = RETRIES,
        backoff: int = BACKOFF_BASE) -> bool:
    """Run a command, self-annealing up to `retries` times. Returns success."""
    LOG.info("[%s] %s", label, " ".join(cmd))
    if dry_run:
        LOG.info("[%s] DRY RUN — skipped", label)
        return True
    for attempt in range(1, retries + 1):
        r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
        if r.stdout.strip():
            LOG.info("[%s] %s", label, r.stdout.strip()[:400])
        if r.returncode == 0:
            if attempt > 1:
                LOG.info("[%s] recovered on attempt %d", label, attempt)
            return True
        LOG.warning("[%s] attempt %d/%d failed (exit %d): %s",
                    label, attempt, retries, r.returncode, (r.stderr or "").strip()[:300])
        if attempt < retries:
            time.sleep(backoff * (2 ** (attempt - 1)))
    LOG.error("[%s] FAILED after %d attempts", label, retries)
    return False


def data_files_changed() -> bool:
    r = subprocess.run([GIT, "status", "--porcelain"] + DATA_FILES,
                       cwd=ROOT, capture_output=True, text=True)
    return bool(r.stdout.strip())


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--skip-youtube", action="store_true",
                    help="Skip the YouTube scrape sources (Notion-only pass)")
    args = ap.parse_args()

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    LOG.info("=== nightly journey sync START ===")
    disconnected: list[str] = []
    fatal: list[str] = []

    # ── SOURCES (best-effort; a dead feed is flagged, not fatal) ──────────
    sources: list[tuple[list[str], str]] = []
    if not args.skip_youtube:
        sources += [
            ([PYTHON_BREW, str(SCRIPTS / "youtube_history_scrape.py")], "youtube-scrape"),
            ([PYTHON_BREW, str(SCRIPTS / "youtube_enrich.py")], "youtube-enrich"),
            ([PYTHON, str(SCRIPTS / "youtube_to_ll.py")], "youtube-to-ll"),
        ]
    sources += [
        ([PYTHON, str(SCRIPTS / "queue_to_ll_sync.py")], "queue-to-ll"),
    ]
    for cmd, label in sources:
        if not run(cmd, label=label, dry_run=args.dry_run):
            disconnected.append(label)

    # ── RENDER (fatal on failure — never publish broken data) ────────────
    render = [
        ([PYTHON_BREW, str(SCRIPTS / "export-journey-json.py"), "--no-push"], "export-journey"),
        ([PYTHON, str(SCRIPTS / "sync-courses.py")], "sync-courses"),
        ([PYTHON, str(SCRIPTS / "sync-queue.py")], "sync-queue"),
        ([PYTHON, str(SCRIPTS / "refresh-stats.py")], "refresh-stats"),
    ]
    for cmd, label in render:
        if not run(cmd, label=label, dry_run=args.dry_run):
            fatal.append(label)

    if fatal:
        msg = f"RENDER failed: {fatal}. Disconnected sources: {disconnected or 'none'}. No deploy."
        LOG.error(msg)
        notify("andrewwebber.dev nightly FAILED", msg)
        sys.exit(1)

    if args.dry_run:
        LOG.info("DRY RUN — skipping git + vercel")
        if disconnected:
            LOG.info("Would flag disconnected sources: %s", disconnected)
        LOG.info("=== nightly journey sync END (dry run) ===")
        return

    # ── PUBLISH (only if data actually changed, or a deploy is still owed) ─
    changed = data_files_changed()
    deploy_pending = DEPLOY_PENDING.exists()
    if not changed and not deploy_pending:
        LOG.info("No data changes — skipping commit + deploy")
        if disconnected:
            notify("andrewwebber.dev nightly: source disconnected",
                   f"No new data, but these feeds failed: {disconnected}. Check auth/connectivity.")
        LOG.info("=== nightly journey sync END (no changes) ===")
        return

    pub_fail: list[str] = []
    if changed:
        if not run([GIT, "add"] + DATA_FILES, label="git-add", dry_run=False):
            pub_fail.append("git-add")
        if not run([GIT, "commit", "-m", "chore(data): nightly auto-sync"], label="git-commit", dry_run=False):
            pub_fail.append("git-commit")
        if not run([GIT, "push", "origin", "main"], label="git-push", dry_run=False):
            pub_fail.append("git-push")
    else:
        LOG.info("No data changes, but previous deploy failed — retrying deploy only")

    if run([VERCEL, "--prod", "--yes"], label="vercel-deploy", dry_run=False,
           retries=DEPLOY_RETRIES, backoff=DEPLOY_BACKOFF):
        DEPLOY_PENDING.unlink(missing_ok=True)
    else:
        pub_fail.append("vercel-deploy")
        DEPLOY_PENDING.parent.mkdir(parents=True, exist_ok=True)
        DEPLOY_PENDING.touch()

    if pub_fail or disconnected:
        notify("andrewwebber.dev nightly: attention",
               f"Publish issues: {pub_fail or 'none'}. Disconnected sources: {disconnected or 'none'}.")
        if pub_fail:
            sys.exit(1)

    LOG.info("=== nightly journey sync END (deployed) ===")


if __name__ == "__main__":
    main()
