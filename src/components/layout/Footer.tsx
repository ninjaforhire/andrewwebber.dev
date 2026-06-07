const FAMILY = [
  { label: "MIGHTY Photo Booths", href: "http://localhost:3000" },
  { label: "MIGHTY Productions", href: "https://web-delta-ten-78.vercel.app" },
  { label: "HotFix Ops", href: "https://hotfixops.com" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-6 pb-28 pt-10 md:ml-20 md:pb-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Andrew Webber &middot; Fort Worth, TX
        </span>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono uppercase tracking-widest text-white/30">Family</span>
          {FAMILY.map((f) => (
            <a
              key={f.href}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              {f.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
