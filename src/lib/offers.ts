// Productized offers — the andrewwebber.dev storefront.
//
// HOW TO GO LIVE (5 min each, only you can do it — it's your bank):
//   1. Go to https://dashboard.stripe.com/payment-links → "New"
//   2. Create a product at the price below, copy the payment-link URL
//   3. Paste it into `checkoutUrl` for that offer
//
// Until a `checkoutUrl` is set, the button falls back to the invoice-request
// form at /engagements#consultation, so the page always works.

export type OfferAccent = "terminal" | "data" | "creative" | "warm";

export interface Offer {
  id: string;
  label: string; // mono eyebrow, e.g. "Fastest ROI"
  title: string;
  price: string; // display price, e.g. "$750"
  cadence: string; // e.g. "flat · 48h turnaround" or "/ month"
  summary: string; // one or two sentences, the pitch
  features: string[];
  accent: OfferAccent;
  featured?: boolean;
  ctaLabel: string; // button text when checkoutUrl is set, e.g. "Buy — $750"
  // ── Paste your Stripe Payment Link here to go live ──
  checkoutUrl: string; // "" = falls back to the invoice-request form
  // Optional "talk first" path (Cal.com / form anchor)
  bookCallUrl: string;
}

export const OFFERS: Offer[] = [
  {
    id: "ai-automation-audit",
    label: "Fastest ROI",
    title: "AI Automation Audit",
    price: "$750",
    cadence: "flat · 48-hour turnaround",
    summary:
      "Your team burns 10+ hours a week on work an AI agent handles in minutes. I audit your top workflows, pinpoint the three highest-ROI automation targets, and deliver a written build-spec report in 48 hours.",
    features: [
      "2–3 hour deep review of your current workflows",
      "Top 3 automation opportunities, ranked by ROI",
      "Written build-spec report (5–8 pages, PDF)",
      "30-minute debrief call",
      "No retainer, no commitment",
    ],
    accent: "data",
    ctaLabel: "Buy — $750",
    checkoutUrl: "",
    bookCallUrl: "#consultation",
  },
  {
    id: "custom-agent-build",
    label: "Highest leverage",
    title: "Custom Agent Build",
    price: "from $2,500",
    cadence: "50% to start · balance on delivery",
    summary:
      "A production-deployed autonomous agent for your specific workflow — lead qualifier, follow-up engine, reporting bot — built on the same stack running 40+ agents at MIGHTY.",
    features: [
      "Scoping call to define the agent's job",
      "Built, tested, and deployed to your systems",
      "Single-purpose from $2,500 · multi-agent workflows to $7,500",
      "Handover docs so your team can run it",
      "Two weeks of post-launch tuning included",
    ],
    accent: "warm",
    featured: true,
    ctaLabel: "Reserve — $2,500 deposit",
    checkoutUrl: "",
    bookCallUrl: "#consultation",
  },
  {
    id: "simone-receptionist",
    label: "Recurring · never miss a call",
    title: "Simone — AI Receptionist",
    price: "$497",
    cadence: "/ month · no setup fee · 30-day cancel",
    summary:
      "Never miss a booking. Simone answers 24/7, qualifies leads, books appointments, and texts back missed callers in under 60 seconds. Running live on MIGHTY's line today.",
    features: [
      "Answers every call, day or night",
      "Qualifies leads and books straight to your calendar",
      "Missed-call text-back in under 60 seconds",
      "Custom-scripted to your business",
      "Cancel anytime — first month pro-rated",
    ],
    accent: "terminal",
    ctaLabel: "Start — $497/mo",
    checkoutUrl: "",
    bookCallUrl: "#consultation",
  },
];
