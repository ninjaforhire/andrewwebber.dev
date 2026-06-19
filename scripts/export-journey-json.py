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
DATA_SOURCE_ID = "25950df1-c088-451d-8002-f2eff57767a9"
NTN_BINARY = os.path.expanduser("~/.local/bin/ntn")


def _ntn_api(method: str, path: str, body: dict | None = None, timeout: int = 60) -> dict:
    """Call the Notion API through the ntn CLI (keychain auth).

    The raw NOTION_API_KEY integration token was revoked; the only valid
    credential on this machine is ntn's keychain login. ntn treats
    NOTION_API_TOKEN as higher priority than the keychain, so we strip it from
    the subprocess env to avoid a stale dotenv value clobbering the good token.
    """
    cmd = [NTN_BINARY, "api", path, "-X", method.upper()]
    if body is not None:
        cmd.extend(["-d", json.dumps(body)])
    env = {k: v for k, v in os.environ.items() if k not in ("NOTION_API_TOKEN", "NOTION_API_KEY")}
    env.setdefault("NOTION_API_VERSION", "2025-09-03")
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, env=env)
    if proc.returncode != 0:
        raise RuntimeError(f"ntn api {method} {path} failed: {(proc.stderr or proc.stdout).strip()[:300]}")
    return json.loads(proc.stdout)
HEADERS = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
}
SITE_ROOT = Path("/Users/mightydesigncenter/_Code/andrewwebber.dev")
OUTPUT_PATH = SITE_ROOT / "src" / "data" / "journey-2026.json"

ERA_ORDER = ["No-Code Era", "First Code", "Agent Builder", "Platform Architect", "Full Stack AI"]

# ── Video curation ───────────────────────────────────────────────────────
# The Notion Category field is unreliable (YouTube enrichment mis-tags ASMR,
# sports streams, and vlogs as "AI/ML"), so we curate off the title/channel
# instead. Only genuine AI / Agents / Business / DevOps / SDLC learning videos
# survive; the day card then features the top few and tucks the rest behind a
# "See more" toggle. Filtering lives here so every nightly export self-cleans.
import re as _re

_LEARN_RE = _re.compile(
    r"(claude|gpt|gemini|llm|\bai\b|agent|agentic|\bcode\b|coding|codex|cursor|"
    r"copilot|prompt|github|saas|automat|workflow|vibe ?cod|framework|\bseo\b|"
    r"n8n|\brag\b|\bmcp\b|notion|firecrawl|glm|deepseek|openai|anthropic|"
    r"second brain|skill|build (a|an|your|unstoppable)|sales ai|fable|cowork)",
    _re.I,
)
_DENY_RE = _re.compile(
    r"(asmr|🔴|live ?stream|livestream|watchalong|going live|world cup|fifa|"
    r"\bmlb\b|\bnba\b|van life|street food|factory|cigar|roof tile|toy car|"
    r"joe rogan|jre vault|andrew tate|pigeon|fashion show|outfit|noodle|"
    r"hamburger|corn (mill|pounder)|survival|debating viewers|sponsor hunting|"
    r"homosexual|\bvlog|youtube movies|skyscraper|side hustle|trillion|"
    r"credit wave|empire of abuse|higher prices|aliens|go live challenge|"
    r"vivir mejor|amazing in china)",
    _re.I,
)
_EMOJI_RE = _re.compile(
    "[\U0001F000-\U0001FAFF☀-➿⬀-⯿\U0001F1E6-\U0001F1FF]"
)
_SCORE_KW = [
    "claude code", "claude", "agent", "agentic", "automat", "workflow",
    "framework", "saas", "github", "prompt", "skill", "mcp", "course",
    "second brain", "codex", "vibe cod", "build",
]

# Videos ranked at or above this score are featured on the day card; the rest
# stay linked behind "See more". Mirrored in DayCard.tsx as FEATURED_VIDEOS.
FEATURED_VIDEO_COUNT = 3


def _is_learning_video(v: dict) -> bool:
    title = v.get("title") or ""
    channel = v.get("channel") or ""
    if _DENY_RE.search(title) or _DENY_RE.search(channel):
        return False
    if _EMOJI_RE.search(title):
        return False
    return bool(_LEARN_RE.search(title) or _LEARN_RE.search(channel))


def _video_score(v: dict) -> float:
    """Higher = more featurable. Rewards keyword density and the 8-45 min
    tutorial sweet spot; penalises >90 min livestream-length filler."""
    title = (v.get("title") or "").lower()
    kw = sum(1 for k in _SCORE_KW if k in title)
    score = kw * 9.0
    rt = v.get("runtime_min") or 0
    if 8 <= rt <= 45:
        score += 14
    elif 45 < rt <= 90:
        score += 5
    elif rt > 90:
        score -= 10
    elif 0 < rt < 8:
        score += 3
    score += min(rt, 45) * 0.3
    return score


