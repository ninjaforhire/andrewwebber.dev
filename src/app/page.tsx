import { StatsCounter } from "@/components/animation/StatsCounter";
import { HeroSection } from "@/components/sections/HeroSection";
import { JourneyTeaser } from "@/components/sections/JourneyTeaser";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <JourneyTeaser />

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-2xl px-8 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          $ echo &quot;let&apos;s build something&quot;
        </p>
        <h2 className="mt-4 font-heading text-3xl font-bold">
          Ready to <span className="text-terminal">collaborate</span>?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Whether you need AI automation, a security audit, or a creative coding partner.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/work#consultation"
            className="rounded-md bg-terminal/10 px-6 py-3 font-mono text-sm text-terminal transition-colors hover:bg-terminal/20"
          >
            Book Consultation →
          </a>
          <a
            href="/about#contact"
            className="rounded-md border border-border px-6 py-3 font-mono text-sm text-muted-foreground transition-colors hover:border-data hover:text-data"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}
