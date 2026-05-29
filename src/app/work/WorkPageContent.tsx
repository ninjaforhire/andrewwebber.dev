"use client";

import { useMemo, useState, useEffect } from "react";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ConsultingSection } from "@/components/sections/ConsultingSection";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { cn } from "@/lib/utils";
import toolsData from "@/data/mighty-tools.json";

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: "photo-booth" | "design-forge" | "spectre" | "finance" | "tooling";
  subcategory: string;
  source: string;
  location: string;
  domain?: string;
}

const CATEGORY_LABELS: Record<Tool["category"], string> = {
  "photo-booth": "Photo Booth",
  "design-forge": "Pandora's Forge",
  spectre: "SPECTRE",
  finance: "Finance",
  tooling: "Tooling",
};

const CATEGORY_ACCENT: Record<Tool["category"], Project["accent"]> = {
  "photo-booth": "warm",
  "design-forge": "creative",
  spectre: "terminal",
  finance: "data",
  tooling: "data",
};

function accentFor(category: Tool["category"]): Project["accent"] {
  return CATEGORY_ACCENT[category];
}

const SUBCATEGORY_LABELS: Record<string, string> = {
  agent: "Agent",
  skill: "Skill",
  wing: "Wing",
  "spectre-aisec": "AISec",
  "spectre-tool": "Tool",
  parent: "Suite",
  site: "Site",
  app: "App",
  scraper: "Scraper",
  tool: "Tool",
  "finance-agent": "Agent",
  "finance-skill": "Skill",
};

function toolToProject(t: Tool): Project {
  const subTag = SUBCATEGORY_LABELS[t.subcategory] ?? t.subcategory;
  const tags = [CATEGORY_LABELS[t.category], subTag];
  if (t.domain) tags.push(t.domain);
  return {
    title: t.name,
    description: t.description,
    tags,
    accent: accentFor(t.category),
  };
}

const PAGE_SIZE = 24;
const RAW_TOOLS = toolsData as Tool[];
const FEATURED_SLUGS = ["design-forge", "spectre"];

// Featured callouts always render first. Everything else is paginated.
const FEATURED = FEATURED_SLUGS
  .map((slug) => RAW_TOOLS.find((t) => t.slug === slug))
  .filter((t): t is Tool => Boolean(t));

const TOOLS = [...RAW_TOOLS].sort((a, b) => a.name.localeCompare(b.name));
const CATEGORY_ORDER: Tool["category"][] = [
  "photo-booth",
  "design-forge",
  "spectre",
  "finance",
  "tooling",
];

const PHOTO_BOOTH_DOMAINS = Array.from(
  new Set(
    TOOLS.filter((t) => t.category === "photo-booth" && t.domain).map(
      (t) => t.domain as string,
    ),
  ),
).sort();

