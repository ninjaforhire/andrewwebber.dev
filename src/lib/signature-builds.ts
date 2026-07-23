import toolsData from "@/data/mighty-tools.json";
import buildProgress from "@/data/build-progress.json";
import type { SignatureBuild, SignatureModule } from "@/components/photo-booth-owners/SignatureCard";
import { SITE_STATS } from "@/lib/site-stats";

interface RawTool {
  slug: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
}

const RAW = toolsData as RawTool[];

// Curated pain-and-relief copy for every SPECTRE module. Keyed by tool slug.
// Scanner descriptions are internal notes; these are written for a reader.
const SPECTRE_COPY: Record<string, string> = {
  "spectre-spectre-api":
    "Security findings trapped in a tool nobody opens are findings nobody acts on. The API exposes every engagement, finding, and score as clean REST, so dashboards and client portals stay current without anyone *exporting a spreadsheet*.",
  "spectre-bastion":
    "Most small businesses find out they were breached months later, from someone else. Bastion is the always-on defense layer: a SIEM plus six autonomous agents that monitor, harden, and respond while you run events. It watches so you can sleep.",
  "spectre-blackthorn":
    "You can't fix holes you've never looked for. Blackthorn attacks your own websites and booking forms the way a real adversary would, then hands you the punch list. Find it before someone with worse intentions does.",
  "spectre-cloudbreak":
    "One misconfigured storage bucket can leak every client gallery you host. Cloudbreak audits AWS, GCP, and Azure for exactly those mistakes: exposed storage, loose permissions, open networks. The cloud stops being a blind spot.",
  "spectre-code-council":
    "A single reviewer misses what their blind spots always miss. Code Council reviews every change from __12 adversarial disciplines__ and converges on a verdict, so risky code gets caught in review instead of in production.",
  "spectre-decepticon-bridge":
    "Red-team tooling usually means juggling a dozen disconnected frameworks. This bridge lets SPECTRE dispatch autonomous offensive engagements without leaving the platform. One console, full engagement.",
  "spectre-dossier":
    "Raw scanner output impresses no one and convinces no one. Dossier consolidates findings from every module, deduplicates, scores, and renders a *branded PDF report* a client can actually read. The deliverable is the product.",
  "spectre-ember":
    "Your credentials end up in breach dumps whether you notice or not. Ember watches breach databases, CVE feeds, and paste sites for anything tied to your business, and alerts the moment something surfaces. You hear it first.",
  "spectre-gauntlet":
    "Security tools you never test are security theater. Gauntlet runs real attack techniques against your own defenses and scores what got caught versus what sailed through. Confidence backed by evidence, not hope.",
  "spectre-ghost-core":
    "Letting an AI drive a computer without guardrails is how horror stories start. Ghost Core is the shared safety layer: dispatch, audit trail, ledger, policy engine, and firewall for every computer-use agent in the fleet. Autonomy with a leash.",
  "spectre-ghost-local":
    "Some jobs need an agent that can see the screen and click, on real accounts. Ghost Local runs on trusted hardware under full policy enforcement, so repetitive portal work gets done without handing credentials to a third party.",
  "spectre-loop":
    "Screenshot, think, click, repeat: that loop is what makes computer-use agents work, and what makes them dangerous when unwatched. Ghost Loop orchestrates it with checkpoints and audit at every step.",
  "spectre-ghost-sandbox":
    "Untrusted automation belongs in a padded room. Ghost Sandbox runs risky browsing in an *ephemeral, isolated browser* that gets destroyed afterward, so experiments can fail without touching anything real.",
  "spectre-spectre-guide":
    "A security engagement the client can't understand is an engagement they won't renew. Guide generates dual-audience PDFs: the full technical manual for operators, the plain-English version for decision makers.",
  "spectre-injection-corpus":
    "AI agents can be talked into doing things they shouldn't; that's the modern attack surface. This curated adversarial dataset hammers the defenses with known injection attacks until they hold.",
  "spectre-llm-guard-wrapper":
    "Every prompt an agent reads is a potential attack vector. LLM Guard vets input before it reaches the model, wrapping computer-use agents in defense-in-depth so a poisoned webpage can't hijack your automation.",
  "spectre-raven":
    "Attackers map your business before they touch it; you should see what they see. Raven runs the same recon: subdomains, exposed emails, tech fingerprints, public footprint. Know your own attack surface cold.",
  "spectre-shannon":
    "A human pentest costs five figures and goes stale the day it's delivered. Shannon is an autonomous AI pentester for web apps and APIs that works methodically and repeats on demand. Continuous assurance instead of an annual snapshot.",
  "spectre-watchtower":
    "Your website degrades quietly: rankings slip, headers weaken, pages break. Watchtower patrols it like a full-time analyst, tracking SEO, security posture, and changes over time, and reports what moved. Nothing rots unnoticed.",
};

