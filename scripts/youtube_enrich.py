#!/usr/bin/env python3
"""Enrich YouTube history JSON with description, runtime, channel, topic tags.

Reads scripts/data/youtube-day-136-143.json (clipboard dump from DevTools snippet).
Hits each video's public /watch page (no auth), parses ytInitialPlayerResponse,
emits scripts/data/youtube-day-136-143-enriched.json.

Topic classifier maps title+desc keywords to existing LL Category multi_select values.
Per memory rule [journey_video_filter]: skips music/gaming/politics entries.
"""
from __future__ import annotations

import argparse
import json
import logging
import re
import sys
import time
from pathlib import Path
from typing import Any

import requests

logging.basicConfig(level=logging.INFO, format="%(message)s")
log = logging.getLogger(__name__)

DATA_DIR = Path(__file__).resolve().parent / "data"
INPUT = DATA_DIR / "youtube-recent.json"
OUTPUT = DATA_DIR / "youtube-recent-enriched.json"

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "AI/ML": ["llm", "gpt", "openai", "chatgpt", "claude", "anthropic", "gemini", "machine learning", "neural", "embedding", "rag", "fine-tun", "training data"],
    "Agents": ["agent", "mcp", "tool use", "swarm", "multi-agent", "autonomy", "agentic"],
    "Automation": ["automat", "workflow", "n8n", "zapier", "make.com", "cron", "pipeline", "ci/cd"],
    "Security": ["security", "vulnerab", "exploit", "pentest", "ctf", "owasp", "auth", "encryption", "cve"],
    "Frontend": ["react", "next.js", "vue", "svelte", "tailwind", "typescript", "css", "ui ", "frontend", "component"],
    "Business": ["business", "startup", "founder", "ceo", "revenue", "saas", "agency", "consult", "client", "sales", "marketing", "seo", "growth"],
    "Design": ["design", "ux", "figma", "typography", "brand", "logo", "color palette", "mockup", "wireframe"],
    "DevOps": ["devops", "docker", "kubernetes", "deploy", "infra", "terraform", "aws ", "gcp ", "vercel", "cloudflare"],
    "No-Code": ["no-code", "no code", "bubble", "webflow", "airtable", "notion", "softr"],
    "Open Source": ["open source", "open-source", "github", "fork", "pull request", "maintainer", "contribute to"],
}

SKIP_KEYWORDS = [
    "music video", "official audio", "official video", "lyrics",
    "gaming", "gameplay", "let's play", "speedrun", "minecraft", "fortnite",
    "politic", "election", "trump", "biden", "harris", "invasion",
    # music / chill mixes
    "lofi", "lo-fi", "jazzhop", "jazz hop", "chillhop", "original mix",
    "(instrumental", "beats to", "study mix", "radio mix",
    # finance / stock-pump
    "stock", "stocks", "wealth opportunity", "ziptrader", "invest now",
    "best stock", "buy now", "explosive potential",
    # recipes / lifestyle noise
    "recipe", "baked potato", "easy dinner",
]

# Channels that only ever produce off-topic content for this portfolio.
SKIP_CHANNELS = [
    "oxen", "fantastic music", "ziptrader", "goat academy",
    "felix & friends", "ciao bella", "chase garsee",
]


def load_raw() -> list[dict[str, Any]]:
    if not INPUT.exists():
        log.error("missing %s — paste DevTools clipboard JSON first", INPUT)
        sys.exit(1)
    return json.loads(INPUT.read_text())


def fetch_watch_page(url: str) -> str | None:
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=15)
        if r.status_code != 200:
            log.warning("  status=%s for %s", r.status_code, url)
            return None
        return r.text
    except Exception as e:
        log.warning("  fetch failed: %s", e)
        return None


def extract_meta(html: str) -> dict[str, Any]:
    out: dict[str, Any] = {}

    m = re.search(r'"shortDescription":"((?:[^"\\]|\\.)*)"', html)
    if m:
        raw = m.group(1)
        try:
            decoded = json.loads(f'"{raw}"')
        except Exception:
            decoded = raw
        out["description"] = decoded[:1200]

    m = re.search(r'"lengthSeconds":"(\d+)"', html)
    if m:
        seconds = int(m.group(1))
        out["runtime_seconds"] = seconds
        out["runtime_minutes"] = round(seconds / 60, 1)

    m = re.search(r'"author":"([^"]+)"', html) or re.search(r'"channelName":"([^"]+)"', html)
    if m:
        out["channel_full"] = m.group(1)

    m = re.search(r'"category":"([^"]+)"', html)
    if m:
        out["yt_category"] = m.group(1)

    m = re.search(r'"viewCount":"(\d+)"', html)
    if m:
        out["view_count"] = int(m.group(1))

    m = re.search(r'"keywords":\[([^\]]*)\]', html)
    if m:
        kws = re.findall(r'"([^"]+)"', m.group(1))
        out["keywords"] = kws[:20]

    m = re.search(r'"uploadDate":"([^"]+)"', html)
    if m:
        out["upload_date"] = m.group(1)

    return out


def classify_topics(title: str, description: str, keywords: list[str]) -> list[str]:
    blob = " ".join([title or "", description or "", " ".join(keywords or [])]).lower()
    hits = []
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(kw in blob for kw in kws):
            hits.append(cat)
    return hits or ["AI/ML"]


def should_skip(title: str, description: str, yt_category: str | None, channel: str = "") -> str | None:
    ch = (channel or "").lower()
    for bad in SKIP_CHANNELS:
        if bad in ch:
            return f"skip-channel:{bad}"
    blob = (title + " " + description).lower()
    for kw in SKIP_KEYWORDS:
        if kw in blob:
            return f"skip-keyword:{kw}"
    if yt_category and yt_category.lower() in {"music", "gaming"}:
        return f"yt-category:{yt_category}"
    return None


def enrich_one(video: dict[str, Any]) -> dict[str, Any]:
    url = video.get("url") or ""
    if "watch?v=" not in url:
        return {**video, "skipped": "no-watch-url"}

    html = fetch_watch_page(url)
    if not html:
        return {**video, "skipped": "fetch-failed"}

    meta = extract_meta(html)
    skip = should_skip(video.get("title", ""), meta.get("description", ""), meta.get("yt_category"), meta.get("channel_full") or video.get("channel", ""))
    if skip:
        return {**video, **meta, "skipped": skip}

    topics = classify_topics(video.get("title", ""), meta.get("description", ""), meta.get("keywords", []))

    return {**video, **meta, "topics": topics}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--limit", type=int, default=0, help="enrich only first N entries (debug)")
    ap.add_argument("--sleep", type=float, default=0.5, help="seconds between requests")
    args = ap.parse_args()

    raw = load_raw()
    if args.limit:
        raw = raw[: args.limit]

    log.info("enriching %d videos", len(raw))
    enriched: list[dict[str, Any]] = []
    for i, v in enumerate(raw, 1):
        log.info("[%d/%d] %s", i, len(raw), (v.get("title") or "")[:70])
        enriched.append(enrich_one(v))
        time.sleep(args.sleep)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(enriched, indent=2, ensure_ascii=False))

    kept = sum(1 for e in enriched if "skipped" not in e)
    skipped = len(enriched) - kept
    log.info("wrote %s  kept=%d skipped=%d", OUTPUT, kept, skipped)


if __name__ == "__main__":
    main()
