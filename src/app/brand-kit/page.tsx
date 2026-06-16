import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Kit",
  description: "Andrew Webber.dev logo system, vector marks, color swatches, and animated screen treatment.",
};

const logoAssets = [
  {
    title: "Main Logo",
    label: "Gradient SVG",
    src: "/brand-kit/awdev-wordmark-main.svg",
    note: "Website-style stack with .dev kicked to the right middle.",
    wide: true,
  },
  {
    title: "Stacked Hero",
    label: "Hero SVG",
    src: "/brand-kit/awdev-stacked-hero.svg",
    note: "Closest match to the homepage lockup.",
    wide: true,
  },
  {
    title: "Horizontal",
    label: "Header SVG",
    src: "/brand-kit/awdev-horizontal.svg",
    note: "For nav, deck footers, and narrow placements.",
    wide: true,
  },
  {
    title: "Wordmark Flat",
    label: "Print SVG",
    src: "/brand-kit/awdev-wordmark-flat.svg",
    note: "Flat vector, no blur, no raster, printable-safe.",
    wide: true,
  },
  {
    title: "Monogram",
    label: "Avatar SVG",
    src: "/brand-kit/awdev-monogram.svg",
    note: "Compact AW mark for profile and badge use.",
  },
  {
    title: "Favicon",
    label: "Icon SVG",
    src: "/brand-kit/awdev-favicon.svg",
    note: "Small-size browser and shortcut mark.",
  },
];

const wordmarkVariants = [
  "Gradient on dark",
  "Flat on dark",
  "Flat one-color",
  "Horizontal lockup",
  "Stacked hero",
  "Icon-only monogram",
];

const swatches = [
  { name: "Terminal", hex: "#00ff41", text: "text-terminal" },
  { name: "Steel Light", hex: "#f5f5f9", text: "hero-steel top" },
  { name: "Steel Mid", hex: "#8f909a", text: ".dev gray" },
  { name: "Night", hex: "#0f0f1a", text: "background" },
  { name: "Panel", hex: "#1a1a2e", text: "surface" },
  { name: "Data", hex: "#00e5ff", text: "secondary accent" },
  { name: "Creative", hex: "#b44aff", text: "tertiary accent" },
  { name: "Warm", hex: "#ffb000", text: "CTA accent" },
];

function DownloadLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      download
      className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-terminal transition hover:text-foreground"
    >
      {label}
    </a>
  );
}

export default function BrandKitPage() {
  return (
    <div className="page-x pb-24 pt-24 md:pt-32">
      <section className="max-w-7xl">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.38em] text-terminal">
          Andrew Webber.dev
        </p>
        <h1 className="crop mt-8 max-w-5xl text-[clamp(64px,12vw,156px)] font-extrabold leading-[0.86]">
          Brand kit
          <br />
          <span className="hero-shine">logo system.</span>
        </h1>
        <div className="mt-10 grid max-w-5xl gap-4 font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground md:grid-cols-3">
          <div className="border-l border-terminal/50 pl-4">
            Vector printables: use flat or gradient SVG only.
          </div>
          <div className="border-l border-data/50 pl-4">
            Glow works on screen and MP4, not as the source for print.
          </div>
          <div className="border-l border-creative/50 pl-4">
            Stacked lockup keeps .dev on the right middle of the name stack.
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-5 lg:grid-cols-6">
        {logoAssets.map((asset) => (
          <article
            key={asset.title}
            className={`border border-white/10 bg-card/45 p-5 ${
              asset.wide ? "lg:col-span-3" : "lg:col-span-2"
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-terminal">
                  {asset.label}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight">{asset.title}</h2>
              </div>
              <DownloadLink href={asset.src} label="SVG" />
            </div>
            <div className="mt-6 grid min-h-48 place-items-center overflow-hidden border border-white/5 bg-background/75 p-5">
              <img
                src={asset.src}
                alt={`${asset.title} preview`}
                className={asset.wide ? "h-auto w-full" : "h-44 w-auto"}
              />
            </div>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">{asset.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border border-white/10 bg-card/45 p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-data">
                Screen only
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Animated MP4 Version</h2>
            </div>
            <div className="flex gap-5">
              <DownloadLink href="/brand-kit/awdev-logo-animated.svg" label="Animated SVG" />
              <DownloadLink href="/brand-kit/awdev-logo-glow.mp4" label="MP4" />
            </div>
          </div>
          <div className="mt-6 overflow-hidden border border-terminal/20 bg-background">
            <video
              className="aspect-video w-full object-cover"
              src="/brand-kit/awdev-logo-glow.mp4"
              poster="/brand-kit/awdev-glow-background.png"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Raster and glow are welcome here because this is a motion asset. Do not use it as printable artwork.
          </p>
        </div>

        <div className="border border-white/10 bg-card/45 p-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-creative">
            Wordmark variants
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">Usage Set</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {wordmarkVariants.map((variant) => (
              <div key={variant} className="border border-white/10 bg-background/70 px-4 py-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {variant}
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-warm">
              Vector note
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              SVG gradients stay vector. Blur/glow filters can render as raster effects in print pipelines, so the flat SVG is the clean production source for decals, printables, embroidery, and cut vinyl.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-terminal">
              Brand color swatches
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Palette</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {swatches.map((swatch) => (
            <div key={swatch.hex} className="border border-white/10 bg-card/45 p-4">
              <div
                className="h-24 border border-white/10"
                style={{ backgroundColor: swatch.hex }}
                aria-hidden
              />
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black tracking-tight">{swatch.name}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    {swatch.text}
                  </p>
                </div>
                <code className="font-mono text-xs text-terminal">{swatch.hex}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
