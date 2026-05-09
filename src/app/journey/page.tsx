"use client";

import { useState } from "react";
import journeyRaw from "@/data/journey-2026.json";
import type { JourneyData } from "@/lib/journey";
import { StatsHeader } from "@/components/journey/StatsHeader";
import { EraFilter } from "@/components/journey/EraFilter";
import { JourneyTimeline } from "@/components/journey/JourneyTimeline";

const journeyData = journeyRaw as JourneyData;

export default function JourneyPage() {
  const [activeEra, setActiveEra] = useState<string | null>(null);

  const sorted = [...journeyData.entries].sort((a, b) => b.day - a.day);
  const filtered = activeEra ? sorted.filter((e) => e.era === activeEra) : sorted;

  return (
    <div className="px-6 sm:px-12 md:px-24 py-24 md:py-32">
      <StatsHeader data={journeyData} />
      <EraFilter
        active={activeEra}
        onSelect={setActiveEra}
        total={journeyData.entries.length}
      />
      <JourneyTimeline entries={filtered} />
    </div>
  );
}
