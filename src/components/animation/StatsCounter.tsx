"use client";

import { useEffect, useRef, useState } from "react";

type FormatType = "compact" | "default";

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  format?: FormatType;
}

function formatNumber(n: number, format: FormatType): string {
  if (format === "compact") {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(n);
  }
  return n.toLocaleString();
}

function AnimatedNumber({
  target,
  suffix = "",
  format = "default",
}: {
  target: number;
  suffix?: string;
  format?: FormatType;
}) {
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
      {formatNumber(current, format)}
      {suffix && <span className="text-[0.55em] align-top ml-0.5">{suffix}</span>}
    </span>
  );
}

function Stat({ value, suffix, label, format = "default" }: StatProps) {
  return (
    <div className="min-w-0 overflow-hidden">
      <div className="crop text-[clamp(56px,7.5vw,104px)] font-extrabold leading-none text-data tabular-nums whitespace-nowrap">
        <AnimatedNumber target={value} suffix={suffix} format={format} />
      </div>
      <div className="font-mono text-xs sm:text-sm font-medium tracking-wider text-muted-foreground mt-4 sm:mt-6 uppercase">
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <Stat value={data.tools} suffix="+" label="Tools shipped" />
        <Stat value={data.linesOfCode} format="compact" suffix="+" label="Lines of code" />
        <Stat value={data.skills} label="Skills authored" />
        <Stat value={data.yearsBuilding} suffix="yr" label="Building" />
      </div>
    </section>
  );
}
