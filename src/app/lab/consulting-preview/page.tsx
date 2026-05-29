import { cn } from "@/lib/utils";

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
}

function Card({ label, price, sub, desc, features, accent, featured, cta = "Book Now →", badge, note }: CardProps) {
  const c = {
    purple: {
      label: "text-violet-400",
      border: "border-violet-500/30",
      bg: "bg-violet-500/[0.07]",
      check: "text-violet-400",
      btnBase: "border-violet-500/30 text-violet-400 hover:bg-violet-500/10",
      btnFeat: "bg-violet-500/15 border-violet-500/40 text-violet-300 hover:bg-violet-500/25",
      badge: "bg-violet-500/15 text-violet-300 border-violet-500/20",
    },
    blue: {
      label: "text-sky-400",
      border: "border-sky-500/30",
      bg: "bg-sky-500/[0.07]",
      check: "text-sky-400",
      btnBase: "border-sky-500/30 text-sky-400 hover:bg-sky-500/10",
      btnFeat: "bg-sky-500/15 border-sky-500/40 text-sky-300 hover:bg-sky-500/25",
      badge: "bg-sky-500/15 text-sky-300 border-sky-500/20",
    },
    emerald: {
      label: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/[0.07]",
      check: "text-emerald-400",
      btnBase: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10",
      btnFeat: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    },
    amber: {
      label: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/[0.07]",
      check: "text-amber-400",
      btnBase: "border-amber-500/30 text-amber-400 hover:bg-amber-500/10",
      btnFeat: "bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    },
  }[accent];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border p-7 transition-all duration-300 hover:scale-[1.01]",
        featured ? `${c.border} ${c.bg}` : "border-white/8 bg-white/[0.025]"
      )}
    >
      {badge && (
        <span className={cn("absolute -top-3 left-6 rounded-full border px-3 py-0.5 font-mono text-[9px] uppercase tracking-widest", c.badge)}>
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
      <a
        href="#"
        className={cn(
          "mt-5 block rounded-md py-2.5 text-center font-mono text-xs uppercase tracking-widest border transition-colors",
          featured ? c.btnFeat : c.btnBase
        )}
      >
        {cta}
      </a>
    </div>
  );
}

function ArchitectureGraphic() {
  const nodes = [
    { cx: 80,  cy: 60,  r: 5 },
    { cx: 200, cy: 40,  r: 7 },
    { cx: 310, cy: 80,  r: 5 },
    { cx: 140, cy: 130, r: 9 },
    { cx: 260, cy: 130, r: 6 },
    { cx: 360, cy: 150, r: 4 },
    { cx: 80,  cy: 185, r: 5 },
    { cx: 195, cy: 200, r: 5 },
    { cx: 310, cy: 190, r: 7 },
  ];
  const edges = [
    [0,1],[1,2],[1,3],[2,4],[3,4],[4,5],[3,6],[3,7],[4,8],[6,7],[7,8],[2,5]
  ];

  return (
    <svg
      viewBox="0 0 420 230"
      className="w-full h-full opacity-60"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fb923c" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* edges */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="url(#edgeGrad)"
          strokeWidth="1"
        />
      ))}

      {/* node halos */}
      {nodes.map((n, i) => (
        <circle
          key={`h${i}`}
          cx={n.cx} cy={n.cy}
          r={n.r * 3}
          fill="url(#nodeGlow)"
          opacity="0.25"
        />
      ))}

      {/* nodes */}
      {nodes.map((n, i) => (
        <circle
          key={`n${i}`}
          cx={n.cx} cy={n.cy}
          r={n.r}
          fill={i === 3 || i === 8 ? "#f43f5e" : "#fb923c"}
          opacity={i === 3 || i === 8 ? "0.9" : "0.6"}
          filter="url(#glow)"
        />
      ))}

      {/* label hints */}
      {[
        { x: 140, y: 148, text: "CORE" },
        { x: 295, y: 208, text: "OUTPUT" },
      ].map((l) => (
        <text
          key={l.text}
          x={l.x} y={l.y}
          textAnchor="middle"
          fontSize="7"
          fontFamily="monospace"
          fill="#f43f5e"
          opacity="0.5"
          letterSpacing="2"
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}

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

        {/* 4-card row */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Card
            label="Quick Intro"
            price="Free"
            sub="/ 15 min"
            badge="Start here"
            desc="Not a sales call. We talk about where you are, what's not working, and whether I can help."
            features={[
              "No pitch, no pressure",
              "You describe your situation",
              "I tell you what I'd focus on",
              "Right-fit check — both ways",
            ]}
            accent="purple"
            cta="Grab a slot →"
          />
          <Card
            label="Owner's Session"
            price="$400"
            sub="/ 90 min"
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
            accent="blue"
            featured
          />
          <Card
            label="AI Discovery"
            price="$150"
            sub="/ 30 min"
            desc="Map what's worth automating before committing to a build."
            features={[
              "AI and automation opportunity scan",
              "Business efficiency gaps",
              "Custom software feasibility",
              "HotFix / security-adjacent scoping",
              "Clear go/no-go recommendation",
            ]}
            note="Discovery cost applied toward your engagement if you move forward."
            accent="emerald"
            featured
            cta="Scope it →"
          />
          <Card
            label="AI Implementation"
            price="$1,000"
            sub="/ 1–2 hrs"
            desc="Deploy proven AI tools into your existing stack. Expert configuration, integration, and training — no custom code."
            features={[
              "Off-the-shelf AI tool setup",
              "Integration into existing workflows",
              "Automation configuration and testing",
              "Team training and onboarding",
              "30-day post-implementation support",
            ]}
            accent="amber"
            featured
          />
        </div>

        {/* Custom Build — premium wide card */}
        <div
          className="relative mt-5 overflow-hidden rounded-xl border border-rose-500/25 transition-all duration-300 hover:border-rose-500/40"
          style={{
            background: "linear-gradient(135deg, rgba(136,19,55,0.18) 0%, rgba(120,10,40,0.12) 40%, rgba(15,10,10,0.6) 100%)",
          }}
        >
          {/* background glow blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #f43f5e 0%, transparent 70%)" }}
            />
            <div
              className="absolute right-60 bottom-0 h-48 w-48 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #fb923c 0%, transparent 70%)" }}
            />
          </div>

          <div className="relative flex flex-col gap-0 lg:flex-row">
            {/* left — copy */}
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
                <a
                  href="#"
                  className="inline-block rounded-md border border-rose-500/40 bg-rose-500/10 px-6 py-2.5 text-center font-mono text-xs uppercase tracking-widest text-rose-300 transition-colors hover:bg-rose-500/20"
                >
                  Start with AI Discovery →
                </a>
                <p className="font-mono text-[10px] text-white/25">
                  Discovery cost applied to project total
                </p>
              </div>
            </div>

            {/* center — graphic */}
            <div className="hidden lg:flex lg:w-[28%] items-center justify-center px-4 py-8 opacity-80">
              <ArchitectureGraphic />
            </div>

            {/* right — features */}
            <div className="border-t border-white/5 p-8 md:p-10 lg:border-t-0 lg:border-l lg:w-[30%]">
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">What&apos;s in scope</p>
              <ul className="space-y-3">
                {[
                  "Custom AI agents and pipelines",
                  "Internal ops and reporting tools",
                  "Security-hardened builds (HotFix)",
                  "Multi-system integrations",
                  "Dashboards and data systems",
                  "Ongoing maintenance available",
                ].map((f) => (
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
