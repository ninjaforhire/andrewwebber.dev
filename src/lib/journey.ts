export interface JourneyVideo {
  title: string;
  channel: string;
  url?: string;
  runtime_min?: number | null;
  category?: string[];
}

export interface JourneyBuild {
  repo: string;
  commits: string[];
}

export interface JourneyEntry {
  day: number;
  date: string;
  title: string;
  era: string;
  type: string[];
  source: string;
  category: string[];
  impact: string;
  videos: JourneyVideo[];
  builds: JourneyBuild[];
  takeaway: string;
}

export interface JourneyData {
  lastUpdated: string;
  totalDays: number;
  currentEra: string;
  entries: JourneyEntry[];
}

export const ERA_COLORS: Record<string, string> = {
  "No-Code Era": "text-warm bg-warm/10 border-warm/20",
  "First Code": "text-orange-400 bg-orange-400/10 border-orange-400/20",
  "Agent Builder": "text-data bg-data/10 border-data/20",
  "Platform Architect": "text-creative bg-creative/10 border-creative/20",
  "Full Stack AI": "text-red-400 bg-red-400/10 border-red-400/20",
};

export const IMPACT_COLORS: Record<string, string> = {
  Low: "text-zinc-400",
  Medium: "text-green-400",
  High: "text-data",
  Critical: "text-red-400",
};

export const TYPE_COLORS: Record<string, string> = {
  Build: "bg-blue-500/20 text-blue-400",
  Video: "bg-red-500/20 text-red-400",
  Book: "bg-amber-700/20 text-amber-500",
  Course: "bg-purple-500/20 text-purple-400",
  Keynote: "bg-pink-500/20 text-pink-400",
  Research: "bg-zinc-500/20 text-zinc-400",
  Retro: "bg-orange-500/20 text-orange-400",
  Skill: "bg-green-500/20 text-green-400",
  Tool: "bg-zinc-500/20 text-zinc-300",
  Design: "bg-yellow-500/20 text-yellow-400",
};

export const ERAS = [
  "No-Code Era",
  "First Code",
  "Agent Builder",
  "Platform Architect",
  "Full Stack AI",
] as const;