def curate_videos(videos: list[dict]) -> list[dict]:
    """Dedupe, drop non-learning videos, and order best-first so the day card
    can feature the strongest few. Order is the ranking — no data is dropped
    from the rendered list beyond the non-learning filter."""
    seen: set[str] = set()
    deduped: list[dict] = []
    for v in videos:
        key = (v.get("url") or v.get("title") or "").strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        deduped.append(v)
    learning = [v for v in deduped if _is_learning_video(v)]
    learning.sort(key=_video_score, reverse=True)
    return learning


def fetch_all_pages() -> list[dict]:
    pages = []
    has_more = True
    start_cursor = None
    while has_more:
        body: dict = {"page_size": 100, "sorts": [{"property": "Streak Day", "direction": "descending"}]}
        if start_cursor:
            body["start_cursor"] = start_cursor
        data = _ntn_api("POST", f"v1/data_sources/{DATA_SOURCE_ID}/query", body)
        pages.extend(data["results"])
        has_more = data.get("has_more", False)
        start_cursor = data.get("next_cursor")
    return pages


def fetch_page_blocks(page_id: str) -> list[dict]:
    blocks = []
    has_more = True
    start_cursor = None
    while has_more:
        path = f"v1/blocks/{page_id}/children?page_size=100"
        if start_cursor:
            path += f"&start_cursor={start_cursor}"
        data = _ntn_api("GET", path)
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
            _para = extract_rich_text(block["paragraph"].get("rich_text", []))
            if _para.strip():
                takeaway = (takeaway + chr(10)+chr(10) + _para) if takeaway else _para

    return {"videos": videos, "builds": builds, "takeaway": takeaway}


def props_to_entry(page: dict, body_data: dict) -> dict:
    props = page["properties"]

    title_parts = props.get("Title", {}).get("title", []) or props.get("Day", {}).get("title", [])
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

    link = (props.get("Links") or {}).get("url")
    channel_rt = props.get("Channel", {}).get("rich_text", [])
    channel = extract_rich_text(channel_rt) if channel_rt else ""
    runtime = props.get("Runtime (min)", {}).get("number")

    return {
        "day": int(streak),
        "date": date_str,
        "title": title,
        "era": era,
        "type": types,
        "source": source,
        "category": categories,
        "impact": impact,
        "url": link,
        "channel": channel,
        "runtime_min": runtime,
        "videos": body_data.get("videos", []),
        "builds": body_data.get("builds", []),
        "takeaway": body_data.get("takeaway", ""),
    }


def bundle_videos_into_journal(entries: list[dict]) -> list[dict]:
    """Merge per-video LL records (Source=YouTube or Type=Video) into each day's journal entry's videos[] list."""
    from collections import defaultdict
    by_date: dict[str, list[dict]] = defaultdict(list)
    for e in entries:
        by_date[e.get("date") or ""].append(e)

    out: list[dict] = []
    for date_key, day_entries in by_date.items():
        # Journal = entry whose title looks like "Day NNN" or has builds or takeaway populated
        def is_journal(e: dict) -> bool:
            t = (e.get("title") or "").strip()
            if t.startswith("Day "):
                return True
            if e.get("builds") or (e.get("takeaway") or "").strip():
                return True
            return False

        def is_video_record(e: dict) -> bool:
            if e.get("source") == "YouTube":
                return True
            types = e.get("type") or []
            return any(t in {"Video", "YouTube"} for t in types)

        journals = [e for e in day_entries if is_journal(e)]
        videos = [e for e in day_entries if is_video_record(e) and not is_journal(e)]
        other = [e for e in day_entries if e not in journals and e not in videos]

        if journals:
            journal = journals[0]
            existing = list(journal.get("videos") or [])
            for v in videos:
                existing.append({
                    "title": v.get("title", ""),
                    "channel": v.get("channel") or "",
                    "url": v.get("url") or "",
                    "runtime_min": v.get("runtime_min"),
                    "category": v.get("category") or [],
                })
            journal["videos"] = curate_videos(existing)
            out.append(journal)
            # Keep any other non-journal, non-video entries (e.g. books, courses)
            out.extend(other)
            out.extend(journals[1:])  # in case of multiple journals same day
        else:
            # No journal entry that day — keep video records as-is (won't show as bundled)
            out.extend(day_entries)

    return out


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

    entries = bundle_videos_into_journal(entries)
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
