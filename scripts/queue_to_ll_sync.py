#!/usr/bin/env python3
"""Graduate completed CONTENT QUEUE entries → LEARNING LIBRARY.

Runs on a 15-min cron (com.workspace-config.queue-ll-sync LaunchAgent).
Safe to run manually at any time — idempotent, skips rows that already
have a Learning Library Entry relation set.

Graduation rule:
  - Status = Completed
  - Learning Library Entry relation = empty
  - Type ∈ {Book, Course, Podcast, YouTube, Documentary, Article}
  - TV Show / Movie / Netflix stay in QUEUE only, never graduate

For each matching row, this script:
  1. Creates a LEARNING LIBRARY page (Day title = queue item title, Type = same)
  2. Populates the body with Takeaways block if Takeaways text exists
  3. Sets the Learning Library Entry relation on the QUEUE row

Usage:
    python3 scripts/queue_to_ll_sync.py
    python3 scripts/queue_to_ll_sync.py --dry-run
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from datetime import date
from pathlib import Path

NTN = "/Users/mightydesigncenter/.local/bin/ntn"
CONFIG = Path(__file__).resolve().parent / "queue_config.json"

GRADUATE_TYPES = {"Book", "Course", "Podcast", "YouTube", "Documentary", "Article"}

# LEARNING LIBRARY data_source_id (for querying) + db_id (for creating pages)
LL_DSID = "25950df1-c088-451d-8002-f2eff57767a9"
LL_DB_ID = "2524ccca0f21429296a7c299abade1cb"


def load_config() -> dict:
    if not CONFIG.exists():
        print("ERROR: queue_config.json not found. Run create_content_queue_db.py first.", file=sys.stderr)
        sys.exit(1)
    return json.loads(CONFIG.read_text())


def ntn_call(args: list[str], *, timeout: int = 30) -> dict | None:
    r = subprocess.run([NTN] + args, capture_output=True, text=True, timeout=timeout)
    if r.returncode != 0:
        print(f"ntn error: {r.stderr.strip()}", file=sys.stderr)
        return None
    try:
        return json.loads(r.stdout)
    except json.JSONDecodeError:
        return None


def query_all(dsid: str) -> list[dict]:
    cursor = ""
    pages: list[dict] = []
    for _ in range(20):
        cmd = [NTN, "datasources", "query", dsid, "--json", "--limit", "100"]
        if cursor:
            cmd.extend(["--start-cursor", cursor])
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        if r.returncode != 0:
            print(f"ERROR querying {dsid}: {r.stderr}", file=sys.stderr)
            return pages
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
    arr = prop.get("rich_text") or prop.get("title") or []
    return "".join(t.get("plain_text", "") for t in arr)


def get_status(prop: dict) -> str:
    return (prop.get("select") or prop.get("status") or {}).get("name", "")


def has_ll_relation(p: dict) -> bool:
    rel = p.get("Learning Library Entry", {}).get("relation") or []
    return len(rel) > 0


def create_ll_page(title: str, type_: str, category: str, source_url: str | None, takeaways: str, completed_date: str | None) -> str | None:
    """Create a LEARNING LIBRARY page. Returns the new page_id or None on failure."""
    today = completed_date or date.today().isoformat()

    type_map = {
        "Book": "Book",
        "Course": "Course",
        "Podcast": "Podcast",
        "YouTube": "YouTube",
        "Documentary": "Documentary",
        "Article": "Article",
    }
    ll_type = type_map.get(type_, "Other")

    props: dict = {
        "Title": {"title": [{"type": "text", "text": {"content": title}}]},
        "Date": {"date": {"start": today}},
        "Type": {"multi_select": [{"name": ll_type}]},
        "Status": {"status": {"name": "Done"}},
        "Source": {"select": {"name": "Content Queue"}},
    }
    if source_url:
        props["Links"] = {"url": source_url}
    if category:
        cats = [{"name": c.strip()} for c in category.split(",") if c.strip()]
        if cats:
            props["Category"] = {"multi_select": cats}

    body_create = {
        "parent": {"database_id": LL_DB_ID},
        "properties": props,
    }

    result = ntn_call(["api", "v1/pages", "-X", "POST", "-d", json.dumps(body_create)])
    if not result:
        return None
    page_id = result.get("id")
    if not page_id:
        return None

    # Append Takeaways as a callout block if text exists
    if takeaways.strip():
        children = [
            {
                "object": "block",
                "type": "callout",
                "callout": {
                    "rich_text": [{"type": "text", "text": {"content": takeaways.strip()}}],
                    "icon": {"type": "emoji", "emoji": "✅"},
                    "color": "green_background",
                },
            }
        ]
        ntn_call([
            "api", f"v1/blocks/{page_id}/children",
            "-X", "PATCH",
            "-d", json.dumps({"children": children}),
        ])

    return page_id


def set_ll_relation(queue_page_id: str, ll_page_id: str) -> bool:
    body = {
        "properties": {
            "Learning Library Entry": {
                "relation": [{"id": ll_page_id}]
            }
        }
    }
    result = ntn_call(["api", f"v1/pages/{queue_page_id}", "-X", "PATCH", "-d", json.dumps(body)])
    return result is not None


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true", help="Print what would graduate, don't write")
    args = ap.parse_args()

    config = load_config()
    dsid = config["data_source_id"]

    print(f"Scanning CONTENT QUEUE for completed entries ...")
    rows = query_all(dsid)
    print(f"  {len(rows)} total rows")

    candidates = []
    for row in rows:
        p = row["properties"]
        status = get_status(p.get("Status", {}))
        type_ = (p.get("Type", {}).get("select") or {}).get("name", "")
        if status != "Completed":
            continue
        if type_ not in GRADUATE_TYPES:
            continue
        if has_ll_relation(p):
            continue
        title = gtext(p.get("Name") or p.get("Title"))
        if not title:
            continue
        candidates.append({
            "id": row["id"],
            "title": title,
            "type": type_,
            "category": ", ".join(c["name"] for c in (p.get("Category", {}).get("multi_select") or [])),
            "url": (p.get("URL") or {}).get("url"),
            "takeaways": gtext(p.get("Takeaways")),
            "date_completed": (p.get("Date Completed", {}).get("date") or {}).get("start"),
        })

    if not candidates:
        print("Nothing to graduate.")
        return

    print(f"Found {len(candidates)} row(s) to graduate → LEARNING LIBRARY")

    for item in candidates:
        print(f"  {item['title']} ({item['type']})", end="")
        if args.dry_run:
            print(" [DRY RUN — skipped]")
            continue

        ll_page_id = create_ll_page(
            title=item["title"],
            type_=item["type"],
            category=item["category"],
            source_url=item["url"],
            takeaways=item["takeaways"],
            completed_date=item["date_completed"],
        )
        if not ll_page_id:
            print(" ✗ LL page creation failed")
            continue

        ok = set_ll_relation(item["id"], ll_page_id)
        if ok:
            print(f" → LL {ll_page_id[:8]}... ✓")
        else:
            print(f" → LL created but relation set failed (page: {ll_page_id})")

        time.sleep(1.5)

    if not args.dry_run:
        print("\nDone. Run sync-courses.py to update courses.json for the /about LearningLibrary display.")


if __name__ == "__main__":
    main()