export function WorkPageContent() {
  const [activeCategory, setActiveCategory] = useState<Tool["category"] | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [toolsCount, setToolsCount] = useState(TOOLS.length);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((s) => {
        if (typeof s.tools === "number" && s.tools > 0) setToolsCount(s.tools);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let out = activeCategory
      ? TOOLS.filter((t) => t.category === activeCategory)
      : TOOLS;
    if (activeCategory === "photo-booth" && activeDomain) {
      out = out.filter((t) => t.domain === activeDomain);
    }
    return out;
  }, [activeCategory, activeDomain]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
    if (activeCategory !== "photo-booth") setActiveDomain(null);
  }, [activeCategory]);

  const categoryCounts = useMemo(() => {
    const out: Record<Tool["category"], number> = {
      "photo-booth": 0,
      "design-forge": 0,
      spectre: 0,
      finance: 0,
      tooling: 0,
    };
    for (const t of TOOLS) out[t.category]++;
    return out;
  }, []);

  const domainCounts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const t of TOOLS) {
      if (t.category === "photo-booth" && t.domain) {
        out[t.domain] = (out[t.domain] ?? 0) + 1;
      }
    }
    return out;
  }, []);

  return (
    <div className="page-x py-16 md:py-32">
      {/* HEADER */}
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-6">
        § 01 — Projects
      </div>
      <h1 className="crop font-extrabold text-[clamp(56px,10vw,140px)] leading-[0.88] mb-8">
        A selection of <span className="text-data">things</span>
        <br />
        I&apos;ve built.
      </h1>
      <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Tools, agents, and systems I&apos;ve shipped — MIGHTY ops, security, creative AI,
        finance, and the shared tooling under it all.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
        <span>
          <span className="font-bold tabular-nums text-foreground">{toolsCount}</span>{" "}
          total
        </span>
        <span className="text-border">·</span>
        <span>
          <span className="font-bold tabular-nums text-warm">
            {categoryCounts["photo-booth"]}
          </span>{" "}
          photo booth
        </span>
        <span>
          <span className="font-bold tabular-nums text-terminal">
            {categoryCounts.spectre}
          </span>{" "}
          spectre
        </span>
        <span>
          <span className="font-bold tabular-nums text-creative">
            {categoryCounts["design-forge"]}
          </span>{" "}
          forge
        </span>
        <span>
          <span className="font-bold tabular-nums text-data">
            {categoryCounts.finance}
          </span>{" "}
          finance
        </span>
        <span>
          <span className="font-bold tabular-nums text-data">
            {categoryCounts.tooling}
          </span>{" "}
          tooling
        </span>
      </div>

      {/* FEATURED — PANDORA'S FORGE + SPECTRE flagships */}
      {FEATURED.length > 0 && (
        <div className="mt-16 md:mt-24">
          <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-creative mb-6">
            Featured · Flagship systems
          </div>
          <div className="grid gap-6 md:gap-8 md:grid-cols-2">
            {FEATURED.map((tool) => (
              <ProjectCard
                key={`featured-${tool.slug}`}
                project={toolToProject(tool)}
                featured
              />
            ))}
          </div>
        </div>
      )}

      {/* CODE COUNCIL — the 12-hat discipline that inspired the SPECTRE stack */}
      <CodeCouncilSection />

      {/* CATEGORY FILTER */}
      <div className="mt-16 md:mt-20 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors touch-target",
            !activeCategory
              ? "bg-data/10 text-data border border-data/30"
              : "text-muted-foreground border border-white/10 hover:border-white/30",
          )}
        >
          All ({TOOLS.length})
        </button>
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(cat === activeCategory ? null : cat)
            }
            className={cn(
              "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors touch-target",
              cat === activeCategory
                ? "bg-data/10 text-data border border-data/30"
                : "text-muted-foreground border border-white/10 hover:border-white/30",
            )}
          >
            {CATEGORY_LABELS[cat]} ({categoryCounts[cat]})
          </button>
        ))}
      </div>

      {/* DOMAIN SUB-FILTER — shown when Photo Booth tab active */}
      {activeCategory === "photo-booth" && PHOTO_BOOTH_DOMAINS.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-l-2 border-warm/30 pl-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-warm mr-2">
            Filter by domain
          </span>
          <button
            onClick={() => setActiveDomain(null)}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors",
              !activeDomain
                ? "bg-warm/10 text-warm border border-warm/30"
                : "text-muted-foreground border border-white/10 hover:border-white/30",
            )}
          >
            All ({categoryCounts["photo-booth"]})
          </button>
          {PHOTO_BOOTH_DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => setActiveDomain(d === activeDomain ? null : d)}
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors",
                d === activeDomain
                  ? "bg-warm/10 text-warm border border-warm/30"
                  : "text-muted-foreground border border-white/10 hover:border-white/30",
              )}
            >
              {d} ({domainCounts[d] ?? 0})
            </button>
          ))}
        </div>
      )}

      {/* TOOL GRID */}
      <div className="mt-8 md:mt-12 grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((tool) => (
          <ProjectCard key={tool.slug} project={toolToProject(tool)} />
        ))}
      </div>

      {/* PAGINATION */}
      {pageCount > 1 && (
        <Pagination
          page={safePage}
          pageCount={pageCount}
          onChange={(p) => {
            setPage(p);
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        />
      )}

      {/* SERVICES */}
      <div className="mt-20 md:mt-40 pt-16 md:pt-32 border-t border-white/5">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-6">
          § 02 — Services
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-8">
          Hands-on <span className="text-warm">consulting</span>.
        </h2>
        <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl">
          Limited engagements each quarter for businesses ready to level up.
        </p>

        <div className="mt-16">
          <ConsultingSection />
        </div>
      </div>

      {/* CONSULTATION FORM */}
      <div className="mt-20 md:mt-40 pt-16 md:pt-32 border-t border-white/5">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-6">
          § 03 — Book a call
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-8">
          Tell me what
          <br />
          you&apos;re <span className="text-terminal">building</span>.
        </h2>
        <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-12">
          I respond within 24 hours.
        </p>
        <ConsultationForm />
      </div>
    </div>
  );
}

