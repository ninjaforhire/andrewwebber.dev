"use client";

export function HeroSection() {
  return (
    <section className="min-h-[100dvh] px-12 sm:px-16 md:px-24 pt-16 pb-12 flex flex-col justify-between relative overflow-hidden">
      {/* Soft radial glow behind the name */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(0,255,65,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Top meta bar */}
      <div className="relative flex justify-between items-start">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-muted-foreground">
          AI Architect · Fort Worth, TX
        </div>
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" />
          Available · 2026
        </div>
      </div>

      {/* Massive cropped name — brushed steel + animated sheen */}
      <div className="relative">
        <h1 className="crop font-extrabold leading-[0.82] hero-glow relative">
          <span className="block text-[clamp(80px,16vw,260px)] hero-steel">Andrew</span>
          <span className="block text-[clamp(80px,16vw,260px)] -mt-2 sm:-mt-4">
            <span className="hero-shine">Webber</span>
            <span className="text-[clamp(24px,4vw,72px)] font-mono font-medium tracking-tight align-top text-muted-foreground ml-2">
              .dev
              <span className="caret-blink text-terminal">_</span>
            </span>
          </span>
        </h1>
      </div>

      {/* Bottom row — descriptor + scroll hint */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 max-w-7xl">
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
