import { ServiceCard } from "./ServiceCard";
import servicesData from "@/data/services.json";

type AccentKey = "terminal" | "data" | "creative" | "warm";

interface ServiceGroup {
  group: string;
  accent: string;
  icon: string;
  description: string;
  items: Array<{ name: string; description: string; price?: string }>;
}

const ACCENT_CYCLE: AccentKey[] = ["terminal", "data", "creative", "warm"];

export function ServicesGrid() {
  const services = servicesData as ServiceGroup[];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {services.map((group, i) => (
        <ServiceCard
          key={group.group}
          group={group.group}
          icon={group.icon}
          description={group.description}
          items={group.items}
          accent={(group.accent as AccentKey) ?? ACCENT_CYCLE[i % 4]}
        />
      ))}
    </div>
  );
}
