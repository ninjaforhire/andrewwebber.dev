"use client";

import { useMemo, useState, useEffect } from "react";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ServiceTier } from "@/components/sections/ServiceTier";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { cn } from "@/lib/utils";
import toolsData from "@/data/mighty-tools.json";

interface Tool {
  slug: string;
  name: string;
  description: string;
  category: "photo-booth" | "design-forge" | "spectre" | "global";
  subcategory: string;
  source: string;
  location: string;
}

const CATEGORY_LABELS: Record<Tool["category"], string> = {
  "photo-booth": "Photo Booth",
  "design-forge": "Design Forge",
  spectre: "SPECTRE",
  global: "Global",
};

const CATEGORY_ACCENT: Record<Tool["category"], Project["accent"]> = {
  "photo-booth": "warm",
  "design-forge": "creative",
  spectre: "terminal",
  global: "data",
};

function accentFor(category: Tool["category"]): Project["accent"] {
  return CATEGORY_ACCENT[category];
}

function toolToProject(t: Tool): Project {
  const subTag =
    t.subcategory === "agent"
      ? "Agent"
      : t.subcategory === "skill"
        ? "Skill"
        : t.subcategory === "wing"
          ? "Wing"
          : t.subcategory === "spectre-aisec"
            ? "AISec"
            : t.subcategory === "spectre-tool"
              ? "Tool"
              : t.subcategory === "parent"
                ? "Suite"
                : t.subcategory === "site"
                  ? "Site"
                  : t.subcategory === "global-tool"
                    ? "Tool"
                    : t.subcategory === "app"
                      ? "App"
                      : t.subcategory;
  return {
    title: t.name,
    description: t.description,
    tags: [CATEGORY_LABELS[t.category], subTag],
    accent: accentFor(t.category),
  };
}

const PAGE_SIZE = 24;
const RAW_TOOLS = toolsData as Tool[];
const FEATURED_SLUGS = ["design-forge", "spectre-spectre-api", "spectre-watchtower"];

// Featured callouts always render first. Everything else is paginated.
const FEATURED = FEATURED_SLUGS
  .map((slug) => RAW_TOOLS.find((t) => t.slug === slug))
  .filter((t): t is Tool => Boolean(t));

const TOOLS = [...RAW_TOOLS].sort((a, b) => a.name.localeCompare(b.name));
const CATEGORY_ORDER: Tool["category"][] = ["photo-booth", "design-forge", "spectre", "global"];

export function WorkPageContent() {
  const [activeCategory, setActiveCategory] = useState<Tool["category"] | null>(null);
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

  const filtered = useMemo(
    () =>
      activeCategory
        ? TOOLS.filter((t) => t.category === activeCategory)
        : TOOLS,
    [activeCategory],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const categoryCounts = useMemo(() => {
    const out: Record<Tool["category"], number> = {
      "photo-booth": 0,
      "design-forge": 0,
      spectre: 0,
      global: 0,
    };
    for (const t of TOOLS) out[t.category]++;
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
      <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl">
        {toolsCount} tools, agents, and systems Andrew built. Photo Booth ({categoryCounts["photo-booth"]}) covers MIGHTY operations. SPECTRE ({categoryCounts.spectre}) is the offensive security suite. Design Forge ({categoryCounts["design-forge"]}) drives every brand asset. Global ({categoryCounts.global}) runs across every repo.
      </p>

      {/* FEATURED — Design Forge + SPECTRE highlights */}
      {FEATURED.length > 0 && (
        <div className="mt-16 md:mt-20">
          <div className="font-mono text-[11px] font-medium tracking-[0.3em] uppercase text-creative mb-6">
            Featured
          </div>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURED.map((tool) => (
              <ProjectCard key={`featured-${tool.slug}`} project={toolToProject(tool)} />
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

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <ServiceTier
            title="Photo Booth Consulting"
            price="Let's Talk"
            description="20 years of live event experience. Ask me anything."
            features={[
              "Photo booth business strategy",
              "Website and SEO audit",
              "Security assessment",
              "Equipment and workflow review",
              "Brand positioning guidance",
            ]}
            accent="creative"
          />
          <ServiceTier
            title="AI Implementation"
            price="$1,000"
            description="Custom AI automation for your business operations."
            features={[
              "Process automation audit",
              "Custom agent architecture",
              "Dashboard and reporting build",
              "AI operations integration",
              "30-day post-implementation support",
            ]}
            accent="warm"
            featured
          />
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
  { hat: "Black", role: "Offensive Attacker", focus: "Vulnerability discovery, exploit paths, secrets exposure" },
  { hat: "Red", role: "Penetration Tester", focus: "Webhook + API testing, injection, fuzzing" },
  { hat: "White", role: "Defensive Engineer", focus: "Best practices, input validation, encryption" },
  { hat: "Blue", role: "Security Ops", focus: "Monitoring, incident response, audit trails" },
  { hat: "Purple", role: "Threat Modeler", focus: "Attack chain mapping, STRIDE, crown jewel ID" },
  { hat: "Gray", role: "Supply Chain", focus: "Dependencies, CVEs, transitive risks" },
  { hat: "Green", role: "Privacy + Compliance", focus: "PII handling, data flows, CCPA + GDPR" },
  { hat: "Gold", role: "Business Continuity", focus: "Failure modes, resilience, recovery" },
  { hat: "Silver", role: "DevSecOps", focus: "CI/CD pipelines, GitHub Actions, branch protection" },
  { hat: "Orange", role: "API Security", focus: "OWASP API Top 10, BOLA, auth flows, SSRF" },
  { hat: "Cyan", role: "Secrets Lifecycle", focus: "Inventory, rotation, scope, emergency revocation" },
  { hat: "Bronze", role: "Runtime Analyst", focus: "Process execution, concurrency, dynamic code, env drift" },
];

function CodeCouncilSection() {
  return (
    <section className="mt-20 md:mt-32 pt-16 md:pt-20 border-t border-white/5">
      <div className="font-mono text-[11px] font-medium tracking-[0.3em] uppercase text-terminal mb-6">
        SPECTRE — The Code Council
      </div>
      <h2 className="crop font-extrabold text-[clamp(40px,6vw,80px)] leading-[0.95] mb-6">
        Twelve disciplines.<br />
        <span className="text-terminal">One adversarial review.</span>
      </h2>
      <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-4">
        The Code Council is the doctrine behind every SPECTRE tool. Twelve specialist hats — each a different security discipline — review the same change from their own angle. Black Hat tries to break it. White Hat tries to harden it. Purple Hat maps the attack chain. They argue, then converge on a verdict.
      </p>
      <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-12">
        That argument-and-converge pattern is what every Spectre module runs on internally: daily missions sweep the surface area through the hats relevant to the work — recon (Raven), red-team (Blackthorn + Decepticon), purple-team coverage (Gauntlet), blue-team detection (Bastion), supply chain (Gray), runtime (Bronze) — and the Dossier consolidates the verdict. Client engagements are the same loop, just longer and reported through Spectre-Guide.
      </p>
      <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          </li>
        ))}
      </ul>
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
