#!/usr/bin/env python3
"""Sync CONTENT QUEUE Notion DB → src/data/queue.json for AWD /journey Reading Queue.

Filters to Books (+ AWD Eligible + active status), sorts In Progress first,
caps display at 5. Also writes queue-level stats (total, completed, in-progress)
for the component header without exposing the full queue.

Usage:
    python3 scripts/sync-queue.py
    python3 scripts/sync-queue.py --dry-run   # print JSON, don't write file
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

NTN = "/Users/mightydesigncenter/.local/bin/ntn"
CONFIG = Path(__file__).resolve().parent / "queue_config.json"
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "queue.json"
DISPLAY_CAP = 5
AWD_TYPES = {"Book"}
ACTIVE_STATUSES = {"In Progress", "Up Next"}
LL_GRADUATE_TYPES = {"Book", "Course", "Podcast", "YouTube", "Documentary", "Article"}


def load_config() -> dict:
    if not CONFIG.exists():
        print("ERROR: queue_config.json not found. Run create_content_queue_db.py first.", file=sys.stderr)
        sys.exit(1)
    return json.loads(CONFIG.read_text())


def query_all(dsid: str) -> list[dict]:
    cursor = ""
    pages: list[dict] = []
    for _ in range(20):
        cmd = [NTN, "datasources", "query", dsid, "--json", "--limit", "100"]
        if cursor:
            cmd.extend(["--start-cursor", cursor])
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            print(f"ERROR: {r.stderr}", file=sys.stderr)
            sys.exit(1)
        data = json.loads(r.stdout)
        pages.extend(data.get("results", []))
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor", "")
        time.sleep(1.0)
    return pages


def gtext(prop: dict | None) -> str:
    if not prop:
        return ""
    # Notion title property can be "title" key (standard) or returned as rich_text
    arr = prop.get("title") or prop.get("rich_text") or []
    return "".join(t.get("plain_text", "") for t in arr)


def get_status(prop: dict) -> str:
    return (prop.get("select") or prop.get("status") or {}).get("name", "")


def get_date(prop: dict | None) -> str | None:
    if not prop:
        return None
    return (prop.get("date") or {}).get("start")


def extract(row: dict) -> dict:
    p = row["properties"]
    return {
        "id": row["id"],
        "title": gtext(p.get("Name") or p.get("Title")),
        "type": (p.get("Type", {}).get("select") or {}).get("name", ""),
        "status": get_status(p.get("Status", {})),
        "awd_eligible": p.get("AWD Eligible", {}).get("checkbox", False),
        "author": gtext(p.get("Author / Creator")),
        "recommended_by": gtext(p.get("Recommended By")),
        "why": gtext(p.get("Why Recommended")),
        "category": ", ".join(
            c["name"] for c in (p.get("Category", {}).get("multi_select") or [])
        ),
        "priority": (p.get("Priority", {}).get("select") or {}).get("name", ""),
        "url": (p.get("URL") or {}).get("url"),
        "cover": (p.get("Cover URL") or {}).get("url"),
        "date_started": get_date(p.get("Date Started")),
        "date_completed": get_date(p.get("Date Completed")),
        "date_added": row.get("created_time", "")[:10],
    }


def sort_key(item: dict) -> tuple:
    status_rank = 0 if item["status"] == "In Progress" else 1
    started = item.get("date_started") or ""
    added = item.get("date_added") or ""
    # desc: negate lexicographic date strings (YYYY-MM-DD sorts correctly when negated)
    return (status_rank, started and started[::-1] or "~", added and added[::-1] or "~")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--cap", type=int, default=DISPLAY_CAP, help="Max items on AWD (default 5)")
    args = ap.parse_args()

    config = load_config()
    dsid = config["data_source_id"]

    print(f"Querying CONTENT QUEUE ({dsid}) ...")
    rows = query_all(dsid)
    print(f"  {len(rows)} total rows")

    all_items = [item for r in rows if (item := extract(r))["title"]]

    # --- Stats computed from the FULL set (any type, any status) ---
    total_books = sum(1 for i in all_items if i["type"] == "Book")
    total_completed = sum(1 for i in all_items if i["status"] == "Completed")
    total_in_progress = sum(1 for i in all_items if i["status"] == "In Progress")
    total_in_queue = sum(1 for i in all_items if i["status"] not in {"Completed", "Skipped"})

    # --- AWD display: Books + AWD Eligible + active statuses only ---
    awd_items = [
        i for i in all_items
        if i["type"] in AWD_TYPES
        and i["awd_eligible"]
        and i["status"] in ACTIVE_STATUSES
    ]
    awd_items.sort(key=sort_key)
    display = awd_items[: args.cap]

    # Normalize shape for CurrentReading.tsx compatibility (matches courses.json shape)
    out_items = [
        {
            "title": i["title"],
            "type": i["type"],
            "status": i["status"],
            "author": i["author"],
            "cover": i["cover"],
            "url": i["url"],
            "recommendedBy": i["recommended_by"],
            "why": i["why"],
            "category": i["category"],
            "dateStarted": i["date_started"],
            "dateAdded": i["date_added"],
        }
        for i in display
    ]

    payload = {
        "lastUpdated": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "meta": {
            "totalBooks": total_books,
            "totalCompleted": total_completed,
            "totalInProgress": total_in_progress,
            "totalInQueue": total_in_queue,
            "displayCap": args.cap,
        },
        "items": out_items,
    }

    if args.dry_run:
        print(json.dumps(payload, indent=2))
    else:
        OUT.write_text(json.dumps(payload, indent=2))
        print(f"Wrote {len(out_items)} display items → {OUT}")
        print(f"  Stats: {total_books} books, {total_in_progress} reading, {total_in_queue} in queue, {total_completed} completed")


if __name__ == "__main__":
    main()
