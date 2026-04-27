"use client";

export function HeroSection() {
  return (
    <section className="min-h-[100dvh] px-12 sm:px-16 md:px-24 pt-16 pb-12 flex flex-col justify-between relative overflow-hidden">
      {/* Top meta bar */}
      <div className="flex justify-between items-start">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-muted-foreground">
          Builder · Fort Worth, TX
        </div>
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" />
          Available · 2026
        </div>
      </div>

      {/* Massive cropped name */}
      <div>
        <h1 className="crop font-extrabold leading-[0.82]">
          <span className="block text-[clamp(80px,16vw,260px)]">Andrew</span>
          <span className="block text-[clamp(80px,16vw,260px)] text-terminal -mt-2 sm:-mt-4">
            Webber
            <span className="text-[clamp(24px,4vw,72px)] font-mono font-medium tracking-tight align-top text-muted-foreground ml-2">
              .dev
            </span>
          </span>
        </h1>
      </div>

      {/* Bottom row — descriptor + scroll hint */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 max-w-7xl">
        <p className="text-2xl sm:text-3xl leading-snug max-w-xl font-medium">
          Builder. Automation architect. Creative coder. Shipping agents and systems that get out of your way.
        </p>
        <div className="font-mono text-sm text-muted-foreground shrink-0">
          ↓ scroll
        </div>
      </div>
    </section>
  );
}
