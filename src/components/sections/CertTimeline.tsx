"use client";

import { useState } from "react";
import { CERTIFICATIONS, CERT_CATEGORIES } from "@/lib/education";
import { cn } from "@/lib/utils";

const CATEGORY_ACCENTS: Record<string, string> = {
  Security: "text-terminal bg-terminal/10",
  Programming: "text-data bg-data/10",
  SEO: "text-warm bg-warm/10",
  "AV/Audio": "text-creative bg-creative/10",
  Design: "text-creative bg-creative/10",
  Leadership: "text-warm bg-warm/10",
  Productivity: "text-data bg-data/10",
};

export function CertTimeline() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? CERTIFICATIONS.filter((c) => c.category === activeCategory)
    : CERTIFICATIONS;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
            !activeCategory
              ? "bg-creative/10 text-creative"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          All ({CERTIFICATIONS.length})
        </button>
        {CERT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
              cat === activeCategory
                ? "bg-creative/10 text-creative"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((cert, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-md border border-border bg-card/30 px-4 py-3 transition-colors hover:border-creative/20"
          >
            <span className="font-mono text-xs text-muted-foreground">
              {cert.year}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium">{cert.title}</p>
              <p className="text-xs text-muted-foreground">{cert.issuer}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                CATEGORY_ACCENTS[cert.category] ?? "text-muted-foreground bg-muted"
              )}
            >
              {cert.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
