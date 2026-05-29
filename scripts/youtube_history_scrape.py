#!/usr/bin/env python3
"""Scrape YouTube watch history via the internal /youtubei/v1/browse API.

Uses Playwright persistent profile for auth. Extracts ytInitialData from the
history page, then follows continuation tokens to paginate. Each section has
a date header (Today / Yesterday / "May 14") and a list of videos.

USAGE
    python3 scripts/youtube_history_scrape.py
    python3 scripts/youtube_history_scrape.py --start 2026-05-10 --end 2026-05-18
    python3 scripts/youtube_history_scrape.py --max-batches 30
"""
from __future__ import annotations

import argparse
import asyncio
import json
import logging
import re
import sys
from datetime import date, datetime
from pathlib import Path

from playwright.async_api import async_playwright

logging.basicConfig(level=logging.INFO, format="%(message)s")
log = logging.getLogger(__name__)

PROFILE_DIR = Path("/tmp/yt-backfill/playwright-profile")
DATA_DIR = Path(__file__).resolve().parent / "data"
OUTPUT_DEFAULT = DATA_DIR / "youtube-day-136-143.json"

HISTORY_URL = "https://www.youtube.com/feed/history"


PAGE_INIT_JS = r"""
(() => {
  // Pull ytInitialData + INNERTUBE config off the page
  const data = window.ytInitialData;
  if (!data) return null;
  const cfg = window.ytcfg && window.ytcfg.data_ ? window.ytcfg.data_ : {};
  return {
    initial: data,
    apiKey: cfg.INNERTUBE_API_KEY || null,
    context: cfg.INNERTUBE_CONTEXT || null,
    clientVersion: cfg.INNERTUBE_CONTEXT_CLIENT_VERSION || null,
  };
})()
"""


FETCH_CONTINUATION_JS = r"""
async (payload) => {
  const { apiKey, context, token } = payload;
  const res = await fetch(`/youtubei/v1/browse?key=${apiKey}&prettyPrint=false`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, continuation: token }),
  });
  if (!res.ok) return { error: `HTTP ${res.status}` };
  return await res.json();
}
"""


def parse_header_date(header: str, today: date) -> date | None:
    if not header:
        return None
    h = header.strip()
    low = h.lower()
    if low == "today":
        return today
    if low == "yesterday":
        return date.fromordinal(today.toordinal() - 1)
    weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    if low in weekdays:
        wd_idx = weekdays.index(low)
        d = date.fromordinal(today.toordinal() - 1)
        while d.weekday() != wd_idx:
            d = date.fromordinal(d.toordinal() - 1)
        return d
    has_year = bool(re.search(r"\b(19|20)\d{2}\b", h))
    txt = h if has_year else f"{h}, {today.year}"
    for fmt in ("%b %d, %Y", "%B %d, %Y"):
        try:
            d = datetime.strptime(txt, fmt).date()
            if not has_year and d > today:
                d = d.replace(year=d.year - 1)
            return d
        except ValueError:
            continue
    return None


def _text(field: dict | None) -> str:
    if not field:
        return ""
    if "simpleText" in field:
        return field["simpleText"]
    if "content" in field and isinstance(field["content"], str):
        return field["content"]
    runs = field.get("runs") or []
    return "".join(r.get("text", "") for r in runs)


def _parse_duration(text: str) -> int | None:
    if not text:
        return None
    parts = [int(p) for p in text.split(":") if p.isdigit()]
    if len(parts) == 3:
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if len(parts) == 2:
        return parts[0] * 60 + parts[1]
    if len(parts) == 1:
        return parts[0]
    return None


def extract_from_video_renderer(renderer: dict) -> dict | None:
    vid = renderer.get("videoId")
    if not vid:
        return None
    title = _text(renderer.get("title"))
    channel = _text(renderer.get("longBylineText")) or _text(renderer.get("shortBylineText")) or _text(renderer.get("ownerText"))
    length = _text(renderer.get("lengthText"))
    runtime_sec = _parse_duration(length)
    return {
        "video_id": vid,
        "url": f"https://www.youtube.com/watch?v={vid}",
        "title": title,
        "channel": channel,
        "length_text": length,
        "runtime_seconds": runtime_sec,
        "runtime_minutes": round(runtime_sec / 60, 1) if runtime_sec else None,
        "source_kind": "videoRenderer",
    }


