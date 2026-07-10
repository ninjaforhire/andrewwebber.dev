// Brand "family" under MIGHTY Enterprises. Each entry shows a logo (desaturated
// until hover/focus, then it re-saturates). Entries with href: null still light
// up on hover but don't link anywhere yet (sites not ready for public eyes).
const BRANDS: { name: string; href: string | null; logo: string }[] = [
  {
    name: "MIGHTY Photo Booths",
    href: "https://mightyphotobooths.com",
    logo: "/images/mpb-logo.png",
  },
  {
    name: "MIGHTY Productions",
    href: null,
    logo: "/images/mighty-productions-logo.svg",
  },
  {
    name: "HotFix Ops",
    href: null,
    logo: "/images/hfo-logo.png",
  },
];

// Photobooth Tools brand lockup: 4-tile mosaic mark + wordmark, rendered
// inline (no raster asset yet). Same desaturate-until-hover behavior.
function PhotoBoothToolsLogo() {
  return (
    <span
      aria-label="photoboothtools.com"
      className="group inline-flex items-center gap-2 opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0 active:opacity-100 active:grayscale-0"
    >
      <svg width="34" height="34" viewBox="0 0 48 48" fill="none" aria-hidden>
        <rect x="4" y="4" width="18" height="18" rx="5" fill="#E33D2A" />
        <rect x="26" y="4" width="18" height="18" rx="5" fill="#2173E2" />
        <rect x="4" y="26" width="18" height="18" rx="5" fill="#FFB70F" />
        <rect x="26" y="26" width="18" height="18" rx="5" fill="#12A73B" />
      </svg>
      <span className="font-heading text-base font-extrabold tracking-tight text-white">
        photobooth<span className="text-white/50">tools</span>
        <span className="text-white/50">.com</span>
      </span>
    </span>
  );
}

const LOGO_CLASS =
  "h-16 w-auto max-w-[200px] object-contain opacity-55 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 group-active:opacity-100 group-active:grayscale-0 sm:h-20";

const SOCIALS: { name: string; handle: string; href: string; icon: "github" | "reddit" }[] = [
  {
    name: "GitHub",
    handle: "@ninjaforhire",
    href: "https://github.com/ninjaforhire",
    icon: "github",
  },
  {
    name: "Reddit",
    handle: "u/ninjaforhire",
    href: "https://www.reddit.com/user/ninjaforhire/",
    icon: "reddit",
  },
];

function SocialIcon({ icon }: { icon: "github" | "reddit" }) {
  if (icon === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
        <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22l-.01 3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M14.24 15.72c.16.16.16.42 0 .58-.87.86-2.23.96-2.66.96-.43 0-1.8-.1-2.66-.96a.41.41 0 0 1 0-.58.41.41 0 0 1 .58 0c.55.54 1.72.73 2.08.73.36 0 1.53-.19 2.08-.73a.41.41 0 0 1 .58 0ZM10.1 13.26a1.09 1.09 0 1 0-2.18 0 1.09 1.09 0 0 0 2.18 0Zm5.07-1.09a1.09 1.09 0 1 0 0 2.18 1.09 1.09 0 0 0 0-2.18ZM24 12a12 12 0 1 1-24 0 12 12 0 0 1 24 0Zm-5.02-1.4c-.5 0-.94.2-1.27.52a8.8 8.8 0 0 0-4.35-1.31l.9-4.15 2.89.65a1.25 1.25 0 1 0 .1-.82l-3.23-.72a.42.42 0 0 0-.5.32l-1 4.7a8.85 8.85 0 0 0-4.4 1.32 1.79 1.79 0 1 0-2.1 2.88 3.4 3.4 0 0 0-.05.6c0 2.72 3.06 4.92 6.83 4.92 3.78 0 6.83-2.2 6.83-4.92 0-.2-.02-.4-.05-.59a1.79 1.79 0 0 0-.6-3.4Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 pb-40 pt-12 md:ml-20 md:pb-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-xs text-white/50">
        <nav className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {BRANDS.map((b) =>
            b.href ? (
              <a
                key={b.name}
                href={b.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={b.name}
                className="group inline-flex items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.logo} alt={b.name} className={LOGO_CLASS} />
              </a>
            ) : (
              <span key={b.name} aria-label={b.name} className="group inline-flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.logo} alt={b.name} className={LOGO_CLASS} />
              </span>
            )
          )}
          <PhotoBoothToolsLogo />
        </nav>

        {/* Socials — normalize showing the GitHub (and Reddit) profiles */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.name} — ${s.handle}`}
              className="group inline-flex items-center gap-2 text-white/45 transition-colors duration-300 hover:text-white focus-visible:text-white"
            >
              <SocialIcon icon={s.icon} />
              <span className="font-mono text-xs tracking-wider">{s.handle}</span>
            </a>
          ))}
        </div>

        <a
          href="/photo-booth-owners"
          className="font-mono text-xs uppercase tracking-[0.2em] text-white/45 underline decoration-white/20 underline-offset-4 transition-colors hover:text-warm hover:decoration-warm/50"
        >
          For Photo Booth Operators →
        </a>
        <span className="font-mono tracking-wide">
          Copyright {new Date().getFullYear()} MIGHTY Enterprises
        </span>
      </div>
    </footer>
  );
}
