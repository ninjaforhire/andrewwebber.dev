import type { Metadata } from "next";
import { CertTimeline } from "@/components/sections/CertTimeline";
import { ContactForm } from "@/components/forms/ContactForm";
import { CharacterStats } from "@/components/sections/CharacterStats";

export const metadata: Metadata = {
  title: "Dossier",
  description:
    "The story behind the code. Andrew Webber — builder, automation architect, and creative coder from Fort Worth, TX.",
};

export default function AboutPage() {
  return (
    <div className="px-12 sm:px-16 md:px-24 py-24 md:py-32">

      {/* HEADER */}
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-creative mb-6">
        § 01 — Dossier
      </div>
      <h1 className="crop font-extrabold text-[clamp(56px,10vw,140px)] leading-[0.88]">
        Builder. <br />
        <span className="text-creative">Storyteller.</span><br />
        Systems guy.
      </h1>

      {/* STORY */}
      <div className="mt-20 max-w-4xl space-y-8 text-2xl leading-relaxed text-muted-foreground">
        <p>
          My dad brought home a computer when I was about six years old. It was running{" "}
          <span className="text-warm">Windows 3.1</span> and didn&apos;t have a single game on it. But I had this unexplainable fascination with the way the file systems worked. I&apos;d click through every folder, every icon, trying to understand how it all connected.
        </p>

        <p>
          By fifth grade I was building my own computers and making websites. Not because anyone told me to. Because I couldn&apos;t stop.
        </p>

        <p>
          That energy never went away. In <span className="text-data">2006</span>, I started working in live events across DFW. Sound, lighting, AV production, photography. I learned how to make things work under pressure, on a deadline, with zero margin for error.
        </p>

        <p>
          On <span className="text-creative">December 5, 2016</span>, I founded{" "}
          <a
            href="https://mightyphotobooths.com"
            className="text-creative underline decoration-creative/30 transition-colors hover:text-creative/80"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIGHTY Photo Booths
          </a>
          . Premium photo experiences for corporate events and brand activations. Canon DSLRs, custom designs from scratch, self-powered battery setups. 55+ brands served. 80+ unique configurations.
        </p>

        <p>
          Somewhere along the way I discovered my <span className="text-terminal">ADHD superpower</span>. The thing people told me was a weakness turned out to be the reason I can build 170+ tools, manage multiple businesses, and hyperfocus on problems until they&apos;re solved. I stopped fighting it and started unleashing it on code.
        </p>

        <p>
          Today I build AI agents, automation systems, and creative code. I have a passion for{" "}
          <span className="text-terminal">cybersecurity</span>,{" "}
          <span className="text-warm">AV production</span>,{" "}
          <span className="text-creative">photography</span>, and{" "}
          <span className="text-data">everything tech</span>. I&apos;m a systems guy who loves perfect organization, LaCroix, and building things that make other people&apos;s lives easier.
        </p>

        <p>
          No aspirations of being a teacher. I help people and businesses by building, not lecturing. I love my family more than anyone should be allowed to love.
        </p>
      </div>

      {/* CHARACTER STATS */}
      <div className="mt-32 md:mt-40 pt-32 border-t border-white/5">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-6">
          § 02 — Character Sheet
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-8">
          Stats <span className="text-terminal">unlocked</span>.
        </h2>
        <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-16">
          Twenty years of practice across six disciplines. Still grinding XP.
        </p>
        <CharacterStats />
      </div>

      {/* EDUCATION */}
      <div className="mt-32 md:mt-40 pt-32 border-t border-white/5">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-6">
          § 03 — Credentials
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-8">
          Always <span className="text-data">learning</span>.<br />
          Never done.
        </h2>
        <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-16">
          Certifications, courses, and credentials picked up along the way.
        </p>
        <CertTimeline />
      </div>

      {/* CONTACT */}
      <div id="contact" className="mt-32 md:mt-40 pt-32 border-t border-white/5">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-6">
          § 04 — Get in touch
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-8">
          Say <span className="text-terminal">hello</span>.
        </h2>
        <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-12">
          Question, collaboration, or just want to say hey.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
