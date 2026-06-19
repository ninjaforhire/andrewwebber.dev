// Brand "family" under MIGHTY Enterprises. Each entry shows a logo (desaturated
// until hover/focus, then it re-saturates). Entries without a logo asset yet
// fall back to a dimmed wordmark with the same hover behavior.
const BRANDS: { name: string; href: string; logo: string | null }[] = [
  {
    name: "MIGHTY Photo Booths",
    href: "https://mightyphotobooths.com",
    logo: "/images/mpb-logo.png",
  },
  {
    name: "MIGHTY Productions",
    href: "https://web-delta-ten-78.vercel.app",
    logo: "/images/mighty-productions-logo.svg",
  },
  {
    name: "HotFix Ops",
    href: "https://hotfixops.com",
    logo: "/images/hfo-logo.png",
  },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 pb-40 pt-12 md:ml-20 md:pb-16">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-xs text-white/50">
        <nav className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {BRANDS.map((b) => (
            <a
              key={b.href}
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={b.name}
              className="group inline-flex items-center"
            >
              {b.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={b.logo}
                  alt={b.name}
                  className="h-16 w-auto max-w-[200px] object-contain opacity-55 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0 group-active:opacity-100 group-active:grayscale-0 sm:h-20"
                />
              ) : (
                <span className="font-mono text-sm uppercase tracking-widest text-white/40 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white group-active:text-white">
                  {b.name}
                </span>
              )}
            </a>
          ))}
        </nav>
        <span className="font-mono tracking-wide">
          Copyright {new Date().getFullYear()} MIGHTY Enterprises
        </span>
      </div>
    </footer>
  );
}