// Curated pain-and-relief copy for every Pandora's Forge wing. Booth-studio angle.
const FORGE_COPY: Record<string, string> = {
  "design-forge-animation-wing":
    "Static posts get scrolled past; motion stops thumbs. The Animation Wing turns flat brand assets into animated pieces without hiring a motion designer or learning After Effects. Event promos that move, made in minutes.",
  "design-forge-audio-forge-wing":
    "The wrong track ruins a highlight reel, and licensing music is a minefield. Audio Forge generates, trims, and masters event-ready audio with fades and multi-format export. Every video ships with sound that fits.",
  "design-forge-avatar-3d-wing":
    "Custom 3D characters used to mean a freelancer and a four-figure invoice. The Avatar Wing generates stylized 3D avatars for branded booth experiences and event activations. Premium look, zero pipeline.",
  "design-forge-brand-intelligence-wing":
    "Guessing a client's brand from one logo email leads to revision hell. Brand Intelligence ingests their site and assets, extracts colors, type, and voice, and feeds every other wing. Designs land on-brand the *first* time.",
  "design-forge-character-wing":
    "Mascots and recurring characters make a booth brand memorable, but keeping them consistent across assets is nearly impossible by hand. The Character Wing locks identity so your character looks the same on every poster, overlay, and reel.",
  "design-forge-copy-wing":
    "Blank-page paralysis kills more marketing than bad design does. The Copy Wing writes captions, event promos, and client-facing copy in your voice, not generic AI mush. The words stop being the bottleneck.",
  "design-forge-creative-coding-wing":
    "Template-made graphics look template-made, and clients can tell. Creative Coding generates shader-driven posters and procedural art no competitor can replicate with a Canva account. Scarcity you can sell.",
  "design-forge-design-planner-wing":
    "Big deliverables die without a plan: which assets, what sizes, what order. Design Planner breaks a brief into a build sequence the other wings execute. Projects finish instead of stalling at 80 percent.",
  "design-forge-gen-wing":
    "Every image model has strengths, and picking wrong wastes money and time. The Gen Wing routes each job to the best model for the task and handles the prompting details. One door, every engine behind it.",
  "design-forge-image-forge-wing":
    "Raw AI images are rarely deliverable: wrong crop, off colors, artifacts. Image Forge runs generation through cleanup, upscale, and brand-fit passes so what comes out is *client-ready*, not almost-ready.",
  "design-forge-image-wing":
    "Event work burns through visual assets: welcome screens, overlays, social tiles, backdrops. The Image Wing produces them on demand, matched to the event's design package. Volume without a design backlog.",
  "design-forge-mockup-wing":
    "Clients struggle to say yes to a flat file. The Mockup Wing drops designs into real contexts: the booth, the venue, the printed strip in someone's hand. Approvals speed up because people can finally *see it*.",
  "design-forge-podcast-wing":
    "Audio content builds authority, but production overhead kills consistency. The Podcast Wing handles scripting, voicing, and assembly so a solo operator can ship episodes without a studio.",
  "design-forge-presentation-wing":
    "Corporate clients judge you by the deck before they ever see the booth. The Presentation Wing builds branded, polished presentations from a brief. Walk into the pitch looking like the bigger company.",
  "design-forge-print-production-wing":
    "Print is unforgiving: wrong bleed, wrong profile, wasted run. Print Production preps files to spec for strips, backdrops, and signage. What the printer gets is what the guest holds.",
  "design-forge-slides-wing":
    "Deck design by hand eats nights. The Slides Wing generates brand-aware HTML decks with __21 automated rule checks__ and a 72-brand library, exporting to PDF and presenter modes. Meeting-ready without the all-nighter.",
  "design-forge-template-wing":
    "Every event needs the same family of assets in slightly different clothes. The Template Wing runs a brand-aware template engine so per-event customization takes minutes, not a design request queue.",
  "design-forge-video-forge-wing":
    "Video post-production is where event content goes to die. Video Forge handles assembly, pacing, and polish passes automatically. Highlight reels ship while the event is still fresh.",
  "design-forge-video-wing":
    "Clients now expect video everywhere, and filming everything is impossible. The Video Wing generates and transforms video from stills and prompts: promos, recaps, social clips. A video presence without a video team.",
  "design-forge-website-wing":
    "A booth business without sharp landing pages loses corporate deals it never hears about. The Website Wing builds branded pages and microsites fast enough to spin one up *per campaign or per event*.",
};

