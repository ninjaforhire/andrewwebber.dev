"use client";

import { useEffect, useRef, useState } from "react";

const DISCIPLINES = [
  { label: "Coding", value: 92, lore: "Python, TS, daily shipping" },
  { label: "Automation", value: 96, lore: "170+ AI tools in production" },
  { label: "Design", value: 78, lore: "Premium event experiences" },
  { label: "Systems", value: 94, lore: "Perfect organization energy" },
  { label: "Security", value: 72, lore: "Pentests, SPECTRE, audits" },
  { label: "AV / Live", value: 88, lore: "20 yrs sound, lights, cameras" },
];

const SIZE = 480;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.36;

function pointAt(angleDeg: number, dist: number): [number, number] {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [CENTER + Math.cos(rad) * dist, CENTER + Math.sin(rad) * dist];
}

function ringPath(scale: number): string {
  const points = DISCIPLINES.map((_, i) => pointAt((360 / DISCIPLINES.length) * i, RADIUS * scale));
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

  const animatedValues = DISCIPLINES.map((d) => d.value * progress);
  const totalLevel = Math.round(
    DISCIPLINES.reduce((s, d) => s + d.value, 0) / DISCIPLINES.length
  );

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-center">
      {/* HEXAGON */}
      <div className="relative" style={{ width: SIZE, maxWidth: "100%" }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto">
          <defs>
            <radialGradient id="statGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00ff41" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00ff41" stopOpacity="0.15" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric hex grid */}
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <path
              key={scale}
              d={ringPath(scale)}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          ))}

          {/* Axis lines */}
          {DISCIPLINES.map((_, i) => {
            const [x, y] = pointAt((360 / DISCIPLINES.length) * i, RADIUS);
            return (
              <line
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={x}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Stat polygon — animated, green fill + glow */}
          <path
            d={statsPath(animatedValues)}
            fill="url(#statGrad)"
            stroke="#00ff41"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#glow)"
            style={{ transition: "d 0.1s linear" }}
          />

          {/* Stat dots at vertices */}
          {animatedValues.map((v, i) => {
            const [x, y] = pointAt((360 / DISCIPLINES.length) * i, RADIUS * (v / 100));
            return <circle key={i} cx={x} cy={y} r="4" fill="#00ff41" filter="url(#glow)" />;
          })}

          {/* Discipline labels */}
          {DISCIPLINES.map((d, i) => {
            const angleDeg = (360 / DISCIPLINES.length) * i;
            const [lx, ly] = pointAt(angleDeg, RADIUS * 1.22);
            // anchor based on angle
            const anchor =
              angleDeg === 0 || angleDeg === 180
                ? "middle"
                : angleDeg < 180
                ? "start"
                : "end";
            return (
              <g key={i}>
                <text
                  x={lx}
                  y={ly}
                  fill="#e8e8ec"
                  fontFamily="var(--font-mono)"
                  fontSize="12"
                  fontWeight="600"
                  textAnchor={anchor}
                  letterSpacing="2"
                  dominantBaseline="middle"
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

          {/* Center label */}
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
        {DISCIPLINES.map((d) => (
          <div key={d.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
            <div className="font-mono text-xs font-bold tracking-wider uppercase text-foreground w-28">
              {d.label}
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-terminal"
                style={{
                  width: `${d.value * progress}%`,
                  boxShadow: "0 0 8px rgba(0,255,65,0.6)",
                  transition: "width 0.1s linear",
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
