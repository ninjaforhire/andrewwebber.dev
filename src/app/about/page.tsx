import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { CertTimeline } from "@/components/sections/CertTimeline";
import { ContactForm } from "@/components/forms/ContactForm";
import { CharacterStatsStrip } from "@/components/sections/CharacterStats";
import { LearningLibrary } from "@/components/sections/LearningLibrary";
import { MatrixRain } from "@/components/portrait/MatrixRain";
import { PortraitFigure } from "@/components/portrait/PortraitFigure";
import { SITE_STATS } from "@/lib/site-stats";

export const metadata: Metadata = {
  title: "Dossier",
  description:
    "The story behind the code. Andrew Webber, builder, automation architect, and creative coder from Fort Worth, TX.",
};

const ROOT = process.cwd();
const LINEART_SVG = fs.readFileSync(
  path.join(ROOT, "src/data/portrait-lineart.svg"),
  "utf-8",
);

const HERO_LABEL_SHADOW = "0 0 18px var(--background), 0 0 36px var(--background)";
const HERO_TEXT_SHADOW =
  "0 0 28px var(--background), 0 0 56px var(--background), 0 0 90px var(--background), 0 0 120px var(--background)";

const CHAPTERS = [
  {
    year: "1996",
    tag: "Origin",
    hook: "Dad brought home a Windows 3.1 machine when I was six. Zero games.",
    body: "No Solitaire, no Minesweeper, nothing. I opened every folder on the hard drive instead, just to see what each one did.\n\nMost kids got a Nintendo. I got File Manager, and honestly, it worked out.",
    accent: "text-warm",
  },
  {
    year: "2001",
    tag: "First builds",
    hook: "Wrote my first HTML page in fifth grade.",
    body: "My whole process was View Source on any site I liked, paste the tags into Notepad, hit refresh, and see what broke. Nobody assigned this. I was ten.\n\nIt never wore off.",
    accent: "text-data",
  },
  {
    year: "2004",
    tag: "LAN years",
    hook: "Built my first gaming rig.",
    body: "Competitive Counter-Strike, LAN tournaments across the country, a full tower PC hauled through airports and hotel lobbies. The sweatiest years of my life.\n\nMy parents drove me everywhere, paid the entry fees, and never once suggested I find a normal hobby. They are heroes and I mean that.",
    accent: "text-warm",
  },
  {
    year: "2006",
    tag: "Live events",
    hook: "Started running live events across DFW.",
    body: "Sound, lighting, AV, photography. Every weekend brought a new venue, a new load-in, and a new discovery about what a road case cannot actually survive.\n\nYou learn to solve problems fast when the room fills in twenty minutes and the clock does not care how you feel about it.",
    accent: "text-creative",
  },
  {
    year: "2016",
    tag: "MIGHTY",
    hook: "Founded MIGHTY Photo Booths.",
    body: "Premium photo and video activations for corporate brands. Canon DSLRs, custom designs built from scratch, self-powered battery rigs so we could set up anywhere a planner pointed.\n\nIt started as a side hustle. It refused to stay one.",
    accent: "text-creative",
  },
  {
    year: "2018",
    tag: "Met Vivian",
    hook: "Met Vivian at a Fourth of July fireworks show. Best thing that ever happened to me or MIGHTY.",
    body: "Kaboomtown fireworks over the runway. MIGHTY was hired to capture a private event on the Addison airfield that night, and I was working the booth with my son Aidyn right next to me. Somewhere between load-in and the finale, Vivian and I got to talking, and eight years later I am still glad she stopped by that booth.\n\nVivian is the driving force at MIGHTY now. She inspects every piece of creative before it goes out and spots fires before they start at our live events, all instinct and a sharp analytical eye.\n\nThen in 2023 she brought us our son Adrian. Best partner I will ever have.",
    accent: "text-warm",
  },
  {
    year: "2023",
    tag: "Full time",
    hook: "Went full time on the crazy idea.",
    body: "January 1, 2023. Every AV contract I had spent years building expired, and I let them all go on purpose. Steady work, safe money, gone. I did the math on our savings about forty times that January.\n\nThat was the year we broke our first $100,000 in revenue. Since then the bar keeps moving: scaling a team, keeping a full client list happy while chasing new ones, building experiences nobody has seen before.\n\nThis is the most fun I have ever had in business, and it is not close.",
    accent: "text-creative",
  },
  {
    year: "2023",
    tag: "ADHD ≠ bug",
    hook: "Figured out the thing people called a weakness was actually the engine.",
    body: `Hyperfocus used to mean losing a whole weekend to something nobody asked for. Now it means ${SITE_STATS.tools}+ tools and counting. Same brain, better aim.\n\nI stopped fighting it and started pointing it at code.`,
    accent: "text-terminal",
  },
  {
    year: "Now",
    tag: "Today",
    hook: "These days I mostly teach robots to do my old jobs.",
    body: "AI agents, automation systems, creative code, security work. I am a systems guy who loves clean organization, cold LaCroix, and shipping things that make someone's day easier.\n\nI help by building, not lecturing.",
    accent: "text-terminal",
  },
];

