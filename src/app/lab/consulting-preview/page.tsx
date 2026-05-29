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
            desc="Map what's worth automating and what isn't before committing to a build."
            features={[
              "AI and automation opportunity scan",
              "Business efficiency gaps",
              "Custom software feasibility",
              "HotFix / security-adjacent scoping",
              "Clear go/no-go recommendation",
            ]}
            note="If you move forward, this $150 applies toward your engagement."
            accent="emerald"
            featured
            cta="Scope it →"
          />

          <Card
            label="AI Implementation"
            price="$1,000"
            sub="/ 1–2 hrs"
            desc="Deploy proven AI tools into your existing stack. No custom code — expert configuration, integration, and training."
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

        {/* Wide custom build card */}
        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-8 md:p-10 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.03]">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex-1 max-w-2xl">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">Custom Build</p>
              <div className="mt-3 flex items-baseline gap-3 flex-wrap">
                <span className="font-heading text-4xl font-extrabold leading-none">$3,000</span>
                <span className="font-mono text-sm text-white/35">– $25,000+ depending on scope</span>
              </div>
              <p className="mt-4 text-base leading-relaxed text-white/45 max-w-xl">
                Bespoke software built from scratch. Custom agents, automation pipelines, internal tools,
                and security-hardened systems. Scoped through an AI Discovery call — no estimates without a conversation first.
              </p>
            </div>
            <div className="grid gap-x-12 gap-y-2.5 sm:grid-cols-2 md:shrink-0 md:w-auto">
              {[
                "Custom AI agents and pipelines",
                "Internal ops tooling",
                "Security-hardened builds (HotFix)",
                "Multi-system integrations",
                "Dashboards and reporting systems",
                "Ongoing maintenance available",
              ].map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 font-mono text-xs shrink-0 text-white/30">✓</span>
                  <span className="text-white/50">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="rounded-md border border-white/15 px-6 py-2.5 text-center font-mono text-xs uppercase tracking-widest text-white/50 transition-colors hover:border-white/25 hover:text-white/70"
            >
              Start with AI Discovery →
            </a>
            <p className="self-center font-mono text-[10px] text-white/25">
              Discovery call cost applied to project total
            </p>
          </div>
        </div>

        <p className="mt-10 font-mono text-xs text-white/15 text-center">
          /lab/consulting-preview · not live · for review only
        </p>
      </div>
    </main>
  );
}
