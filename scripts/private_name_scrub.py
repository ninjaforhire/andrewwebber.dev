"""Shared private-name scrub for everything this site publishes.

Public pages must never surface teammate names, person-named internal
tools, or personal account handles, no matter what lands in Notion pages,
skill descriptions, or git commit messages.

The actual pattern list lives in scripts/data/private-scrub.local.json,
which is gitignored on purpose: this repo is public, so committing the
patterns would republish the very strings they exist to remove. Data
generation only ever runs on the owner's machine, where the config exists;
without it the scrub is a no-op, which is safe because committed data
files are already scrubbed.

Config format:
    {"drop": ["<regex>", ...], "replace": [["<regex>", "<replacement>"], ...]}
"drop" patterns are matched case-insensitively against tool slugs/names;
"replace" patterns use inline flags (e.g. "(?i)") where needed.

Single source of truth: scan-tools.py and export-journey-json.py both
import from here so the pattern list cannot drift between copies.
"""

from __future__ import annotations

import json
import re
from pathlib import Path

_CONFIG_PATH = Path(__file__).resolve().parent / "data" / "private-scrub.local.json"
_MATCH_NOTHING = r"$^"


def _load_config() -> tuple[re.Pattern[str], list[tuple[re.Pattern[str], str]]]:
    if not _CONFIG_PATH.exists():
        return re.compile(_MATCH_NOTHING), []
    config = json.loads(_CONFIG_PATH.read_text())
    drop_patterns = config.get("drop") or [_MATCH_NOTHING]
    private_name = re.compile("|".join(drop_patterns), re.IGNORECASE)
    replacements = [
        (re.compile(pattern), replacement)
        for pattern, replacement in (config.get("replace") or [])
    ]
    return private_name, replacements


PRIVATE_NAME, REPLACEMENTS = _load_config()


def scrub_text(s: str) -> str:
    for pattern, replacement in REPLACEMENTS:
        s = pattern.sub(replacement, s)
    return s