// What Jimbo actually orchestrates day to day. Pain-and-relief, like SPECTRE.
const JIMBO_AGENTS: SignatureModule[] = [
  {
    name: "Inbox Agent",
    icon: "Inbox",
    description:
      "Leads go cold in hours, and you're mid-event when they land. Inbox Agent reads every inquiry, classifies it, and drafts a reply in your voice, trained on __3+ years of sent email__. Nothing sits, nothing slips.",
  },
  {
    name: "Morning Brief",
    icon: "Sunrise",
    description:
      "Mornings used to start with an hour of tab-checking across email, calendar, and CRM. The brief lands at 06:00 with leads ranked, tasks flagged, and one priority action. The day starts decided.",
  },
  {
    name: "Lead Score Agent",
    icon: "Target",
    description:
      "Treating every inquiry equally means the $5k corporate lead waits behind a price shopper. Scoring across __13 weighted signals__ pushes hot leads to the top before you open Gmail.",
  },
  {
    name: "Design Request Pipeline",
    icon: "Palette",
    description:
      "Design briefs assembled over eight back-and-forth emails burn goodwill and days. This scans email for assets, builds a structured brief, and queues it for the designer complete.",
  },
  {
    name: "Post-Event Pipeline",
    icon: "PackageCheck",
    description:
      "The day after an event is admin quicksand: downloads, uploads, gallery links, thank-yous. This runs the whole sequence automatically while you sleep in.",
  },
  {
    name: "Competitor Intel Engine",
    icon: "Telescope",
    description:
      "Pricing blind against local competitors costs you either margin or deals. Passive OSINT tracks their pricing, venues, and momentum onto a color-coded map.",
  },
  {
    name: "Overnight Missions",
    icon: "MoonStar",
    description:
      "Growth work always loses to urgent work when one person does both. Jimbo runs __41 autonomous missions__ overnight: follow-ups, data hygiene, monitoring, research. You review outcomes over coffee.",
  },
  {
    name: "System Medic",
    icon: "Stethoscope",
    description:
      "Automations break silently, and you find out when a client does. Jimbo coordinates system health through System Medic: autonomous triage that detects a sick daemon or stalled pipeline, self-heals the reversible cases, and escalates the rest.",
  },
  {
    name: "Remote Server Management",
    icon: "ServerCog",
    description:
      "Infrastructure shouldn't need you at a keyboard. Jimbo manages remote servers and tunnels, keeps services alive, and restarts what falls over, from wherever he's running.",
  },
  {
    name: "Shared Memory + Watchdog",
    icon: "Database",
    description:
      "Automation you can't trust creates more anxiety than work. Every agent logs to shared memory, and a watchdog flags anything stalled or off-script. You always know what ran and why.",
  },
];

