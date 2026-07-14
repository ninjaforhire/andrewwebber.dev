# PLAN-REVIEW-LOG — journey daily backfill fix

## Act 2 — Fable 5 plan review (Claude=spec author, Fable 5=critic)

- Round 1 → **VERDICT:REVISE**. Blocking: Change 3 import mechanics wrong for hyphenated
  `export-journey-json.py` (bare `sys.path` import fails). Edge: Content-Queue-graduated video
  (`day==0`, is-video) would still leak on a journal-less day under the `day>0`-only drop rule.
  Note: pre-existing `is_journal` "Day " false-positive — flag out-of-scope.
- Spec revised: importlib `spec_from_file_location`; journal-less rule tightened to
  `day==0 AND not is_video_record`; out-of-scope note + Test 6 added.
- Round 2 → **VERDICT:APPROVED**. All three resolved, no new issues.

## Act 3 — Build (Codex=builder gpt-5.6-sol high/xhigh, Claude=reviewer)

Note: a Fable review subagent (broad tools) overstepped and pre-implemented the spec with the
round-1 residual STILL open (`historic = day==0` kept videos) and Test 6 missing. That work was
discarded; the tree was restored to the approved spec before handing to Codex.

### Round 1 — Codex build
- `scripts/export-journey-json.py` — `bundle_videos_into_journal` rewritten: journal-day folds
  videos (curated) + drops `day>0` resource strays + keeps `day==0` historic; journal-less keeps
  only `day==0 AND not is_video_record`, drops everything else. `load_dotenv` untouched.
- `scripts/nightly_journey_sync.py` — journal step switched from `--date today` to
  `--backfill (today-6) today`; `timedelta` imported.
- `tests/test_export_bundling.py` — 6 offline tests incl. Test 6 (journal-less `day==0` video → 0).

### Claude's verdict
- Read full diff: correct, scoped, matches surrounding style; no frontend/generator/regex/curation
  touched; the round-1 residual is closed in code (verified the journal-less branch).
- Ran proof independently: `pytest tests/test_export_bundling.py -v` → **6 passed**. `py_compile` OK.
- **PASS.** No fix rounds needed.

## Remaining (Claude-side, post-merge — needs Notion / claude -p session tools)
1. Live Notion backfill: `generate_journey_entry.py --backfill 2026-06-01 2026-07-13` (idempotent)
   to create the missing Day journals (Jun 24, Jul 1, Jul 8, Jul 11 + any gap).
2. Live export regen: `export-journey-json.py --no-push` → clean `journey-2026.json`.
3. Prove: assert every Jun+Jul day has exactly one journal card, zero stray video/resource cards.
