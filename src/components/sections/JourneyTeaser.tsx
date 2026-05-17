"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const MILESTONES = [
  {
    year: "2006",
    title: "Live events, sound, lights, AV.",
    description:
      "Started in DFW live production. Learned to ship under pressure, on deadlines, with zero margin for error. The discipline transferred.",
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
      "93 Audible books. 19 certifications — Google IT Support, Python, cybersecurity, SEO, Dante audio networking, Photoshop, leadership. Stacking skills while running a business full-time.",
    details: [
      "Google IT Support Certificate — Coursera",
      "Python 101 for Hackers — TCM Security",
      "Programming with AI — TCM Security",
      "OOP Design + Learning Python — LinkedIn",
      "SEMrush SEO Suite — 3 certifications",
      "Dante Audio Networking — Levels 1-3",
      "93 audiobooks on business, psychology, and strategy",
    ],
  },
  {
    year: "2025",
    title: "MIGHTY goes full-time.",
    description:
      "January. Every contract expired — and I let them. Walked away from the safety net to bet everything on MIGHTY Photo Booths. Eyes open to eyes closed, usually 2 or 3am. A year of conviction, manual processes, and proving myself.",
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
    title: "Systems architect. Agentic engineer. Security builder.",
    description:
      "170+ tools. Custom orchestrators, autonomous agent pipelines, offensive security platforms. From OSINT engines to production deployment — full stack, every layer.",
    details: [
      "31 autonomous agents orchestrated by a custom dispatch system",
      "SPECTRE — offensive security + OSINT platform (Docker, Nmap, Nuclei)",
      "193 Claude Code skills powering daily operations",
      "1.3M+ lines of code across 22 repositories",
      "Shipping daily — 143 consecutive days and counting",
    ],
  },
];

export function JourneyTeaser() {
  const [agentsLive, setAgentsLive] = useState(31);
  const [dayStreak, setDayStreak] = useState(143);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((s) => {
        if (s.agentsLive) setAgentsLive(s.agentsLive);
        if (s.dayStreak) setDayStreak(s.dayStreak);
      })
      .catch(() => {});
  }, []);

  const milestones = MILESTONES.map((m) => {
    if (m.year !== "Now") return m;
    return {
      ...m,
      details: [
        `${agentsLive} autonomous agents orchestrated by a custom dispatch system`,
        "SPECTRE — offensive security + OSINT platform (Docker, Nmap, Nuclei)",
        "193 Claude Code skills powering daily operations",
        "1.3M+ lines of code across 22 repositories",
        `Shipping daily — ${dayStreak} consecutive days and counting`,
      ],
    };
  });

  return (
    <section className="px-12 sm:px-16 md:px-24 py-32 md:py-40 border-t border-white/5">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-creative mb-16 md:mb-24">
        § 02 — Timeline
      </div>

      <div className="space-y-24 md:space-y-32">
        {milestones.map((m) => (
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
