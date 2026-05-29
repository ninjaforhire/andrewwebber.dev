import { cn } from "@/lib/utils";

function Card({
  label,
  price,
  sub,
  desc,
  features,
  accent,
  featured,
  cta = "Book Now →",
}: {
  label: string;
  price: string;
  sub?: string;
  desc: string;
  features: string[];
  accent: "purple" | "blue" | "green" | "amber";
  featured?: boolean;
  cta?: string;
}) {
  const colors = {
    purple: {
      label: "text-purple-400",
      border: "border-purple-500/30",
      bg: "bg-purple-500/10",
      check: "text-purple-400",
      btn: "border-purple-500/40 text-purple-400 hover:bg-purple-500/10",
      btnFeatured: "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30",
    },
    blue: {
      label: "text-sky-400",
      border: "border-sky-500/30",
      bg: "bg-sky-500/10",
      check: "text-sky-400",
      btn: "border-sky-500/40 text-sky-400 hover:bg-sky-500/10",
      btnFeatured: "bg-sky-500/20 text-sky-300 hover:bg-sky-500/30",
    },
    green: {
      label: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      check: "text-emerald-400",
      btn: "border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10",
      btnFeatured: "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30",
    },
    amber: {
      label: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      check: "text-amber-400",
      btn: "border-amber-500/40 text-amber-400 hover:bg-amber-500/10",
      btnFeatured: "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30",
    },
  }[accent];

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-7 transition-all duration-300 hover:scale-[1.01]",
        featured
          ? `${colors.border} ${colors.bg}`
          : "border-white/10 bg-white/[0.03]"
      )}
    >
      <p className={cn("font-mono text-[10px] uppercase tracking-widest", colors.label)}>
        {label}
      </p>
      <div className="mt-3">
        <span className="font-heading text-4xl font-extrabold leading-none">{price}</span>
        {sub && (
          <span className="ml-2 font-mono text-xs text-white/40">{sub}</span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/50">{desc}</p>
      <ul className="mt-5 flex-1 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm">
            <span className={cn("mt-0.5 font-mono text-xs shrink-0", colors.check)}>✓</span>
            <span className="text-white/60">{f}</span>
          </li>
        ))}
      </ul>
      <a
        href="#"
        className={cn(
          "mt-8 block rounded-md py-2.5 text-center font-mono text-xs uppercase tracking-widest border transition-colors",
          featured ? colors.btnFeatured : colors.btn
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
      <div className="mx-auto max-w-6xl">
        {/* header */}
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-amber-400 mb-6">
          § 02 — Services · preview
        </p>
        <h1 className="font-heading text-[clamp(48px,7vw,96px)] font-extrabold leading-[0.9] mb-6">
          Hands-on <span className="text-amber-400">consulting</span>.
        </h1>
        <p className="text-xl text-white/50 max-w-2xl mb-16">
          Limited engagements each quarter for businesses ready to level up.
        </p>

        {/* 3-card grid */}
        <div className="grid gap-5 md:grid-cols-3">
          <Card
            label="Photo Booth Consulting"
            price="Let's Talk"
            desc="20 years of live event experience. Ask me anything."
            features={[
              "Photo booth business strategy",
              "Website and SEO audit",
              "Security assessment",
              "Equipment and workflow review",
              "Brand positioning guidance",
            ]}
            accent="purple"
            cta="Start the conversation →"
          />
          <Card
            label="Discovery Call"
            price="$250"
            sub="/ 1 hr"
            desc="Map your AI and ops gaps — or uncover security risk. Pick a scope."
            features={[
              "AI & automation opportunities",
              "Business process improvement",
              "Code and application security",
              "Infrastructure threat surface",
              "Prioritized action plan",
            ]}
            accent="blue"
            featured
          />
          <Card
            label="AI Implementation"
            price="$1,000"
            desc="Custom AI automation built for your business operations."
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

        {/* divider + note */}
        <p className="mt-12 font-mono text-xs text-white/20 text-center">
          /lab/consulting-preview · not live · for review only
        </p>
      </div>
    </main>
  );
}
