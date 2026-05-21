"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { cn } from "@/lib/utils";

interface Props {
  projects: Project[];
}

export function WorkCardCarousel({ projects }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = Number(
            (visible.target as HTMLElement).dataset.index ?? 0,
          );
          setActiveIndex(idx);
        }
      },
      { root, threshold: [0.55, 0.75, 0.95] },
    );

    const cards = root.querySelectorAll<HTMLElement>("[data-carousel-card]");
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [projects.length]);

  function scrollTo(idx: number) {
    const root = scrollerRef.current;
    if (!root) return;
    const card = root.querySelector<HTMLElement>(
      `[data-carousel-card][data-index="${idx}"]`,
    );
    card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  return (
    <div className="md:hidden">
      <div
        ref={scrollerRef}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
        aria-roledescription="carousel"
      >
        {projects.map((project, i) => (
          <div
            key={project.title}
            data-carousel-card
            data-index={i}
            className="w-[85vw] max-w-[420px] flex-shrink-0 snap-center"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2" role="tablist">
        {projects.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-label={`Go to project ${i + 1}`}
            aria-selected={i === activeIndex}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex
                ? "w-6 bg-data shadow-[0_0_10px_rgba(0,229,255,0.6)]"
                : "w-1.5 bg-muted-foreground/30",
            )}
          />
        ))}
      </div>
    </div>
  );
}
