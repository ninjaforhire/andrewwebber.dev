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
    <div className="px-12 sm:px-16 md:px-24 py-24 md:py-32">

      {/* HEADER */}
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-6">
        § 01 — Projects
      </div>
      <h1 className="crop font-extrabold text-[clamp(56px,10vw,140px)] leading-[0.88] mb-8">
        A selection of <span className="text-data">things</span><br />
        I&apos;ve built.
      </h1>
      <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl">
        170+ tools, agents, and systems shipped. Most live in production today. A few of the highlights below.
      </p>

      {/* TAG FILTER */}
      <div className="mt-16 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={cn(
            "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
            !activeTag
              ? "bg-data/10 text-data border border-data/30"
              : "text-muted-foreground border border-white/10 hover:border-white/30"
          )}
        >
          All
        </button>
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={cn(
              "rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
              tag === activeTag
                ? "bg-data/10 text-data border border-data/30"
                : "text-muted-foreground border border-white/10 hover:border-white/30"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* PROJECT GRID */}
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>

      {/* SERVICES */}
      <div className="mt-32 md:mt-40 pt-32 border-t border-white/5">
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
      <div className="mt-32 md:mt-40 pt-32 border-t border-white/5">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-6">
          § 03 — Book a call
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-8">
          Tell me what<br />
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
