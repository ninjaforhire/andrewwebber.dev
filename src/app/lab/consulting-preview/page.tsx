import { cn } from "@/lib/utils";

// ─── Card graphics ────────────────────────────────────────────────────────────

function GraphicIntro() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="ig1" cx="35%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ig2" cx="65%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
        <filter id="iglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      {/* halos */}
      <circle cx="68" cy="50" r="36" fill="url(#ig1)" />
      <circle cx="132" cy="50" r="36" fill="url(#ig2)" />
      {/* rings */}
      <circle cx="68" cy="50" r="22" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      <circle cx="132" cy="50" r="22" fill="none" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      {/* connecting line */}
      <line x1="90" y1="50" x2="110" y2="50" stroke="#c4b5fd" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" filter="url(#iglow)" />
      {/* nodes */}
      <circle cx="68" cy="50" r="5" fill="#a78bfa" opacity="0.9" filter="url(#iglow)" />
      <circle cx="132" cy="50" r="5" fill="#7c3aed" opacity="0.9" filter="url(#iglow)" />
      {/* pulse rings */}
      <circle cx="68" cy="50" r="11" fill="none" stroke="#a78bfa" strokeWidth="0.5" opacity="0.3" />
      <circle cx="132" cy="50" r="11" fill="none" stroke="#7c3aed" strokeWidth="0.5" opacity="0.3" />
      {/* label */}
      <text x="100" y="88" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#a78bfa" opacity="0.4" letterSpacing="2">CONNECT</text>
    </svg>
  );
}

function GraphicOwner() {
  const cols = 7, rows = 4;
  const dots = [];
  const highlightPath = new Set([3, 10, 17, 18, 19, 26]);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ x: 24 + c * 24, y: 20 + r * 20, i: r * cols + c });
    }
  }
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="og" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
        <filter id="oglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect x="0" y="0" width="200" height="100" fill="url(#og)" />
      {/* path line */}
      <polyline points="51,20 51,40 75,40 75,60 99,60 123,60 147,60" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
      {dots.map((d) => (
        <circle
          key={d.i}
          cx={d.x} cy={d.y}
          r={highlightPath.has(d.i) ? 3.5 : 1.5}
          fill={highlightPath.has(d.i) ? "#38bdf8" : "#0ea5e9"}
          opacity={highlightPath.has(d.i) ? 0.9 : 0.2}
          filter={highlightPath.has(d.i) ? "url(#oglow)" : undefined}
        />
      ))}
      <text x="100" y="93" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#38bdf8" opacity="0.4" letterSpacing="2">ROADMAP</text>
    </svg>
  );
}

function GraphicDiscovery() {
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="dg" cx="45%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>
        <filter id="dglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <clipPath id="dclip"><circle cx="82" cy="52" r="42" /></clipPath>
      </defs>
      <circle cx="82" cy="52" r="42" fill="url(#dg)" />
      {/* concentric scan rings */}
      {[14, 24, 34, 42].map((r, i) => (
        <circle key={r} cx="82" cy="52" r={r} fill="none" stroke="#34d399" strokeWidth="0.8"
          opacity={0.5 - i * 0.1} strokeDasharray={i === 3 ? "none" : "3 2"} />
      ))}
      {/* crosshair */}
      <line x1="82" y1="12" x2="82" y2="92" stroke="#34d399" strokeWidth="0.6" opacity="0.25" clipPath="url(#dclip)" />
      <line x1="42" y1="52" x2="122" y2="52" stroke="#34d399" strokeWidth="0.6" opacity="0.25" clipPath="url(#dclip)" />
      {/* sweep line */}
      <line x1="82" y1="52" x2="115" y2="24" stroke="#34d399" strokeWidth="1.2" opacity="0.7" filter="url(#dglow)" />
      {/* center dot */}
      <circle cx="82" cy="52" r="3.5" fill="#34d399" opacity="0.9" filter="url(#dglow)" />
      {/* blip */}
      <circle cx="111" cy="29" r="2.5" fill="#6ee7b7" opacity="0.8" filter="url(#dglow)" />
      <circle cx="111" cy="29" r="6" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.4" />
      <text x="155" y="55" textAnchor="middle" fontSize="6" fontFamily="monospace" fill="#34d399" opacity="0.4" letterSpacing="2">SCAN</text>
    </svg>
  );
}

