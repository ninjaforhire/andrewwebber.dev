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
  const items = (coursesData.items as CourseItem[]).filter(
    (i) => (i.date || "").startsWith("2026")
  );

  if (items.length === 0) return null;

  return (
    <div className="mb-12 md:mb-16 border-l-2 border-warm/30 pl-4 md:pl-6">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-3">
        2026 Reading Queue
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Books and courses started this year. {items.filter((i) => i.status === "Done").length} done,{" "}
        {items.filter((i) => i.status === "In progress").length} in progress.{" "}
        <a href="/about#credentials" className="text-warm underline decoration-warm/30 transition-colors hover:text-warm/80">
          Full library →
        </a>
      </p>
      <div className="flex flex-wrap gap-3">
        {items.map((c, i) => {
          const Wrapper = c.url ? "a" : "div";
          const props = c.url
            ? { href: c.url, target: "_blank", rel: "noopener noreferrer" }
            : {};
          return (
            <Wrapper
              key={`${c.title}-${i}`}
              {...props}
              className="group flex items-center gap-3 rounded-md border border-border bg-card/30 px-3 py-2 transition-colors hover:border-warm/40"
            >
              {c.cover && (
                <div className="relative h-10 w-7 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={c.cover}
                    alt={`Cover: ${stripSubtitle(c.title)}`}
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 max-w-[220px]">
                <p className="truncate text-xs font-medium">{stripSubtitle(c.title)}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {c.author} · {c.status === "Done" ? "Done" : "Reading"}
                </p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}
