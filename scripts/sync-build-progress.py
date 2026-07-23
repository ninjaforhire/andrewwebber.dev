#!/usr/bin/env python3
"""Refresh public spotlight percentages from the canonical BUILD PIPELINE roadmaps."""

from __future__ import annotations

import argparse
import json
import logging
import re
from datetime import datetime, timezone
from pathlib import Path

LOG = logging.getLogger("sync-build-progress")
ROOT = Path(__file__).resolve().parents[1]
PLANS = Path.home() / "_Code" / "plans" / "active"
CRM = PLANS / "2026-07-02-mighty-crm-master-plan.md"
MEDIA = PLANS / "2026-07-22-mighty-media-intelligence-master-roadmap.md"
OUTPUT = ROOT / "src" / "data" / "build-progress.json"


def crm_progress(text: str) -> tuple[int, int]:
    """Match the Jimbo BUILD PIPELINE milestone parser."""
    phases = sorted(set(re.findall(r"\b(P\d+(?:\.\d+)?)\s+[—-]", text)))
    done = len(
        re.findall(
            r"^[-*].*?✅\s*(?:SHIPPED|DONE)",
            text,
            re.MULTILINE | re.IGNORECASE,
        )
    )
    return done, len(phases)


def media_progress(text: str) -> tuple[int, int]:
    """Count completed rows in the roadmap's canonical phase table."""
    rows: list[list[str]] = []
    in_table = False
    for line in text.splitlines():
        if line.strip().startswith("## 6. Phase roadmap"):
            in_table = True
            continue
        if in_table and line.startswith("## "):
            break
        if in_table and line.strip().startswith("| P"):
            cells = [cell.strip() for cell in line.split("|")[1:-1]]
            if len(cells) >= 5:
                rows.append(cells)
    done = sum(
        1
        for row in rows
        if row[4].upper() in {"DONE", "SHIPPED", "COMPLETE", "COMPLETED"}
    )
    return done, len(rows)


def record(done: int, total: int) -> dict[str, int | str]:
    percentage = round(done / total * 100) if total else 0
    return {
        "done": done,
        "total": total,
        "percentage": percentage,
        "status": "In Progress",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    crm = record(*crm_progress(CRM.read_text(encoding="utf-8")))
    media = record(*media_progress(MEDIA.read_text(encoding="utf-8")))
    payload = {
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "mightyCrm": crm,
        "mightyMediaIntelligence": media,
    }
    if args.dry_run:
        LOG.info("%s", json.dumps(payload, indent=2))
        return
    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    LOG.info("Wrote %s", OUTPUT)


if __name__ == "__main__":
    main()