export default function AboutPage() {
  return (
    <>
      <MatrixRain />

      <div className="page-x py-24 md:py-32 relative">
        {/* HERO + STORY — left content column; PortraitFigure pins to the right 40vw of the viewport. */}
        <section className="relative">
          {/* Desktop: the fixed glitch portrait pins to the right 40vw. On
              mobile it collapses to a sliver behind the backplates, so we hide
              it here and surface a centered portrait in the contact section. */}
          <div className="hidden lg:block">
            <PortraitFigure
              lineartSvg={LINEART_SVG}
              photoSrc="/images/portrait/andrew-display.jpg"
            />
          </div>

          <div
            className="relative z-10 rounded-2xl px-5 py-8 backdrop-blur-sm md:px-8 md:py-10 lg:mr-[40%]"
            style={{ background: "color-mix(in oklab, var(--background) 80%, transparent)" }}
          >
            {/* HEADER */}
            <div
              className="font-mono text-xs font-bold tracking-[0.4em] uppercase text-creative mb-6"
              style={{ textShadow: HERO_LABEL_SHADOW }}
            >
              Dossier
            </div>
            <h1
              className="crop font-extrabold text-[clamp(56px,9vw,128px)] leading-[0.88]"
              style={{ textShadow: HERO_TEXT_SHADOW }}
            >
              Builder. <br />
              <span className="text-creative">Storyteller.</span>
              <br />
              Systems guy.
            </h1>

            {/* STATS STRIP */}
            <div className="mt-12 md:mt-16">
              <CharacterStatsStrip />
            </div>

            {/* CHAPTERED STORY — replaces the wall of text. Each chapter:
                year marker · short tag · big hook · subordinate body line. */}
            <div className="mt-24 md:mt-32 space-y-16 md:space-y-20">
              {CHAPTERS.map((c, i) => (
                <article
                  key={`${c.year}-${c.tag}`}
                  className="grid gap-3 md:grid-cols-[140px_1fr] md:gap-6"
                >
                  <div className="font-mono">
                    <div
                      className={`text-2xl md:text-3xl font-bold tabular-nums ${c.accent}`}
                      style={{ textShadow: HERO_LABEL_SHADOW }}
                    >
                      {c.year}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
                      {c.tag}
                    </div>
                  </div>
                  <div>
                    <p
                      className="font-heading text-2xl md:text-3xl font-bold leading-[1.15]"
                      style={{ textShadow: HERO_LABEL_SHADOW }}
                    >
                      {c.hook.includes("MIGHTY Photo Booths") ? (
                        <>
                          {c.hook.split("MIGHTY")[0]}
                          <a
                            href="https://mightyphotobooths.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-creative underline decoration-creative/30 hover:text-creative/80"
                          >
                            MIGHTY Photo Booths
                          </a>
                          {c.hook.split("MIGHTY Photo Booths")[1]}
                        </>
                      ) : (
                        c.hook
                      )}
                    </p>
                    <div className="mt-3 space-y-3 max-w-xl">
                      {c.body.split("\n\n").map((para) => (
                        <p
                          key={para.slice(0, 24)}
                          className="text-base md:text-lg leading-relaxed text-muted-foreground"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  </div>
                  {i < CHAPTERS.length - 1 && (
                    <div className="md:col-span-2 mt-10 h-px bg-white/5" />
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EDUCATION — anchored left, constrained, plated against the portrait */}
        <div
          className="relative z-10 mt-16 md:mt-24 rounded-2xl px-5 py-12 backdrop-blur-sm md:px-8 md:py-16 lg:mr-[40%]"
          style={{ background: "color-mix(in oklab, var(--background) 80%, transparent)" }}
        >
          <div
            className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-6"
            style={{ textShadow: HERO_LABEL_SHADOW }}
          >
            § 01 — Credentials
          </div>
          <h2
            className="crop font-extrabold text-[clamp(40px,7vw,96px)] leading-[0.9] mb-6"
            style={{ textShadow: HERO_TEXT_SHADOW }}
          >
            Always <span className="text-data">learning</span>.<br />
            Never done.
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-10">
            Certifications, courses, and credentials picked up along the way.
          </p>
          <CertTimeline />

          <div className="mt-16 md:mt-24">
            <div
              className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-4"
              style={{ textShadow: HERO_LABEL_SHADOW }}
            >
              Library / books + courses
            </div>
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl mb-8">
              The reading and self-study stack. Business, leadership, design, security. Always
              something open in the queue.
            </p>
            <LearningLibrary />
          </div>
        </div>

        {/* CONTACT — backplate at 80% bg so the portrait + rain barely peek through */}
        <div
          id="contact"
          className="relative z-10 mt-32 md:mt-48 rounded-2xl border border-white/5 px-6 md:px-10 py-16 md:py-24 backdrop-blur-sm"
          style={{ background: "color-mix(in oklab, var(--background) 80%, transparent)" }}
        >
          {/* Mobile-only portrait: centered behind the contact copy so Andrew is
              visible here (the fixed desktop portrait is hidden on mobile).
              Negative z keeps it above the backplate but under the text. */}
          <img
            src="/images/portrait/andrew-display.jpg"
            alt=""
            aria-hidden
            className="lg:hidden pointer-events-none absolute left-1/2 top-[150px] w-[88%] max-w-[340px] -translate-x-1/2 -translate-y-1/2 object-contain mix-blend-screen"
            style={{
              zIndex: -1,
              opacity: 0.65,
              filter:
                "grayscale(1) brightness(0.95) contrast(1.2) sepia(1) hue-rotate(60deg) saturate(4.5)",
              maskImage:
                "radial-gradient(closest-side, black 62%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(closest-side, black 62%, transparent 100%)",
            }}
          />
          <div
            className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-6"
            style={{ textShadow: HERO_LABEL_SHADOW }}
          >
            § 02 — Get in touch
          </div>
          <h2
            className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-8"
            style={{ textShadow: HERO_TEXT_SHADOW }}
          >
            Say <span className="text-terminal">hello</span>.
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-10 md:mb-12">
            Question, collaboration, or just want to say hey.
          </p>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
