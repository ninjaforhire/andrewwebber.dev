"use client";

import { ToolCard, type MightyTool } from "./ToolCard";
import { SignatureCard, type SignatureBuild } from "./SignatureCard";
import { cn } from "@/lib/utils";

export interface ToolGroupMeta {
  key: string;
  title: string;
  tagline: string;
  accent: "terminal" | "data" | "creative" | "warm";
}

export const GROUP_ORDER: ToolGroupMeta[] = [
  {
    key: "ops-automation",
    title: "Ops Automation",
    tagline: "The agents that run the day so you don't have to.",
    accent: "terminal",
  },
  {
    key: "sales-leads",
    title: "Sales & Leads",
    tagline: "Find them, know them, close them.",
    accent: "data",
  },
  {
    key: "back-office",
    title: "Back Office",
    tagline: "Money, paperwork, and compliance on rails.",
    accent: "data",
  },
  {
    key: "logistics",
    title: "Logistics",
    tagline: "Every event planned, packed, and findable.",
    accent: "terminal",
  },
  {
    key: "staffing",
    title: "Staffing",
    tagline: "The right people, briefed and dispatched.",
    accent: "warm",
  },
  {
    key: "booth-features",
    title: "Booth Features",
    tagline: "The details guests notice and competitors can't copy.",
    accent: "creative",
  },
  {
    key: "booth-utility",
    title: "Booth Utility",
    tagline: "The workhorse tools that keep the operation sharp.",
    accent: "terminal",
  },
  {
    key: "upsells",
    title: "Upsells",
    tagline: "Deliverables that turn one booking into more revenue.",
    accent: "warm",
  },
  {
    key: "web-design",
    title: "Web Design",
    tagline: "Websites that sell the experience before the event.",
    accent: "data",
  },
];

const ACCENT_TEXT = {
  terminal: "text-terminal",
  data: "text-data",
  creative: "text-creative",
  warm: "text-warm",
};

const ACCENT_PILL = {
  terminal: "border-terminal/30 text-terminal hover:bg-terminal/10",
  data: "border-data/30 text-data hover:bg-data/10",
  creative: "border-creative/30 text-creative hover:bg-creative/10",
  warm: "border-warm/30 text-warm hover:bg-warm/10",
};

export function ToolsGrid({
  tools,
  signatureBuilds,
  totalCount,
}: {
  tools: MightyTool[];
  signatureBuilds: SignatureBuild[];
  totalCount: number;
}) {
  const groups = GROUP_ORDER.map((meta) => ({
    meta,
    tools: tools.filter((t) => t.group === meta.key),
  })).filter((g) => g.tools.length > 0);

  const shown = groups.reduce((n, g) => n + g.tools.length, 0) + signatureBuilds.length;

  return (
    <div>
      {/* Jump nav */}
      <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <a
          href="#signature-builds"
          className="shrink-0 snap-start rounded-full border border-creative/40 bg-creative/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-creative transition-colors touch-target hover:bg-creative/20"
        >
          ★ Signature Builds
        </a>
        {groups.map(({ meta }) => (
          <a
            key={meta.key}
            href={`#group-${meta.key}`}
            className={cn(
              "shrink-0 snap-start rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors touch-target",
              ACCENT_PILL[meta.accent]
            )}
          >
            {meta.title}
          </a>
        ))}
      </div>

      {/* Signature builds */}
      <div id="signature-builds" className="mt-10 scroll-mt-28">
        <div className="mb-1 font-mono text-xs font-medium uppercase tracking-[0.4em] text-creative">
          ★ Signature Builds
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          The flagship systems. Each one holds a full roster inside — click to explore.
        </p>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {signatureBuilds.map((build) => (
            <SignatureCard key={build.slug} build={build} />
          ))}
        </div>
      </div>

      {/* Themed groups */}
      {groups.map(({ meta, tools: groupTools }) => (
        <div key={meta.key} id={`group-${meta.key}`} className="mt-14 scroll-mt-28 md:mt-20">
          <div className="flex items-baseline gap-3">
            <h3 className={cn("font-heading text-xl font-bold md:text-2xl", ACCENT_TEXT[meta.accent])}>
              {meta.title}
            </h3>
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {groupTools.length} {groupTools.length === 1 ? "tool" : "tools"}
            </span>
          </div>
          <p className="mt-1 mb-5 text-sm text-muted-foreground">{meta.tagline}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {groupTools.map((tool, i) => (
              <ToolCard key={tool.slug} tool={tool} index={i} />
            ))}
          </div>
        </div>
      ))}

      <p className="mt-10 font-mono text-xs text-muted-foreground">
        {shown} highlighted here out of {totalCount} built — the full inventory lives on{" "}
        <a href="/work" className="text-data underline decoration-data/40 hover:decoration-data">
          /work
        </a>
        . More run internally, never shown publicly.
      </p>

      <nav
        aria-label="Photo booth tool sections"
        className="mt-8 rounded-xl border border-white/10 bg-card/70 p-4"
      >
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Interactive tool index
        </div>
        <div className="flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <a
            href="#signature-builds"
            className="shrink-0 rounded-full border border-creative/40 bg-creative/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-creative transition-colors hover:bg-creative/20"
          >
            ★ Signature Builds
          </a>
          {groups.map(({ meta }) => (
            <a
              key={`bottom-${meta.key}`}
              href={`#group-${meta.key}`}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                ACCENT_PILL[meta.accent]
              )}
            >
              {meta.title}
            </a>
          ))}
          <a
            href="#tools"
            className="shrink-0 rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:bg-white/5"
          >
            ↑ Top
          </a>
        </div>
      </nav>
    </div>
  );
}