function GraphicImplementation() {
  const layers = [
    { y: 18, w: 90, label: "INTEGRATE" },
    { y: 42, w: 110, label: "CONFIGURE" },
    { y: 66, w: 80, label: "DEPLOY" },
  ];
  return (
    <svg viewBox="0 0 200 100" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="amg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <filter id="amglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="ambar" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="100" fill="url(#amg)" />
      {layers.map((l, i) => (
        <g key={l.label}>
          <rect x={55 - i * 5} y={l.y} width={l.w} height="14" rx="3" fill="url(#ambar)" opacity={0.9 - i * 0.15} />
          <rect x={55 - i * 5} y={l.y} width={l.w} height="14" rx="3" fill="none" stroke="#fbbf24" strokeWidth="0.6" opacity="0.5" />
          {/* connecting arrow */}
          {i < 2 && (
            <line
              x1={55 - i * 5 + l.w / 2} y1={l.y + 14}
              x2={55 - (i + 1) * 5 + layers[i + 1].w / 2} y2={layers[i + 1].y}
              stroke="#fbbf24" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2"
            />
          )}
          <text x={55 - i * 5 + l.w / 2} y={l.y + 9} textAnchor="middle" fontSize="5.5"
            fontFamily="monospace" fill="#fde68a" opacity="0.7" letterSpacing="1.5">
            {l.label}
          </text>
        </g>
      ))}
      {/* end dot */}
      <circle cx="95" cy="88" r="3" fill="#fbbf24" opacity="0.9" filter="url(#amglow)" />
      <circle cx="95" cy="88" r="7" fill="none" stroke="#fbbf24" strokeWidth="0.6" opacity="0.35" />
    </svg>
  );
}

function ArchitectureGraphic() {
  const nodes = [
    { cx: 80,  cy: 55,  r: 5 },
    { cx: 195, cy: 38,  r: 7 },
    { cx: 305, cy: 75,  r: 5 },
    { cx: 138, cy: 125, r: 9 },
    { cx: 255, cy: 125, r: 6 },
    { cx: 355, cy: 145, r: 4 },
    { cx: 78,  cy: 178, r: 5 },
    { cx: 192, cy: 194, r: 5 },
    { cx: 305, cy: 185, r: 7 },
  ];
  const edges = [[0,1],[1,2],[1,3],[2,4],[3,4],[4,5],[3,6],[3,7],[4,8],[6,7],[7,8],[2,5]];
  return (
    <svg viewBox="0 0 420 230" className="w-full h-full opacity-70" aria-hidden="true">
      <defs>
        <radialGradient id="rng" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <filter id="rglow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="redge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].cx} y1={nodes[a].cy} x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="url(#redge)" strokeWidth="1" />
      ))}
      {nodes.map((n, i) => (
        <circle key={`h${i}`} cx={n.cx} cy={n.cy} r={n.r * 3} fill="url(#rng)" opacity="0.2" />
      ))}
      {nodes.map((n, i) => (
        <circle key={`n${i}`} cx={n.cx} cy={n.cy} r={n.r}
          fill={i === 3 || i === 8 ? "#f43f5e" : "#fb923c"}
          opacity={i === 3 || i === 8 ? 0.9 : 0.6} filter="url(#rglow)" />
      ))}
      {[{ x: 138, y: 143, t: "CORE" }, { x: 290, y: 203, t: "OUTPUT" }].map((l) => (
        <text key={l.t} x={l.x} y={l.y} textAnchor="middle" fontSize="7"
          fontFamily="monospace" fill="#f43f5e" opacity="0.45" letterSpacing="2">{l.t}</text>
      ))}
    </svg>
  );
}

// ─── Card component ────────────────────────────────────────────────────────────

interface CardProps {
  label: string;
  price: string;
  sub?: string;
  desc: string;
  features: string[];
  accent: "purple" | "blue" | "emerald" | "amber";
  featured?: boolean;
  cta?: string;
  badge?: string;
  note?: string;
  graphic: React.ReactNode;
}

