import { cn } from "@/lib/utils";
import { TYPE_COLORS } from "@/lib/journey";

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const colors = TYPE_COLORS[type] ?? "bg-zinc-500/20 text-zinc-400";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
        colors
      )}
    >
      {type}
    </span>
  );
}
