/* eslint-disable react-hooks/purity */
"use client";

import { useMemo } from "react";

const WORDS = [
  "BASTION", "BLACKTHORN", "CLOUDBREAK", "CODECOUNCIL", "DECEPTICON",
  "DOSSIER", "EMBER", "GAUNTLET", "RAVEN", "SHANNON", "WATCHTOWER",
  "GHOST", "SPECTRE",
  "MIGHTY", "ANDREWWEBBER", "HOTFIXOPS", "PANDORASFORGE",
  "VENDORFLOOR", "AICARICATURE", "IRISSTUDIO",
  "JIMBO", "FOREMAN", "ATTICUS", "PENNY", "KNOWLEDGE",
  "SEOAGENT", "BLOGAGENT", "INBOXAGENT", "LEADSCORE", "DESIGNREQUEST",
  "QUOAGENT", "EVENTPREP", "POSTEVENT", "MORNINGBRIEF", "JORDAN",
  "FULLSPECTRUM", "REDTEAM", "BLUETEAM", "PURPLE", "AISEC",
  "RECON", "FINDINGS", "ROOTCAUSE", "AUTONOMY",
];

const FILLER = "01<>{}[]+-=*/$#@%&·:;";

function buildColumn(rows: number): string {
  let s = "";
  while (s.length < rows) {
    if (Math.random() < 0.55) {
      s += WORDS[Math.floor(Math.random() * WORDS.length)];
    } else {
      const n = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < n; i++) {
        s += FILLER[Math.floor(Math.random() * FILLER.length)];
      }
    }
    if (Math.random() < 0.4) s += FILLER[Math.floor(Math.random() * FILLER.length)];
  }
  return s.slice(0, rows);
}

interface RainCol {
  leftPct: number;
  delay: number;
  duration: number;
  chars: string;
  topPct: number;
  opacity: number;
  fontSize: number;
}

/**
 * Fixed full-viewport matrix rain. Sits at z-0 with no pointer events so
 * page content scrolls over it without interference. The portrait figure is
 * a separate component so the photo can scroll while the rain stays put.
 */
export function MatrixRain() {
  const rain = useMemo<RainCol[]>(() => {
    const cols: RainCol[] = [];
    for (let i = 0; i < 46; i++) {
      const colLen = 14 + Math.floor(Math.random() * 60);
      cols.push({
        leftPct: (i / 46) * 100 + (Math.random() * 2.4 - 1.2),
        delay: Math.random() * 11,
        duration: 9 + Math.random() * 20,
        chars: buildColumn(colLen),
        topPct: Math.random() * 30,
        opacity: 0.12 + Math.random() * 0.16,
        fontSize: 7 + Math.floor(Math.random() * 4),
      });
    }
    return cols;
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {rain.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${c.leftPct}%`,
            top: `${c.topPct}%`,
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: `${c.fontSize}px`,
            lineHeight: "1.1",
            color: "var(--color-terminal, oklch(0.78 0.18 145))",
            opacity: c.opacity,
            writingMode: "vertical-rl",
            animation: `matrix-rain ${c.duration}s linear ${c.delay}s infinite`,
            whiteSpace: "nowrap",
            letterSpacing: "0.05em",
          }}
        >
          {c.chars}
        </div>
      ))}

      {/* Very faint viewport-wide scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,255,150,0.04) 0px, rgba(0,255,150,0.04) 1px, transparent 1px, transparent 5px)",
          mixBlendMode: "overlay",
          opacity: 0.6,
        }}
      />

      <style>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-115%); opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(115%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
