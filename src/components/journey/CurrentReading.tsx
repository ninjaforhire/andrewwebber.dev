import Image from "next/image";
import queueData from "@/data/queue.json";

interface QueueItem {
  title: string;
  type: string;
  status: string;
  author: string;
  cover: string | null;
  url: string | null;
  recommendedBy?: string;
}

interface QueueMeta {
  totalBooks: number;
  totalCompleted: number;
  totalInProgress: number;
  totalInQueue: number;
  displayCap: number;
}

function stripSubtitle(title: string): string {
  return title.split(" - ")[0].split(":")[0].trim();
}

export function CurrentReading() {
  const items = queueData.items as QueueItem[];
  const meta = queueData.meta as QueueMeta;

  if (items.length === 0) return null;

  const readingCount = items.filter((i) => i.status === "In Progress").length;
  const upNextCount = items.filter((i) => i.status === "Up Next").length;

  return (
    <div className="border-l-2 border-warm/30 pl-4 md:pl-6">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-3">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm">
          Reading Queue
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
          <span className="text-foreground font-bold">{meta.totalBooks}</span> in queue ·{" "}
          <span className="text-foreground font-bold">{meta.totalCompleted}</span> read ·{" "}
          <span className="text-foreground font-bold">{readingCount}</span> reading now
          {upNextCount > 0 && (
            <>
              {" · "}
              <span className="text-foreground font-bold">{upNextCount}</span> up next
            </>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        On the desk + queued up.{" "}
        <a
          href="/about#credentials"
          className="text-warm underline decoration-warm/30 transition-colors hover:text-warm/80"
        >
          Full library →
        </a>
      </p>
      <div className="flex flex-wrap gap-3">
        {items.map((b, i) => {
          const Wrapper = b.url ? "a" : "div";
          const props = b.url
            ? { href: b.url, target: "_blank", rel: "noopener noreferrer" }
            : {};
          const isReading = b.status === "In Progress";
          const statusLabel = isReading ? "Reading" : "Up next";
          const statusClass = isReading ? "text-data" : "text-muted-foreground/60";

          return (
            <Wrapper
              key={`${b.title}-${i}`}
              {...props}
              className="group flex items-center gap-3 rounded-md border border-border bg-card/30 px-3 py-2 transition-colors hover:border-warm/40"
            >
              {b.cover && (
                <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={b.cover}
                    alt={`Cover: ${stripSubtitle(b.title)}`}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 max-w-[220px]">
                <p className="truncate text-xs font-medium">{stripSubtitle(b.title)}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {b.author || b.recommendedBy || "—"} ·{" "}
                  <span className={statusClass}>{statusLabel}</span>
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
