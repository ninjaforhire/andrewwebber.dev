"use client";

import { cn } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import { ExternalLink } from "lucide-react";

const ACCENT_BORDER = {
  terminal: "hover:border-terminal/40 hover:glow-terminal",
  data: "hover:border-data/40 hover:glow-data",
  creative: "hover:border-creative/40 hover:glow-creative",
  warm: "hover:border-warm/40 hover:glow-warm",
};

const ACCENT_TEXT = {
  terminal: "text-terminal",
  data: "text-data",
  creative: "text-creative",
  warm: "text-warm",
};

const ACCENT_BG = {
  terminal: "bg-terminal/10 text-terminal",
  data: "bg-data/10 text-data",
  creative: "bg-creative/10 text-creative",
  warm: "bg-warm/10 text-warm",
};

const ACCENT_DOT = {
  terminal: "bg-terminal",
  data: "bg-data",
  creative: "bg-creative",
  warm: "bg-warm",
};

export interface ProjectDetail {
  blurb: string;
  highlights: { label: string; text: string }[];
  footnote?: string;
}

export function ProjectCard({
  project,
  featured = false,
  detail,
}: {
  project: Project;
  featured?: boolean;
  detail?: ProjectDetail;
}) {
  const Wrapper = project.link ? "a" : "div";
  const wrapperProps = project.link
    ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group block rounded-lg border border-border bg-card/50 transition-all duration-300",
        featured ? "p-8 md:p-10 ring-1 ring-white/5" : "p-5",
        ACCENT_BORDER[project.accent],
        project.link && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={cn(
            "font-heading font-bold",
            featured ? "text-2xl md:text-3xl leading-tight" : "text-base"
          )}
        >
          {project.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          {featured && (
            <span
              className={cn(
                "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
                "border-terminal/30 bg-terminal/10 text-terminal"
              )}
              aria-label="Actively iterating"
            >
              <span className="mr-1 inline-block h-1.5 w-1.5 -translate-y-[1px] rounded-full bg-terminal animate-pulse" />
              Live · iterating
            </span>
          )}
          {project.link && (
            <ExternalLink
              size={featured ? 18 : 14}
              className={cn(
                "mt-0.5 opacity-0 transition-opacity group-hover:opacity-100",
                ACCENT_TEXT[project.accent]
              )}
            />
          )}
        </div>
      </div>
      {featured && detail ? (
        <div className="mt-4">
          <p className="text-base md:text-[17px] leading-relaxed text-foreground/90">
            {detail.blurb}
          </p>
          <ul className="mt-5 space-y-2.5">
            {detail.highlights.map((h) => (
              <li
                key={h.label}
                className="flex items-start gap-3 text-sm md:text-[15px] leading-relaxed text-muted-foreground"
              >
                <span
                  className={cn(
                    "mt-2 h-1.5 w-1.5 shrink-0 rounded-full",
                    ACCENT_DOT[project.accent]
                  )}
                  aria-hidden
                />
                <span>
                  <span className={cn("font-semibold", ACCENT_TEXT[project.accent])}>
                    {h.label}
                  </span>
                  <span className="text-muted-foreground"> — {h.text}</span>
                </span>
              </li>
            ))}
          </ul>
          {detail.footnote && (
            <p className="mt-5 border-t border-white/5 pt-4 text-sm leading-relaxed text-muted-foreground/80">
              {detail.footnote}
            </p>
          )}
        </div>
      ) : (
        <p
          className={cn(
            "leading-relaxed text-muted-foreground",
            featured ? "mt-4 text-base md:text-[17px]" : "mt-2 text-sm"
          )}
        >
          {project.description}
        </p>
      )}
      <div className={cn("flex flex-wrap gap-1.5", featured ? "mt-5" : "mt-3")}>
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-2 py-0.5 font-mono uppercase tracking-wider",
              featured ? "text-[11px] px-2.5 py-1" : "text-[10px]",
              ACCENT_BG[project.accent]
            )}
          >
            {tag}
          </span>
        ))}
      </div>
    </Wrapper>
  );
}
