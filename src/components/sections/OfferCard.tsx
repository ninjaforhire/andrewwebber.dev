import { cn } from "@/lib/utils";
import type { Offer } from "@/lib/offers";

const ACCENT_CLASSES = {
  terminal: { border: "border-terminal/30", text: "text-terminal", bg: "bg-terminal/10" },
  data: { border: "border-data/30", text: "text-data", bg: "bg-data/10" },
  creative: { border: "border-creative/30", text: "text-creative", bg: "bg-creative/10" },
  warm: { border: "border-warm/30", text: "text-warm", bg: "bg-warm/10" },
};

export function OfferCard({ offer }: { offer: Offer }) {
  const a = ACCENT_CLASSES[offer.accent];
  const live = offer.checkoutUrl.trim().length > 0;

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-6 transition-all duration-300 hover:scale-[1.02]",
        offer.featured ? `${a.border} ${a.bg}` : "border-border bg-card/50"
      )}
    >
      <p className={cn("font-mono text-xs uppercase tracking-wider", a.text)}>
        {offer.label}
      </p>

      <h3 className="mt-3 font-heading text-2xl font-bold">{offer.title}</h3>

      <div className="mt-5 grid gap-1">
        <span className="font-heading text-4xl font-bold leading-none">{offer.price}</span>
        <span className="font-mono text-xs leading-relaxed text-muted-foreground">
          {offer.cadence}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{offer.summary}</p>

      <ul className="mt-5 space-y-2">
        {offer.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className={cn("mt-1 font-mono text-xs", a.text)}>✓</span>
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        {live ? (
          <a
            href={offer.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block rounded-md py-3 text-center font-mono text-xs uppercase tracking-wider transition-opacity hover:opacity-80",
              a.bg,
              a.text
            )}
          >
            {offer.ctaLabel} →
          </a>
        ) : offer.bookingUrl ? (
          // BOOK card — routes to Cal.com / contact form, no payment up front
          <a
            href={offer.bookingUrl}
            className={cn(
              "block rounded-md py-3 text-center font-mono text-xs uppercase tracking-wider transition-opacity hover:opacity-80",
              a.bg,
              a.text
            )}
          >
            {offer.ctaLabel} →
          </a>
        ) : (
          // BUY card with no Stripe link yet — graceful fallback
          <a
            href={offer.bookCallUrl}
            className="block rounded-md border border-border py-3 text-center font-mono text-xs uppercase tracking-wider transition-colors hover:border-white/30"
          >
            Request invoice →
          </a>
        )}

        {live && (
          <a
            href={offer.bookCallUrl}
            className="mt-3 block text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
          >
            or book a 15-min call first
          </a>
        )}
      </div>
    </div>
  );
}
