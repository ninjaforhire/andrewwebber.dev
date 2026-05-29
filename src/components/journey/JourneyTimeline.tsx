"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JourneyEntry } from "@/lib/journey";
import { DayCard } from "./DayCard";

interface JourneyTimelineProps {
  entries: JourneyEntry[];
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function getCurrentMonthKey(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

interface AnnotatedEntry {
  entry: JourneyEntry;
  showEra: boolean;
  isFirstEverEra: boolean;
}

interface MonthGroup {
  key: string;
  items: AnnotatedEntry[];
}

export function JourneyTimeline({ entries }: JourneyTimelineProps) {
  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);

  const groups = useMemo<MonthGroup[]>(() => {
    const out: MonthGroup[] = [];
    let lastEra = "";
    let seenAny = false;

    for (const entry of entries) {
      const showEra = seenAny && entry.era !== lastEra;
      const isFirstEverEra = !seenAny;
      lastEra = entry.era;
      seenAny = true;

      const key = getMonthKey(entry.date);
      const last = out[out.length - 1];
      const annotated: AnnotatedEntry = { entry, showEra, isFirstEverEra };
      if (!last || last.key !== key) {
        out.push({ key, items: [annotated] });
      } else {
        last.items.push(annotated);
      }
    }
    return out;
  }, [entries]);

  const [toggled, setToggled] = useState<Set<string>>(new Set());

  const isOpen = (key: string): boolean => {
    const defaultOpen = key === currentMonthKey;
    return toggled.has(key) ? !defaultOpen : defaultOpen;
  };

  const handleToggle = (key: string) => {
    setToggled((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="relative">
      <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/5 hidden md:block" />

      <div className="space-y-0">
        {groups.map((group) => {
          const open = isOpen(group.key);
          const isCurrent = group.key === currentMonthKey;

          return (
            <div key={group.key}>
              <button
                onClick={() => handleToggle(group.key)}
                className={cn(
                  "group/month relative flex w-full items-center gap-4 md:gap-6 mb-4 mt-8 first:mt-0 text-left",
                  "transition-colors"
                )}
                aria-expanded={open}
                aria-label={`${group.key} (${group.items.length} entries)`}
              >
                <div className="hidden md:block w-8" />
                <div className="flex flex-1 items-center gap-3">
                  <ChevronDown
                    size={12}
                    className={cn(
                      "text-muted-foreground/60 transition-transform duration-200",
                      open ? "rotate-0" : "-rotate-90"
                    )}
                  />
                  <span
                    className={cn(
                      "font-mono text-xs uppercase tracking-widest transition-colors",
                      isCurrent
                        ? "text-warm group-hover/month:text-warm/80"
                        : "text-muted-foreground group-hover/month:text-foreground"
                    )}
                  >
                    {group.key}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50">
                    {group.items.length} {group.items.length === 1 ? "entry" : "entries"}
                    {isCurrent && " · current"}
                  </span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-0 pb-2">
                      {group.items.map(({ entry, showEra, isFirstEverEra }) => (
                        <div key={`${entry.day}-${entry.date}`}>
                          {showEra && !isFirstEverEra && (
                            <div className="relative flex items-center gap-4 md:gap-6 my-6">
                              <div className="hidden md:flex h-3 w-8 items-center justify-center">
                                <div className="h-3 w-3 rounded-full border border-white/10 bg-background" />
                              </div>
                              <div className="flex-1 flex items-center gap-3">
                                <div className="h-px flex-1 bg-white/10" />
                                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                                  {entry.era} begins
                                </span>
                                <div className="h-px flex-1 bg-white/10" />
                              </div>
                            </div>
                          )}

                          <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.35, delay: 0.05 }}
                          >
                            <DayCard entry={entry} />
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
