import importlib.util
import pathlib


_p = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "export-journey-json.py"
_spec = importlib.util.spec_from_file_location("export_journey_json", _p)
export_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(export_mod)
bundle_videos_into_journal = export_mod.bundle_videos_into_journal
curate_videos = export_mod.curate_videos


def test_journal_day_folds_videos_and_drops_resource_strays():
    journal = {
        "day": 195,
        "date": "2026-07-08",
        "title": "Day 195",
        "videos": [],
        "builds": [{"repo": "site", "commits": ["Fix journey"]}],
        "takeaway": "Keep the timeline clean.",
    }
    videos = [
        {
            "day": 195,
            "date": "2026-07-08",
            "title": "Build an AI Agent with Claude Code",
            "source": "YouTube",
            "type": ["YouTube"],
            "channel": "Agent Academy",
            "url": "https://youtube.example/agent",
            "runtime_min": 24,
            "category": ["AI/ML"],
        },
        {
            "day": 195,
            "date": "2026-07-08",
            "title": "GitHub Workflow Automation Tutorial",
            "source": "YouTube",
            "type": ["Video"],
            "channel": "Developer School",
            "url": "https://youtube.example/workflow",
            "runtime_min": 18,
            "category": ["DevOps"],
        },
    ]
    resource = {
        "day": 195,
        "date": "2026-07-08",
        "title": "Prompt Library",
        "source": "Skool",
        "type": ["Learn"],
    }

    result = bundle_videos_into_journal([journal, *videos, resource])

    assert result == [journal]
    assert {video["title"] for video in journal["videos"]} == {
        "Build an AI Agent with Claude Code",
        "GitHub Workflow Automation Tutorial",
    }


def test_junk_video_is_filtered_from_journal():
    journal = {
        "day": 196,
        "date": "2026-07-09",
        "title": "Day 196",
        "videos": [],
        "builds": [],
        "takeaway": "Reviewed an agent workflow.",
    }
    learning_video = {
        "day": 196,
        "date": "2026-07-09",
        "title": "Claude Agent Workflow Guide",
        "source": "YouTube",
        "type": ["YouTube"],
        "channel": "AI Builder",
        "url": "https://youtube.example/guide",
        "runtime_min": 20,
        "category": ["AI/ML"],
    }
    junk_video = {
        "day": 196,
        "date": "2026-07-09",
        "title": "🔴 AI livestream",
        "source": "YouTube",
        "type": ["YouTube"],
        "channel": "Random Stream",
        "url": "https://youtube.example/live",
        "runtime_min": 180,
        "category": ["AI/ML"],
    }

    result = bundle_videos_into_journal([journal, learning_video, junk_video])

    expected = curate_videos(
        [
            {
                "title": video["title"],
                "channel": video["channel"],
                "url": video["url"],
                "runtime_min": video["runtime_min"],
                "category": video["category"],
            }
            for video in (learning_video, junk_video)
        ]
    )
    assert result[0]["videos"] == expected
    assert [video["title"] for video in result[0]["videos"]] == [
        "Claude Agent Workflow Guide"
    ]


def test_journal_less_journey_day_drops_strays():
    video = {
        "day": 181,
        "date": "2026-06-24",
        "title": "Claude Code Agent Tutorial",
        "source": "YouTube",
        "type": ["YouTube"],
        "url": "https://youtube.example/missed-day",
    }

    assert bundle_videos_into_journal([video]) == []


def test_historic_book_is_preserved():
    book = {
        "day": 0,
        "date": "2023-04-12",
        "title": "The Pragmatic Programmer",
        "source": "Audible",
        "type": ["Book"],
    }

    assert bundle_videos_into_journal([book]) == [book]


def test_every_journey_day_has_exactly_one_journal_card():
    entries = []
    dates = ["2026-07-10", "2026-07-11", "2026-07-12"]
    for day, date_value in enumerate(dates, start=197):
        entries.extend(
            [
                {
                    "day": day,
                    "date": date_value,
                    "title": f"Day {day}",
                    "videos": [],
                    "builds": [],
                    "takeaway": f"Takeaway for day {day}",
                },
                {
                    "day": day,
                    "date": date_value,
                    "title": f"Claude Code Tutorial {day}",
                    "source": "YouTube",
                    "type": ["YouTube"],
                    "url": f"https://youtube.example/{day}",
                    "runtime_min": 15,
                },
                {
                    "day": day,
                    "date": date_value,
                    "title": f"Agent Prompt Resource {day}",
                    "source": "Skool",
                    "type": ["Tool"],
                },
            ]
        )

    result = bundle_videos_into_journal(entries)

    assert len(result) == 3
    assert {entry["date"] for entry in result} == set(dates)
    assert all(
        int(entry.get("day") or 0) == 0
        or (entry.get("title") or "").startswith("Day ")
        for entry in result
    )


def test_journal_less_day_zero_video_is_dropped():
    video = {
        "day": 0,
        "date": "2026-07-01",
        "title": "Build a Claude Agent",
        "source": "Content Queue",
        "type": ["YouTube"],
        "url": "https://youtube.example/content-queue",
    }

    assert bundle_videos_into_journal([video]) == []
