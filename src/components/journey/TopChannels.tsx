import { Play } from "lucide-react";
import { getTopChannels } from "@/lib/journey";
import type { JourneyEntry } from "@/lib/journey";

interface TopChannelsProps {
  entries: JourneyEntry[];
}

export function TopChannels({ entries }: TopChannelsProps) {
  const top = getTopChannels(entries, 5);
  if (top.length === 0) return null;

  const totalWatched = entries.reduce((n, e) => n + e.videos.length, 0);

  return (
    <div className="border-l-2 border-warm/30 pl-4 md:pl-6">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-3">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm">
          Top YouTube Channels
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
          <span className="text-foreground font-bold">{totalWatched}</span> videos watched
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Most-watched teachers this year, ranked live from the journey log.
      </p>
      <div className="flex flex-col gap-2">
        {top.map((c, i) => (
          <a
            key={c.channel}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 rounded-md border border-border bg-card/30 px-3 py-2 transition-colors hover:border-warm/40"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="w-4 shrink-0 font-mono text-xs tabular-nums text-muted-foreground/60">
                {i + 1}
              </span>
              <Play size={12} className="shrink-0 text-red-400" />
              <span className="truncate text-xs font-medium">{c.channel}</span>
            </div>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
              {c.count} videos
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
