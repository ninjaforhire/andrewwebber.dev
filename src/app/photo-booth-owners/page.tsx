import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/photo-booth-owners/Hero";
import { ToolsGrid } from "@/components/photo-booth-owners/ToolsGrid";
import { ServicesExplorer } from "@/components/photo-booth-owners/services/ServicesExplorer";
import { GuideCard } from "@/components/photo-booth-owners/GuideCard";
import { InquiryForm } from "@/components/photo-booth-owners/InquiryForm";
import { OffersSection } from "@/components/sections/OffersSection";
import { BOOTH_OFFERS } from "@/lib/offers";
import toolsData from "@/data/mighty-tools.json";
import overridesData from "@/data/tools-overrides.json";
import extraData from "@/data/tools-extra.json";
import guidesData from "@/data/guides.json";
import type { MightyTool } from "@/components/photo-booth-owners/ToolCard";
import { getSignatureBuilds } from "@/lib/signature-builds";

export const metadata: Metadata = {
  title: "For Photo Booth Operators",
  description:
    "Tools, automation, and consulting for photo booth business owners. Built by a working operator since 2016. Available for hire.",
};

interface ToolOverride {
  slug: string;
  name?: string;
  category?: string;
  group?: string;
  badge?: string;
  body?: string[];
  blurb?: string;
  time_saved_per_event?: string;
  time_saved_per_day?: string;
}

// Curated grid: only tools with an override (they carry group + real copy),
// plus hand-added extras not in the scan (MIGHTY-CRM, Remote Event Monitoring).
function curatedTools(): MightyTool[] {
  const toolMap = new Map((toolsData as MightyTool[]).map((t) => [t.slug, t]));

  // Iterate the overrides array (not the scan) so card order inside each
  // group is curated, not alphabetical.
  const curated = (overridesData as ToolOverride[])
    .filter((o) => toolMap.has(o.slug))
    .map((o) => {
      const tool = toolMap.get(o.slug)!;
      return {
        ...tool,
        name: o.name ?? tool.name,
        category: o.category ?? tool.category,
        group: o.group,
        badge: o.badge,
        body: o.body,
        blurb: o.blurb,
        time_saved_per_event: o.time_saved_per_event,
        time_saved_per_day: o.time_saved_per_day,
      };
    });

  return [...curated, ...(extraData as MightyTool[])];
}

export default function PhotoBoothOwnersPage() {
  const tools = curatedTools();
  const signatureBuilds = getSignatureBuilds();
  const totalCount = (toolsData as MightyTool[]).length;

  return (
    <>
      <Hero />

      {/* TOOLS */}
      <section id="tools" className="page-x pb-20 md:pb-40 border-t border-white/5 pt-16 md:pt-32">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-6">
          § 01 — What I&apos;ve Built
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-6">
          Tools built for
          <br />
          <span className="text-warm">my own shop.</span>
        </h2>
        <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mb-12 md:mb-16">
          Every tool below runs at MIGHTY Photo Booths. Built to solve a real problem, not a
          hypothetical one. Capability and time savings — no implementation details published.
        </p>
        <ToolsGrid tools={tools} signatureBuilds={signatureBuilds} totalCount={totalCount} />
      </section>

      {/* SERVICES */}
      <section id="services" className="page-x pb-20 md:pb-40 border-t border-white/5 pt-16 md:pt-32">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-creative mb-6">
          § 02 — Services for Hire
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-6">
          Hire me to build
          <br />
          <span className="text-creative">yours.</span>
        </h2>
        <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mb-12 md:mb-16">
          Software builds, brand design, SEO, competitive intel, security, and ops tools. Everything
          is priced honestly. If it&apos;s not listed, ask.
        </p>
        <ServicesExplorer />

        <div className="mt-10 md:mt-16 rounded-lg border border-warm/20 bg-warm/5 p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-warm mb-2">
            Design Request Policy
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All design work requires 7-day notice, a completed brief, and full payment before any
            preview is delivered.{" "}
            <a
              href="/photo-booth-owners/design-request"
              className="text-warm underline decoration-warm/40 hover:decoration-warm transition-colors"
            >
              Read the full policy →
            </a>
          </p>
        </div>
      </section>

      {/* VLOGS */}
      <section id="vlogs" className="page-x pb-20 md:pb-40 border-t border-white/5 pt-16 md:pt-32">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-6">
          § 03 — Deep Dives
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-6">
          Behind the
          <br />
          <span className="text-data">build.</span>
        </h2>
        <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mb-12 md:mb-16">
          Walkthroughs, build logs, and operator breakdowns. Supercut recordings and YouTube sessions
          — no fluff.
        </p>
        <Link
          href="/photo-booth-owners/vlogs"
          className="inline-block font-mono text-sm uppercase tracking-wider text-data border border-data/30 px-6 py-3 hover:bg-data/5 transition-colors"
        >
          → Browse all deep dives
        </Link>
      </section>

      {/* CONSULT + GUIDES */}
      <section id="consult" className="page-x pb-20 md:pb-40 border-t border-white/5 pt-16 md:pt-32">
        <OffersSection
          id="booth-consult"
          eyebrow="§ 04 — Consultation for operators"
          headingTop="Put the stack"
          headingAccent="in your shop."
          accent="terminal"
          sub="Booth-specific help at a fixed price. Whatever platform you run, whatever you wish were automated — I've probably already built it for MIGHTY."
          offers={BOOTH_OFFERS}
        />

        <h3 className="font-heading text-2xl font-bold mt-20 md:mt-32 mb-8">PDF Guides</h3>
        <div className="grid gap-4 md:grid-cols-3 max-w-5xl">
          {(guidesData as Parameters<typeof GuideCard>[0]["guide"][]).map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      {/* INQUIRY FORM */}
      <section id="inquiry" className="page-x pb-20 md:pb-40 border-t border-white/5 pt-16 md:pt-32">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-6">
          § 05 — Get in Touch
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-6">
          What are you
          <br />
          <span className="text-warm">trying to solve?</span>
        </h2>
        <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mb-12 md:mb-16">
          Fill out the form. I read everything. If it&apos;s a fit, I&apos;ll reply within 24 hours.
        </p>
        <InquiryForm />
      </section>
    </>
  );
}
