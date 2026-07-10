"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Plug,
  ShieldCheck,
  Crosshair,
  CloudCog,
  Scale,
  Cable,
  FileText,
  Flame,
  Swords,
  Ghost,
  MonitorCheck,
  RefreshCw,
  Box,
  BookOpen,
  Syringe,
  ShieldAlert,
  Bird,
  Bug,
  Radar,
  Clapperboard,
  AudioWaveform,
  Boxes,
  Fingerprint,
  VenetianMask,
  PenLine,
  Code2,
  ListChecks,
  Sparkles,
  Wand2,
  Image,
  Frame,
  Mic,
  Presentation,
  Printer,
  LayoutTemplate,
  LayoutGrid,
  Film,
  Video,
  Globe,
  Inbox,
  Sunrise,
  Target,
  Palette,
  PackageCheck,
  Telescope,
  MoonStar,
  Database,
  Stethoscope,
  ServerCog,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RichText } from "./ToolCard";

// String-keyed registry so the data layer (signature-builds.ts) stays
// React-free and serializable.
const MODULE_ICONS: Record<string, LucideIcon> = {
  Plug,
  ShieldCheck,
  Crosshair,
  CloudCog,
  Scale,
  Cable,
  FileText,
  Flame,
  Swords,
  Ghost,
  MonitorCheck,
  RefreshCw,
  Box,
  BookOpen,
  Syringe,
  ShieldAlert,
  Bird,
  Bug,
  Radar,
  Clapperboard,
  AudioWaveform,
  Boxes,
  Fingerprint,
  VenetianMask,
  PenLine,
  Code2,
  ListChecks,
  Sparkles,
  Wand2,
  Image,
  Frame,
  Mic,
  Presentation,
  Printer,
  LayoutTemplate,
  LayoutGrid,
  Film,
  Video,
  Globe,
  Inbox,
  Sunrise,
  Target,
  Palette,
  PackageCheck,
  Telescope,
  MoonStar,
  Database,
  Stethoscope,
  ServerCog,
};

export interface SignatureModule {
  name: string;
  description: string;
  icon?: string;
}

export interface SignatureBuild {
  slug: string;
  title: string;
  tagline: string;
  accent: "terminal" | "creative" | "warm";
  moduleLabel: string;
  highlights: { label: string; text: string }[];
  modules: SignatureModule[];
  wide?: boolean;
}

const ACCENT = {
  warm: {
    text: "text-warm",
    bg: "bg-warm/10",
    border: "border-warm/25 hover:border-warm/50 hover:glow-warm",
    dot: "bg-warm",
    chip: "border-warm/30 bg-warm/10 text-warm",
  },
  terminal: {
    text: "text-terminal",
    bg: "bg-terminal/10",
    border: "border-terminal/25 hover:border-terminal/50 hover:glow-terminal",
    dot: "bg-terminal",
    chip: "border-terminal/30 bg-terminal/10 text-terminal",
  },
  creative: {
    text: "text-creative",
    bg: "bg-creative/10",
    border: "border-creative/25 hover:border-creative/50 hover:glow-creative",
    dot: "bg-creative",
    chip: "border-creative/30 bg-creative/10 text-creative",
  },
};

// Expandable flagship card. Collapsed: blurb + highlights + a loud "holds more"
// affordance. Expanded: the full module/wing roster.
export function SignatureCard({ build }: { build: SignatureBuild }) {
  const [open, setOpen] = useState(false);
  const a = ACCENT[build.accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-xl border bg-card/60 p-6 md:p-8 ring-1 ring-white/5 transition-all duration-300",
        a.border,
        build.wide && "md:col-span-2"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className={cn("mb-2 font-mono text-[10px] uppercase tracking-[0.3em]", a.text)}>
            ★ Signature Build
          </div>
          <h3 className="font-heading text-2xl font-bold leading-tight md:text-3xl">
            {build.title}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
            a.chip
          )}
        >
          <span className={cn("mr-1 inline-block h-1.5 w-1.5 -translate-y-[1px] rounded-full animate-pulse", a.dot)} />
          Live · iterating
        </span>
      </div>

      <p className="mt-4 text-base leading-relaxed text-foreground/90 md:text-[17px]">
        <RichText text={build.tagline} />
      </p>

      <ul className="mt-5 space-y-2.5">
        {build.highlights.map((h) => (
          <li
            key={h.label}
            className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]"
          >
            <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", a.dot)} aria-hidden />
            <span>
              <span className={cn("font-semibold", a.text)}>{h.label}</span>
              <span className="text-muted-foreground"> — {h.text}</span>
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "mt-6 flex w-full items-center justify-between rounded-lg border px-4 py-3 font-mono text-sm uppercase tracking-wider transition-colors touch-target",
          a.chip,
          "hover:brightness-125"
        )}
      >
        <span>
          {open ? "Hide" : "Explore"} all {build.modules.length} {build.moduleLabel}
        </span>
        <ChevronDown
          size={16}
          className={cn("transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-3">
              {build.modules.map((m) => {
                const Icon = m.icon ? MODULE_ICONS[m.icon] : undefined;
                return (
                  <div
                    key={m.name}
                    className="flex items-start gap-4 rounded-md border border-white/8 bg-white/[0.02] p-4 md:p-5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className={cn("font-mono text-base font-semibold md:text-lg", a.text)}>
                        {m.name}
                      </div>
                      {m.description && (
                        <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground md:text-base">
                          <RichText text={m.description} />
                        </p>
                      )}
                    </div>
                    {Icon && (
                      <div
                        className={cn(
                          "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border",
                          a.bg,
                          a.text,
                          build.accent === "terminal" && "border-terminal/25",
                          build.accent === "creative" && "border-creative/25",
                          build.accent === "warm" && "border-warm/25"
                        )}
                        aria-hidden
                      >
                        <Icon size={30} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
