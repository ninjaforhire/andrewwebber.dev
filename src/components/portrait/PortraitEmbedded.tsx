"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  lineartSvg: string;
  photoSrc: string;
}

type Phase = "lineart" | "to-photo" | "photo" | "to-lineart";

const PHASE_MS: Record<Phase, number> = {
  lineart: 3000,
  "to-photo": 350,
  photo: 3000,
  "to-lineart": 350,
};

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
 * Background-embedded portrait — fixed to the viewport, body anchored to the
 * bottom edge so it always reads as part of the page itself, not inside a card.
 * Sits at z-index 0 with `pointer-events: none` so page content scrolls over it.
 */
export function PortraitEmbedded({ lineartSvg, photoSrc }: Props) {
  const [phase, setPhase] = useState<Phase>("lineart");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let tid: ReturnType<typeof setTimeout> | null = null;
    function next(p: Phase) {
      if (cancelled) return;
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
      }, PHASE_MS[p]);
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

  // Portrait sits anchored to the bottom-right of the viewport. Both layers
  // share an inverted body mask so the rain can flow behind them while the
  // body silhouette stays clean.
  const portraitWrapStyle: React.CSSProperties = {
    position: "fixed",
    right: "0",
    bottom: "0",
    height: "100vh",
    width: "min(60vw, 720px)",
    pointerEvents: "none",
    overflow: "hidden",
  };

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
      {/* RAIN — across the whole viewport, low contrast */}
      <div
        style={{
          position: "absolute",
          inset: 0,
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
              animation: `portrait-rain ${c.duration}s linear ${c.delay}s infinite`,
              whiteSpace: "nowrap",
              letterSpacing: "0.05em",
            }}
          >
            {c.chars}
          </div>
        ))}
      </div>

      {/* PORTRAIT — fixed bottom-right, body rises from bottom edge */}
      <div style={portraitWrapStyle}>
        {/* Photo */}
        <img
          src={photoSrc}
          alt=""
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            height: "100%",
            width: "auto",
            maxWidth: "none",
            objectFit: "contain",
            objectPosition: "bottom right",
            filter: transitioning
              ? "grayscale(1) brightness(1.05) contrast(1.4) sepia(1) hue-rotate(60deg) saturate(5)"
              : "grayscale(1) brightness(0.92) contrast(1.2) sepia(1) hue-rotate(60deg) saturate(4.5)",
            opacity: showPhoto ? (transitioning ? 0.45 : 0.55) : 0,
            mixBlendMode: "screen",
            transition: "opacity 120ms linear",
            transform: transitioning ? `translate(${shiftX}px, ${shiftY}px)` : "none",
            maskImage:
              "linear-gradient(to top, black 60%, transparent 100%), linear-gradient(to left, black 65%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 60%, transparent 100%), linear-gradient(to left, black 65%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />

        {/* SVG line-art */}
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            height: "100%",
            aspectRatio: "1 / 1",
            color: "var(--color-terminal, oklch(0.78 0.18 145))",
            opacity: showLineart ? (transitioning ? 0.32 : 0.6) : 0,
            transition: "opacity 120ms linear, transform 35ms linear",
            transform: transitioning
              ? `translate(${shiftX * -0.6}px, ${shiftY * -0.6}px)`
              : "none",
            maskImage:
              "linear-gradient(to top, black 55%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 55%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
            animation: "portrait-pulse 4.5s ease-in-out infinite",
          }}
          dangerouslySetInnerHTML={{ __html: lineartSvg }}
        />

        {/* Chromatic split during glitch */}
        {transitioning && (
          <>
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                height: "100%",
                aspectRatio: "1 / 1",
                color: "rgba(255, 60, 80, 0.45)",
                transform: `translate(${shiftX + 4}px, 0)`,
                mixBlendMode: "screen",
                maskImage:
                  "linear-gradient(to top, black 55%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, black 55%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
              dangerouslySetInnerHTML={{ __html: lineartSvg }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                height: "100%",
                aspectRatio: "1 / 1",
                color: "rgba(40, 180, 255, 0.45)",
                transform: `translate(${shiftX - 4}px, 0)`,
                mixBlendMode: "screen",
                maskImage:
                  "linear-gradient(to top, black 55%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, black 55%, transparent 100%), linear-gradient(to left, black 60%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
              dangerouslySetInnerHTML={{ __html: lineartSvg }}
            />
          </>
        )}

        {/* TV-glitch tear bars only on the portrait region */}
        {transitioning && (
          <>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${tearTop}%`,
                height: `${tearH}px`,
                background:
                  "linear-gradient(to right, transparent, rgba(0,255,150,0.7), rgba(255,255,255,0.4), transparent)",
                mixBlendMode: "screen",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(0,255,150,0.18) 0px, rgba(0,255,150,0.18) 2px, transparent 2px, transparent 6px)",
                mixBlendMode: "screen",
                animation: "portrait-scan-slip 350ms linear",
              }}
            />
          </>
        )}
      </div>

      {/* Subtle viewport-wide scanlines, very faint */}
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
        @keyframes portrait-pulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.18); }
        }
        @keyframes portrait-rain {
          0% { transform: translateY(-115%); opacity: 0; }
          10% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(115%); opacity: 0; }
        }
        @keyframes portrait-scan-slip {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
      `}</style>
    </div>
  );
}
