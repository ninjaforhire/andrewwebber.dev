"use client";

import { useEffect, useRef, useState } from "react";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
}

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

function Stat({ value, suffix, label }: StatProps) {
  return (
    <div>
      <div className="crop text-[clamp(72px,10vw,140px)] font-extrabold leading-none text-data tabular-nums">
        <AnimatedNumber target={value} suffix={suffix} />
      </div>
      <div className="font-mono text-sm font-medium tracking-wider text-muted-foreground mt-4 sm:mt-6 uppercase">
        {label}
      </div>
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
    <section className="px-12 sm:px-16 md:px-24 py-32 md:py-40 border-t border-white/5">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-16 md:mb-24">
        § 01 — Output
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        <Stat value={data.tools} suffix="+" label="Tools shipped" />
        <Stat value={data.linesOfCode} label="Lines of code" />
        <Stat value={data.skills} label="Skills authored" />
        <Stat value={data.yearsBuilding} suffix=" y" label="Building" />
      </div>
    </section>
  );
}
