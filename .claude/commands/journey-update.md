---
description: Pull latest journey entries from Notion, update stats, and deploy to andrewwebber.dev
allowed-tools: Bash(python3:*), Bash(git:*), Bash(npm:*), Bash(npx:*)
---

## Context

- Today's date: !`date +%Y-%m-%d`
- Current journey entries: !`python3 -c "import json; d=json.load(open('src/data/journey-2026.json')); print(f\"Day {d['totalDays']} — last updated {d['lastUpdated'][:10]}\")" 2>/dev/null || echo "Unable to read"`
- Git status: !`git status --short`

## Your task

Run the full journey update pipeline in this order. Do not skip steps.

### Step 1 — Pull from Notion

```bash
cd /Users/mightydesigncenter/_Code/andrewwebber.dev && python3 scripts/export-journey-json.py
```

The script writes `src/data/journey-2026.json` directly to this repo. If it errors on the git step, ignore that — the JSON file is already written and we'll commit it ourselves.

After running, confirm the new entry count is higher than the current count shown in Context above. If the count did NOT increase, stop and tell the user — it means Notion has no new entries logged yet.

### Step 2 — Report new entries

Read `src/data/journey-2026.json` and list every new entry added since the previous day count. For each new entry show:
- Day number, date, title
- Type tags (Build / Video / Research)
- Impact level
- Key builds or videos

### Step 3 — Commit and push

```bash
git add src/data/journey-2026.json
git commit -m "feat: journey update — Day <N> through Day <M> (YYYY-MM-DD)"
git push origin main
```

Replace `<N>` and `<M>` with the actual day range.

### Step 4 — Deploy to Vercel

GitHub auto-deploy is disconnected. Must deploy manually:

```bash
cd /Users/mightydesigncenter/_Code/andrewwebber.dev && npx vercel --prod
```

Wait for "Aliased: https://andrewwebber.dev" in output before reporting success.

The following sections auto-update from `journey-2026.json` and `/api/stats` on every deploy — no manual edits needed:
- **Homepage stats** (`§ 01 — Output`): Day Streak counter pulls from `totalDays`
- **Homepage timeline** (`§ 02 — Timeline`, "Now" section): agent count + consecutive days
- **Work page** (`/work`): tools count in hero subtitle

### Step 5 — Confirm deployment

Tell the user:
- How many new days were added
- The new total day count (now showing as "Day Streak")
- That Vercel deployed (not just building — it's done)
- Live URLs: https://andrewwebber.dev and https://andrewwebber.dev/journey
