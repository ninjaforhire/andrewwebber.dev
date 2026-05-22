"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "off" | "noise" | "binaural" | "isochronic";

// Intentionally cryptic labels. The point is the experience, not the
// explanation. ADHD audience tends to discover what works by feel.
const MODES: { id: Mode; label: string }[] = [
  { id: "off", label: "Silence" },
  { id: "noise", label: "Brown" },
  { id: "binaural", label: "Binaural γ" },
  { id: "isochronic", label: "Isochronic α" },
];

function readMode(): Mode {
  if (typeof window === "undefined") return "off";
  const raw = localStorage.getItem("sound");
  if (raw === "true") return "noise";
  if (raw === "false" || raw === null) return "off";
  if (raw === "off" || raw === "noise" || raw === "binaural" || raw === "isochronic") {
    return raw;
  }
  return "off";
}

interface Props {
  iconSize?: number;
  className?: string;
  align?: "left" | "right";
}

export function SoundPicker({ iconSize = 18, className, align = "right" }: Props) {
  const [mode, setMode] = useState<Mode>("off");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
            "absolute z-50 mt-2 min-w-[160px] rounded-md border border-border bg-popover/95 p-1 shadow-lg backdrop-blur-md",
            align === "right" ? "right-0" : "left-0"
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
              <span>{m.label}</span>
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
