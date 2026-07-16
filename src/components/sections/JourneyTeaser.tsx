"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MILESTONES = [
  {
    year: "2006",
    title: "Lakeview Centennial — television production magnet.",
    description:
      "Garland's TV production magnet program. Wrapped cables, ran cameras for newscasts and Friday-night football, learned CGI titling, and edited everything in Final Cut Pro. The core production skills that still inform every decision — pacing, framing, how to deliver under a live deadline — started here.",
    details: [
      "Cable wrapping the right way (over-under, no twists)",
      "Studio + ENG cameras — newscast desk + sideline football",
      "CGI lower-thirds and broadcast titling",
      "Final Cut Pro — first real editing environment",
      "Live broadcast pressure: no second takes",
    ],
  },
  {
    year: "2016",
    title: "Founded MIGHTY Photo Booths.",
    description:
      "December 5th. Premium experiences for brands that demand more than a backdrop and a button.",
  },
  {
    year: "2022",
    title: "The Learning Era.",
    description:
      "52 audiobooks. 21 certifications. 7 self-study courses. Google IT Support, Python, cybersecurity, SEO, Dante audio networking, Photoshop, leadership. Stacking skills while running a business full-time.",
    details: [
      "Google IT Support Certificate — Coursera",
      "Python 101 for Hackers — TCM Security",
      "Programming with AI — TCM Security",
      "OOP Design + Learning Python — LinkedIn",
      "SEMrush SEO Suite — 3 certifications",
      "Dante Audio Networking — Levels 1-3",
      "Advanced LinkedIn for Photo Booth Owners — PBM Academy",
      "52 audiobooks on business, psychology, and strategy → /about#credentials",
    ],
    link: "/about#credentials",
  },
  {
    year: "2023",
    title: "MIGHTY goes full-time.",
    description:
      "January 1. Every contract expired and I let them go. Walked away from the safety net to bet everything on MIGHTY Photo Booths, the year we broke our first $100,000 in revenue. Eyes open to eyes closed, usually 2 or 3am. A year of conviction, manual processes, and proving myself.",
    details: [
      "Hired a creative partner for design — Matt changed the game",
      "Tried to hire an executive assistant three times — all three quit",
      "Every quote, every email, every follow-up — done by hand",
      "The EA frustration became the spark: what if AI could do this?",
      "December 26, 2025 — the journey begins →",
    ],
    link: "/journey",
  },
  {
    year: "Now",
    title: "Systems architect. Agentic engineer. Cybersecurity expert.",
    description:
      "Custom orchestrators, autonomous agent pipelines, offensive security platforms. From OSINT engines to production deployment — full stack, every layer.",
    details: [
      "{agents} autonomous agents orchestrated by a custom dispatch system",
      "SPECTRE — offensive security + OSINT platform (Docker, Nmap, Nuclei)",
      "{skills} Claude Code skills powering daily operations",
      "{loc} lines of code across {repos} repositories",
      "Shipping daily — {days} consecutive days and counting",
    ],
  },
];

interface Stats {
  agentsLive: number;
  dayStreak: number;
  skills: number;
  repos: number;
  linesOfCode: number;
}

const STATS_FALLBACK: Stats = {
  agentsLive: 47,
  dayStreak: 272,
  skills: 399,
  repos: 47,
  linesOfCode: 2916521,
};

export function JourneyTeaser() {
  const [stats, setStats] = useState<Stats>(STATS_FALLBACK);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((s) =>
        setStats({
          agentsLive: s.agentsLive || STATS_FALLBACK.agentsLive,
          dayStreak: s.dayStreak || STATS_FALLBACK.dayStreak,
          skills: s.skills || STATS_FALLBACK.skills,
          repos: s.repos || STATS_FALLBACK.repos,
          linesOfCode: s.linesOfCode || STATS_FALLBACK.linesOfCode,
        }),
      )
      .catch(() => {});
  }, []);

  const fillTemplate = (s: string) =>
    s
      .replaceAll("{agents}", String(stats.agentsLive))
      .replaceAll("{skills}", String(stats.skills))
      .replaceAll("{loc}", stats.linesOfCode.toLocaleString())
      .replaceAll("{repos}", String(stats.repos))
      .replaceAll("{days}", String(stats.dayStreak));

  const milestones = MILESTONES.map((m) => {
    if (m.year !== "Now") return m;
    return {
      ...m,
      details: (m.details as string[]).map(fillTemplate),
    };
  });

  return (
    <section className="page-x section-y border-t border-white/5">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-creative mb-16 md:mb-24">
        § 02 — Timeline
      </div>

      <div className="space-y-24 md:space-y-32">
        {[...milestones].reverse().map((m) => (
          <div
            key={m.year}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start"
          >
            <div className="md:col-span-3">
              <div className="crop text-[clamp(72px,10vw,120px)] font-extrabold text-creative leading-none">
                {m.year}
              </div>
            </div>
            <div className="md:col-span-8 md:col-start-5">
              <h3 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 crop">
                {m.title}
              </h3>
              <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground">
                {m.description}
              </p>
              {"details" in m && m.details && (
                <ul className="mt-6 space-y-2">
                  {(m.details as string[]).map((d, i) => {
                    const isLinkItem = "link" in m && m.link && d.includes("→");
                    return (
                      <li
                        key={d}
                        className="flex items-start gap-3 text-base md:text-lg text-muted-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-creative" />
                        {isLinkItem ? (
                          <Link
                            href={m.link as string}
                            className="text-creative hover:text-foreground transition-colors font-semibold"
                          >
                            {d}
                          </Link>
                        ) : (
                          d
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
