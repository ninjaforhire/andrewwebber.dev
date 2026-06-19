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
    if (n >= 1_000_000_000) {
      // 12,150,008,887 -> 12.2B (round hundreds-of-millions up to the
      // nearest tenth of a billion; "basic rounding rules" per spec).
      const tenths = Math.round(n / 1e8) / 10;
      return tenths.toFixed(1) + "B";
    }
    if (n >= 1_000_000) {
      return (Math.round(n / 1e5) / 10).toFixed(1) + "M";
    }
    if (n >= 1_000) {
      return (Math.round(n / 100) / 10).toFixed(1) + "K";
    }
    return n.toLocaleString();
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
  // Font max capped so the widest number (7-digit LOC, 2,459,266) fits a 5-col
  // desktop slot without bleeding into the next column. text-center anchors the
  // number above its label; the parent grid is items-start so every number
  // shares one baseline even when a label wraps to two lines.
  return (
    <div className="min-w-0 text-center">
      <div className="crop text-[clamp(20px,3.3vw,34px)] font-extrabold leading-none text-data tabular-nums whitespace-nowrap">
        <AnimatedNumber target={value} suffix={suffix} format={format} />
      </div>
      <div className="font-mono text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.18em] text-muted-foreground mt-3 sm:mt-4 uppercase leading-tight">
        {label}
      </div>
    </div>
  );
}

function SubStat({ value, label, format = "default" }: StatProps) {
  // Tokens render in compact form ("12.2B") so this clamp can run closer to
  // Stat's top-tier scale without overflowing. Still ~30% smaller than Stat
  // because the token count is naturally the largest number on the page.
  return (
    <div className="min-w-0 text-center">
      <div className="crop text-[clamp(18px,3.5vw,32px)] font-extrabold leading-none text-data/85 tabular-nums whitespace-nowrap">
        <AnimatedNumber target={value} format={format} />
      </div>
      <div className="font-mono text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.2em] text-muted-foreground mt-3 sm:mt-5 uppercase">
        {label}
      </div>
    </div>
  );
}

interface LiveStats {
  tools: number;
  skills: number;
  linesOfCode: number;
  commitsShipped: number;
  agentsLive: number;
  claudeHours: number;
  claudeTokens: number;
}

const ZERO: LiveStats = {
  tools: 0,
  skills: 0,
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
          Since January 1st, 2026.
          <span className="block mt-2 text-muted-foreground normal-case tracking-normal text-xs sm:text-sm">
            Some were even legible.
          </span>
        </figcaption>

        {/* Top row: four headline counts, centered. 2-up on mobile, 4-up on desktop. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-y-10 gap-x-4 sm:gap-x-8 items-start justify-items-center">
          <Stat value={data.tools} label="Tools" />
          <Stat value={data.skills} label="Skills" />
          <Stat value={data.agentsLive} label="Agents" />
          <Stat value={data.commitsShipped} label="Commits" />
        </div>

        {/* Bottom row: the two Claude counts + Lines of Code last, centered. */}
        <div className="mt-10 pt-8 sm:mt-14 sm:pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-y-8 gap-x-4 sm:gap-x-8 items-start justify-items-center">
          <Stat value={data.claudeHours} label="Hours with Claude" />
          <SubStat value={data.claudeTokens} label="Tokens through Claude" format="compact" />
          <Stat value={data.linesOfCode} label="Lines of Code" />
        </div>
      </figure>
    </section>
  );
}
