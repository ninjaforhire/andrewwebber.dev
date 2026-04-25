import { cn } from "@/lib/utils";

interface ServiceTierProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  accent: "terminal" | "data" | "creative" | "warm";
  featured?: boolean;
}

const ACCENT_CLASSES = {
  terminal: { border: "border-terminal/30", text: "text-terminal", bg: "bg-terminal/10" },
  data: { border: "border-data/30", text: "text-data", bg: "bg-data/10" },
  creative: { border: "border-creative/30", text: "text-creative", bg: "bg-creative/10" },
  warm: { border: "border-warm/30", text: "text-warm", bg: "bg-warm/10" },
};

export function ServiceTier({
  title,
  price,
  description,
  features,
  accent,
  featured,
}: ServiceTierProps) {
  const a = ACCENT_CLASSES[accent];

  return (
    <div
      className={cn(
        "rounded-lg border p-6 transition-all duration-300",
        featured ? `${a.border} ${a.bg}` : "border-border bg-card/50",
        "hover:scale-[1.02]"
      )}
    >
      <p className={cn("font-mono text-xs uppercase tracking-wider", a.text)}>
        {title}
      </p>
      <p className="mt-2 font-heading text-3xl font-bold">{price}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <ul className="mt-4 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className={cn("mt-1 font-mono text-xs", a.text)}>✓</span>
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>
      <a
        href="#consultation"
        className={cn(
          "mt-6 block rounded-md py-2.5 text-center font-mono text-xs uppercase tracking-wider transition-colors",
          featured
            ? `${a.bg} ${a.text} hover:opacity-80`
            : `border border-border hover:${a.border} hover:${a.text}`
        )}
      >
        Book Now →
      </a>
    </div>
  );
}
