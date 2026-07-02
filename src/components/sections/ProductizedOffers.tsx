import { OFFERS } from "@/lib/offers";
import { OfferCard } from "@/components/sections/OfferCard";

export function ProductizedOffers() {
  return (
    <section aria-labelledby="offers-heading">
      <div className="font-mono text-xs font-medium tracking-[0.4em] uppercase text-data mb-6">
        Productized · fixed scope, fixed price
      </div>

      <h2
        id="offers-heading"
        className="crop font-extrabold text-[clamp(40px,7vw,96px)] leading-[0.9] max-w-4xl"
      >
        Buy an outcome,
        <br />
        <span className="text-data">not an hour</span>.
      </h2>

      <p className="text-xl leading-relaxed text-muted-foreground max-w-2xl mt-6 md:mt-8">
        Three ways to put the stack to work — a fast audit, a built-to-order agent,
        or an AI receptionist that never sleeps. Clear price, clear deliverable.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {OFFERS.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