// Icon names resolve against MODULE_ICONS in SignatureCard.tsx (lucide-react).
const SPECTRE_ICONS: Record<string, string> = {
  "spectre-spectre-api": "Plug",
  "spectre-bastion": "ShieldCheck",
  "spectre-blackthorn": "Crosshair",
  "spectre-cloudbreak": "CloudCog",
  "spectre-code-council": "Scale",
  "spectre-decepticon-bridge": "Cable",
  "spectre-dossier": "FileText",
  "spectre-ember": "Flame",
  "spectre-gauntlet": "Swords",
  "spectre-ghost-core": "Ghost",
  "spectre-ghost-local": "MonitorCheck",
  "spectre-loop": "RefreshCw",
  "spectre-ghost-sandbox": "Box",
  "spectre-spectre-guide": "BookOpen",
  "spectre-injection-corpus": "Syringe",
  "spectre-llm-guard-wrapper": "ShieldAlert",
  "spectre-raven": "Bird",
  "spectre-shannon": "Bug",
  "spectre-watchtower": "Radar",
};

const FORGE_ICONS: Record<string, string> = {
  "design-forge-animation-wing": "Clapperboard",
  "design-forge-audio-forge-wing": "AudioWaveform",
  "design-forge-avatar-3d-wing": "Boxes",
  "design-forge-brand-intelligence-wing": "Fingerprint",
  "design-forge-character-wing": "VenetianMask",
  "design-forge-copy-wing": "PenLine",
  "design-forge-creative-coding-wing": "Code2",
  "design-forge-design-planner-wing": "ListChecks",
  "design-forge-gen-wing": "Sparkles",
  "design-forge-image-forge-wing": "Wand2",
  "design-forge-image-wing": "Image",
  "design-forge-mockup-wing": "Frame",
  "design-forge-podcast-wing": "Mic",
  "design-forge-presentation-wing": "Presentation",
  "design-forge-print-production-wing": "Printer",
  "design-forge-slides-wing": "LayoutTemplate",
  "design-forge-template-wing": "LayoutGrid",
  "design-forge-video-forge-wing": "Film",
  "design-forge-video-wing": "Video",
  "design-forge-website-wing": "Globe",
};

const MEDIA_MODULES: SignatureModule[] = [
  {
    name: "Read-only media index",
    icon: "Image",
    description:
      "Inventories the photo and video library without moving or renaming a single client file.",
  },
  {
    name: "Visual enrichment",
    icon: "Fingerprint",
    description:
      "Builds previews, captions, OCR, and duplicate clusters so years of media become searchable.",
  },
  {
    name: "Teach Media",
    icon: "BookOpen",
    description:
      "A resumable review flow for teaching the system which assets are approved, restricted, derivative, or just junk.",
  },
  {
    name: "ContentPack retrieval",
    icon: "PackageCheck",
    description:
      "Packages the right approved images, clips, rights notes, and context for Forge, HeyGen, and publishing tools.",
  },
];

const CRM_MODULES: SignatureModule[] = [
  {
    name: "Quote engine",
    icon: "FileText",
    description:
      "Builds branded quotes from structured product data and tracks the full Draft to Accepted lifecycle.",
  },
  {
    name: "Revenue system of record",
    icon: "Database",
    description:
      "Moves the business from rented CRM data into an owned Postgres foundation with auditable migrations.",
  },
  {
    name: "Payment intelligence",
    icon: "Plug",
    description:
      "Unifies Square and QuickBooks activity into one allocation ledger with payment status reflected back to operations.",
  },
  {
    name: "Reporting dashboard",
    icon: "Radar",
    description:
      "Turns leads, jobs, quotes, balances, and conversion history into the operating picture VSCO never provided.",
  },
];

const NO_SCREEN_KIDS_MODULES: SignatureModule[] = [
  { name: "Classic coloring page", icon: "Palette", description: "Clean printable line art." },
  { name: "Color by number", icon: "Palette", description: "Locally validated numbered regions and a crayon palette." },
  { name: "Adventure maze", icon: "Route", description: "A playable illustrated maze with age-adjusted difficulty." },
  { name: "Connect the dots", icon: "ListChecks", description: "Numbered drawing practice constructed locally." },
  { name: "I Spy", icon: "Telescope", description: "A detailed scene with explicit, validated search targets." },
  { name: "Spot the difference", icon: "ScanSearch", description: "Paired scenes with deterministic differences." },
  { name: "Matching", icon: "Network", description: "Kid-friendly visual pairs to connect." },
  { name: "Trace and draw", icon: "PenLine", description: "Guided tracing that leaves room to finish the picture." },
  { name: "Finish the picture", icon: "Wand2", description: "A partial scene that invites the child to complete it." },
  { name: "Picture sudoku", icon: "LayoutGrid", description: "A visual logic grid built for ages three through eight." },
  { name: "Pokémon", icon: "Sparkles", description: "A built-in character universe option." },
  { name: "Mario Bros.", icon: "Sparkles", description: "A built-in character universe option." },
  { name: "Pixar Cars", icon: "Sparkles", description: "A built-in vehicle-character option." },
  { name: "Matchbox / Hot Wheels", icon: "Sparkles", description: "A built-in toy-car genre option." },
  { name: "Bluey", icon: "Sparkles", description: "A built-in character universe option." },
];

