import type { Metadata } from "next";
import { OffersSection } from "@/components/sections/OffersSection";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { OFFERS, CALL_TIERS } from "@/lib/offers";

export const metadata: Metadata = {
  title: "Engagements",
  description:
    "Hands-on consulting with Andrew Webber. AI implementation, custom dashboards, and automation strategy. Limited engagements each quarter.",
};

export default function EngagementsPage() {
  return (
    <div className="page-x section-y">
      {/* HERO */}
      <div className="font-mono text-xs font-normal tracking-[0.4em] uppercase text-warm mb-8">
        <span className="font-bold">Engagements</span> · Limited each quarter
      </div>
      <h1 className="crop font-extrabold text-[clamp(48px,8vw,120px)] leading-[0.9] max-w-5xl">
        Hands-on
        <br />
        <span className="text-warm">consulting</span>.
      </h1>
      <p className="text-2xl leading-relaxed text-muted-foreground max-w-3xl mt-8 md:mt-12">
        A handful of slots each quarter for businesses ready to level up. AI implementation, custom dashboards, automation that compounds.
      </p>

      {/* PRODUCTIZED OFFERS — fixed-scope, Stripe checkout */}
      <div className="mt-20 md:mt-32">
        <OffersSection
          id="offers"
          eyebrow="Productized · fixed scope, fixed price"
          headingTop="Buy an outcome,"
          headingAccent="not an hour."
          accent="data"
          sub="Three ways to put the stack to work — a fast audit, a built-to-order agent, or an AI receptionist that never sleeps. Clear price, clear deliverable."
          offers={OFFERS}
        />
      </div>

      {/* CALL TIERS — book a working session */}
      <div className="mt-20 md:mt-40 pt-16 md:pt-32 border-t border-white/5">
        <OffersSection
          id="sessions"
          eyebrow="Or book a working session"
          headingTop="Pick my brain."
          headingAccent="Or build with me."
          accent="warm"
          sub="Prefer to talk it through first? Book time directly. From a free intro to a live build on your systems."
          offers={CALL_TIERS}
        />
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
