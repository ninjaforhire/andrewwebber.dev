# PLAN — Fix nightly journey: kill stray video/resource cards + self-heal missing days

Frozen spec for `/codex-build`. Repo: `andrewwebber.dev`. Worktree branch: `fix/journey-daily-backfill`.
Codex implements the CODE + TEST changes only. The live Notion backfill + live export
regen are done by Claude after merge (they need Notion/claude -p session tools) — OUT OF SCOPE here.

## Background (verified)

The journey timeline on andrewwebber.dev renders `src/data/journey-2026.json`, produced nightly by
`scripts/export-journey-json.py` from the Notion LEARNING LIBRARY. Intended shape: **exactly one
"Day NNN" journal card per calendar day** (builds + takeaway + top videos watched), each expandable.
`DayCard.tsx` already renders good days correctly — DO NOT touch the frontend.

Two data-pipeline defects produce bad cards (confirmed against live data, Jun 1 – Jul 14 2026):

1. **Stray records leak as standalone cards.** `bundle_videos_into_journal()` only folds video
   records into a day's journal when that day HAS a journal. On journal-less days it emits the raw
   per-video LEARNING LIBRARY records as their own timeline entries — bypassing `curate_videos()`
   (the junk/deny/emoji filter). Result: e.g. Jun 24 shows 7 stray video cards incl. an Arabic
   livestream (day 181); Jul 11 shows "H-E-B in Fort Worth closed after catching fire" (day 198).
   Separately, non-video resource records (Source=Skool, Type=Learn/Tool) ALWAYS fall into the
   passthrough "other" bucket and stand alone even when a journal exists — e.g. Jul 5 shows its
   journal PLUS 11 Skool prompt/tool cards.

2. **Missing journals never recover.** The orchestrator `nightly_journey_sync.py` generates only
   *today's* journal (`generate_journey_entry.py --date <today>`), best-effort. Any night the run
   didn't complete the journal step (Mac asleep, claude -p miss, cascade abort) leaves a permanent
   gap. Confirmed gaps: Jun 24, Jul 1, Jul 8, Jul 11 have no journal entry.

Boundary fact that makes the fix safe: daily-journey records carry a **Streak Day > 0**; the
historic reading log (Audible books, 2018–2023) carries **day == 0**. The historic book cards are
intentional and OUT OF SCOPE — the fix must preserve them untouched.

## Goal

After this change + the post-merge live backfill/export, every calendar day in the journey range
shows exactly ONE journal card (expandable, with its builds, takeaway, and curated top videos), and
NO stray video or resource record ever appears as a standalone timeline entry. A missed night
auto-recovers within 7 days with no manual action.

## Change 1 — `scripts/export-journey-json.py` : harden `bundle_videos_into_journal()`

Rewrite the grouping so, per calendar date:

- Classify each same-day record with the EXISTING helpers already in the function:
  `is_journal(e)` and `is_video_record(e)`. Add a third: a record is a **journey record** if
  `int(e.get("day") or 0) > 0` (Streak Day present).
- **If the day has a journal** (use `journals[0]` as today):
  - Fold every video record's `{title, channel, url, runtime_min, category}` into the journal's
    `videos[]`, then run the existing `curate_videos()` on the combined list (unchanged behavior).
  - Emit the journal only. **Drop** every other same-day non-journal record whose `day > 0`
    (videos already folded; Skool/Learn/Tool resources discarded from the timeline).
  - Preserve same-day non-journal records with `day == 0` (historic books/courses) by emitting them
    as-is (defensive; rare to coincide).
  - Preserve the existing "multiple journals same day" defense (`journals[1:]`).
- **If the day has NO journal:**
  - Emit only same-day records that are BOTH `day == 0` AND `not is_video_record(e)` — i.e. the
    historic reading log (books/courses), unchanged.
  - **Drop** everything else: every `day > 0` record (in-journey strays), AND every video record
    regardless of `day`. This closes the residual where a Content-Queue-graduated video (Source
    "Content Queue", no Streak Day → `day == 0`) would otherwise survive standalone on a
    journal-less day. A dropped in-journey video re-folds once the journal is backfilled; a
    journal-less video is never a legitimate standalone timeline card.

Net: journey-range strays and stray videos never stand alone; genuine historic day-0
book/course records are never dropped. Keep the function's docstring accurate to the new behavior.
No other function changes.

