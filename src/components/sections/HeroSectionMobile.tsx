"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const ROLES = [
  { text: "Systems Architect", color: "text-terminal", dot: "bg-terminal" },
  { text: "Agentic Engineer", color: "text-data", dot: "bg-data" },
  { text: "Cybersecurity", color: "text-creative", dot: "bg-creative" },
];

export function HeroSectionMobile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const glowOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden page-x pt-6 pb-10 md:hidden"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          y: glowY,
          opacity: glowOpacity,
          background:
            "radial-gradient(ellipse 90% 40% at 50% 55%, rgba(0,255,65,0.06) 0%, transparent 65%)",
        }}
      />

      {/* Top meta */}
      <div className="relative flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
          Fort Worth, TX
        </span>
        <span className="font-mono flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-terminal">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-terminal" />
          Available · 2026
        </span>
      </div>

      {/* Stacked title — Andrew / Webber / .dev_ */}
      <div className="relative">
        <h1 className="crop hero-glow font-extrabold leading-[0.86]">
          <span className="hero-steel block text-[clamp(64px,22vw,120px)]">
            Andrew
          </span>
          <span className="hero-shine -mt-1 block text-[clamp(64px,22vw,120px)]">
            Webber
          </span>
          <span className="mt-1 block font-mono text-[clamp(20px,7vw,36px)] font-medium tracking-tight text-muted-foreground">
            .dev<span className="caret-blink text-terminal">_</span>
          </span>
        </h1>
      </div>

      {/* Vertical role rotator — full-width tap rows */}
      <div className="relative flex flex-col gap-1">
        <span className="mb-2 font-mono text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
          § Disciplines
        </span>
        {ROLES.map((role, i) => {
          const isActive = i === activeIndex;
          return (
            <motion.button
              key={role.text}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveIndex(i)}
              className="flex w-full items-center gap-3 py-3 text-left touch-target"
              aria-pressed={isActive}
            >
              <motion.span
                className={`h-2 w-2 rounded-full ${role.dot}`}
                animate={{
                  scale: isActive ? [1, 1.4, 1] : 1,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{
                  duration: 0.6,
                  repeat: isActive ? Infinity : 0,
                  repeatDelay: 2,
                }}
              />
              <span
                className={`text-xl font-bold tracking-tight transition-colors duration-500 ${
                  isActive ? role.color : "text-muted-foreground/50"
                }`}
              >
                {role.text}
              </span>
            </motion.button>
          );
        })}
        <div className="mt-6 font-mono text-xs text-muted-foreground">
          ↓ scroll
        </div>
      </div>
    </section>
  );
}
