"""One-shot updater for journey Day 154 — beef up takeaway + commits."""
import json
import pathlib

P = pathlib.Path(__file__).resolve().parent.parent / "src" / "data" / "journey-2026.json"

d = json.loads(P.read_text())
day = [x for x in d["entries"] if x["day"] == 154][0]

day["title"] = "Day 154 - Insomniac Ship Day: Portrait, Music, Featured, About Rebuild"
day["impact"] = "High"
day["category"] = ["Design", "Frontend", "Automation", "Agents", "DevOps"]
day["type"] = ["Build", "Milestone", "Refactor", "Design"]

day["builds"] = [{
    "repo": "andrewwebber.dev",
    "commits": [
        "feat(library): merge LEARNING LIBRARY into AWD dossier + journey",
        "feat(stats): refresh stats + 4 journey entries (150-153) + radar fix",
        "Merge pull request #1 from ninjaforhire/learning-library-merge",
        "feat(work): SPECTRE + PANDORA'S FORGE flagship Featured + Live·iterating badge",
        "fix(audio): SoundPicker desktop menu pops upward in NavRail (direction prop)",
        "feat(audio): 6 focus modes — Pink, Brown, Binaural γ, Lo-fi pad ♪, Cinematic drone ♪, Silence",
        "feat(portrait): MatrixRain + PortraitFigure — TV-glitch loop, body-anchored embed",
        "feat(scanner): top-level SPECTRE entry + PANDORA'S FORGE rebrand in scan-tools.py",
        "feat(about): chaptered story, kill Character Sheet radar, plate Contact section",
        "feat(formatter): file paths blue + URLs green in journey takeaways",
    ],
}]

paragraphs = [
    "Insomniac ship day — started 12:30am, ended ~9pm. Single session, four product surfaces overhauled.",

    "**PANDORA'S FORGE** + **SPECTRE** promoted to flagship status on /work. Old sub-module features pulled, replaced with the two top-level platforms. Cards bumped 2-col + larger, **Live · iterating** pulse badge added so the always-shipping nature reads at a glance. Scanner in `scripts/scan-tools.py` now emits a parent SPECTRE entry alongside the 13 modules. Forge copy rewritten to land the 11-wing creative AI suite; SPECTRE copy rewritten to land the full-spectrum recon + red/blue/purple + AI-sec stack.",

    "Music focus picker overhauled. Dropped Isochronic α. Added Pink noise, Lo-fi pad ♪, Cinematic drone ♪ — 6 modes total, music-note icon for the musical ones. All synthesized in WebAudio in `src/components/animation/FocusAudio.tsx` (Paul Kellet pink filter, random-walk brown, 200/240Hz binaural, detuned-saw lo-fi, sub+air drone). Zero asset weight. Desktop NavRail SoundPicker was popping downward off-screen — added a `direction` prop, opens upward when anchored to viewport bottom now.",

    "About page rebuilt from the ground up. Replaced the wall of text with a chaptered 6-year story (1996 origin → Now) — each chapter a year marker + tag + bold hook + body line. Killed the giant Character Sheet radar; the strip stats up top are enough. Wired in the embedded portrait: fixed `src/components/portrait/MatrixRain.tsx` (46 columns mixing SPECTRE / business / agent words with binary) + scrollable `src/components/portrait/PortraitFigure.tsx` running a 3s lineart → 350ms TV-glitch transition → 3s photo loop. Photo + lineart anchored to bottom-right so the body rises from the viewport bottom. Contact section gets an 80% backdrop-blur plate. Image pipeline: Canny edges + CLAHE for right-side detail → SVG paths, Otsu body mask for the silhouette, all from a single 800px source headshot.",

    "**Refreshed stats: LOC 2.03M → 2.05M, tools 149 → 157, dayStreak 153 → 154.** PR pending for the portrait + about + music + featured combo. Read it live at [andrewwebber.dev/about](https://andrewwebber.dev/about) once it deploys.",

    "_YouTube watched today: none — pure build session. Pre-154 entries pending YouTube history backfill in a future update._",
]
day["takeaway"] = "\n\n".join(paragraphs)

P.write_text(json.dumps(d, indent=2, ensure_ascii=False))
print(f"OK day 154 rewritten — takeaway {len(day['takeaway'])} chars, {len(day['builds'][0]['commits'])} commits")
