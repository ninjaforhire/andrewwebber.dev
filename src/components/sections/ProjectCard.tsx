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

export function ProjectCard({ project }: { project: Project }) {
  const Wrapper = project.link ? "a" : "div";
  const wrapperProps = project.link
    ? { href: project.link, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={cn(
        "group block rounded-lg border border-border bg-card/50 p-5 transition-all duration-300",
        ACCENT_BORDER[project.accent],
        project.link && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-heading text-base font-bold">{project.title}</h3>
        {project.link && (
          <ExternalLink
            size={14}
            className={cn(
              "mt-0.5 opacity-0 transition-opacity group-hover:opacity-100",
              ACCENT_TEXT[project.accent]
            )}
          />
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={cn(
              "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider",
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
