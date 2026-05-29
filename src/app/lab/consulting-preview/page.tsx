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
}

function Card({ label, price, sub, desc, features, accent, featured, cta = "Book Now →", badge }: CardProps) {
  const c = {
    purple: {
      label: "text-violet-400",
      border: "border-violet-500/30",
      bg: "bg-violet-500/8",
      check: "text-violet-400",
      btnBase: "border-violet-500/30 text-violet-400 hover:bg-violet-500/10",
      btnFeat: "bg-violet-500/15 border-violet-500/40 text-violet-300 hover:bg-violet-500/25",
      badge: "bg-violet-500/15 text-violet-300 border-violet-500/20",
    },
    blue: {
      label: "text-sky-400",
      border: "border-sky-500/30",
      bg: "bg-sky-500/8",
      check: "text-sky-400",
      btnBase: "border-sky-500/30 text-sky-400 hover:bg-sky-500/10",
      btnFeat: "bg-sky-500/15 border-sky-500/40 text-sky-300 hover:bg-sky-500/25",
      badge: "bg-sky-500/15 text-sky-300 border-sky-500/20",
    },
    emerald: {
      label: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/8",
      check: "text-emerald-400",
      btnBase: "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10",
      btnFeat: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    },
    amber: {
      label: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/8",
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
      <a
        href="#"
        className={cn(
          "mt-8 block rounded-md py-2.5 text-center font-mono text-xs uppercase tracking-widest border transition-colors",
          featured ? c.btnFeat : c.btnBase
        )}
      >
        {cta}
      </a>
    </div>
  );
}

export default function ConsultingPreviewPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0f] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400 mb-6">
          § 02 — Services · 4-card preview
        </p>
        <h1 className="font-heading text-[clamp(42px,6vw,88px)] font-extrabold leading-[0.9] mb-6">
          Hands-on <span className="text-amber-400">consulting</span>.
        </h1>
        <p className="text-xl text-white/45 max-w-2xl mb-16">
          Limited engagements each quarter for businesses ready to level up.
        </p>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {/* 1 — Free intro */}
          <Card
            label="Quick Intro"
            price="Free"
            sub="/ 15 min"
            desc="Not a sales call. We talk about where you are, what's not working, and whether I can actually help."
            badge="Start here"
            features={[
              "No pitch, no pressure",
              "You describe your situation",
              "I tell you what I'd focus on",
              "Right fit check — both ways",
            ]}
            accent="purple"
            cta="Grab a slot →"
          />

          {/* 2 — PB owner consulting */}
          <Card
            label="Owner's Session"
            price="$250"
            sub="/ 1 hr"
            desc="For photo booth, live event, and activation business owners. Ask me anything."
            features={[
              "Serving out-of-town markets without white-labeling",
              "Designing custom activations",
              "Website and SEO review",
              "Building SOPs that actually get followed",
              "Fixing workflow and ops friction",
              "Hardware selection and setup",
              "Booking travel logistics",
              "Ranking organically — no ad spend",
            ]}
            accent="blue"
            featured
          />

          {/* 3 — AI discovery */}
          <Card
            label="AI Discovery"
            price="Free"
            sub="/ 15 min"
            desc="Scoping call before we build anything. Map what's worth automating and what isn't."
            features={[
              "AI and automation opportunity scan",
              "Business efficiency gaps",
              "Custom software feasibility",
              "HotFix / security-adjacent builds",
              "Feeds directly into Implementation",
            ]}
            accent="emerald"
            cta="Scope it →"
          />

          {/* 4 — AI implementation */}
          <Card
            label="AI Implementation"
            price="$1,000"
            sub="/ 1–2 hrs"
            desc="We build it. Custom AI automation designed around your actual operations."
            features={[
              "Process automation audit",
              "Custom agent architecture",
              "Dashboard and reporting build",
              "AI operations integration",
              "30-day post-implementation support",
            ]}
            accent="amber"
            featured
          />
        </div>

        <p className="mt-12 font-mono text-xs text-white/15 text-center">
          /lab/consulting-preview · not live · for review only
        </p>
      </div>
    </main>
  );
}
