import Image from "next/image";
import coursesData from "@/data/courses.json";

interface CourseItem {
  title: string;
  type: string;
  source: string;
  status: string;
  date: string | null;
  author: string;
  cover: string | null;
  url: string | null;
}

function stripSubtitle(title: string): string {
  return title.split(" - ")[0].split(":")[0].trim();
}

export function CurrentReading() {
  const all = coursesData.items as CourseItem[];
  const books = all.filter((i) => i.type === "Book");

  const reading = books.filter((b) => b.status === "In progress");
  const notStarted = books.filter((b) => b.status === "Not started");
  const totalRead = books.filter((b) => b.status === "Done").length;

  const queue = [...reading, ...notStarted];
  if (queue.length === 0) return null;

  return (
    <div className="mb-12 md:mb-16 border-l-2 border-warm/30 pl-4 md:pl-6">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-3">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm">
          Reading Queue
        </div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
          <span className="text-foreground font-bold">{books.length}</span> books in library ·{" "}
          <span className="text-foreground font-bold">{totalRead}</span> read ·{" "}
          <span className="text-foreground font-bold">{reading.length}</span> reading now
          {notStarted.length > 0 && (
            <>
              {" · "}
              <span className="text-foreground font-bold">{notStarted.length}</span> up next
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
        {queue.map((b, i) => {
          const Wrapper = b.url ? "a" : "div";
          const props = b.url
            ? { href: b.url, target: "_blank", rel: "noopener noreferrer" }
            : {};
          const isReading = b.status === "In progress";
          const statusLabel = isReading ? "Reading" : "Up next";
          const statusClass = isReading
            ? "text-data"
            : "text-muted-foreground/60";

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
                  {b.author} · <span className={statusClass}>{statusLabel}</span>
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
