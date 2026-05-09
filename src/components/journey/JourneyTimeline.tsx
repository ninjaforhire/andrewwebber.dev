"use client";

import { motion } from "framer-motion";
import type { JourneyEntry } from "@/lib/journey";
import { DayCard } from "./DayCard";

interface JourneyTimelineProps {
  entries: JourneyEntry[];
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function JourneyTimeline({ entries }: JourneyTimelineProps) {
  let lastMonth = "";
  let lastEra = "";

  return (
    <div className="relative">
      <div className="absolute left-[15px] md:left-[15px] top-0 bottom-0 w-px bg-white/5 hidden md:block" />

      <div className="space-y-0">
        {entries.map((entry, i) => {
          const monthKey = getMonthKey(entry.date);
          const showMonth = monthKey !== lastMonth;
          const showEra = entry.era !== lastEra;
          lastMonth = monthKey;
          lastEra = entry.era;

          return (
            <div key={`${entry.day}-${entry.date}`}>
              {showEra && i > 0 && (
                <div className="relative flex items-center gap-4 md:gap-6 my-6">
                  <div className="hidden md:flex h-3 w-8 items-center justify-center">
                    <div className="h-3 w-3 rounded-full border border-white/10 bg-background" />
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {entry.era} begins
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                </div>
              )}

              {showMonth && (
                <div className="relative flex items-center gap-4 md:gap-6 mb-4 mt-8 first:mt-0">
                  <div className="hidden md:block w-8" />
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {monthKey}
                  </div>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <DayCard entry={entry} />
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
