import type { Metadata } from "next";
import { CertTimeline } from "@/components/sections/CertTimeline";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind the code. Andrew Webber — builder, automation architect, and creative coder from Fort Worth, TX.",
};

export default function AboutPage() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-8 py-24">
      {/* Header */}
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-creative">
        $ cat about.txt
      </p>
      <h1 className="mt-2 font-heading text-4xl font-bold">About</h1>

      {/* Story */}
      <div className="mt-12 space-y-6 text-base leading-relaxed text-muted-foreground">
        <p>
          My dad brought home a computer when I was about six years old. It was
          running <span className="text-warm">Windows 3.1</span> and didn&apos;t
          have a single game on it. But I had this unexplainable fascination
          with the way the file systems worked. I&apos;d click through every
          folder, every icon, trying to understand how it all connected.
        </p>

        <p>
          By fifth grade I was building my own computers and making websites.
          Not because anyone told me to. Because I couldn&apos;t stop.
        </p>

        <p>
          That energy never went away. In{" "}
          <span className="text-data">2006</span>, I started working in live
          events across DFW. Sound, lighting, AV production, photography. I
          learned how to make things work under pressure, on a deadline, with
          zero margin for error.
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
          . Premium photo experiences for corporate events and brand
          activations. Canon DSLRs, custom designs from scratch, self-powered
          battery setups. 55+ brands served. 80+ unique configurations.
        </p>

        <p>
          Somewhere along the way I discovered my{" "}
          <span className="text-terminal">ADHD superpower</span>. The thing
          people told me was a weakness turned out to be the reason I can build
          170+ tools, manage multiple businesses, and hyperfocus on problems
          until they&apos;re solved. I stopped fighting it and started
          unleashing it on code.
        </p>

        <p>
          Today I build AI agents, automation systems, and creative code. I have
          a passion for{" "}
          <span className="text-terminal">cybersecurity</span>,{" "}
          <span className="text-warm">AV production</span>,{" "}
          <span className="text-creative">photography</span>, and{" "}
          <span className="text-data">everything tech</span>. I&apos;m a
          systems guy who loves perfect organization, LaCroix, and building
          things that make other people&apos;s lives easier.
        </p>

        <p>
          No aspirations of being a teacher. I help people and businesses by
          building, not lecturing. I love my family more than anyone should
          be allowed to love.
        </p>
      </div>

      {/* Education */}
      <div className="mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-creative">
          $ cat ~/.credentials
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold">
          Education & Certifications
        </h2>
        <p className="mt-2 mb-8 text-muted-foreground">
          Always learning. Never done.
        </p>
        <CertTimeline />
      </div>

      {/* Contact */}
      <div className="mt-24">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-creative">
          $ echo &quot;say hello&quot;
        </p>
        <h2 className="mt-2 font-heading text-3xl font-bold">Get in Touch</h2>
        <p className="mt-2 mb-8 text-muted-foreground">
          Have a question, want to collaborate, or just want to say hey.
        </p>
        <ContactForm />
      </div>
    </div>
  );
}
