"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="page-x py-16 md:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,176,0,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-6">
          § 00 — For Photo Booth Operators
        </div>

        <h1 className="crop font-extrabold text-[clamp(52px,9vw,130px)] leading-[0.88] max-w-6xl">
          Built for operators.
          <br />
          <span className="text-warm">By an operator.</span>
        </h1>

        <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mt-8 md:mt-12">
          10 years running MIGHTY Photo Booths. 39 autonomous agents. 370+ skills. Everything on
          this page exists because I needed it — and built it myself.
        </p>

        <div className="mt-6 md:mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-3xl">
          Tools, services, and consulting for operators who want to stop doing the same things
          manually every event.
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-wrap gap-3 md:gap-4 mt-10 md:mt-16"
        >
          <a
            href="#services"
            className="font-mono text-sm md:text-base font-medium tracking-wider uppercase text-warm border-2 border-warm/40 bg-warm/5 px-6 py-4 md:px-10 md:py-6 hover:bg-warm/10 active:scale-[0.98] transition"
          >
            → See Services
          </a>
          <a
            href="#tools"
            className="font-mono text-sm md:text-base font-medium tracking-wider uppercase text-muted-foreground border-2 border-white/10 px-6 py-4 md:px-10 md:py-6 hover:border-white/30 active:scale-[0.98] transition"
          >
            → What I&apos;ve Built
          </a>
        </motion.div>

        <div className="mt-10 md:mt-16 flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-warm" />
            Fort Worth, TX
          </span>
          <span>10 yrs operating</span>
          <span>39 agents in production</span>
          <span>500+ events</span>
        </div>
      </div>

      <div className="mt-16 md:mt-24 pt-8 border-t border-white/5 text-sm text-muted-foreground font-mono">
        ↓ scroll
      </div>
    </section>
  );
}
