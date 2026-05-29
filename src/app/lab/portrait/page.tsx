import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { PortraitGlitch } from "@/components/portrait/PortraitGlitch";

export const metadata: Metadata = {
  title: "Portrait Lab",
  robots: { index: false, follow: false },
};

const ROOT = process.cwd();
const LINEART_SVG = fs.readFileSync(path.join(ROOT, "src/data/portrait-lineart.svg"), "utf-8");

export default function PortraitLab() {
  return (
    <div className="page-x py-16 md:py-24">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-6">
        § Lab — Portrait
      </div>
      <h1 className="font-extrabold text-[clamp(40px,7vw,90px)] leading-[0.92] mb-6">
        Three treatments,
        <br />
        <span className="text-terminal">one face.</span>
      </h1>
      <p className="text-lg leading-relaxed text-muted-foreground max-w-2xl mb-12">
        Pick a treatment for the About page right-side portrait. All three use the same source photo
        (4000×4000 headshot, resized to 800px). Each is rendered to fade into the background.
      </p>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* B — SVG line-art w/ TV-glitch loop + matrix rain behind body */}
        <section>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-terminal mb-3">
            B · Glitch line-art (NEW)
          </div>
          <div className="relative rounded-lg border border-border bg-card/40 p-4 overflow-hidden aspect-square">
            <div className="absolute inset-4">
              <PortraitGlitch
                lineartSvg={LINEART_SVG}
                photoSrc="/images/portrait/andrew-display.jpg"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Canny edge strokes + random glitch that briefly reveals the real photo + RGB-split
            tear + subtle scanlines + vertical matrix rain. The data/terminal vibe.
          </p>
        </section>

        {/* C — CSS shader */}
        <section>
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-terminal mb-3">
            C · CSS shader (CRT)
          </div>
          <div className="relative rounded-lg border border-border bg-card/40 p-4 overflow-hidden aspect-square">
            <div className="relative h-full w-full overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/portrait/andrew-display.jpg"
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
                style={{
                  filter:
                    "grayscale(1) brightness(0.85) contrast(1.25) sepia(1) hue-rotate(60deg) saturate(6)",
                  opacity: 0.55,
                  mixBlendMode: "screen",
                }}
              />
              {/* subtle scanlines */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(0,255,150,0.10) 0px, rgba(0,255,150,0.10) 1px, transparent 1px, transparent 4px)",
                  mixBlendMode: "screen",
                  opacity: 0.7,
                }}
              />
              {/* radial fade to background */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, transparent 35%, var(--background) 85%)",
                }}
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Hue-rotate + scanlines + radial fade on the real JPG. CRT/security-camera feel. Quickest
            to ship, most photographic of the three.
          </p>
        </section>
      </div>

      <div className="mt-16 rounded-lg border border-border bg-card/30 p-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-creative mb-2">
          Source reference
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Original photo used for all three treatments. Background already removed; will be cropped
          tighter when wired into the About page.
        </p>
        <div className="w-40 overflow-hidden rounded-md border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/portrait/andrew-display.jpg" alt="Source portrait" />
        </div>
      </div>
    </div>
  );
}
