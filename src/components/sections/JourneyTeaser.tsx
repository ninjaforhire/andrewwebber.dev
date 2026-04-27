"use client";

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
    year: "Now",
    title: "Building AI agents at scale.",
    description:
      "170+ tools. Custom orchestrators, automation pipelines, creative code. Shipping daily.",
  },
];

export function JourneyTeaser() {
  return (
    <section className="px-12 sm:px-16 md:px-24 py-32 md:py-40 border-t border-white/5">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-creative mb-16 md:mb-24">
        § 02 — Timeline
      </div>

      <div className="space-y-24 md:space-y-32">
        {MILESTONES.map((m) => (
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
