"use client";

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
    <div className="mb-16 md:mb-24">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-6">
        § Journey — 2026
      </div>

      <h1 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.88] mb-6">
        The <span className="text-terminal">daily</span> grind.
      </h1>

      <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-10">
        {data.totalDays} days into the journey.{" "}
        <span className="text-foreground">{data.currentEra}</span> era.
      </p>

      <div className="max-w-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
            Day {dayOfYear} of 365
          </span>
          <span className="font-mono text-xs text-terminal">{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-terminal"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </div>
        <div className="mt-3 font-mono text-xs text-muted-foreground tracking-wider">
          Last updated {formattedDate} at {formattedTime}
        </div>
      </div>
    </div>
  );
}