const CODE_COUNCIL = [
  {
    hat: "Black",
    role: "Offensive Attacker",
    focus: "Vulnerability discovery, exploit paths, secrets exposure",
    ai: "Jailbreaks, prompt-injection attacks, model exfil chains",
  },
  {
    hat: "Red",
    role: "Penetration Tester",
    focus: "Webhook + API testing, injection, fuzzing",
    ai: "LLM red-teaming, adversarial prompt fuzzing, model extraction",
  },
  {
    hat: "White",
    role: "Defensive Engineer",
    focus: "Best practices, input validation, encryption",
    ai: "Prompt + output sanitization, system-prompt hardening, guardrails",
  },
  {
    hat: "Blue",
    role: "Security Ops",
    focus: "Monitoring, incident response, audit trails",
    ai: "Model-call telemetry, anomaly detection on inference traffic",
  },
  {
    hat: "Purple",
    role: "Threat Modeler",
    focus: "Attack chain mapping, STRIDE, crown jewel ID",
    ai: "STRIDE for LLM apps, tool-use attack chains, blast-radius modeling",
  },
  {
    hat: "Gray",
    role: "Supply Chain",
    focus: "Dependencies, CVEs, transitive risks",
    ai: "Model provenance, training-data poisoning, AI dep vuln tracking",
  },
  {
    hat: "Green",
    role: "Privacy + Compliance",
    focus: "PII handling, data flows, CCPA + GDPR",
    ai: "PII leakage in prompts + outputs, RAG data exposure, memorization",
  },
  {
    hat: "Gold",
    role: "Business Continuity",
    focus: "Failure modes, resilience, recovery",
    ai: "Model availability + fallback chains, rate-limit + outage handling",
  },
  {
    hat: "Silver",
    role: "DevSecOps",
    focus: "CI/CD pipelines, GitHub Actions, branch protection",
    ai: "Model versioning in pipeline, eval suites as deploy gates",
  },
  {
    hat: "Orange",
    role: "API Security",
    focus: "OWASP API Top 10, BOLA, auth flows, SSRF",
    ai: "AI API gateways, per-model rate limits, BOLA on tool endpoints",
  },
  {
    hat: "Cyan",
    role: "Secrets Lifecycle",
    focus: "Inventory, rotation, scope, emergency revocation",
    ai: "Provider API keys (Anthropic, OpenAI, etc.) — rotation + scope",
  },
  {
    hat: "Bronze",
    role: "Runtime Analyst",
    focus: "Process execution, concurrency, dynamic code, env drift",
    ai: "Live prompt-injection detection, computer-use action vetting, LLM-Guard",
  },
];

function CodeCouncilSection() {
  const [showHats, setShowHats] = useState(false);

  return (
    <section className="mt-20 md:mt-32 pt-16 md:pt-20 border-t border-white/5">
      <div className="font-mono text-[11px] font-medium tracking-[0.3em] uppercase text-terminal mb-6">
        SPECTRE — The Code Council
      </div>
      <h2 className="crop font-extrabold text-[clamp(40px,6vw,80px)] leading-[0.95] mb-6">
        Twelve disciplines.<br />
        <span className="text-terminal">One adversarial review.</span>
      </h2>
      <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-8">
        The Code Council is the doctrine behind every SPECTRE tool. Twelve specialist hats, each a different security discipline, review the same change from their own angle, argue, and converge on a verdict. That pattern runs every SPECTRE module internally: daily missions sweep the relevant hats (Raven for recon, Blackthorn for red-team, Bastion for detection, Dossier for verdict) and every hat already owns a slice of the AI threat surface.
      </p>
      <button
        onClick={() => setShowHats((v) => !v)}
        className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-terminal border border-terminal/30 rounded-full px-4 py-2 hover:bg-terminal/5 transition-colors"
      >
        <span>{showHats ? "Hide" : "Show"} the 12 hats</span>
        <span className="text-terminal/60">{showHats ? "↑" : "↓"}</span>
      </button>
      {showHats && (
        <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {CODE_COUNCIL.map((agent) => (
            <li
              key={agent.hat}
              className="rounded-lg border border-border bg-card/40 p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-heading text-base font-bold text-terminal">
                  {agent.hat} Hat
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {agent.role}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {agent.focus}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-data/80">
                <span className="font-mono uppercase tracking-wider text-[10px] text-data/60">AI:</span>{" "}
                {agent.ai}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  // Compact page list with ellipses for long ranges: 1 … p-1 p p+1 … N
  const pages = useMemo(() => {
    const set = new Set<number>([1, pageCount, page - 1, page, page + 1]);
    return [...set]
      .filter((n) => n >= 1 && n <= pageCount)
      .sort((a, b) => a - b);
  }, [page, pageCount]);

  return (
    <nav
      aria-label="Project pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-white/30 disabled:opacity-30 disabled:hover:border-white/10 touch-target"
      >
        Prev
      </button>
      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showGap = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showGap && (
              <span className="font-mono text-xs text-muted-foreground">…</span>
            )}
            <button
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors touch-target tabular-nums",
                p === page
                  ? "border-data/30 bg-data/10 text-data"
                  : "border-white/10 text-muted-foreground hover:border-white/30",
              )}
            >
              {p}
            </button>
          </span>
        );
      })}
      <button
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        className="rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-white/30 disabled:opacity-30 disabled:hover:border-white/10 touch-target"
      >
        Next
      </button>
    </nav>
  );
}
