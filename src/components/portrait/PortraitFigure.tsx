"use client";

import { useEffect, useState } from "react";

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

/**
 * Glitch portrait figure. Absolutely positioned inside its parent (no fixed
 * positioning) so it scrolls with the surrounding page content. Photo + line
 * art share an aspect-square wrap anchored to the bottom-right of the parent.
 */
export function PortraitFigure({ lineartSvg, photoSrc }: Props) {
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

  const mask =
    "linear-gradient(to top, black 60%, transparent 100%), linear-gradient(to left, black 65%, transparent 100%)";

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        right: 0,
        bottom: 0,
        height: "100vh",
        width: "40vw",
        maxWidth: "720px",
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Photo */}
      <img
        src={photoSrc}
        alt=""
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "100%",
          height: "auto",
          maxHeight: "100%",
          objectFit: "contain",
          objectPosition: "bottom right",
          filter: transitioning
            ? "grayscale(1) brightness(1.05) contrast(1.4) sepia(1) hue-rotate(60deg) saturate(5)"
            : "grayscale(1) brightness(0.92) contrast(1.2) sepia(1) hue-rotate(60deg) saturate(4.5)",
          opacity: showPhoto ? (transitioning ? 0.45 : 0.6) : 0,
          mixBlendMode: "screen",
          transition: "opacity 120ms linear",
          transform: transitioning ? `translate(${shiftX}px, ${shiftY}px)` : "none",
          maskImage: mask,
          WebkitMaskImage: mask,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* SVG line art */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: "100%",
          aspectRatio: "1 / 1",
          color: "var(--color-terminal, oklch(0.78 0.18 145))",
          opacity: showLineart ? (transitioning ? 0.32 : 0.62) : 0,
          transition: "opacity 120ms linear, transform 35ms linear",
          transform: transitioning
            ? `translate(${shiftX * -0.6}px, ${shiftY * -0.6}px)`
            : "none",
          maskImage: mask,
          WebkitMaskImage: mask,
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
              width: "100%",
              aspectRatio: "1 / 1",
              color: "rgba(255, 60, 80, 0.45)",
              transform: `translate(${shiftX + 4}px, 0)`,
              mixBlendMode: "screen",
              maskImage: mask,
              WebkitMaskImage: mask,
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
              width: "100%",
              aspectRatio: "1 / 1",
              color: "rgba(40, 180, 255, 0.45)",
              transform: `translate(${shiftX - 4}px, 0)`,
              mixBlendMode: "screen",
              maskImage: mask,
              WebkitMaskImage: mask,
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
            dangerouslySetInnerHTML={{ __html: lineartSvg }}
          />
        </>
      )}

      {/* TV-glitch tear bars during transition */}
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

      <style>{`
        @keyframes portrait-pulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.18); }
        }
        @keyframes portrait-scan-slip {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
      `}</style>
    </div>
  );
}
