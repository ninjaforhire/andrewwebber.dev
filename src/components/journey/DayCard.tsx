"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, GitCommit, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ERA_COLORS, IMPACT_COLORS } from "@/lib/journey";
import { TypeBadge } from "./TypeBadge";
import { FormattedTakeaway } from "./FormattedTakeaway";
import type { JourneyEntry } from "@/lib/journey";

interface DayCardProps {
  entry: JourneyEntry;
}

export function DayCard({ entry }: DayCardProps) {
  const [open, setOpen] = useState(false);
  const eraColors = ERA_COLORS[entry.era] ?? "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
  const impactColor = IMPACT_COLORS[entry.impact] ?? "text-zinc-400";
  const hasDetails = entry.videos.length > 0 || entry.builds.length > 0 || entry.takeaway;

  const formatted = new Date(entry.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative flex gap-4 md:gap-6">
      <div className="relative flex flex-col items-center pt-1">
        <div
          className={cn(
            "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-mono font-bold",
            eraColors
          )}
        >
          {entry.day}
        </div>
        <div className="hidden md:block w-px flex-1 bg-white/5" />
      </div>

      <motion.div
        layout
        className={cn(
          "flex-1 mb-4 rounded-xl border border-white/5 bg-card/40 backdrop-blur-sm transition-colors",
          "hover:border-white/10 hover:bg-card/60",
          open && "border-white/10 bg-card/60"
        )}
      >
        <button
          onClick={() => hasDetails && setOpen(!open)}
          className="w-full px-4 py-3 md:px-5 md:py-4 text-left"
          disabled={!hasDetails}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0 font-mono text-xs text-muted-foreground tracking-wider">
                {formatted}
              </span>
              <h3 className="text-base md:text-lg font-semibold truncate">
                {entry.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex gap-1">
                {entry.type.map((t) => (
                  <TypeBadge key={t} type={t} />
                ))}
              </div>
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full shrink-0",
                  impactColor.replace("text-", "bg-")
                )}
                title={`${entry.impact} impact`}
              />
              {hasDetails && (
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-muted-foreground transition-transform duration-200",
                    open && "rotate-180"
                  )}
                />
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider",
                eraColors
              )}
            >
              {entry.era}
            </span>
            {entry.category.map((cat) => (
              <span
                key={cat}
                className="font-mono text-[11px] text-muted-foreground tracking-wider"
              >
                {cat}
              </span>
            ))}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {open && hasDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-white/5 px-4 py-3 md:px-5 md:py-4 space-y-3">
                {entry.videos.length > 0 && (
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-red-400 mb-1.5">
                      Videos
                    </div>
                    {entry.videos.map((v, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Play size={12} className="mt-0.5 shrink-0 text-red-400" />
                        <div>
                          {v.url ? (
                            <a
                              href={v.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground hover:text-red-400 transition-colors underline decoration-white/20 hover:decoration-red-400"
                            >
                              {v.title}
                            </a>
                          ) : (
                            <span className="text-foreground">{v.title}</span>
                          )}
                          <span className="text-muted-foreground"> — {v.channel}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {entry.builds.length > 0 && (
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-blue-400 mb-1.5">
                      Builds
                    </div>
                    {entry.builds.map((b, i) => (
                      <div key={i} className="space-y-1">
                        <span className="font-mono text-xs text-data">{b.repo}</span>
                        {b.commits.map((c, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <GitCommit size={12} className="mt-0.5 shrink-0 text-blue-400" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {entry.takeaway && (
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-terminal mb-2">
                      Takeaway
                    </div>
                    <FormattedTakeaway text={entry.takeaway} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
