#!/usr/bin/env python3
"""Export Learning Library from Notion → journey-2026.json for andrewwebber.dev."""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import requests
from dotenv import load_dotenv

load_dotenv(Path("/Users/mightydesigncenter/.claude/plugins/cache/mighty/mighty/2.0.0/agents/.env"))

NOTION_API_KEY = os.getenv("NOTION_API_KEY")
DATABASE_ID = "2524ccca0f21429296a7c299abade1cb"
HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}
SITE_ROOT = Path("/Users/mightydesigncenter/Desktop/_Code/andrewwebber.dev")
OUTPUT_PATH = SITE_ROOT / "src" / "data" / "journey-2026.json"

ERA_ORDER = ["No-Code Era", "First Code", "Agent Builder", "Platform Architect", "Full Stack AI"]


def fetch_all_pages() -> list[dict]:
    pages = []
    has_more = True
    start_cursor = None
    while has_more:
        body: dict = {"page_size": 100, "sorts": [{"property": "Streak Day", "direction": "descending"}]}
        if start_cursor:
            body["start_cursor"] = start_cursor
        resp = requests.post(
            f"https://api.notion.com/v1/databases/{DATABASE_ID}/query",
            headers=HEADERS,
            json=body,
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()
        pages.extend(data["results"])
        has_more = data.get("has_more", False)
        start_cursor = data.get("next_cursor")
    return pages


def fetch_page_blocks(page_id: str) -> list[dict]:
    blocks = []
    has_more = True
    start_cursor = None
    while has_more:
        url = f"https://api.notion.com/v1/blocks/{page_id}/children?page_size=100"
        if start_cursor:
            url += f"&start_cursor={start_cursor}"
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        blocks.extend(data["results"])
        has_more = data.get("has_more", False)
        start_cursor = data.get("next_cursor")
    return blocks


def extract_rich_text(rt_list: list[dict]) -> str:
    return "".join(rt.get("text", {}).get("content", "") or rt.get("plain_text", "") for rt in rt_list)


def parse_blocks(blocks: list[dict]) -> dict:
    videos = []
    builds = []
    takeaway = ""
    current_section = None

    for block in blocks:
        btype = block["type"]
        if btype == "heading_2":
            heading = extract_rich_text(block["heading_2"].get("rich_text", []))
            if "Video" in heading:
                current_section = "videos"
            elif "Built" in heading:
                current_section = "builds"
            elif "Takeaway" in heading:
                current_section = "takeaway"
            elif "Security" in heading:
                current_section = "builds"
            elif "Books" in heading:
                current_section = "books"
            else:
                current_section = None
        elif btype == "bulleted_list_item":
            text_parts = block["bulleted_list_item"].get("rich_text", [])
            if current_section == "videos":
                title = ""
                channel = ""
                url = None
                for part in text_parts:
                    annotations = part.get("annotations", {})
                    if annotations.get("bold"):
                        title = part.get("text", {}).get("content", "").strip()
                        link = part.get("text", {}).get("link")
                        if link:
                            url = link.get("url")
                    elif annotations.get("italic"):
                        channel = part.get("text", {}).get("content", "").replace("—", "").strip()
                if title and "more videos" not in title:
                    v = {"title": title, "channel": channel}
                    if url:
                        v["url"] = url
                    videos.append(v)
            elif current_section == "builds":
                full = extract_rich_text(text_parts)
                if "more commits" not in full and full.strip():
                    parts = full.split(" — ", 1)
                    repo = parts[0].strip() if len(parts) > 1 else "misc"
                    commits = [c.strip() for c in (parts[1] if len(parts) > 1 else parts[0]).split(";") if c.strip()]
                    if commits:
                        builds.append({"repo": repo, "commits": commits[:3]})
        elif btype == "paragraph" and current_section == "takeaway":
            takeaway = extract_rich_text(block["paragraph"].get("rich_text", []))

    return {"videos": videos, "builds": builds, "takeaway": takeaway}


def props_to_entry(page: dict, body_data: dict) -> dict:
    props = page["properties"]

    title_parts = props.get("Day", {}).get("title", [])
    title = extract_rich_text(title_parts) if title_parts else "Untitled"

    date_obj = props.get("Date", {}).get("date")
    date_str = date_obj["start"] if date_obj else ""

    types = [o["name"] for o in props.get("Type", {}).get("multi_select", [])]
    source_obj = props.get("Source", {}).get("select")
    source = source_obj["name"] if source_obj else ""
    categories = [o["name"] for o in props.get("Category", {}).get("multi_select", [])]
    impact_obj = props.get("Impact", {}).get("select")
    impact = impact_obj["name"] if impact_obj else "Low"
    era_obj = props.get("Era", {}).get("select")
    era = era_obj["name"] if era_obj else ""
    streak = props.get("Streak Day", {}).get("number", 0) or 0

    return {
        "day": int(streak),
        "date": date_str,
        "title": title,
        "era": era,
        "type": types,
        "source": source,
        "category": categories,
        "impact": impact,
        "videos": body_data.get("videos", []),
        "builds": body_data.get("builds", []),
        "takeaway": body_data.get("takeaway", ""),
    }


def main() -> None:
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--no-push", action="store_true", help="Skip git push")
    parser.add_argument("--dry-run", action="store_true", help="Print JSON, don't write")
    args = parser.parse_args()

    print("Fetching all Learning Library pages...")
    pages = fetch_all_pages()
    print(f"  Found {len(pages)} pages")

    entries = []
    for i, page in enumerate(pages):
        pid = page["id"]
        print(f"  Reading blocks for page {i+1}/{len(pages)}...", end="\r")
        blocks = fetch_page_blocks(pid)
        body_data = parse_blocks(blocks)
        entry = props_to_entry(page, body_data)
        entries.append(entry)

    entries.sort(key=lambda e: e["day"], reverse=True)
    current_era = entries[0]["era"] if entries else ""

    journey_data = {
        "lastUpdated": datetime.now().isoformat(timespec="seconds"),
        "totalDays": len(entries),
        "currentEra": current_era,
        "entries": entries,
    }

    if args.dry_run:
        print(json.dumps(journey_data, indent=2)[:2000])
        print(f"\n... ({len(entries)} entries total)")
        return

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(journey_data, indent=2))
    print(f"\nWritten to {OUTPUT_PATH}")
    print(f"  {len(entries)} entries, current era: {current_era}")

    if not args.no_push:
        print("\nCommitting and pushing to GitHub...")
        subprocess.run(["git", "add", "src/data/journey-2026.json"], cwd=SITE_ROOT, check=True)
        result = subprocess.run(
            ["git", "diff", "--cached", "--quiet"],
            cwd=SITE_ROOT,
        )
        if result.returncode != 0:
            subprocess.run(
                ["git", "commit", "-m", "chore: update journey-2026.json"],
                cwd=SITE_ROOT,
                check=True,
            )
            subprocess.run(["git", "push"], cwd=SITE_ROOT, check=True)
            print("  Pushed to GitHub. Vercel will auto-deploy.")
        else:
            print("  No changes to commit.")


if __name__ == "__main__":
    main()
