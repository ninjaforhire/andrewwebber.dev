"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeOff, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode =
  | "off"
  | "pink"
  | "brown"
  | "binaural"
  | "lofi"
  | "drone"
  | "sousvide"
  | "blackhole";

const MODES: { id: Mode; label: string; musical?: boolean }[] = [
  { id: "off", label: "Silence" },
  { id: "pink", label: "Pink noise" },
  { id: "brown", label: "Brown noise" },
  { id: "binaural", label: "Binaural γ" },
  { id: "lofi", label: "Lo-fi pad", musical: true },
  { id: "drone", label: "Cinematic drone", musical: true },
  { id: "sousvide", label: "Sous vide" },
  { id: "blackhole", label: "Black hole" },
];

const VALID_IDS = new Set<Mode>([
  "off",
  "pink",
  "brown",
  "binaural",
  "lofi",
  "drone",
  "sousvide",
  "blackhole",
]);

function readMode(): Mode {
  if (typeof window === "undefined") return "off";
  const raw = localStorage.getItem("sound");
  if (raw === "true") return "brown";
  if (raw === "noise") return "brown";
  if (raw === "isochronic") return "binaural";
  if (raw && VALID_IDS.has(raw as Mode)) return raw as Mode;
  return "off";
}

interface Props {
  iconSize?: number;
  className?: string;
  align?: "left" | "right";
  direction?: "up" | "down" | "right";
}

export function SoundPicker({ iconSize = 18, className, align = "right", direction = "down" }: Props) {
  const isSide = direction === "right";
  const [mode, setMode] = useState<Mode>("off");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(readMode());
    const sync = () => setMode(readMode());
    window.addEventListener("sound-toggle", sync);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sound") sync();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("sound-toggle", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function selectMode(next: Mode) {
    setMode(next);
    localStorage.setItem("sound", next);
    window.dispatchEvent(new Event("sound-toggle"));
    setOpen(false);
  }

  const isOn = mode !== "off";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={isOn ? `Focus audio: ${mode}` : "Choose focus audio"}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex h-9 w-9 items-center justify-center transition-colors",
          isOn ? "text-terminal" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {isOn ? <Volume2 size={iconSize} /> : <VolumeOff size={iconSize} />}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Focus audio"
          className={cn(
            "absolute z-50 min-w-[180px] rounded-md border border-border bg-popover/95 p-1 shadow-lg backdrop-blur-md",
            isSide
              ? "left-full ml-3 bottom-0"
              : cn(
                  align === "right" ? "right-0" : "left-0",
                  direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
                )
          )}
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              role="menuitemradio"
              aria-checked={mode === m.id}
              onClick={() => selectMode(m.id)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors",
                mode === m.id
                  ? "bg-data/10 text-data"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                {m.label}
                {m.musical && (
                  <Music2
                    size={11}
                    aria-label="Musical mode"
                    className={cn(mode === m.id ? "text-data" : "text-creative/70")}
                  />
                )}
              </span>
              {mode === m.id && (
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-data" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
