"use client";

import { useEffect, useRef, useState } from "react";

export const DISCIPLINES = [
  { label: "Coding", value: 92, lore: "Python, TS, daily shipping" },
  { label: "Automation", value: 91, lore: "170+ AI tools in production" },
  { label: "Design", value: 78, lore: "Premium event experiences" },
  { label: "Systems", value: 94, lore: "Perfect organization energy" },
  { label: "Security", value: 72, lore: "Pentests, SPECTRE, audits" },
  { label: "AI / ML", value: 90, lore: "Agents, orchestrators, LLMs" },
] as const;

const SIZE = 480;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.36;

function pointAt(angleDeg: number, dist: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [CENTER + Math.cos(rad) * dist, CENTER + Math.sin(rad) * dist];
}

function ringPath(scale: number, n = DISCIPLINES.length): string {
  const points = Array.from({ length: n }, (_, i) =>
    pointAt((360 / n) * i, RADIUS * scale)
  );
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z";
}

function statsPath(values: number[]): string {
  const points = values.map((v, i) =>
    pointAt((360 / DISCIPLINES.length) * i, RADIUS * (v / 100))
  );
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z";
}

export function CharacterStats() {
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [breath, setBreath] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  // Entry animation
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const dur = 1600;
          function tick(now: number) {
            const t = Math.min((now - start) / dur, 1);
            setProgress(1 - Math.pow(1 - t, 3));
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Continuous breathing pulse
  useEffect(() => {
    let raf: number;
    function loop(now: number) {
      setBreath(Math.sin(now / 1500) * 0.5 + 0.5); // 0..1
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const animatedValues = DISCIPLINES.map((d, i) => {
    const base = d.value * progress;
    const hoverBoost = hover === i ? 4 * progress : 0;
    return Math.min(100, base + hoverBoost);
  });
  const totalLevel = Math.round(
    DISCIPLINES.reduce((s, d) => s + d.value, 0) / DISCIPLINES.length
  );
  const breathScale = 1 + breath * 0.015;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-center"
    >
      {/* HEXAGON */}
      <div className="relative" style={{ width: SIZE, maxWidth: "100%" }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto">
          <defs>
            <radialGradient id="statGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ff41" stopOpacity={0.45 + breath * 0.15} />
              <stop offset="100%" stopColor="#00ff41" stopOpacity={0.12 + breath * 0.05} />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation={2 + breath * 1.5} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g style={{ transformOrigin: "50% 50%", transform: `scale(${breathScale})`, transition: "transform 0.05s linear" }}>
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <path
                key={scale}
                d={ringPath(scale)}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}

            {DISCIPLINES.map((_, i) => {
              const [x, y] = pointAt((360 / DISCIPLINES.length) * i, RADIUS);
              return (
                <line
                  key={i}
                  x1={CENTER}
                  y1={CENTER}
                  x2={x}
                  y2={y}
                  stroke={hover === i ? "rgba(0,255,65,0.4)" : "rgba(255,255,255,0.06)"}
                  strokeWidth="1"
                />
              );
            })}

            <path
              d={statsPath(animatedValues)}
              fill="url(#statGrad)"
              stroke="#00ff41"
              strokeWidth="2"
              strokeLinejoin="round"
              filter="url(#glow)"
            />

            {animatedValues.map((v, i) => {
              const [x, y] = pointAt((360 / DISCIPLINES.length) * i, RADIUS * (v / 100));
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={hover === i ? 7 : 4}
                  fill="#00ff41"
                  filter="url(#glow)"
                  style={{ transition: "r 0.2s ease" }}
                />
              );
            })}
          </g>

          {DISCIPLINES.map((d, i) => {
            const angleDeg = (360 / DISCIPLINES.length) * i;
            const [lx, ly] = pointAt(angleDeg, RADIUS * 1.22);
            const anchor =
              angleDeg === 0 || angleDeg === 180
                ? "middle"
                : angleDeg < 180
                ? "start"
                : "end";
            return (
              <g
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "pointer" }}
              >
                <text
                  x={lx}
                  y={ly}
                  fill={hover === i ? "#00ff41" : "#e8e8ec"}
                  fontFamily="var(--font-mono)"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor={anchor}
                  letterSpacing="2"
                  dominantBaseline="middle"
                  style={{ transition: "fill 0.2s ease" }}
                >
                  {d.label.toUpperCase()}
                </text>
                <text
                  x={lx}
                  y={ly + 14}
                  fill="#00ff41"
                  fontFamily="var(--font-mono)"
                  fontSize="11"
                  fontWeight="700"
                  textAnchor={anchor}
                  dominantBaseline="middle"
                >
                  {Math.round(d.value * progress)}
                </text>
              </g>
            );
          })}

          <text
            x={CENTER}
            y={CENTER - 8}
            fill="#7a7a86"
            fontFamily="var(--font-mono)"
            fontSize="9"
            fontWeight="500"
            textAnchor="middle"
            letterSpacing="3"
          >
            LV
          </text>
          <text
            x={CENTER}
            y={CENTER + 14}
            fill="#00ff41"
            fontFamily="var(--font-display)"
            fontSize="32"
            fontWeight="800"
            textAnchor="middle"
            filter="url(#glow)"
          >
            {Math.round(totalLevel * progress)}
          </text>
        </svg>
      </div>

      {/* STAT LEGEND */}
      <div className="space-y-3">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-4">
          / character.stats
        </div>
        {DISCIPLINES.map((d, i) => (
          <div
            key={d.label}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 cursor-pointer"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div
              className="font-mono text-xs font-bold tracking-wider uppercase w-28 transition-colors duration-200"
              style={{ color: hover === i ? "#00ff41" : "var(--foreground)" }}
            >
              {d.label}
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-terminal"
                style={{
                  width: `${d.value * progress}%`,
                  boxShadow: hover === i
                    ? "0 0 14px rgba(0,255,65,0.9)"
                    : "0 0 8px rgba(0,255,65,0.6)",
                  transition: "box-shadow 0.2s ease, width 0.1s linear",
                }}
              />
            </div>
            <div className="font-mono text-xs font-bold text-terminal w-10 text-right tabular-nums">
              {Math.round(d.value * progress)}
            </div>
          </div>
        ))}
        <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="font-mono text-xs font-bold tracking-wider uppercase text-muted-foreground w-28">
            Overall Lv
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground italic">
            still leveling up
          </div>
          <div className="font-mono text-xl font-extrabold text-terminal tabular-nums">
            {Math.round(totalLevel * progress)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================
   COMPACT STRIP variant — for home page
   =========================================================== */

const STRIP_SIZE = 200;
const STRIP_CENTER = STRIP_SIZE / 2;
const STRIP_RADIUS = STRIP_SIZE * 0.38;

function stripPointAt(angleDeg: number, dist: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [STRIP_CENTER + Math.cos(rad) * dist, STRIP_CENTER + Math.sin(rad) * dist];
}

function stripRingPath(scale: number): string {
  const points = DISCIPLINES.map((_, i) =>
    stripPointAt((360 / DISCIPLINES.length) * i, STRIP_RADIUS * scale)
  );
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z";
}

function stripStatsPath(values: number[]): string {
  const points = values.map((v, i) =>
    stripPointAt((360 / DISCIPLINES.length) * i, STRIP_RADIUS * (v / 100))
  );
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ") + " Z";
}

export function CharacterStatsStrip() {
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [breath, setBreath] = useState(0);
  const [rotation, setRotation] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const dur = 1400;
          function tick(now: number) {
            const t = Math.min((now - start) / dur, 1);
            setProgress(1 - Math.pow(1 - t, 3));
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let raf: number;
    function loop(now: number) {
      setBreath(Math.sin(now / 1800) * 0.5 + 0.5);
      setRotation((now / 200) % 360);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const animatedValues = DISCIPLINES.map((d, i) => {
    const base = d.value * progress;
    const hoverBoost = hover === i ? 5 * progress : 0;
    return Math.min(100, base + hoverBoost);
  });
  const totalLevel = Math.round(
    DISCIPLINES.reduce((s, d) => s + d.value, 0) / DISCIPLINES.length
  );
  const breathScale = 1 + breath * 0.02;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 sm:gap-12 items-center max-w-5xl"
    >
      {/* Compact hexagon */}
      <div className="relative shrink-0" style={{ width: STRIP_SIZE, height: STRIP_SIZE }}>
        <svg viewBox={`0 0 ${STRIP_SIZE} ${STRIP_SIZE}`} className="w-full h-auto">
          <defs>
            <radialGradient id="stripGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ff41" stopOpacity={0.45 + breath * 0.15} />
              <stop offset="100%" stopColor="#00ff41" stopOpacity={0.1 + breath * 0.05} />
            </radialGradient>
            <filter id="stripGlow">
              <feGaussianBlur stdDeviation={1.5 + breath * 1} result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background grid — gently rotates */}
          <g
            style={{
              transformOrigin: "50% 50%",
              transform: `rotate(${rotation}deg) scale(${breathScale})`,
              transition: "transform 0.05s linear",
            }}
          >
            {[0.5, 0.75, 1].map((scale) => (
              <path
                key={scale}
                d={stripRingPath(scale)}
                fill="none"
                stroke="rgba(0,255,65,0.08)"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Stat polygon with breathing */}
          <g
            style={{
              transformOrigin: "50% 50%",
              transform: `scale(${breathScale})`,
              transition: "transform 0.05s linear",
            }}
          >
            <path
              d={stripStatsPath(animatedValues)}
              fill="url(#stripGrad)"
              stroke="#00ff41"
              strokeWidth="1.5"
              strokeLinejoin="round"
              filter="url(#stripGlow)"
            />

            {animatedValues.map((v, i) => {
              const [x, y] = stripPointAt((360 / DISCIPLINES.length) * i, STRIP_RADIUS * (v / 100));
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={hover === i ? 4 : 2.5}
                  fill="#00ff41"
                  filter="url(#stripGlow)"
                  style={{ transition: "r 0.2s ease" }}
                />
              );
            })}
          </g>

          {/* Center LV */}
          <text
            x={STRIP_CENTER}
            y={STRIP_CENTER + 6}
            fill="#00ff41"
            fontFamily="var(--font-display)"
            fontSize="22"
            fontWeight="800"
            textAnchor="middle"
            filter="url(#stripGlow)"
          >
            {Math.round(totalLevel * progress)}
          </text>
        </svg>
      </div>

      {/* Compact stat list */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
        {DISCIPLINES.map((d, i) => (
          <div
            key={d.label}
            className="group flex items-center gap-3 cursor-pointer transition-transform duration-200 hover:translate-x-1"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <div
              className="font-mono text-[11px] font-bold tracking-wider uppercase w-20 transition-colors duration-200"
              style={{ color: hover === i ? "#00ff41" : "var(--foreground)" }}
            >
              {d.label}
            </div>
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-terminal"
                style={{
                  width: `${d.value * progress}%`,
                  boxShadow: hover === i
                    ? "0 0 10px rgba(0,255,65,0.9)"
                    : "0 0 4px rgba(0,255,65,0.5)",
                  transition: "box-shadow 0.2s ease, width 0.1s linear",
                }}
              />
            </div>
            <div className="font-mono text-[11px] font-bold text-terminal w-7 text-right tabular-nums">
              {Math.round(d.value * progress)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