Out-of-scope pre-existing quirk (DO NOT fix): `is_journal()` treats any title starting `"Day "`
as a journal, so a video literally titled e.g. "Day in the Life ..." could be misread. This
predates the fix, is not in the confirmed defect set, and must be left untouched.

## Change 2 — `scripts/nightly_journey_sync.py` : self-heal a trailing 7-day window

Replace the single-day journal step with an idempotent 7-day catch-up. In `main()`, where the
journal-entry source command is built:

- Change the command from `["--date", journal_date]` to
  `["--backfill", <today-6 days>, <today>]` (inclusive), using `datetime.date.today()` and
  `timedelta(days=6)`, both ISO-formatted.
- Update the surrounding comment to say it now backfills the trailing 7 days so a missed night
  auto-recovers; still best-effort (a miss flags disconnected, never blocks deploy).
- `generate_journey_entry.py` already supports `--backfill START END` and is idempotent
  (`entry_exists` skips days that already have a "Day N" journal) — no generator change needed.

Keep the label `"journal-entry"`. Nothing else in the orchestrator changes.

## Change 3 — `tests/test_export_bundling.py` : pytest proving the invariants

Create the test (pytest, per house standards). The target file name is hyphenated
(`export-journey-json.py`) so it is NOT importable as a normal module — a bare `sys.path` +
`import` fails, and renaming the script is FORBIDDEN (the orchestrator calls it by that exact
path). Load it via `importlib.util.spec_from_file_location`:

```python
import importlib.util, pathlib
_p = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "export-journey-json.py"
_spec = importlib.util.spec_from_file_location("export_journey_json", _p)
export_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(export_mod)
bundle_videos_into_journal = export_mod.bundle_videos_into_journal
curate_videos = export_mod.curate_videos
```

(The module's top-level `load_dotenv()` no-ops on a missing path and `import requests` does no
network I/O, so `exec_module` is import-safe as-is; no guard needed. Do NOT change the module's
runtime behavior to accommodate the test.)

Cover, with synthetic in-memory entries (no network):

1. **Journal day folds videos, drops resource strays** — a day with 1 journal + 2 YouTube video
   records (learning titles) + 1 Skool `Type=["Learn"]`, `day>0` record → output has exactly 1
   entry (the journal); its `videos` contains the 2 curated videos; the Skool record is gone.
2. **Junk video filtered** — a journal day whose video records include an Arabic/emoji/deny-listed
   title (e.g. contains an emoji, or "livestream") → that video is absent from the journal's
   `videos[]` after bundling.
3. **Journal-less journey day drops strays** — a day with NO journal + 1 video record with `day>0`
   → output has 0 entries for that day.
4. **Historic book preserved** — a day with NO journal + 1 book record `day==0`,
   `type=["Book"]` → output still contains that 1 record unchanged.
5. **One-card-per-day invariant** — feed a mixed list spanning 3 journey days (each with a journal +
   assorted video/resource strays) → assert exactly one journal entry survives per date and no
   surviving entry is a bare video record (`is_video_record` false for all non-journal survivors, or
   simpler: every surviving journey-range entry (`day>0`) has a title starting with "Day ").
6. **Journal-less day-0 video dropped** — a day with NO journal + 1 video record with `day==0`
   (a Content-Queue-graduated video, `source="Content Queue"`, `type=["YouTube"]`) → output has 0
   entries for that day (proves the residual is closed: video records never stand alone regardless
   of `day`).

Tests must pass offline and deterministically.

## PROOF

Run from the worktree root and paste full output:

```
cd /Users/mightydesigncenter/wt/andrewwebber.dev/fix-journey-daily-backfill
python3 -m pytest tests/test_export_bundling.py -v
```

All tests green = proof. (Live Notion backfill + full export regeneration are Claude's post-merge
step, not part of this build.)

## Constraints / non-goals

- DO NOT touch `src/components/journey/DayCard.tsx` or any frontend — rendering is already correct.
- DO NOT touch `generate_journey_entry.py` — it already has `--backfill` + idempotency.
- DO NOT change `curate_videos`, the deny/learn regexes, or `_video_score`.
- DO NOT run the live pipeline, hit Notion, or regenerate `journey-2026.json` — data ops are Claude's.
- DO NOT reformat unrelated code or restyle the files beyond the two targeted functions + new test.
- Preserve historic day-0 records exactly.
