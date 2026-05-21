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
  category: string;
  source: "skill" | "agent";
}

// Category → accent color bucket. Keeps the 22 raw categories visually grouped
// into the 4 brand accents without hiding any of them from the filter row.
const CATEGORY_ACCENT: Record<string, Project["accent"]> = {
  ops: "terminal",
  admin: "terminal",
  integrations: "terminal",
  infrastructure: "terminal",
  email: "terminal",
  notion: "terminal",
  "design-center": "creative",
  design: "creative",
  brand: "creative",
  media: "creative",
  crm: "data",
  sales: "data",
  marketing: "data",
  analytics: "data",
  "scraper-agents": "data",
  finance: "warm",
  legal: "warm",
  "r-and-d": "warm",
  tools: "warm",
  "general-tools": "warm",
  "photo-booth-tools": "warm",
  voice: "warm",
  research: "warm",
};

function accentFor(category: string): Project["accent"] {
  return CATEGORY_ACCENT[category] ?? "data";
}

function toolToProject(t: Tool): Project {
  const sourceTag = t.source === "agent" ? "Agent" : "Skill";
  return {
    title: t.name,
    description: t.description || `${sourceTag} — ${t.category}`,
    tags: [t.category, sourceTag],
    accent: accentFor(t.category),
  };
}

const PAGE_SIZE = 24;
const TOOLS = (toolsData as Tool[]).slice();
TOOLS.sort((a, b) => a.name.localeCompare(b.name));
const ALL_CATEGORIES = [...new Set(TOOLS.map((t) => t.category))].sort();

export function WorkPageContent() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
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
        {toolsCount} tools, agents, and systems shipped — every one of them live in production. Filter, browse, or just scroll through the lot.
      </p>

      {/* CATEGORY FILTER */}
      <div className="-mx-5 mt-12 flex snap-x gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-16 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "shrink-0 snap-start rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors touch-target",
            !activeCategory
              ? "bg-data/10 text-data border border-data/30"
              : "text-muted-foreground border border-white/10 hover:border-white/30",
          )}
        >
          All ({TOOLS.length})
        </button>
        {ALL_CATEGORIES.map((cat) => {
          const count = TOOLS.filter((t) => t.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(cat === activeCategory ? null : cat)
              }
              className={cn(
                "shrink-0 snap-start rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors touch-target",
                cat === activeCategory
                  ? "bg-data/10 text-data border border-data/30"
                  : "text-muted-foreground border border-white/10 hover:border-white/30",
              )}
            >
              {cat} ({count})
            </button>
          );
        })}
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
