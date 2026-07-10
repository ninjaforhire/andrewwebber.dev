"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MightyTool {
  slug: string;
  name: string;
  description: string;
  category: string;
  source: "skill" | "agent" | "app";
  blurb?: string;
  body?: string[];
  badge?: string;
  group?: string;
  time_saved_per_event?: string;
  time_saved_per_day?: string;
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

// Curated blurb markup: __underline__ for truly important facts (sparing),
// *italic* for light emphasis. No bold in body copy by design.
function Italics({ text }: { text: string }) {
  const parts = text.split(/\*(.+?)\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="text-foreground/85">
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function RichText({ text, accentClass }: { text: string; accentClass?: string }) {
  const parts = text.split(/__(.+?)__/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span
            key={i}
            className={cn("underline decoration-1 underline-offset-4 text-foreground/90", accentClass)}
          >
            <Italics text={part} />
          </span>
        ) : (
          <Italics key={i} text={part} />
        )
      )}
    </>
  );
}

export function ToolCard({ tool, index }: { tool: MightyTool; index: number }) {
  const a = accent(tool.category);
  const paragraphs = tool.body ?? (tool.blurb ? [tool.blurb] : [tool.description]);
  const saved = tool.time_saved_per_event ?? tool.time_saved_per_day;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-card/50 p-5 transition-all duration-300",
        a.border
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-base font-bold leading-snug">{tool.name}</h3>
        <div className="flex shrink-0 items-center gap-1.5">
          {tool.badge && (
            <span className="rounded-full border border-warm/40 bg-warm/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-warm">
              {tool.badge}
            </span>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
              a.bg,
              a.text
            )}
          >
            {tool.category}
          </span>
        </div>
      </div>

      <div className="mt-2 space-y-2.5">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-muted-foreground">
            <RichText text={p} />
          </p>
        ))}
      </div>

      {saved && saved !== "0 min" && (
        <div className={cn("mt-auto pt-3 font-mono text-[10px] uppercase tracking-wider", a.text)}>
          ≈ {saved} saved
        </div>
      )}
    </motion.div>
  );
}
