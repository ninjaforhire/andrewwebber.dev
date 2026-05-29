"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  lineartSvg: string;
  photoSrc: string;
  className?: string;
}

type Phase = "lineart" | "to-photo" | "photo" | "to-lineart";

const PHASE_MS: Record<Phase, number> = {
  lineart: 3000,
  "to-photo": 350,
  photo: 3000,
  "to-lineart": 350,
};

// Word pool: SPECTRE modules + Andrew's businesses + agents + ops nouns.
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

export function PortraitGlitch({ lineartSvg, photoSrc, className }: Props) {
  const [phase, setPhase] = useState<Phase>("lineart");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let tid: ReturnType<typeof setTimeout> | null = null;
    function next(p: Phase) {
      if (cancelled) return;
      const dur = PHASE_MS[p];
      tid = setTimeout(() => {
        const order: Record<Phase, Phase> = {
          lineart: "to-photo",
          "to-photo": "photo",
          photo: "to-lineart",
          "to-lineart": "lineart",
        };
        const nxt = order[p];
        setPhase(nxt);
        next(nxt);
      }, dur);
    }
    next(phase);
    return () => {
      cancelled = true;
      if (tid) clearTimeout(tid);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "to-photo" && phase !== "to-lineart") return;
    let cancelled = false;
    let n = 0;
    const id = setInterval(() => {
      if (cancelled) return;
      n++;
      setTick((t) => t + 1);
      if (n > 6) clearInterval(id);
    }, 45);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [phase]);

  const showPhoto = phase === "photo" || phase === "to-photo";
  const showLineart = phase === "lineart" || phase === "to-lineart";
  const transitioning = phase === "to-photo" || phase === "to-lineart";

  const shiftX = transitioning ? (Math.random() - 0.5) * 14 : 0;
  const shiftY = transitioning ? (Math.random() - 0.5) * 6 : 0;
  const tearTop = transitioning ? 10 + Math.random() * 80 : 50;
  const tearH = transitioning ? 3 + Math.random() * 16 : 0;
  void tick;

  // Doubled density (36 columns). Varied lengths (12-58 chars), varied
  // speeds, opacities, and font sizes so the wall reads as living data.
  const rain = useMemo<RainCol[]>(() => {
    const cols: RainCol[] = [];
    for (let i = 0; i < 36; i++) {
      const colLen = 12 + Math.floor(Math.random() * 46);
      cols.push({
        leftPct: (i / 36) * 100 + (Math.random() * 3 - 1.5),
        delay: Math.random() * 9,
        duration: 7 + Math.random() * 16, // 7-23s
        chars: buildColumn(colLen),
        topPct: Math.random() * 40,
        opacity: 0.16 + Math.random() * 0.18, // 0.16-0.34
        fontSize: 7 + Math.floor(Math.random() * 4), // 7-10px
      });
    }
    return cols;
  }, []);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* RAIN — behind everything, masked OUT of body area so it doesn't stream over the face */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          maskImage: "url(/images/portrait/andrew-mask-inverse.png)",
          WebkitMaskImage: "url(/images/portrait/andrew-mask-inverse.png)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
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
              animation: `portrait-rain ${c.duration}s linear ${c.delay}s infinite`,
              whiteSpace: "nowrap",
              letterSpacing: "0.05em",
            }}
          >
            {c.chars}
          </div>
        ))}
      </div>

      {/* Photo layer */}
      <img
        src={photoSrc}
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: transitioning
            ? "grayscale(1) brightness(1.1) contrast(1.4) sepia(1) hue-rotate(60deg) saturate(5)"
            : "grayscale(1) brightness(0.92) contrast(1.2) sepia(1) hue-rotate(60deg) saturate(4.5)",
          opacity: showPhoto ? (transitioning ? 0.45 : 0.7) : 0,
          mixBlendMode: "screen",
          transition: "opacity 120ms linear",
          transform: transitioning ? `translate(${shiftX}px, ${shiftY}px)` : "none",
          maskImage:
            "radial-gradient(circle at 50% 45%, black 60%, transparent 92%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 45%, black 60%, transparent 92%)",
        }}
      />

      {/* SVG line-art layer */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          color: "var(--color-terminal, oklch(0.78 0.18 145))",
          opacity: showLineart ? (transitioning ? 0.35 : 0.78) : 0,
          transition: "opacity 120ms linear, transform 35ms linear",
          transform: transitioning
            ? `translate(${shiftX * -0.6}px, ${shiftY * -0.6}px)`
            : "none",
          maskImage:
            "radial-gradient(circle at 50% 45%, black 40%, transparent 84%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 45%, black 40%, transparent 84%)",
          animation: "portrait-pulse 4.5s ease-in-out infinite",
        }}
        dangerouslySetInnerHTML={{ __html: lineartSvg }}
      />

      {/* Chromatic split during transition */}
      {transitioning && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: "rgba(255, 60, 80, 0.55)",
              transform: `translate(${shiftX + 4}px, 0)`,
              mixBlendMode: "screen",
              maskImage:
                "radial-gradient(circle at 50% 45%, black 40%, transparent 84%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 45%, black 40%, transparent 84%)",
            }}
            dangerouslySetInnerHTML={{ __html: lineartSvg }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: "rgba(40, 180, 255, 0.55)",
              transform: `translate(${shiftX - 4}px, 0)`,
              mixBlendMode: "screen",
              maskImage:
                "radial-gradient(circle at 50% 45%, black 40%, transparent 84%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 45%, black 40%, transparent 84%)",
            }}
            dangerouslySetInnerHTML={{ __html: lineartSvg }}
          />
        </>
      )}

      {/* Subtle always-on scanlines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,255,150,0.06) 0px, rgba(0,255,150,0.06) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "overlay",
          pointerEvents: "none",
          opacity: transitioning ? 0.9 : 0.4,
          transition: "opacity 80ms linear",
        }}
      />

      {/* TV-glitch transition bars */}
      {transitioning && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${tearTop}%`,
              height: `${tearH}px`,
              background:
                "linear-gradient(to right, transparent, rgba(0,255,150,0.85), rgba(255,255,255,0.5), transparent)",
              mixBlendMode: "screen",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(0,255,150,0.18) 0px, rgba(0,255,150,0.18) 2px, transparent 2px, transparent 6px)",
              mixBlendMode: "screen",
              pointerEvents: "none",
              animation: "portrait-scan-slip 350ms linear",
            }}
          />
        </>
      )}

      <style>{`
        @keyframes portrait-pulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.18); }
        }
        @keyframes portrait-rain {
          0% { transform: translateY(-110%); opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(110%); opacity: 0; }
        }
        @keyframes portrait-scan-slip {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
      `}</style>
    </div>
  );
}
