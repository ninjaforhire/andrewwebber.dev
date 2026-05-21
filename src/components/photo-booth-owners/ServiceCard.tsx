import { cn } from "@/lib/utils";

interface ServiceItem {
  name: string;
  description: string;
  price?: string;
}

interface ServiceCardProps {
  group: string;
  icon: string;
  description: string;
  items: ServiceItem[];
  accent: "terminal" | "data" | "creative" | "warm";
}

const ACCENT_CLASSES = {
  terminal: { border: "border-terminal/20", text: "text-terminal", tag: "bg-terminal/10 text-terminal" },
  data: { border: "border-data/20", text: "text-data", tag: "bg-data/10 text-data" },
  creative: { border: "border-creative/20", text: "text-creative", tag: "bg-creative/10 text-creative" },
  warm: { border: "border-warm/20", text: "text-warm", tag: "bg-warm/10 text-warm" },
};

export function ServiceCard({ group, icon, description, items, accent }: ServiceCardProps) {
  const a = ACCENT_CLASSES[accent];

  return (
    <div className={cn("rounded-lg border bg-card/30 p-6 transition-all duration-300", a.border)}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" aria-hidden>
          {icon}
        </span>
        <h3 className={cn("font-heading text-lg font-bold", a.text)}>{group}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{description}</p>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.name} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{item.name}</span>
              {item.price && (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
                    a.tag
                  )}
                >
                  {item.price}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
