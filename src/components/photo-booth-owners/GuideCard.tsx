import { cn } from "@/lib/utils";

interface Guide {
  slug: string;
  title: string;
  description: string;
  price: string;
  storefront: string;
  url: string;
  accent: "terminal" | "data" | "creative" | "warm";
  tags: string[];
}

const ACCENT = {
  terminal: { border: "border-terminal/20", text: "text-terminal", tag: "bg-terminal/10 text-terminal" },
  data: { border: "border-data/20", text: "text-data", tag: "bg-data/10 text-data" },
  creative: { border: "border-creative/20", text: "text-creative", tag: "bg-creative/10 text-creative" },
  warm: { border: "border-warm/20", text: "text-warm", tag: "bg-warm/10 text-warm" },
};

const STORE_LABELS: Record<string, string> = {
  lemonsqueezy: "LemonSqueezy",
  gumroad: "Gumroad",
  square: "Square",
};

export function GuideCard({ guide }: { guide: Guide }) {
  const a = ACCENT[guide.accent];
  const isLive = guide.url !== "#";

  const Wrapper = isLive ? "a" : "div";
  const wrapperProps = isLive
    ? { href: guide.url, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group block rounded-lg border bg-card/30 p-6 transition-all duration-300",
        a.border,
        isLive && "hover:scale-[1.02] cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-heading text-base font-bold leading-snug">{guide.title}</h3>
        <span className={cn("shrink-0 font-mono text-sm font-bold", a.text)}>
          {guide.price}
        </span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{guide.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {guide.tags.map((tag) => (
            <span
              key={tag}
              className={cn("rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider", a.tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        {isLive ? (
          <span className={cn("font-mono text-xs", a.text)}>
            {STORE_LABELS[guide.storefront] ?? guide.storefront} →
          </span>
        ) : (
          <span className="font-mono text-xs text-muted-foreground">Coming soon</span>
        )}
      </div>
    </Wrapper>
  );
}
