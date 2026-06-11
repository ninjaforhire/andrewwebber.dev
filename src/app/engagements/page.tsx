import type { Metadata } from "next";
import { ConsultingSection } from "@/components/sections/ConsultingSection";
import { ConsultationForm } from "@/components/forms/ConsultationForm";

export const metadata: Metadata = {
  title: "Engagements",
  description:
    "Hands-on consulting with Andrew Webber. AI implementation, custom dashboards, and automation strategy. Limited engagements each quarter.",
};

export default function EngagementsPage() {
  return (
    <div className="page-x section-y">
      {/* HERO */}
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-warm mb-8">
        Engagements · Limited each quarter
      </div>
      <h1 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] max-w-5xl">
        Hands-on
        <br />
        <span className="text-warm">consulting</span>.
      </h1>
      <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mt-8 md:mt-12">
        A handful of slots each quarter for businesses ready to level up. AI implementation, custom dashboards, automation that compounds.
      </p>

      {/* OFFER */}
      <div className="mt-16">
        <ConsultingSection />
      </div>

      {/* BOOK A CALL */}
      <div className="mt-20 md:mt-40 pt-16 md:pt-32 border-t border-white/5">
        <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-terminal mb-6">
          Book a call
        </div>
        <h2 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] mb-8">
          Tell me what
          <br />
          you&apos;re <span className="text-terminal">building</span>.
        </h2>
        <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mb-12">
          I respond within 24 hours.
        </p>
        <ConsultationForm />
      </div>
    </div>
  );
}