const ACCENT = {
  purple: {
    label: "text-violet-400", border: "border-violet-500/30", bg: "bg-violet-500/[0.07]",
    gradFrom: "rgba(76,29,149,0.25)", gradTo: "rgba(13,13,15,0.0)",
    glowColor: "#7c3aed",
    check: "text-violet-400",
    btnBase: "border-violet-500/30 text-violet-400 hover:bg-violet-500/10",
    btnFeat: "bg-violet-500/15 border-violet-500/40 text-violet-300 hover:bg-violet-500/25",
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  },
  blue: {
    label: "text-sky-400", border: "border-sky-500/30", bg: "bg-sky-500/[0.07]",
    gradFrom: "rgba(12,74,110,0.28)", gradTo: "rgba(13,13,15,0.0)",
    glowColor: "#0ea5e9",
    check: "text-sky-400",
    btnBase: "border-sky-500/30 text-sky-400 hover:bg-sky-500/10",
    btnFeat: "bg-sky-500/15 border-sky-500/40 text-sky-300 hover:bg-sky-500/25",
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  },
  emerald: {
    label: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/[0.07]",
    gradFrom: "rgba(6,78,59,0.28)", gradTo: "rgba(13,13,15,0.0)",
    glowColor: "#10b981",
    check: "text-emerald-400",
    btnBase: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10",
    btnFeat: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25",
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  },
  amber: {
    label: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/[0.07]",
    gradFrom: "rgba(120,53,15,0.28)", gradTo: "rgba(13,13,15,0.0)",
    glowColor: "#f59e0b",
    check: "text-amber-400",
    btnBase: "border-amber-500/30 text-amber-400 hover:bg-amber-500/10",
    btnFeat: "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25",
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  },
};

