"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { JourneyData } from "@/lib/journey";

interface StatsHeaderProps {
  data: JourneyData;
}

export function StatsHeader({ data }: StatsHeaderProps) {
  const dayOfYear = data.totalDays;
  const pct = Math.round((dayOfYear / 365) * 100);
  const updated = new Date(data.lastUpdated);
  const formattedDate = updated.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = updated.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="relative mb-16 md:mb-24">
      {/* OPERATOR CARD — centered above the hero on mobile, pinned top-right on lg+ */}
      <motion.div
        className="relative mx-auto mb-10 w-[210px] sm:w-[240px] lg:absolute lg:right-0 lg:top-0 lg:mx-0 lg:mb-0 lg:w-[260px] xl:w-[300px]"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        <Link
          href="/about"
          aria-label="Dossier — about Andrew Webber"
          className="group block"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-white/10 bg-card/30 shadow-[0_0_60px_-20px_rgba(34,197,94,0.25)] transition-shadow duration-500 group-hover:shadow-[0_0_80px_-15px_rgba(34,197,94,0.5)]">
            <Image
              src="/images/portrait/andrew-display.jpg"
              alt="Andrew Webber portrait"
              fill
              sizes="(min-width:1280px) 300px, 260px"
              priority
              className="object-cover grayscale-[35%] contrast-110 brightness-90 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.03]"
            />
            {/* Duotone — terminal-green wash over highlights, dark fade at bottom */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-terminal/15 via-transparent to-background/60 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-30"
            />
            {/* Scanlines */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent 0,transparent 2px,rgba(0,0,0,0.45) 2px,rgba(0,0,0,0.45) 3px)",
              }}
            />
            {/* Corner brackets */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 border-l border-t border-terminal/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 border-r border-t border-terminal/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-12 left-2 h-3.5 w-3.5 border-b border-l border-terminal/70"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-12 right-2 h-3.5 w-3.5 border-b border-r border-terminal/70"
            />
            {/* Live pulse */}
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-3 flex h-2 w-2"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-terminal" />
            </span>
            {/* Caption strip */}
            <div className="absolute inset-x-0 bottom-0 border-t border-terminal/30 bg-background/85 px-3 py-2 backdrop-blur-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-terminal">
                  Operator
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground tabular-nums">
                  Day {data.totalDays}
                </span>
              </div>
              <div className="mt-0.5 flex items-baseline justify-between gap-2">
                <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                  Andrew W.
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/70">
                  {data.currentEra.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
            </div>
          </div>
          {/* Location stamp */}
          <div className="mt-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/70">
            <span className="h-px w-4 bg-warm/60" />
            <span>Ft Worth · TX · 32.7N 97.3W</span>
          </div>
        </Link>
      </motion.div>

      {/* HERO — clears the portrait column on lg+ */}
      <div className="lg:pr-[320px] xl:pr-[360px]">
        <div className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.4em] text-terminal">
          § Journey — 2026
        </div>

        <h1 className="crop mb-6 font-extrabold leading-[0.88] text-[clamp(48px,8vw,120px)]">
          The <span className="text-terminal">daily</span> grind.
        </h1>

        <p className="mb-10 max-w-3xl text-2xl leading-relaxed text-muted-foreground">
          {data.totalDays} days into the journey.{" "}
          <span className="text-foreground">{data.currentEra}</span> era.
        </p>

        <div className="max-w-xl">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Day {dayOfYear} of 365
            </span>
            <span className="font-mono text-xs text-terminal">{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div
              className="h-full rounded-full bg-terminal"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
          <div className="mt-3 font-mono text-xs tracking-wider text-muted-foreground">
            Last updated {formattedDate} at {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
}
