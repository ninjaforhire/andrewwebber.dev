"use client";

import { TypeWriter } from "@/components/animation/TypeWriter";

export function HeroSection() {
  return (
    <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-8">
      <div className="text-center">
        {/* Terminal prompt */}
        <div className="mb-6 font-mono text-xs text-muted-foreground">
          <TypeWriter
            text="$ whoami"
            speed={80}
            delay={2800}
            cursor={false}
          />
        </div>

        {/* Name - hero typography */}
        <h1 className="font-heading leading-none tracking-tight">
          <span className="block text-7xl font-bold text-foreground md:text-8xl">
            Andrew
          </span>
          <span className="block text-7xl font-bold text-data md:text-8xl">
            Webber
          </span>
        </h1>
        <p className="mt-2 text-right font-mono text-2xl font-light text-creative md:text-3xl">
          .dev
        </p>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-md text-base text-muted-foreground">
          Builder. Automation architect. Creative coder.
          <br />
          <span className="text-sm">Fort Worth, TX</span>
        </p>

        {/* Quick stats preview */}
        <div className="mt-10 flex items-center justify-center gap-6 font-mono text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-terminal" />
            <span className="text-terminal">170+ tools</span>
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-data" />
            <span className="text-data">377K+ LOC</span>
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-creative" />
            <span className="text-creative">20 yrs building</span>
          </span>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 animate-bounce text-muted-foreground/50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
