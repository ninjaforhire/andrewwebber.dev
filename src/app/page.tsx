import { StatsCounter } from "@/components/animation/StatsCounter";
import { HeroSection } from "@/components/sections/HeroSection";
import { HeroSectionMobile } from "@/components/sections/HeroSectionMobile";
import { JourneyTeaser } from "@/components/sections/JourneyTeaser";

export default function Home() {
  return (
    <>
      <HeroSectionMobile />
      <HeroSection />
      <StatsCounter />
      <JourneyTeaser />

      {/* ENGAGEMENTS TEASER — data accent, routes to the dedicated page */}
      <section className="page-x section-y border-t border-white/5">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-12">
          § 02 — Engagements
        </div>

        <h2 className="crop font-extrabold text-[clamp(56px,10vw,120px)] leading-[0.9] max-w-5xl">
          Work with me
          <br />
          <span className="text-data">directly.</span>
        </h2>

        <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-2xl mt-8 md:mt-12">
          A handful of consulting slots each quarter. AI implementation, custom dashboards, automation that compounds.
        </p>

        <div className="flex flex-wrap gap-3 md:gap-4 mt-10 md:mt-16">
          <a
            href="/engagements"
            className="font-mono text-sm md:text-base font-medium tracking-wider uppercase text-data border-2 border-data/40 bg-data/5 px-6 py-4 md:px-10 md:py-6 hover:bg-data/10 active:scale-[0.98] transition"
          >
            → See engagements
          </a>
        </div>
      </section>

      {/* CTA — single amber accent, big confident */}
      <section className="page-x section-y border-t border-white/5 mb-12 md:mb-24">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-12">
          § 03 — Work together
        </div>

        <h2 className="crop font-extrabold text-[clamp(56px,10vw,120px)] leading-[0.9] max-w-5xl">
          Got something
          <br />
          <span className="text-warm">worth building?</span>
        </h2>

        <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-2xl mt-8 md:mt-12">
          Limited consulting slots. AI implementation, custom dashboards, automation strategy. Let&apos;s talk.
        </p>

        <div className="flex flex-wrap gap-3 md:gap-4 mt-10 md:mt-16">
          <a
            href="/engagements#consultation"
            className="font-mono text-sm md:text-base font-medium tracking-wider uppercase text-warm border-2 border-warm/40 bg-warm/5 px-6 py-4 md:px-10 md:py-6 hover:bg-warm/10 active:scale-[0.98] transition"
          >
            → Book Consultation · $1K
          </a>
          <a
            href="/about#contact"
            className="font-mono text-sm md:text-base font-medium tracking-wider uppercase text-muted-foreground border-2 border-white/10 px-6 py-4 md:px-10 md:py-6 hover:border-white/30 active:scale-[0.98] transition"
          >
            → Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}
