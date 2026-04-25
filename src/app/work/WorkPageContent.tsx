"use client";

import { useState } from "react";
import { PROJECTS, ALL_TAGS } from "@/lib/projects";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { ServiceTier } from "@/components/sections/ServiceTier";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { cn } from "@/lib/utils";

export function WorkPageContent() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? PROJECTS.filter((p) => p.tags.includes(activeTag))
    : PROJECTS;

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-8 py-24">
      {/* Header */}
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-data">
        $ ls ~/projects
      </p>
      <h1 className="mt-2 font-heading text-4xl font-bold">Work</h1>
      <p className="mt-2 text-muted-foreground">
        A selection of tools, agents, and systems I&apos;ve built.
      </p>

      {/* Tag filter */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={cn(
            "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
            !activeTag
              ? "bg-data/10 text-data"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </button>
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={cn(
              "rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
              tag === activeTag
                ? "bg-data/10 text-data"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      {/* Services */}
      <div className="mt-32">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-data">
          $ cat services.yml
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold">Services</h2>
        <p className="mt-2 text-muted-foreground">
          Hands-on consulting for businesses ready to level up.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
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
            accent="data"
            featured
          />
        </div>
      </div>

      {/* Consultation form */}
      <div className="mt-32">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-data">
          $ ./book-consultation.sh
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold">
          Book a Consultation
        </h2>
        <p className="mt-2 mb-8 text-muted-foreground">
          Tell me what you&apos;re working on. I&apos;ll respond within 24 hours.
        </p>
        <ConsultationForm />
      </div>
    </div>
  );
}
