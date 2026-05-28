#!/usr/bin/env python3
"""Sync LEARNING LIBRARY Notion DB → src/data/courses.json.

Queries the LEARNING LIBRARY data source, filters Type contains Book|Course,
and writes a courses.json that the LearningLibrary + CurrentReading components consume.

Usage:
    python3 scripts/sync-courses.py
"""
import json
import re
import subprocess
import sys
import time
from pathlib import Path

NTN = "/Users/mightydesigncenter/.local/bin/ntn"
DSID = "25950df1-c088-451d-8002-f2eff57767a9"
OUT = Path(__file__).resolve().parents[1] / "src" / "data" / "courses.json"


def query_all():
    cursor = ""
    pages = []
    for _ in range(10):
        cmd = [NTN, "datasources", "query", DSID, "--json", "--limit", "100"]
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
        time.sleep(1.5)
    return pages


def gtext(prop):
    if not prop:
        return ""
    arr = prop.get("rich_text") or prop.get("title") or []
    return "".join(t.get("plain_text", "") for t in arr)


def norm_title(t):
    base = t.split(" - ")[0].split(":")[0]
    return re.sub(r"[^a-z0-9]", "", base.lower())


def extract_meta_from_callout(page_id):
    """Pull the metadata callout block to recover Author/Duration/Rating/ASIN/Cover."""
    r = subprocess.run(
        [NTN, "api", f"v1/blocks/{page_id}/children"],
        capture_output=True, text=True, timeout=30
    )
    if r.returncode != 0:
        return {}
    try:
        data = json.loads(r.stdout)
    except json.JSONDecodeError:
        return {}
    meta = {}
    for block in data.get("results", []):
        if block.get("type") == "callout":
            rt = block.get("callout", {}).get("rich_text") or []
            text = "".join(t.get("plain_text", "") for t in rt)
            for m in re.finditer(r"\*\*([^*:]+):\*\*\s*([^·]+)", text):
                k = m.group(1).strip().lower().replace(" ", "_")
                meta[k] = m.group(2).strip()
            break
    return meta


def main():
    print("Querying LEARNING LIBRARY ...")
    rows = query_all()
    print(f"  {len(rows)} total rows")

    items = []
    for row in rows:
        p = row["properties"]
        types = [t["name"] for t in (p.get("Type", {}).get("multi_select") or [])]
        if not ({"Book", "Course"} & set(types)):
            continue
        title = gtext(p.get("Day"))
        if not title:
            continue
        url = (p.get("Links") or {}).get("url")
        status = (p.get("Status", {}).get("status") or {}).get("name")
        date = (p.get("Date", {}).get("date") or {}).get("start")
        source = (p.get("Source", {}).get("select") or {}).get("name") or "Other"
        category = ", ".join(c["name"] for c in (p.get("Category", {}).get("multi_select") or []))

        meta = extract_meta_from_callout(row["id"])
        items.append({
            "title": title,
            "type": "Book" if "Book" in types else "Course",
            "source": source,
            "status": status or "In progress",
            "date": date,
            "author": meta.get("author", ""),
            "duration": meta.get("duration"),
            "rating": float(meta["rating"].split("/")[0]) if meta.get("rating") else None,
            "url": url,
            "cover": None,  # not stored on new entries; recover via Audible cover-image API if needed
            "asin": meta.get("asin"),
            "category": category or None,
        })
        time.sleep(0.3)

    # Sort: Done first, then by date desc
    def sort_key(c):
        d = (c.get("date") or "")[:10].replace("-", "")
        return (0 if c.get("status") == "Done" else 1, -(int(d) if d.isdigit() else 0))
    items.sort(key=sort_key)

    payload = {
        "lastUpdated": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "total": len(items),
        "items": items,
    }
    OUT.write_text(json.dumps(payload, indent=2))
    print(f"Wrote {len(items)} → {OUT}")
    print(f"  Books: {sum(1 for i in items if i['type']=='Book')}")
    print(f"  Courses: {sum(1 for i in items if i['type']=='Course')}")


if __name__ == "__main__":
    main()
