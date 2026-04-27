import { StatsCounter } from "@/components/animation/StatsCounter";
import { HeroSection } from "@/components/sections/HeroSection";
import { JourneyTeaser } from "@/components/sections/JourneyTeaser";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <JourneyTeaser />

      {/* CTA — single amber accent, big confident */}
      <section className="px-12 sm:px-16 md:px-24 py-32 md:py-40 border-t border-white/5 mb-24">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-12">
          § 03 — Work together
        </div>

        <h2 className="crop font-extrabold text-[clamp(56px,10vw,120px)] leading-[0.9] max-w-5xl">
          Got something
          <br />
          <span className="text-warm">worth building?</span>
        </h2>

        <p className="text-2xl leading-relaxed text-muted-foreground max-w-2xl mt-12">
          Limited consulting slots. AI implementation, custom dashboards, automation strategy. Let&apos;s talk.
        </p>

        <div className="flex flex-wrap gap-4 mt-16">
          <a
            href="/work#consultation"
            className="font-mono text-base font-medium tracking-wider uppercase text-warm border-2 border-warm/40 bg-warm/5 px-10 py-6 hover:bg-warm/10 transition-colors"
          >
            → Book Consultation · $1K
          </a>
          <a
            href="/about#contact"
            className="font-mono text-base font-medium tracking-wider uppercase text-muted-foreground border-2 border-white/10 px-10 py-6 hover:border-white/30 transition-colors"
          >
            → Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}
