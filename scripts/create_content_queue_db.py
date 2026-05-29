#!/usr/bin/env python3
"""One-shot: create CONTENT QUEUE Notion DB + write queue_config.json.

Usage:
    python3 scripts/create_content_queue_db.py [--parent-page PAGE_ID]

Default parent: ca13233b-e7ec-4cea-8ac3-866fe74158af (same page as LEARNING LIBRARY)

After running, the DB appears in Notion. Status options are pre-named.
The resulting DB ID + data_source_id are written to scripts/queue_config.json
which sync-queue.py and queue_to_ll_sync.py both read.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

NTN = "/Users/mightydesigncenter/.local/bin/ntn"
DEFAULT_PARENT = "ca13233b-e7ec-4cea-8ac3-866fe74158af"
LL_DB_ID = "2524ccca0f21429296a7c299abade1cb"
CONFIG_OUT = Path(__file__).resolve().parent / "queue_config.json"


def ntn(args: list[str]) -> dict:
    r = subprocess.run([NTN] + args, capture_output=True, text=True, timeout=30)
    if r.returncode != 0:
        print(f"ntn error: {r.stderr}", file=sys.stderr)
        sys.exit(1)
    return json.loads(r.stdout)


PROPERTY_SCHEMA: dict = {
    "Type": {"select": {"options": [
        {"name": "Book", "color": "blue"}, {"name": "TV Show", "color": "purple"},
        {"name": "Movie", "color": "pink"}, {"name": "Podcast", "color": "orange"},
        {"name": "YouTube", "color": "red"}, {"name": "Netflix", "color": "red"},
        {"name": "Article", "color": "gray"}, {"name": "Course", "color": "green"},
        {"name": "Documentary", "color": "yellow"},
    ]}},
    "Status": {"select": {"options": [
        {"name": "Backlog", "color": "gray"}, {"name": "Up Next", "color": "yellow"},
        {"name": "In Progress", "color": "blue"}, {"name": "Completed", "color": "green"},
        {"name": "Skipped", "color": "red"},
    ]}},
    "Recommended By": {"rich_text": {}},
    "Why Recommended": {"rich_text": {}},
    "Category": {"multi_select": {"options": [
        {"name": "AI/Tech", "color": "blue"}, {"name": "Business", "color": "green"},
        {"name": "Personal Dev", "color": "orange"}, {"name": "Marketing", "color": "yellow"},
        {"name": "Health", "color": "pink"}, {"name": "Entertainment", "color": "purple"},
        {"name": "Creative", "color": "red"}, {"name": "Finance", "color": "gray"},
    ]}},
    "Priority": {"select": {"options": [
        {"name": "High", "color": "red"}, {"name": "Medium", "color": "yellow"}, {"name": "Low", "color": "gray"},
    ]}},
    "AWD Eligible": {"checkbox": {}},
    "URL": {"url": {}},
    "Cover URL": {"url": {}},
    "Author / Creator": {"rich_text": {}},
    "Date Started": {"date": {}},
    "Date Completed": {"date": {}},
    "Notes": {"rich_text": {}},
    "Takeaways": {"rich_text": {}},
}


def create_db(parent_page_id: str) -> dict:
    # Notion API 2026-03-11: properties go on the data source via PATCH /v1/data_sources/{id}
    # after DB creation. The POST body creates the empty DB + auto-creates the Name (title) property.
    body = {
        "parent": {"type": "page_id", "page_id": parent_page_id},
        "icon": {"type": "emoji", "emoji": "📋"},
        "title": [{"type": "text", "text": {"content": "CONTENT QUEUE"}}],
    }
    return ntn(["api", "v1/databases", "-X", "POST", "-d", json.dumps(body)])


def patch_data_source_properties(dsid: str) -> None:
    body = {"properties": PROPERTY_SCHEMA}
    result = ntn(["api", f"v1/data_sources/{dsid}", "-X", "PATCH", "-d", json.dumps(body)])
    count = len(result.get("properties", {}))
    print(f"  {count} properties added to data source")


def resolve_dsid(db_id: str) -> str:
    data = ntn(["datasources", "resolve", db_id, "--json"])
    sources = data.get("data_sources", [])
    if not sources:
        print("ERROR: no data sources returned — wait a moment and re-run", file=sys.stderr)
        sys.exit(1)
    return sources[0]["id"]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--parent-page", default=DEFAULT_PARENT, help="Notion page ID to place the DB under")
    args = ap.parse_args()

    if CONFIG_OUT.exists():
        print(f"WARNING: {CONFIG_OUT} already exists. DB may already have been created.")
        print("Pass --force to overwrite, or delete queue_config.json first.")
        if "--force" not in sys.argv:
            sys.exit(1)

    print(f"Creating CONTENT QUEUE DB under page {args.parent_page} ...")
    db = create_db(args.parent_page)
    db_id = db["id"].replace("-", "")
    print(f"  DB created: {db_id}")

    print("Waiting for Notion to index the new DB ...")
    time.sleep(3)

    print("Resolving data source ID ...")
    dsid = resolve_dsid(db_id)
    print(f"  data_source_id: {dsid}")

    print("Patching custom properties onto data source ...")
    patch_data_source_properties(dsid)

    config = {
        "db_id": db_id,
        "data_source_id": dsid,
        "ll_db_id": LL_DB_ID,
    }
    CONFIG_OUT.write_text(json.dumps(config, indent=2) + "\n")
    print(f"\nConfig written → {CONFIG_OUT}")
    print("\nNext steps:")
    print("  1. Open the CONTENT QUEUE DB in Notion and set a default view.")
    print("  2. Run: python3 scripts/sync-queue.py  (test with empty DB, writes queue.json)")
    print("  3. Add a few entries and test sync again.")
    print("  4. Run: python3 scripts/queue_to_ll_sync.py  (graduation daemon, safe to run now)")


if __name__ == "__main__":
    main()
