import type { Offer, OfferAccent } from "@/lib/offers";
import { OfferCard } from "@/components/sections/OfferCard";

const ACCENT_TEXT: Record<OfferAccent, string> = {
  terminal: "text-terminal",
  data: "text-data",
  creative: "text-creative",
  warm: "text-warm",
};

interface OffersSectionProps {
  id?: string;
  eyebrow: string;
  headingTop: string;
  headingAccent: string;
  accent: OfferAccent;
  sub: string;
  offers: Offer[];
}

export function OffersSection({
  id,
  eyebrow,
  headingTop,
  headingAccent,
  accent,
  sub,
  offers,
}: OffersSectionProps) {
  const headingId = id ? `${id}-heading` : undefined;
  const grid =
    offers.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";

  return (
    <section aria-labelledby={headingId}>
      <div className={`font-mono text-xs font-medium tracking-[0.4em] uppercase ${ACCENT_TEXT[accent]} mb-6`}>
        {eyebrow}
      </div>

      <h2
        id={headingId}
        className="crop font-extrabold text-[clamp(40px,7vw,96px)] leading-[0.9] max-w-4xl"
      >
        {headingTop}
        <br />
        <span className={ACCENT_TEXT[accent]}>{headingAccent}</span>
      </h2>

      <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl mt-6 md:mt-8">
        {sub}
      </p>

      <div className={`mt-12 grid gap-6 ${grid}`}>
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