def extract_from_lockup(lv: dict) -> dict | None:
    if lv.get("contentType") not in (None, "LOCKUP_CONTENT_TYPE_VIDEO"):
        return None
    vid = lv.get("contentId")
    if not vid:
        return None
    md = (lv.get("metadata") or {}).get("lockupMetadataViewModel") or {}
    title = _text(md.get("title"))

    # Duration is in badge text under thumbnailViewModel.overlays[*].thumbnailBottomOverlayViewModel.badges[*].thumbnailBadgeViewModel.text
    length = ""
    runtime_sec = None
    thumb = (lv.get("contentImage") or {}).get("thumbnailViewModel") or {}
    for overlay in thumb.get("overlays") or []:
        bot = overlay.get("thumbnailBottomOverlayViewModel")
        if not bot:
            continue
        for badge in bot.get("badges") or []:
            bv = badge.get("thumbnailBadgeViewModel") or {}
            txt = bv.get("text") or ""
            if re.fullmatch(r"\d+(?::\d+)+", txt):
                length = txt
                runtime_sec = _parse_duration(txt)
                break
        if length:
            break

    # Channel: search metadataParts -> rows for any subtitle / byline
    channel = ""
    for row in (md.get("metadata") or {}).get("contentMetadataViewModel", {}).get("metadataRows", []) or []:
        for part in row.get("metadataParts") or []:
            t = part.get("text") or {}
            c = _text(t)
            if c and not channel:
                channel = c
                break
        if channel:
            break

    return {
        "video_id": vid,
        "url": f"https://www.youtube.com/watch?v={vid}",
        "title": title,
        "channel": channel,
        "length_text": length,
        "runtime_seconds": runtime_sec,
        "runtime_minutes": round(runtime_sec / 60, 1) if runtime_sec else None,
        "source_kind": "lockupViewModel",
    }


def parse_browse_response(payload: dict, today: date) -> tuple[list[dict], str | None]:
    """Walk a /youtubei/v1/browse response. Return (entries_with_date, continuation_token)."""
    entries: list[dict] = []
    next_token: str | None = None

    # The response shape:
    #   ytInitialData →
    #     contents.twoColumnBrowseResultsRenderer.tabs[].tabRenderer.content
    #       .sectionListRenderer.contents = [ itemSectionRenderer, ..., continuationItemRenderer ]
    # Continuation response shape:
    #   onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems = [ itemSectionRenderer, ..., continuationItemRenderer ]

    def walk_section_list(items: list[dict]) -> None:
        nonlocal next_token
        for item in items or []:
            if "itemSectionRenderer" in item:
                section = item["itemSectionRenderer"]
                header_blob = section.get("header") or {}
                header_text = ""
                # header.itemSectionHeaderRenderer.title.simpleText
                hsr = header_blob.get("itemSectionHeaderRenderer", {})
                title_field = hsr.get("title") or {}
                header_text = title_field.get("simpleText") or ""
                if not header_text:
                    runs = title_field.get("runs") or []
                    header_text = "".join(r.get("text", "") for r in runs)
                section_date = parse_header_date(header_text, today)
                for content in section.get("contents") or []:
                    v = None
                    if "videoRenderer" in content:
                        v = extract_from_video_renderer(content["videoRenderer"])
                    elif "lockupViewModel" in content:
                        v = extract_from_lockup(content["lockupViewModel"])
                    if v:
                        v["header"] = header_text
                        v["date"] = section_date.isoformat() if section_date else None
                        entries.append(v)
            elif "continuationItemRenderer" in item:
                ci = item["continuationItemRenderer"]
                endpoint = ci.get("continuationEndpoint") or {}
                cmd = endpoint.get("continuationCommand") or {}
                token = cmd.get("token")
                if token:
                    next_token = token

    # Initial load
    contents = (
        payload.get("contents", {})
        .get("twoColumnBrowseResultsRenderer", {})
        .get("tabs", [])
    )
    for tab in contents:
        tab_content = (tab.get("tabRenderer") or {}).get("content") or {}
        slr = tab_content.get("sectionListRenderer") or {}
        walk_section_list(slr.get("contents") or [])

    # Continuation responses
    for action in payload.get("onResponseReceivedActions") or []:
        appended = action.get("appendContinuationItemsAction") or {}
        walk_section_list(appended.get("continuationItems") or [])

    return entries, next_token


async def is_signed_in(page) -> bool:
    try:
        url = page.url
        if "youtube.com/feed/history" not in url:
            return False
        body = await page.locator("body").inner_text()
        return "Watch history isn't viewable when signed out" not in body and "Sign in to like" not in body
    except Exception:
        return False


