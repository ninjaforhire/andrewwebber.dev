// Offers across the site — one data file, one card component (OfferCard).
//
// Two kinds of card:
//   • BUY  — has `checkoutUrl` (Stripe Payment Link). Falls back to the
//     invoice-request form until you paste a link, so the page never breaks.
//   • BOOK — has `bookingUrl` (Cal.com or #consultation). For call/session
//     bookings, no payment needed up front.
//
// HOW TO GO LIVE ON A BUY CARD (5 min each, only you can — it's your bank):
//   1. https://dashboard.stripe.com/payment-links → New
//   2. Create the product at the price below, copy the payment-link URL
//   3. Paste it into that offer's `checkoutUrl`

export type OfferAccent = "terminal" | "data" | "creative" | "warm";

export interface Offer {
  id: string;
  label: string; // mono eyebrow
  title: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  accent: OfferAccent;
  featured?: boolean;
  ctaLabel: string; // button text when live
  checkoutUrl: string; // Stripe link — "" falls back to invoice-request form
  bookingUrl?: string; // Cal.com / "#consultation" — makes this a BOOK card
  bookCallUrl: string; // secondary "talk first" link on BUY cards
}

// ── /engagements — productized services (general market) ──────────────────
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

// ── /engagements — book a working session (restyled call tiers) ───────────
export const CALL_TIERS: Offer[] = [
  {
    id: "quick-intro",
    label: "Start here",
    title: "Quick Intro",
    price: "Free",
    cadence: "/ 15 min",
    summary:
      "A quick call to see if we're a fit. Bring one specific problem and we'll figure out whether I can help.",
    features: ["No commitment", "One specific problem", "Straight answer on fit"],
    accent: "terminal",
    ctaLabel: "Book",
    checkoutUrl: "",
    bookingUrl: "#consultation",
    bookCallUrl: "#consultation",
  },
  {
    id: "ai-discovery",
    label: "Explore",
    title: "AI Discovery",
    price: "$150",
    cadence: "/ 30 min",
    summary:
      "Where would AI actually move the needle in your business? We map the highest-value spots and I point you at what to build first.",
    features: ["30 focused minutes", "Opportunity map", "What to build first"],
    accent: "data",
    ctaLabel: "Book — $150",
    checkoutUrl: "",
    bookingUrl: "#consultation",
    bookCallUrl: "#consultation",
  },
  {
    id: "owners-session",
    label: "Most popular",
    title: "Owner's Session",
    price: "$400",
    cadence: "/ 90 min",
    summary:
      "Deep working session on your ops and automation strategy. Come with the mess, leave with a plan and a priority order.",
    features: ["90 minutes, screen-shared", "Ops + automation strategy", "Prioritized action plan"],
    accent: "warm",
    featured: true,
    ctaLabel: "Book — $400",
    checkoutUrl: "",
    bookingUrl: "#consultation",
    bookCallUrl: "#consultation",
  },
  {
    id: "ai-implementation",
    label: "Build with me",
    title: "AI Implementation",
    price: "$1,000",
    cadence: "/ 1–2 hrs",
    summary:
      "We build live. Bring a real workflow and we stand up a working automation together, on your systems, in the session.",
    features: ["Live build on your systems", "One working automation", "You keep everything we build"],
    accent: "creative",
    ctaLabel: "Book — $1,000",
    checkoutUrl: "",
    bookingUrl: "#consultation",
    bookCallUrl: "#consultation",
  },
];

// ── /photo-booth-owners — consultation built for operators ────────────────
export const BOOTH_OFFERS: Offer[] = [
  {
    id: "booth-automation-audit",
    label: "Fastest ROI",
    title: "Booth Automation Audit",
    price: "$299",
    cadence: "flat · 48-hour turnaround",
    summary:
      "I map every manual thing your booth business does before, during, and after an event, then hand you a done-for-you automation roadmap ranked by what saves you the most time.",
    features: [
      "Full review of your booth ops workflow",
      "Automation roadmap, ranked by time saved",
      "Written plan you can act on yourself or hire out",
      "30-minute debrief call",
      "Built by a 10-year operator, for operators",
    ],
    accent: "data",
    ctaLabel: "Buy — $299",
    checkoutUrl: "",
    bookCallUrl: "#inquiry",
  },
  {
    id: "power-hour",
    label: "Any platform · one automation",
    title: "Automation Power Hour",
    price: "$400",
    cadence: "90-min live build · one automation",
    summary:
      "Tell me your platform and the automation you wish existed. In one 90-minute session we build it live, together, on your systems. Snappic, Booth.Events, HoneyBook, Check Cherry, whatever you run.",
    features: [
      "90 minutes, screen-shared, we build together",
      "One CRM or ops automation for YOUR platform",
      "You bring the platform + the idea",
      "Works with any booth CRM or booking tool",
      "You keep everything we build",
    ],
    accent: "warm",
    featured: true,
    ctaLabel: "Buy — $400",
    checkoutUrl: "",
    bookCallUrl: "#inquiry",
  },
  {
    id: "roi-reports",
    label: "Sell premium · prove ROI",
    title: "Post-Event ROI Reports",
    price: "$99",
    cadence: "/ report · Snappic + Booth.Events",
    summary:
      "Hand your corporate clients a branded report that proves the value of their activation — engagement, reach, top moments. The proof that justifies premium pricing and gets you rebooked.",
    features: [
      "Branded, client-ready PDF from your gallery data",
      "Works with Snappic and Booth.Events galleries",
      "Engagement, reach, and top-moments breakdown",
      "Turn it around same week",
      "Volume pricing for repeat corporate work",
    ],
    accent: "terminal",
    ctaLabel: "Buy — $99",
    checkoutUrl: "",
    bookCallUrl: "#inquiry",
  },
];
