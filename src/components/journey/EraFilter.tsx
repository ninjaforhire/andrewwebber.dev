"use client";

import { cn } from "@/lib/utils";
import { ERA_COLORS, ERAS } from "@/lib/journey";

interface EraFilterProps {
  active: string | null;
  onSelect: (era: string | null) => void;
  total: number;
}

export function EraFilter({ active, onSelect, total }: EraFilterProps) {
  return (
    <div className="mb-10 flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors border",
          !active
            ? "bg-terminal/10 text-terminal border-terminal/20"
            : "text-muted-foreground border-transparent hover:text-foreground"
        )}
      >
        All ({total})
      </button>
      {ERAS.map((era) => {
        const colors = ERA_COLORS[era] ?? "";
        const isActive = active === era;
        return (
          <button
            key={era}
            onClick={() => onSelect(era === active ? null : era)}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider transition-colors border",
              isActive
                ? colors
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            {era}
          </button>
        );
      })}
    </div>
  );
}
