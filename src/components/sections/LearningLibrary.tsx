"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import coursesData from "@/data/courses.json";
import { cn } from "@/lib/utils";

interface CourseItem {
  title: string;
  type: string;
  source: string;
  status: string;
  date: string | null;
  author: string;
  duration: string | null;
  rating: number | null;
  url: string | null;
  cover: string | null;
  asin: string | null;
  category: string | null;
}

const SOURCE_BADGE: Record<string, string> = {
  Audible: "text-warm bg-warm/10 border-warm/20",
  Skillshare: "text-creative bg-creative/10 border-creative/20",
  "Photo Booth Marketing": "text-data bg-data/10 border-data/20",
  YouTube: "text-terminal bg-terminal/10 border-terminal/20",
  LinkedIn: "text-data bg-data/10 border-data/20",
  Other: "text-muted-foreground bg-muted/40 border-border",
};

const TYPE_FILTERS = ["All", "Books", "Courses"] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

function stripSubtitle(title: string): string {
  return title.split(" - ")[0].split(":")[0].trim();
}

function getYear(date: string | null): string {
  return date ? date.slice(0, 4) : "—";
}

export function LearningLibrary() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | "Done" | "In progress">("All");

  const items = coursesData.items as CourseItem[];

  const sources = useMemo(
    () => Array.from(new Set(items.map((i) => i.source))).sort(),
    [items]
  );

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (typeFilter === "Books" && i.type !== "Book") return false;
      if (typeFilter === "Courses" && i.type !== "Course") return false;
      if (sourceFilter && i.source !== sourceFilter) return false;
      if (statusFilter !== "All" && i.status !== statusFilter) return false;
      return true;
    });
  }, [items, typeFilter, sourceFilter, statusFilter]);

  const doneCount = items.filter((i) => i.status === "Done").length;

  return (
    <div>
      {/* HEADER STATS STRIP */}
      <div className="mb-8 flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span>
          <span className="text-data font-bold">{items.length}</span> total
        </span>
        <span className="text-border">/</span>
        <span>
          <span className="text-terminal font-bold">{doneCount}</span> completed
        </span>
        <span className="text-border">/</span>
        <span>
          <span className="text-warm font-bold">
            {items.filter((i) => i.type === "Book").length}
          </span>{" "}
          books
        </span>
        <span className="text-border">/</span>
        <span>
          <span className="text-creative font-bold">
            {items.filter((i) => i.type === "Course").length}
          </span>{" "}
          courses
        </span>
      </div>

      {/* FILTERS */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-2">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                typeFilter === t
                  ? "bg-creative/10 text-creative"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <span className="text-border">·</span>

        <div className="flex gap-2">
          {(["All", "Done", "In progress"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                statusFilter === s
                  ? "bg-terminal/10 text-terminal"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="text-border">·</span>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSourceFilter(null)}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
              !sourceFilter
                ? "bg-data/10 text-data"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All sources
          </button>
          {sources.map((s) => (
            <button
              key={s}
              onClick={() => setSourceFilter(s === sourceFilter ? null : s)}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
                s === sourceFilter
                  ? "bg-data/10 text-data"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {filtered.map((c, i) => {
          const Wrapper = c.url ? "a" : "div";
          const wrapperProps = c.url
            ? { href: c.url, target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <Wrapper
              key={`${c.title}-${i}`}
              {...wrapperProps}
              className={cn(
                "group flex items-center gap-4 rounded-md border border-border bg-card/30 px-3 py-2 transition-colors",
                c.url && "hover:border-creative/40 cursor-pointer"
              )}
            >
              {/* COVER THUMB */}
              <div className="relative flex h-14 w-10 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted/40">
                {c.cover ? (
                  <Image
                    src={c.cover}
                    alt={`Cover: ${stripSubtitle(c.title)}`}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-mono text-[9px] uppercase text-muted-foreground">
                    {c.type === "Book" ? "📖" : "🎓"}
                  </span>
                )}
              </div>

              {/* TITLE + AUTHOR */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight">
                  {stripSubtitle(c.title)}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.author || c.category || c.source}
                  {c.duration ? ` · ${c.duration}` : ""}
                </p>
              </div>

              {/* META */}
              <div className="flex shrink-0 items-center gap-2">
                {c.rating != null && (
                  <span className="hidden font-mono text-[10px] tabular-nums text-warm md:inline">
                    ★ {c.rating.toFixed(1)}
                  </span>
                )}
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {getYear(c.date)}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                    SOURCE_BADGE[c.source] ?? SOURCE_BADGE.Other
                  )}
                >
                  {c.source}
                </span>
                {c.status === "In progress" && (
                  <span className="hidden rounded-full border border-data/20 bg-data/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-data sm:inline">
                    In progress
                  </span>
                )}
              </div>
            </Wrapper>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
          No results for this filter.
        </p>
      )}
    </div>
  );
}
