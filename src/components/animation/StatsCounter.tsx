"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  accent: "terminal" | "data" | "creative" | "warm";
}

const ACCENT_MAP = {
  terminal: "text-terminal",
  data: "text-data",
  creative: "text-creative",
  warm: "text-warm",
};

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const start = performance.now();

          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCurrent(Math.round(eased * target));

            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {current.toLocaleString()}
      {suffix}
    </span>
  );
}

function Stat({ value, suffix, label, accent }: StatProps) {
  return (
    <div className="text-center">
      <p className={cn("font-mono text-3xl font-medium tabular-nums", ACCENT_MAP[accent])}>
        <AnimatedNumber target={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

interface StatsCounterProps {
  stats?: {
    tools: number;
    linesOfCode: number;
    skills: number;
    yearsBuilding: number;
  };
}

export function StatsCounter({ stats }: StatsCounterProps) {
  const data = stats ?? {
    tools: 170,
    linesOfCode: 377000,
    skills: 71,
    yearsBuilding: 20,
  };

  return (
    <section className="relative z-10 mx-auto w-full max-w-3xl px-8 py-24">
      <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        $ wc -l **/*.py **/*.ts
      </p>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <Stat value={data.tools} suffix="+" label="Tools Built" accent="terminal" />
        <Stat
          value={data.linesOfCode}
          suffix="+"
          label="Lines of Code"
          accent="data"
        />
        <Stat value={data.skills} label="Skills" accent="creative" />
        <Stat value={data.yearsBuilding} suffix=" yrs" label="Building" accent="warm" />
      </div>
    </section>
  );
}
