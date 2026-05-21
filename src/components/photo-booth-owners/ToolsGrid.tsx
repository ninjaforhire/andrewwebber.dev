"use client";

import { useState } from "react";
import { ToolCard, type MightyTool } from "./ToolCard";
import { cn } from "@/lib/utils";

const CATEGORIES = ["all", "ops", "sales", "design", "marketing", "finance"];

export function ToolsGrid({ tools }: { tools: MightyTool[] }) {
  const [active, setActive] = useState("all");

  const filtered = active === "all" ? tools : tools.filter((t) => t.category === active);

  return (
    <div>
      {/* Filter pills */}
      <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              "shrink-0 snap-start rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors touch-target",
              active === cat
                ? "bg-warm/10 text-warm border border-warm/30"
                : "text-muted-foreground border border-white/10 hover:border-white/30"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>

      <p className="mt-6 font-mono text-xs text-muted-foreground">
        {filtered.length} of {tools.length} tools shown — more run internally, never shown publicly.
      </p>
    </div>
  );
}
