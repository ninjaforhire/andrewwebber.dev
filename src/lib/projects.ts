export interface Project {
  title: string;
  description: string;
  tags: string[];
  accent: "terminal" | "data" | "creative" | "warm";
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    title: "Jimbo — AI Orchestrator",
    description:
      "Autonomous AI coworker running 22 missions. Routes tasks, manages memory, runs overnight.",
    tags: ["AI", "Automation", "Python"],
    accent: "terminal",
  },
  {
    title: "SPECTRE — OSINT Platform",
    description:
      "Full-spectrum security reconnaissance. TheHarvester, Sherlock, Subfinder, Wappalyzer integrated.",
    tags: ["Security", "Python", "VPS"],
    accent: "creative",
  },
  {
    title: "Design Request Agent",
    description:
      "End-to-end design pipeline. Gmail scan, Notion enrichment, Drive linking, creative direction via AI.",
    tags: ["AI", "Automation", "Notion"],
    accent: "data",
  },
  {
    title: "Inbox Agent",
    description:
      "Email composition engine. Drafts responses with brand voice, handles W9s, ACH forms, follow-ups.",
    tags: ["AI", "Email", "Python"],
    accent: "terminal",
  },
  {
    title: "MIGHTY Photo Booths Site",
    description:
      "Next.js 16 site with 4-theme daylight system, GSAP animations, custom booking flow.",
    tags: ["Next.js", "React", "Design"],
    accent: "warm",
    link: "https://mightyphotobooths.com",
  },
  {
    title: "Lead Score Agent",
    description:
      "Scores inbound leads by event type, budget signals, timeline, and fit. Prioritizes follow-up.",
    tags: ["AI", "Sales", "Python"],
    accent: "data",
  },
  {
    title: "Code Council",
    description:
      "Automated security auditor. Scans repos for vulnerabilities, generates remediation reports.",
    tags: ["Security", "Python", "AI"],
    accent: "creative",
  },
  {
    title: "AI Caricature Studio",
    description:
      "Real-time AI caricature generation for events. Portrait to caricature transformation pipeline.",
    tags: ["AI", "Creative", "Product"],
    accent: "warm",
  },
  {
    title: "VSCO Quote Sync",
    description:
      "Bidirectional sync between VSCO CRM and Notion. REST API integration, upserts by UUID.",
    tags: ["Automation", "API", "Python"],
    accent: "terminal",
  },
  {
    title: "Memory Bridge",
    description:
      "Cross-agent shared memory via SQLite. Every agent logs decisions, learnings, and discoveries.",
    tags: ["AI", "Architecture", "Python"],
    accent: "data",
  },
  {
    title: "Vault Sync",
    description:
      "Bitwarden-backed secret management. CLI for secure credential distribution across agents.",
    tags: ["Security", "DevOps", "Python"],
    accent: "creative",
  },
  {
    title: "Blog Agent",
    description:
      "Automated blog pipeline. Research, outline, write, generate images via Nano Banana, publish.",
    tags: ["AI", "Content", "Python"],
    accent: "warm",
  },
];

export const ALL_TAGS = [...new Set(PROJECTS.flatMap((p) => p.tags))].sort();
