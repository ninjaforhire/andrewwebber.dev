"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  { text: "Systems Architect", color: "text-terminal" },
  { text: "Agentic Engineer", color: "text-data" },
  { text: "Cybersecurity Expert", color: "text-creative" },
];

const DIVIDER_COLORS = ["bg-terminal", "bg-data", "bg-creative"];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ROLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="hidden min-h-[100dvh] page-x pt-16 pb-12 md:flex flex-col justify-between relative overflow-hidden">
      {/* Soft radial glow behind the name */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 60%, rgba(0,255,65,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Top meta bar */}
      <div className="relative flex justify-between items-start">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-muted-foreground">
          Systems · Agents · Security · Fort Worth, TX
        </div>
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-terminal animate-pulse" />
          Available · 2026
        </div>
      </div>

      {/* Massive cropped name — brushed steel + animated sheen */}
      <div className="relative">
        <h1 className="crop font-extrabold leading-[0.82] hero-glow relative">
          <span className="block text-[clamp(80px,16vw,260px)] hero-steel">Andrew</span>
          <span className="block text-[clamp(80px,16vw,260px)] -mt-2 sm:-mt-4">
            <span className="hero-shine">Webber</span>
            <span className="text-[clamp(24px,4vw,72px)] font-mono font-medium tracking-tight align-top text-muted-foreground ml-2">
              .dev
              <span className="caret-blink text-terminal">_</span>
            </span>
          </span>
        </h1>
      </div>

      {/* Bottom row — descriptor + scroll hint */}
      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 max-w-7xl">
        <div className="flex items-center gap-4">
          {ROLES.map((role, i) => (
            <button
              key={role.text}
              onClick={() => setActiveIndex(i)}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <motion.span
                className={`h-2 w-2 rounded-full ${DIVIDER_COLORS[i]}`}
                animate={{
                  scale: i === activeIndex ? [1, 1.4, 1] : 1,
                  opacity: i === activeIndex ? 1 : 0.4,
                }}
                transition={{ duration: 0.6, repeat: i === activeIndex ? Infinity : 0, repeatDelay: 2 }}
              />
              <span
                className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-all duration-500 ${
                  i === activeIndex ? role.color : "text-muted-foreground/40"
                } group-hover:opacity-100`}
              >
                {role.text}
              </span>
              {i < ROLES.length - 1 && (
                <span className="text-muted-foreground/20 text-xl font-light ml-1">·</span>
              )}
            </button>
          ))}
        </div>
        <div className="font-mono text-sm text-muted-foreground shrink-0">
          ↓ scroll
        </div>
      </div>
    </section>
  );
}
