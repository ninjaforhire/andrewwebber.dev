"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface BusinessCardProps {
  name: string;
  tagline: string;
  url: string;
  logoSrc: string;
  brandColor: string;
  brandColorSecondary?: string;
  description: string;
}

export function BusinessCard({
  name,
  tagline,
  url,
  logoSrc,
  brandColor,
  brandColorSecondary,
  description,
}: BusinessCardProps) {
  const cssVars = {
    "--brand": brandColor,
    "--brand2": brandColorSecondary ?? brandColor,
  } as React.CSSProperties;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-card/30 p-8 transition-all duration-300 hover:scale-[1.015] hover:border-[var(--brand)]/40 hover:shadow-[0_25px_60px_-25px_var(--brand)]"
      style={cssVars}
    >
      {/* Brand glow background — fades in on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 30% 20%, var(--brand) 0%, transparent 60%), radial-gradient(ellipse 500px 300px at 80% 100%, var(--brand2) 0%, transparent 60%)",
        }}
      />

      {/* Sweep highlight on hover */}
      <div className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: "linear-gradient(90deg, transparent, var(--brand), transparent)",
        }}
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Logo */}
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white/5 p-3 transition-all duration-300 group-hover:bg-white/10"
          style={{
            border: `1px solid ${brandColor}33`,
          }}
        >
          <div className="relative h-full w-full">
            <Image
              src={logoSrc}
              alt={`${name} logo`}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
              sizes="96px"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-xs font-medium uppercase tracking-[0.3em] mb-2"
            style={{ color: brandColor }}
          >
            {tagline}
          </div>
          <h3 className="crop font-extrabold text-3xl sm:text-4xl leading-tight">
            {name}
          </h3>
          <p className="mt-2 text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Visit indicator */}
        <div
          className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:translate-x-1"
          style={{ color: brandColor }}
        >
          Visit
          <ExternalLink size={14} className="transition-transform duration-300 group-hover:rotate-12" />
        </div>
      </div>
    </a>
  );
}
