"use client";

import { useState } from "react";
import journeyRaw from "@/data/journey-2026.json";
import type { JourneyData } from "@/lib/journey";
import { StatsHeader } from "@/components/journey/StatsHeader";
import { EraFilter } from "@/components/journey/EraFilter";
import { JourneyTimeline } from "@/components/journey/JourneyTimeline";
import { CurrentReading } from "@/components/journey/CurrentReading";
import { TopChannels } from "@/components/journey/TopChannels";

const journeyData = journeyRaw as JourneyData;

export default function JourneyPage() {
  const [activeEra, setActiveEra] = useState<string | null>(null);

  const sorted = [...journeyData.entries].sort((a, b) => b.day - a.day);
  const filtered = activeEra ? sorted.filter((e) => e.era === activeEra) : sorted;

  return (
    <div className="page-x py-16 md:py-32">
      <StatsHeader data={journeyData} />
      <div className="mb-12 md:mb-16 grid items-start gap-6 md:grid-cols-2 md:gap-8">
        <CurrentReading />
        <TopChannels entries={journeyData.entries} />
      </div>
      <EraFilter
        active={activeEra}
        onSelect={setActiveEra}
        total={journeyData.entries.length}
      />
      <JourneyTimeline entries={filtered} />
    </div>
  );
}
