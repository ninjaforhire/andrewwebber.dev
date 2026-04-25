"use client";

import { TypeWriter } from "@/components/animation/TypeWriter";

const MILESTONES = [
  {
    year: "2006",
    label: "Live Events in DFW",
    description: "Started in the live events industry",
    accent: "text-warm",
    dot: "bg-warm",
  },
  {
    year: "2016",
    label: "MIGHTY Photo Booths",
    description: "Founded December 5th. Premium photo experiences.",
    accent: "text-creative",
    dot: "bg-creative",
  },
  {
    year: "Now",
    label: "AI & Automation",
    description: "170+ tools. 377K+ lines. Building the future.",
    accent: "text-terminal",
    dot: "bg-terminal",
  },
];

export function JourneyTeaser() {
  return (
    <section className="relative z-10 mx-auto max-w-2xl px-8 py-24">
      <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        <TypeWriter text="$ git log --oneline --reverse" speed={40} cursor={false} />
      </p>

      <div className="space-y-8">
        {MILESTONES.map((m) => (
          <div key={m.year} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`h-3 w-3 rounded-full ${m.dot}`} />
              <div className="h-full w-px bg-border" />
            </div>
            <div>
              <p className={`font-mono text-sm font-medium ${m.accent}`}>
                {m.year}
              </p>
              <p className="font-heading text-lg font-bold">{m.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {m.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="/about"
          className="font-mono text-xs text-data transition-colors hover:text-terminal"
        >
          Read the full story →
        </a>
      </div>
    </section>
  );
}
