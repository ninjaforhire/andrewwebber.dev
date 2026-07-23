// Single source of truth for build-time stat copy (SEO metadata, radar lore,
// anywhere a number appears in static text). Reads the SAME overrides.json that
// /api/stats serves at runtime, so compiled copy can never drift from the live
// counter. overrides.json is written by scripts/refresh-stats.py; every stats
// refresh + commit rebuilds the site and these strings update with it.
// Cumulative usage/LOC values ratchet;
// inventories (tools, skills, agents, repos) publish their exact current count.
//
// Do NOT hardcode tool/agent/skill/LOC numbers in components. Import from here
// instead. scripts/check-stat-literals.mjs fails the check if a raw "N tools"
// literal reappears in src/app or src/components.
import overrides from "../../overrides.json";

export interface SiteStats {
  tools: number;
  linesOfCode: number;
  skills: number;
  agentsLive: number;
  commitsShipped: number;
  claudeHours: number;
  claudeTokens: number;
  aiTokens: number;
  repos: number;
  yearsBuilding: number;
}

export const SITE_STATS = overrides as SiteStats;
