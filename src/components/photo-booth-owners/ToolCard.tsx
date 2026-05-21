"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MightyTool {
  slug: string;
  name: string;
  description: string;
  category: string;
  source: "skill" | "agent";
  blurb?: string;
  time_saved_per_event?: string;
}

const CATEGORY_ACCENT: Record<string, { border: string; text: string; bg: string }> = {
  ops: {
    border: "hover:border-terminal/40 hover:glow-terminal",
    text: "text-terminal",
    bg: "bg-terminal/10",
  },
  sales: {
    border: "hover:border-data/40 hover:glow-data",
    text: "text-data",
    bg: "bg-data/10",
  },
  design: {
    border: "hover:border-creative/40 hover:glow-creative",
    text: "text-creative",
    bg: "bg-creative/10",
  },
  marketing: {
    border: "hover:border-warm/40 hover:glow-warm",
    text: "text-warm",
    bg: "bg-warm/10",
  },
  finance: {
    border: "hover:border-data/40 hover:glow-data",
    text: "text-data",
    bg: "bg-data/10",
  },
  tools: {
    border: "hover:border-terminal/40 hover:glow-terminal",
    text: "text-terminal",
    bg: "bg-terminal/10",
  },
};

function accent(category: string) {
  return CATEGORY_ACCENT[category] ?? CATEGORY_ACCENT.ops;
}

export function ToolCard({ tool, index }: { tool: MightyTool; index: number }) {
  const a = accent(tool.category);
  const body = tool.blurb ?? tool.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className={cn(
        "group rounded-lg border border-border bg-card/50 p-5 transition-all duration-300",
        a.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-base font-bold leading-snug">{tool.name}</h3>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
            a.bg,
            a.text
          )}
        >
          {tool.category}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>

      {tool.time_saved_per_event && tool.time_saved_per_event !== "0 min" && (
        <div className={cn("mt-3 font-mono text-[10px] uppercase tracking-wider", a.text)}>
          ≈ {tool.time_saved_per_event} saved / event
        </div>
      )}
    </motion.div>
  );
}
