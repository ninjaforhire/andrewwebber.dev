#!/usr/bin/env python3
"""Push enriched YouTube watch records → LEARNING LIBRARY (one Notion page per video).

Reads scripts/data/youtube-day-136-143-enriched.json.
Dedups by Links URL — skips any entry whose URL already exists in LL.
Creates one page per video with Title, Date (= watched date), Type=Video,
Source=YouTube, Channel, Runtime (min), Category topics, Links, Status=Done,
Era=Full Stack AI, Streak Day. Description goes in page body.

USAGE:
    python3 scripts/youtube_to_ll.py --dry-run     # preview only
    python3 scripts/youtube_to_ll.py               # live write

Assumes Phase A done: title prop renamed Day→Title; Channel + Runtime (min) props added.
"""
from __future__ import annotations

import argparse
import json
import logging
import subprocess
import sys
import time
from datetime import date
from pathlib import Path
from typing import Any

logging.basicConfig(level=logging.INFO, format="%(message)s")
log = logging.getLogger(__name__)

NTN = "/Users/mightydesigncenter/.local/bin/ntn"
DATA_DIR = Path(__file__).resolve().parent / "data"
INPUT = DATA_DIR / "youtube-day-136-143-enriched.json"

LL_DB_ID = "2524ccca0f21429296a7c299abade1cb"
LL_DSID = "25950df1-c088-451d-8002-f2eff57767a9"

STREAK_EPOCH = date(2025, 12, 26)
ERA_FULL_STACK = "Full Stack AI"


def ntn_api(args: list[str], *, timeout: int = 30) -> dict | None:
    cmd = [NTN, "api"] + args
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    if r.returncode != 0:
        log.warning("  ntn api error: %s", r.stderr.strip()[:200])
        return None
    try:
        return json.loads(r.stdout)
    except json.JSONDecodeError:
        return None


def fetch_schema() -> dict[str, str]:
    """Return {prop_name: type} for the LL data source. Empty on failure."""
    data = ntn_api([f"v1/data_sources/{LL_DSID}"])
    if not data:
        return {}
    return {k: v.get("type", "") for k, v in (data.get("properties") or {}).items()}


def preflight(schema: dict[str, str]) -> tuple[str | None, list[str]]:
    """Return (title_prop_name, missing_props). title_prop_name is None if no title found."""
    title_prop = next((k for k, t in schema.items() if t == "title"), None)
    required = {"Channel": "rich_text", "Runtime (min)": "number"}
    missing = [f"{name} ({typ})" for name, typ in required.items() if name not in schema]
    return title_prop, missing


def existing_urls() -> set[str]:
    """Query all LL pages, return set of Links URLs already stored."""
    urls: set[str] = set()
    cursor = ""
    for _ in range(50):
        cmd = [NTN, "datasources", "query", LL_DSID, "--json", "--limit", "100"]
        if cursor:
            cmd.extend(["--start-cursor", cursor])
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            log.warning("query failed: %s", r.stderr[:200])
            return urls
        data = json.loads(r.stdout)
        for page in data.get("results", []):
            url = (page.get("properties", {}).get("Links") or {}).get("url")
            if url:
                urls.add(url.strip())
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor", "")
        time.sleep(0.5)
    return urls


def build_props(v: dict[str, Any], title_prop: str) -> dict[str, Any]:
    title = v.get("title") or "(untitled)"
    watched_date = v["date"]
    streak_day = (date.fromisoformat(watched_date) - STREAK_EPOCH).days + 1

    props: dict[str, Any] = {
        title_prop: {"title": [{"type": "text", "text": {"content": title[:200]}}]},
        "Date": {"date": {"start": watched_date}},
        "Type": {"multi_select": [{"name": "Video"}]},
        "Source": {"select": {"name": "YouTube"}},
        "Status": {"status": {"name": "Done"}},
        "Era": {"select": {"name": ERA_FULL_STACK}},
        "Streak Day": {"number": streak_day},
        "Links": {"url": v.get("url") or ""},
    }

    channel = v.get("channel_full") or v.get("channel")
    if channel:
        props["Channel"] = {"rich_text": [{"type": "text", "text": {"content": channel[:200]}}]}

    if v.get("runtime_minutes") is not None:
        props["Runtime (min)"] = {"number": v["runtime_minutes"]}

    topics = v.get("topics") or []
    if topics:
        props["Category"] = {"multi_select": [{"name": t} for t in topics[:5]]}

    return props


def body_blocks(v: dict[str, Any]) -> list[dict[str, Any]]:
    desc = (v.get("description") or "").strip()
    if not desc:
        return []
    chunks = [desc[i : i + 1900] for i in range(0, len(desc), 1900)]
    return [
        {
            "object": "block",
            "type": "paragraph",
            "paragraph": {
                "rich_text": [{"type": "text", "text": {"content": chunk}}],
            },
        }
        for chunk in chunks
    ]


def create_page(v: dict[str, Any], title_prop: str) -> str | None:
    body = {
        "parent": {"database_id": LL_DB_ID},
        "properties": build_props(v, title_prop),
    }
    children = body_blocks(v)
    if children:
        body["children"] = children

    result = ntn_api(["v1/pages", "-X", "POST", "-d", json.dumps(body)])
    if not result:
        return None
    return result.get("id")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="Don't write, just print plan")
    ap.add_argument("--limit", type=int, default=0, help="Only process first N entries")
    args = ap.parse_args()

    if not INPUT.exists():
        log.error("missing %s — run youtube_enrich.py first", INPUT)
        sys.exit(1)

    log.info("preflight: LL schema")
    schema = fetch_schema()
    if not schema:
        log.error("could not fetch LL schema; check ntn auth")
        sys.exit(1)
    title_prop, missing = preflight(schema)
    if not title_prop:
        log.error("LL has no title property — schema broken")
        sys.exit(1)
    log.info("  title prop = %r", title_prop)
    if missing:
        log.error("LL is missing required props: %s", ", ".join(missing))
        log.error("add them in Notion UI before re-running")
        sys.exit(1)

    entries = json.loads(INPUT.read_text())
    entries = [e for e in entries if "skipped" not in e and e.get("url")]
    if args.limit:
        entries = entries[: args.limit]

    log.info("loaded %d enriched entries", len(entries))

    log.info("fetching existing LL Links to dedup...")
    existing = existing_urls()
    log.info("  %d existing pages with Links", len(existing))

    fresh = [e for e in entries if e.get("url", "").strip() not in existing]
    log.info("%d new (after dedup), %d already in LL", len(fresh), len(entries) - len(fresh))

    if not fresh:
        log.info("nothing to write")
        return

    if args.dry_run:
        for e in fresh:
            log.info(
                "  [DRY] %s  %s  ch=%s  rt=%s  topics=%s",
                e["date"],
                (e.get("title") or "")[:60],
                (e.get("channel_full") or e.get("channel") or "")[:30],
                e.get("runtime_minutes"),
                e.get("topics"),
            )
        return

    written = 0
    for i, e in enumerate(fresh, 1):
        log.info("[%d/%d] writing %s  %s", i, len(fresh), e["date"], (e.get("title") or "")[:60])
        pid = create_page(e, title_prop)
        if pid:
            written += 1
            log.info("  → %s", pid[:8])
        else:
            log.warning("  ✗ failed")
        time.sleep(1.5)

    log.info("done. wrote %d / %d", written, len(fresh))


if __name__ == "__main__":
    main()
