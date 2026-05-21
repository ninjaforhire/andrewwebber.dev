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
      maximumFractionDigits: 1,
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
  const currentRef = useRef(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inViewRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const runAnimation = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      const startValue = currentRef.current;
      const delta = target - startValue;
      if (delta === 0) return;
      const duration = 1200;
      const startTime = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrent(Math.round(startValue + delta * eased));
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (inViewRef.current) {
      runAnimation();
      return () => {
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          inViewRef.current = true;
          runAnimation();
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
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
    <div className="min-w-0">
      <div className="crop text-[clamp(20px,5.5vw,52px)] font-extrabold leading-none text-data tabular-nums whitespace-nowrap">
        <AnimatedNumber target={value} suffix={suffix} format={format} />
      </div>
      <div className="font-mono text-[10px] sm:text-sm font-medium tracking-wider text-muted-foreground mt-3 sm:mt-6 uppercase">
        {label}
      </div>
    </div>
  );
}

function SubStat({ value, label, format = "default" }: StatProps) {
  // Smaller min font than top-tier Stat so a 14-char number like
  // 11,962,615,408 still fits in a ~90-150px mobile column without wrapping.
  return (
    <div className="min-w-0">
      <div className="crop text-[clamp(11px,3.6vw,28px)] font-bold leading-none text-data/80 tabular-nums whitespace-nowrap">
        <AnimatedNumber target={value} format={format} />
      </div>
      <div className="font-mono text-[9px] sm:text-xs font-medium tracking-wider text-muted-foreground/70 mt-2 sm:mt-4 uppercase">
        {label}
      </div>
    </div>
  );
}

interface LiveStats {
  tools: number;
  linesOfCode: number;
  commitsShipped: number;
  agentsLive: number;
  claudeHours: number;
  claudeTokens: number;
}

const ZERO: LiveStats = {
  tools: 0,
  linesOfCode: 0,
  commitsShipped: 0,
  agentsLive: 0,
  claudeHours: 0,
  claudeTokens: 0,
};

export function StatsCounter() {
  const [data, setData] = useState<LiveStats>(ZERO);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <section className="page-x section-y border-t border-white/5">
      <figure className="rounded-2xl border border-white/10 bg-white/[0.015] px-6 py-10 sm:px-10 sm:py-14">
        <figcaption className="font-mono text-[11px] sm:text-sm font-medium tracking-[0.3em] uppercase text-data mb-10 md:mb-14 text-center leading-relaxed">
          Since January 1st, 2026 — all of this.
          <span className="block mt-2 text-muted-foreground normal-case tracking-normal text-xs sm:text-sm">
            Some were even legible.
          </span>
        </figcaption>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
          <Stat value={data.tools} label="Tools Shipped" />
          <Stat value={data.linesOfCode} label="Lines of Code" />
          <Stat value={data.commitsShipped} label="Commits Shipped" />
          <Stat value={data.agentsLive} label="Live Agents" />
        </div>

        <div className="mt-10 pt-8 sm:mt-14 sm:pt-10 border-t border-white/10 grid grid-cols-2 gap-12 sm:gap-16">
          <SubStat value={data.claudeHours} label="Hours with Claude" />
          <SubStat value={data.claudeTokens} label="Tokens through Claude" />
        </div>
      </figure>
    </section>
  );
}
