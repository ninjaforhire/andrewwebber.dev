import type { Metadata } from "next";
import { Hero } from "@/components/photo-booth-owners/Hero";
import { ToolsGrid } from "@/components/photo-booth-owners/ToolsGrid";
import { ServicesGrid } from "@/components/photo-booth-owners/ServicesGrid";
import toolsData from "@/data/mighty-tools.json";
import overridesData from "@/data/tools-overrides.json";
import type { MightyTool } from "@/components/photo-booth-owners/ToolCard";

export const metadata: Metadata = {
  title: "For Photo Booth Operators",
  description:
    "Tools, automation, and consulting for photo booth business owners. Built by a 10-year operator. Available for hire.",
};

function mergeTools(): MightyTool[] {
  const overrides = overridesData as Array<{
    slug: string;
    name?: string;
    blurb?: string;
    time_saved_per_event?: string;
    category?: string;
  }>;
  const overrideMap = new Map(overrides.map((o) => [o.slug, o]));

  return (toolsData as MightyTool[]).map((tool) => {
    const override = overrideMap.get(tool.slug);
    if (!override) return tool;
    return {
      ...tool,
      name: override.name ?? tool.name,
      category: override.category ?? tool.category,
      blurb: override.blurb,
      time_saved_per_event: override.time_saved_per_event,
    };
  });
}

export default function PhotoBoothOwnersPage() {
  const tools = mergeTools();

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
        <ToolsGrid tools={tools} />
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
        <ServicesGrid />

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
        <a
          href="/photo-booth-owners/vlogs"
          className="inline-block font-mono text-sm uppercase tracking-wider text-data border border-data/30 px-6 py-3 hover:bg-data/5 transition-colors"
        >
          → Browse all deep dives
        </a>
      </section>

      {/* CONSULT + GUIDES */}
      <section id="consult" className="page-x pb-20 md:pb-40 border-t border-white/5 pt-16 md:pt-32">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-6">
          § 04 — Consult + Guides
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-6">
          Pick my brain.
          <br />
          <span className="text-terminal">Or read the playbook.</span>
        </h2>
        <p className="text-xl leading-relaxed text-muted-foreground max-w-3xl mb-12 md:mb-16">
          10-minute discovery calls and 1-hour AMAs. PDF guides for operators who want to move at
          their own pace.
        </p>

        <div className="rounded-lg border border-border bg-card/30 p-8 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Booking
          </p>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Cal.com embed coming soon. In the meantime, use the inquiry form below and mention
            &ldquo;consultation&rdquo; in your message.
          </p>
          <a
            href="#inquiry"
            className="font-mono text-sm uppercase tracking-wider text-terminal border border-terminal/30 px-6 py-3 hover:bg-terminal/5 transition-colors block text-center"
          >
            → Send Inquiry
          </a>
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

        <div className="rounded-lg border border-border bg-card/30 p-8 max-w-2xl">
          <p className="font-mono text-xs text-muted-foreground text-center py-8">
            Inquiry form — coming in Phase 3. Email directly: andrew@mightyphotobooths.com
          </p>
        </div>
      </section>
    </>
  );
}