// Placeholder descriptions from the scanner add no signal in the module list.
const PLACEHOLDER = /^Design Forge wing\.?$/;

function modulesFor(
  category: string,
  namePrefix: RegExp,
  copy: Record<string, string>,
  icons: Record<string, string>,
): SignatureModule[] {
  return RAW.filter((t) => t.category === category && t.subcategory !== "parent").map((t) => ({
    name: t.name.replace(namePrefix, "").trim(),
    description: copy[t.slug] ?? (PLACEHOLDER.test(t.description) ? "" : t.description),
    icon: icons[t.slug],
  }));
}

// Curated flagship copy shared by /photo-booth-owners and /work.
export function getSignatureBuilds(): SignatureBuild[] {
  return [
    {
      slug: "jimbo",
      title: "JIMBO — AI Orchestrator",
      tagline:
        `Running a booth business solo means being the salesperson, designer, accountant, dispatcher, and IT department at once, and dropping balls daily. Jimbo is the *master orchestrator* that ends that: with access to __${SITE_STATS.tools} tools__ he can operate directly, he routes every task to a specialist agent, holds shared memory across the whole operation, coordinates system health, manages remote servers, and runs missions overnight without supervision. You review, approve, and redirect. The business runs even when you're on a ladder at a venue.`,
      accent: "warm",
      moduleLabel: "specialist agents",
      wide: true,
      highlights: [
        { label: "Dispatch", text: `${SITE_STATS.tools} tools at his fingertips — every task routed to the right specialist, 24/7` },
        { label: "Memory", text: "one shared brain — every agent knows what the others did" },
        { label: "Missions", text: "41 autonomous overnight runs: follow-ups, monitoring, research" },
        { label: "Overwatch", text: "System Medic health triage, remote server management, watchdog + audit trail" },
      ],
      modules: JIMBO_AGENTS,
      visuals: [
        {
          src: "/images/blog/claude-codex/jimbo-cameo.jpg",
          alt: "Andrew working beside Jimbo, his AI orchestrator",
          position: "center 42%",
        },
      ],
    },
    {
      slug: "spectre",
      title: "SPECTRE",
      tagline:
        "Small businesses get breached because attackers know nobody is watching. SPECTRE is a *full-spectrum security platform* that runs an engagement end to end: map the attack surface, hammer it, verify the defenses caught it, and ship a branded report. Enterprise-grade security posture at a booth-studio scale.",
      accent: "terminal",
      moduleLabel: "modules",
      highlights: [
        { label: "Recon", text: "Raven, Blackthorn" },
        { label: "Red-team", text: "Gauntlet, Ember" },
        { label: "Blue + Purple", text: "Bastion, Watchtower, Shannon" },
        { label: "Cloud + AI-sec", text: "Cloudbreak, Ghost (computer-use)" },
        { label: "Report", text: "Dossier, Code Council, REST API" },
      ],
      modules: modulesFor("spectre", /^SPECTRE\s*—\s*/, SPECTRE_COPY, SPECTRE_ICONS),
      visuals: [
        {
          src: "/images/signature-builds/spectre.webp",
          alt: "SPECTRE shield and raven security artwork",
        },
        {
          src: "/images/signature-builds/code-council.webp",
          alt: "The twelve Code Council reviewers in their color-coded magical hats",
          position: "center 32%",
        },
      ],
    },
    {
      slug: "design-forge",
      title: "PANDORA'S FORGE",
      tagline:
        "Design is where booth businesses bleed: every event needs custom assets, agencies are slow, and freelancers are feast-or-famine. Pandora's Forge is a *full creative-AI suite* of specialist wings that take a brief from idea to finished asset: posters, overlays, animated reels, client decks, impact reports. Agency output on a solo operator's payroll.",
      accent: "creative",
      moduleLabel: "wings",
      highlights: [
        { label: "Generate", text: "image and video across every major model" },
        { label: "Brand", text: "brand-aware template engine, font and style libraries" },
        { label: "Compose", text: "scene composers plus post-production" },
        { label: "Ship", text: "Notion-driven pipeline → posters, reels, decks, reports" },
      ],
      modules: modulesFor("design-forge", /^Design Forge\s*—\s*/, FORGE_COPY, FORGE_ICONS),
      visuals: [
        {
          src: "/images/signature-builds/pandoras-forge.webp",
          alt: "Pandora's Forge opening with music, video, and generated imagery",
        },
      ],
    },
    {
      slug: "mighty-media-intelligence",
      title: "MIGHTY MEDIA INTELLIGENCE",
      tagline:
        "Years of event photos and video are valuable only if anyone can find the right asset again. MIGHTY Media Intelligence is the planned media brain for the company: a rights-aware catalog that learns what each image is, where it belongs, and which production tools may use it. The roadmap is active; the first production phase is just beginning.",
      accent: "creative",
      moduleLabel: "planned capabilities",
      status: buildProgress.mightyMediaIntelligence.status,
      progress: buildProgress.mightyMediaIntelligence.percentage,
      highlights: [
        { label: "Source", text: "Drive Graph inventory with zero destructive file moves" },
        { label: "Teach", text: "human decisions become an auditable, reversible media catalog" },
        { label: "Retrieve", text: "approved ContentPacks for posts, decks, reels, and campaigns" },
        {
          label: "Pipeline",
          text: `${buildProgress.mightyMediaIntelligence.done} of ${buildProgress.mightyMediaIntelligence.total} roadmap phases completed`,
        },
      ],
      modules: MEDIA_MODULES,
    },
    {
      slug: "mighty-crm",
      title: "MIGHTY CRM",
      tagline:
        "MIGHTY CRM is the owned revenue system replacing the pile of rented software between a new lead and a paid event. Quotes, contracts, jobs, Square payments, QuickBooks activity, and reporting are moving onto one Postgres-backed operating system built around how MIGHTY actually sells and delivers events.",
      accent: "data",
      moduleLabel: "core systems",
      status: buildProgress.mightyCrm.status,
      progress: buildProgress.mightyCrm.percentage,
      highlights: [
        { label: "Foundation", text: "owned Postgres data model and quote dual-write are live" },
        { label: "Payments", text: "Square and QuickBooks rails feed one allocation ledger" },
        { label: "Exit plan", text: "built to replace BoothBook and VSCO Workspace safely" },
        {
          label: "Pipeline",
          text: `${buildProgress.mightyCrm.done} of ${buildProgress.mightyCrm.total} master phases completed`,
        },
      ],
      modules: CRM_MODULES,
    },
    {
      slug: "no-screen-kids",
      title: "NO SCREEN KIDS",
      tagline:
        "A free printable activity-page project for parents who need twenty quiet minutes without handing over another glowing rectangle. Pick an activity, age band, layout, and character genre; the system creates one or two print-ready pages and checks that the puzzle actually works. It is still being tested and improved, with the plan to release it free when the output is consistently safe, playable, and worth the paper.",
      accent: "warm",
      moduleLabel: "activities and genres",
      status: "In Progress",
      highlights: [
        { label: "For kids", text: "printable activities designed for ages 3–8" },
        { label: "Free", text: "planned as a free parent tool, not another subscription" },
        { label: "Playable", text: "mazes, puzzles, and PDF geometry are validated locally" },
        { label: "Iterating", text: "art quality, review gates, and print testing improve every pass" },
      ],
      modules: NO_SCREEN_KIDS_MODULES,
    },
  ];
}