function Card({ label, price, sub, desc, features, accent, featured, cta = "Book Now →", badge, note, graphic }: CardProps) {
  const c = ACCENT[accent];
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.01]",
        featured ? c.border : "border-white/8"
      )}
      style={{ background: `linear-gradient(160deg, ${c.gradFrom} 0%, ${c.gradTo} 55%, rgba(13,13,15,0.95) 100%)` }}
    >
      {/* glow blob */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-25"
        style={{ background: `radial-gradient(circle, ${c.glowColor} 0%, transparent 70%)` }} />

      {/* graphic header */}
      <div className="relative h-28 w-full shrink-0 overflow-hidden border-b border-white/5">
        {graphic}
      </div>

      {/* content */}
      <div className="relative flex flex-col flex-1 p-7">
        {badge && (
          <span className={cn("absolute -top-3.5 left-5 rounded-full border px-3 py-0.5 font-mono text-[9px] uppercase tracking-widest", c.badge)}>
            {badge}
          </span>
        )}
        <p className={cn("font-mono text-[9px] uppercase tracking-[0.2em]", c.label)}>{label}</p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-heading text-4xl font-extrabold leading-none">{price}</span>
          {sub && <span className="font-mono text-xs text-white/35">{sub}</span>}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/45">{desc}</p>
        <ul className="mt-5 flex-1 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <span className={cn("mt-0.5 font-mono text-xs shrink-0", c.check)}>✓</span>
              <span className="text-white/55">{f}</span>
            </li>
          ))}
        </ul>
        {note && (
          <p className="mt-4 rounded-md bg-white/[0.04] px-3 py-2 font-mono text-[10px] leading-relaxed text-white/35">
            {note}
          </p>
        )}
        <a href="#"
          className={cn("mt-5 block rounded-md py-2.5 text-center font-mono text-xs uppercase tracking-widest border transition-colors",
            featured ? c.btnFeat : c.btnBase)}>
          {cta}
        </a>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ConsultingPreviewPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400 mb-6">
          § 02 — Services · preview
        </p>
        <h1 className="font-heading text-[clamp(42px,6vw,88px)] font-extrabold leading-[0.9] mb-6">
          Hands-on <span className="text-amber-400">consulting</span>.
        </h1>
        <p className="text-xl text-white/45 max-w-2xl mb-16">
          Limited engagements each quarter for businesses ready to level up.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Card
            label="Quick Intro" price="Free" sub="/ 15 min" badge="Start here"
            accent="purple" graphic={<GraphicIntro />}
            desc="Not a sales call. We talk about where you are, what's not working, and whether I can help."
            features={["No pitch, no pressure","You describe your situation","I tell you what I'd focus on","Right-fit check — both ways"]}
            cta="Grab a slot →"
          />
          <Card
            label="Owner's Session" price="$400" sub="/ 90 min"
            accent="blue" featured graphic={<GraphicOwner />}
            desc="For photo booth, live event, and activation business owners. Ask me anything."
            features={[
              "Serving out-of-town markets without white-labeling",
              "Designing custom activations",
              "Website and SEO review",
              "Building SOPs that actually get followed",
              "Fixing workflow and operations friction",
              "Hardware selection and setup",
              "Travel logistics planning",
              "Ranking organically — no ad spend",
            ]}
          />
          <Card
            label="AI Discovery" price="$150" sub="/ 30 min"
            accent="emerald" featured graphic={<GraphicDiscovery />}
            desc="Map what's worth automating before committing to a build."
            features={[
              "AI and automation opportunity scan",
              "Business efficiency gaps",
              "Custom software feasibility",
              "HotFix / security-adjacent scoping",
              "Clear go/no-go recommendation",
            ]}
            note="Discovery cost applied toward your engagement if you move forward."
            cta="Scope it →"
          />
          <Card
            label="AI Implementation" price="$1,000" sub="/ 1–2 hrs"
            accent="amber" featured graphic={<GraphicImplementation />}
            desc="Deploy proven AI tools into your existing stack. Expert configuration, integration, and training — no custom code."
            features={[
              "Off-the-shelf AI tool setup",
              "Integration into existing workflows",
              "Automation configuration and testing",
              "Team training and onboarding",
              "30-day post-implementation support",
            ]}
          />
        </div>

        {/* Custom Build */}
        <div
          className="relative mt-5 overflow-hidden rounded-xl border border-rose-500/25 transition-all duration-300 hover:border-rose-500/40"
          style={{ background: "linear-gradient(135deg, rgba(136,19,55,0.18) 0%, rgba(120,10,40,0.12) 40%, rgba(15,10,10,0.6) 100%)" }}
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #f43f5e 0%, transparent 70%)" }} />
            <div className="absolute right-60 bottom-0 h-48 w-48 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #fb923c 0%, transparent 70%)" }} />
          </div>
          <div className="relative flex flex-col gap-0 lg:flex-row">
            <div className="flex flex-col justify-between p-8 md:p-10 lg:w-[42%]">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-rose-400">Custom Build</p>
                <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                  <span className="font-heading text-5xl font-extrabold leading-none">$3,000</span>
                  <span className="font-mono text-sm text-white/35">– $25,000+ depending on scope</span>
                </div>
                <p className="mt-4 text-base leading-relaxed text-white/50 max-w-sm">
                  Bespoke software built from scratch. Custom agents, automation pipelines, internal tools, and security-hardened systems. Every project starts with an AI Discovery call.
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#"
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-rose-500/40 bg-rose-500/10 px-6 py-2.5 font-mono text-xs uppercase tracking-wider text-rose-300 transition-colors hover:bg-rose-500/20">
                  Start with AI Discovery <span aria-hidden="true">→</span>
                </a>
                <p className="font-mono text-[10px] leading-relaxed text-white/25">
                  Discovery cost applied<br />to project total
                </p>
              </div>
            </div>
            <div className="hidden lg:flex lg:w-[28%] items-center justify-center px-4 py-8 opacity-80">
              <ArchitectureGraphic />
            </div>
            <div className="border-t border-white/5 p-8 md:p-10 lg:border-t-0 lg:border-l lg:w-[30%]">
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">What&apos;s in scope</p>
              <ul className="space-y-3">
                {["Custom AI agents and pipelines","Internal ops and reporting tools","Security-hardened builds (HotFix)","Multi-system integrations","Dashboards and data systems","Ongoing maintenance available"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className="mt-0.5 font-mono text-xs shrink-0 text-rose-500/60">✓</span>
                    <span className="text-white/50">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <p className="mt-10 font-mono text-xs text-white/15 text-center">
          /lab/consulting-preview · not live · for review only
        </p>
      </div>
    </main>
  );
}