async def scrape(start: str, end: str, output: Path, max_batches: int, headless: bool) -> int:
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    output.parent.mkdir(parents=True, exist_ok=True)

    target_start_d = datetime.strptime(start, "%Y-%m-%d").date()
    target_end_d = datetime.strptime(end, "%Y-%m-%d").date()
    today = date.today()

    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=str(PROFILE_DIR),
            headless=headless,
            viewport={"width": 1280, "height": 900},
            args=["--disable-blink-features=AutomationControlled"],
        )
        page = context.pages[0] if context.pages else await context.new_page()

        log.info("navigating to YouTube history...")
        await page.goto(HISTORY_URL, wait_until="domcontentloaded", timeout=60_000)
        await page.wait_for_timeout(3000)

        if not await is_signed_in(page):
            if headless:
                log.error("not signed in; can't auth headless")
                await context.close()
                return 1
            log.warning("NOT SIGNED IN. sign in via visible window — polling silently (max 15 min)")
            for _ in range(90):
                await page.wait_for_timeout(10000)
                if await is_signed_in(page):
                    log.info("  signed in")
                    break
            else:
                log.error("timed out waiting for sign-in")
                await context.close()
                return 2

        # Wait for ytInitialData to be present
        await page.wait_for_function("window.ytInitialData != null", timeout=30_000)

        log.info("hooking XHR response listener to capture native YT continuation calls")
        captured_payloads: list[dict] = []

        async def on_response(response):
            if "/youtubei/v1/browse" not in response.url:
                return
            try:
                body = await response.json()
                captured_payloads.append(body)
            except Exception:
                pass

        page.on("response", on_response)

        # Pull initial payload off the page
        bootstrap = await page.evaluate(PAGE_INIT_JS)
        if not bootstrap:
            log.error("ytInitialData missing on page")
            await context.close()
            return 3

        all_entries: list[dict] = []
        seen_ids: set[str] = set()

        def ingest(payload: dict, label: str) -> tuple[int, str | None]:
            entries, _ = parse_browse_response(payload, today)
            added = 0
            for e in entries:
                if e["video_id"] in seen_ids:
                    continue
                seen_ids.add(e["video_id"])
                all_entries.append(e)
                added += 1
            min_d = min((e["date"] for e in all_entries if e.get("date")), default=None)
            log.info("  %s: +%d (total %d) minDate=%s", label, added, len(all_entries), min_d)
            return added, min_d

        ingest(bootstrap["initial"], "initial")

        # Now scroll the page naturally — YT will fire its own /youtubei/v1/browse calls
        # with proper auth headers, our listener captures them.
        last_total = 0
        stuck = 0
        for i in range(max_batches):
            await page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
            await page.wait_for_timeout(2000)
            # Drain any new payloads
            new_payloads = captured_payloads[len(captured_payloads) - 0:]  # capture all so far
            # Actually re-process each unprocessed
            # We tag processed via len marker
            pass

            # Re-parse all captured payloads — dedup via seen_ids handles re-entries
            for idx in range(len(captured_payloads)):
                p_ = captured_payloads[idx]
                if p_.get("_processed"):
                    continue
                p_["_processed"] = True
                ingest(p_, f"xhr{idx}")

            cur_min = min((e["date"] for e in all_entries if e.get("date")), default=None)
            if len(all_entries) == last_total:
                stuck += 1
            else:
                stuck = 0
            last_total = len(all_entries)

            if cur_min and cur_min < start:
                log.info("  reached window — total %d", last_total)
                # one more scroll-and-wait to ensure full day capture
                await page.wait_for_timeout(2000)
                for idx in range(len(captured_payloads)):
                    p_ = captured_payloads[idx]
                    if not p_.get("_processed"):
                        p_["_processed"] = True
                        ingest(p_, f"xhr{idx}")
                break
            if stuck >= 5:
                log.warning("  stuck — no new entries in 5 scrolls. total=%d minDate=%s", last_total, cur_min)
                break

        in_window = [e for e in all_entries if e.get("date") and start <= e["date"] < end]
        log.info("captured total %d; in window %s..%s = %d", len(all_entries), start, end, len(in_window))

        output.write_text(json.dumps(in_window, indent=2, ensure_ascii=False))
        log.info("wrote %s", output)

        await context.close()
    return 0 if in_window else 4


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--start", default="2026-05-10")
    ap.add_argument("--end", default="2026-05-18")
    ap.add_argument("--output", type=Path, default=OUTPUT_DEFAULT)
    ap.add_argument("--max-batches", type=int, default=40)
    ap.add_argument("--headless", action="store_true")
    args = ap.parse_args()

    rc = asyncio.run(scrape(args.start, args.end, args.output, args.max_batches, args.headless))
    sys.exit(rc)


if __name__ == "__main__":
    main()
