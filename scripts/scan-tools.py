"""Scan ~/_Code for tools Andrew built.

A "tool" = a discrete thing Andrew built. Discovered by walking these
subtrees of ~/_Code. Each row in the output = exactly one tool.
Categories are derived from location, not content.

| Subtree                                        | What counts                        | Category     |
|------------------------------------------------|------------------------------------|--------------|
| mighty/agents/finance/**/manifest.json         | each finance agent                 | finance      |
| mighty/agents/**/manifest.json                 | each agent dir (recursive)         | photo-booth  |
| mighty/skills/finance/<skill>/SKILL.md         | each finance skill                 | finance      |
| mighty/skills/<cat>/<skill>/SKILL.md           | each skill dir                     | photo-booth  |
| mighty/apps/<name>/                            | each standalone app                | photo-booth  |
| forge/                                         | Design Forge parent                | design-forge |
| forge/execution/wings/<name>/                  | each wing                          | design-forge |
| hotfixops/security/<dir>/                      | each Spectre tool                  | spectre      |
| hotfixops/security/aisec/<sub>/                | each Ghost variant                 | spectre      |
| general-tools/<allowlist>                      | curated cross-project tools        | tooling      |
| general-tools/Scrapers/<dir>/                  | each scraper                       | tooling      |
| andrewwebber.dev/                              | this site                          | tooling      |

Photo Booth entries also get a `domain` tag (Ops/Sales/Design/etc) derived
from path so the UI can offer a sub-filter without exploding top-level tabs.

Explicit SKIP list (downloaded/upstream things Andrew did not author):
  - huashu-design
  - everything under general-tools/dev/ unless allowlisted
  - everything under general-tools/security/ unless allowlisted
"""

from __future__ import annotations

import json
import pathlib
import re
import sys

CODE_ROOT = pathlib.Path.home() / "_Code"
OUTPUT = (
    pathlib.Path(__file__).resolve().parent.parent / "src" / "data" / "mighty-tools.json"
)

SKIP_DIR_PARTS = {
    ".worktrees", ".cache", "_archive", "_reference",
    "node_modules", "vendor", "__pycache__", "graphify-out",
    ".git", "output", ".tmp", "dist", "build", ".next",
}
SKIP_TOOL_SLUGS = {
    "huashu-design",
}

# Public site: internal skill/agent descriptions must never surface teammate
# names or personal account handles. Patterns live in private_name_scrub.py,
# shared with export-journey-json.py.
from private_name_scrub import PRIVATE_NAME, scrub_text


def scrub_private_names(tools: list[dict]) -> list[dict]:
    """Drop person-named tools and scrub teammate names from descriptions."""
    kept = [
        t for t in tools
        if not PRIVATE_NAME.search(t["slug"]) and not PRIVATE_NAME.search(t["name"])
    ]
    for t in kept:
        t["description"] = scrub_text(t.get("description", ""))
    return kept

# Domain mapping for Photo Booth sub-filter. Key = first path component after
# mighty/agents/ or mighty/skills/. Value = display label.
DOMAIN_BY_AGENT_DIR: dict[str, str] = {
    "agency-agents": "Sales",
    "autoresearch": "R&D",
    "coach": "R&D",
    "design-request-agent": "Design",
    "email": "Comms",
    "finance": "Finance",
    "legal-team": "Legal",
    "mighty-agent-upgrade": "Ops",
    "operations": "Ops",
    "tools": "Ops",
    "voice": "Comms",
    "workflows": "Ops",
}
DOMAIN_BY_SKILL_DIR: dict[str, str] = {
    "admin": "Admin",
    "brand": "Brand",
    "crm": "CRM",
    "design-center": "Design",
    "finance": "Finance",
    "legal": "Legal",
    "marketing": "Marketing",
    "ops": "Ops",
    "r-and-d": "R&D",
    "sales": "Sales",
}

CURATED: dict[str, dict[str, str]] = {
    "design-forge": {
        "name": "PANDORA'S FORGE",
        "description": "Andrew's full creative-AI suite. 11 specialist wings across creation, production, intelligence, and distribution: image + video generation across every major model, brand-aware template engine, font + style libraries, scene composers, post-production, and a Notion-driven asset pipeline. Outputs everything from event posters and animated reels to client decks and impact reports. Actively iterating — new wings ship every few weeks.",
    },
    "design-forge:creative_coding": {
        "name": "Design Forge — Creative Coding Wing",
        "description": "Generative art pipeline. Shader-driven posters, animated backgrounds, brand-tuned procedural art.",
    },
    "design-forge:slides": {
        "name": "Design Forge — Slides Wing",
        "description": "Brand-aware HTML deck generator. 21 rule checks, 72-brand library, NotebookLM bridge, PDF + presenter modes.",
    },
}

# general-tools/ allowlist — only the dirs Andrew actually built. Everything
# else under general-tools/ (dev/, security/, etc.) is upstream / vendored
# / experiments and is excluded from the published tools count.
GENERAL_TOOLS_ALLOWED: dict[str, dict[str, str]] = {
    "graphify": {
        "name": "Graphify",
        "description": "Andrew's queryable knowledge-graph builder for any codebase. AST + LLM extraction → JSON graph; powers cross-repo `graphify query` / `path` / `explain` workflows across all of _Code.",
    },
    "cli-printing-press": {
        "name": "CLI Printing Press",
        "description": "Generator that turns a third-party API spec into a complete `*-pp-cli` Go CLI. Powers quo-pp-cli, vsco-workspace-pp-cli, kie-pp-cli and friends — one printer, many CLIs.",
    },
    "gdrive-recovery": {
        "name": "Gdrive Recovery",
        "description": "Tooling for reclaiming ownership + restoring Google Drive uploads after a Drive ownership mixup.",
    },
    "no-screen-kids": {
        "name": "No Screen Kids",
        "description": "Printable activity-page generator for ages 3–8. Builds coloring pages, mazes, I Spy sheets, visual puzzles, and duplex PDFs from a guided parent interview.",
    },
}

# general-tools/Scrapers/<dir>/ — individual scrapers Andrew built. Skip the
# parent and only expose the actual tools underneath.
SCRAPER_DESCRIPTIONS: dict[str, str] = {
    "awwwards-scraper": "Scrapes Awwwards site-of-the-day designs, downloads hero shots, and tags by style for the Forge inspiration library.",
    "video-agent": "Video-content scraper / analyzer pipeline used to convert YouTube + Loom + login-gated videos into transcript + key-frame data.",
}

# Finance-side skill slugs that live under mighty/skills/finance/* but also
# the few finance-adjacent skills that live elsewhere by historical accident.
EXTRA_FINANCE_SKILLS: set[str] = {
    "w9-creator",   # historically under mighty/skills/legal — re-tag to finance
    "pdf-copy",     # invoices live here too
}


def has_skip_part(path: pathlib.Path) -> bool:
    return any(p in SKIP_DIR_PARTS for p in path.parts)


def slugify(name: str) -> str:
    out = []
    for ch in name.lower():
        if ch.isalnum():
            out.append(ch)
        elif out and out[-1] != "-":
            out.append("-")
    return "".join(out).strip("-")


def add(
    tools: list[dict],
    *,
    slug: str,
    name: str,
    description: str,
    category: str,
    subcategory: str,
    location: str,
    domain: str | None = None,
) -> None:
    if slug in SKIP_TOOL_SLUGS:
        return
    entry = {
        "slug": slug,
        "name": name,
        "description": description,
        "category": category,
        "subcategory": subcategory,
        "source": subcategory,
        "location": location,
    }
    if domain:
        entry["domain"] = domain
    tools.append(entry)


def first_sentence(text: str) -> str:
    text = (text or "").strip()
    if not text:
        return ""
    for end in [". ", "\n"]:
        if end in text:
            text = text.split(end, 1)[0]
            break
    return text.strip().rstrip(".")


def parse_skill_frontmatter(skill_md: pathlib.Path) -> dict:
    try:
        text = skill_md.read_text(errors="ignore")
    except OSError:
        return {}
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    fm = text[3:end].strip()
    out = {}
    for line in fm.splitlines():
        if ":" not in line:
            continue
        k, _, v = line.partition(":")
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def parse_manifest(p: pathlib.Path) -> dict:
    try:
        return json.loads(p.read_text())
    except (OSError, json.JSONDecodeError):
        return {}


def _domain_for_agent_path(rel: pathlib.PurePath) -> str | None:
    if not rel.parts:
        return None
    first = rel.parts[0]
    return DOMAIN_BY_AGENT_DIR.get(first)


def _domain_for_skill_path(rel: pathlib.PurePath) -> str | None:
    if not rel.parts:
        return None
    first = rel.parts[0]
    return DOMAIN_BY_SKILL_DIR.get(first)


def scan_mighty_agents(tools: list[dict]) -> None:
    root = CODE_ROOT / "mighty" / "agents"
    if not root.exists():
        return
    for manifest in root.rglob("manifest.json"):
        if has_skip_part(manifest):
            continue
        data = parse_manifest(manifest)
        if not data:
            continue
        if data.get("status") == "archived":
            continue
        rel_from_root = manifest.parent.relative_to(root)
        domain = _domain_for_agent_path(rel_from_root)
        # Finance agents get re-routed to the finance category entirely.
        if domain == "Finance":
            category = "finance"
            subcategory = "finance-agent"
            domain = None
        else:
            category = "photo-booth"
            subcategory = "agent"

        name = str(data.get("name") or manifest.parent.name)
        slug = slugify(name)
        desc = first_sentence(str(data.get("description") or ""))
        if not desc:
            desc = "MIGHTY agent."
        add(
            tools,
            slug=slug,
            name=name,
            description=desc,
            category=category,
            subcategory=subcategory,
            location=str(manifest.parent.relative_to(CODE_ROOT)),
            domain=domain,
        )


def scan_mighty_skills(tools: list[dict]) -> None:
    root = CODE_ROOT / "mighty" / "skills"
    if not root.exists():
        return
    for skill_md in root.rglob("SKILL.md"):
        if has_skip_part(skill_md):
            continue
        fm = parse_skill_frontmatter(skill_md)
        name = fm.get("name") or skill_md.parent.name
        slug = slugify(name)
        rel_from_root = skill_md.parent.relative_to(root)
        domain = _domain_for_skill_path(rel_from_root)
        # Finance skills (or any allowlisted finance-adjacent skill) get
        # re-routed to the Finance category.
        if domain == "Finance" or slug in EXTRA_FINANCE_SKILLS:
            category = "finance"
            subcategory = "finance-skill"
            domain = None
        else:
            category = "photo-booth"
            subcategory = "skill"
        desc = first_sentence(fm.get("description", ""))
        if not desc:
            desc = "MIGHTY skill."
        add(
            tools,
            slug=slug,
            name=name,
            description=desc,
            category=category,
            subcategory=subcategory,
            location=str(skill_md.parent.relative_to(CODE_ROOT)),
            domain=domain,
        )


def scan_mighty_apps(tools: list[dict]) -> None:
    root = CODE_ROOT / "mighty" / "apps"
    if not root.exists():
        return
    for entry in sorted(root.iterdir()):
        if not entry.is_dir() or entry.name.startswith(".") or entry.name.startswith("_"):
            continue
        if entry.name in SKIP_DIR_PARTS:
            continue
        name = entry.name.replace("-", " ").title()
        add(
            tools,
            slug=slugify(entry.name),
            name=name,
            description="Standalone app under mighty/apps.",
            category="photo-booth",
            subcategory="app",
            location=str(entry.relative_to(CODE_ROOT)),
            domain="Apps",
        )


def scan_design_forge(tools: list[dict]) -> None:
    root = CODE_ROOT / "forge"
    if not root.exists():
        return
    curated = CURATED["design-forge"]
    add(
        tools,
        slug="design-forge",
        name=curated["name"],
        description=curated["description"],
        category="design-forge",
        subcategory="parent",
        location="forge",
    )
    wings_dir = root / "execution" / "wings"
    if not wings_dir.exists():
        return
    for entry in sorted(wings_dir.iterdir()):
        if not entry.is_dir() or entry.name.startswith("_") or entry.name.startswith("."):
            continue
        key = f"design-forge:{entry.name}"
        if key in CURATED:
            name = CURATED[key]["name"]
            desc = CURATED[key]["description"]
        else:
            name = f"Design Forge — {entry.name.replace('_', ' ').title()} Wing"
            desc = "Design Forge wing."
        add(
            tools,
            slug=slugify(name),
            name=name,
            description=desc,
            category="design-forge",
            subcategory="wing",
            location=str(entry.relative_to(CODE_ROOT)),
        )


SPECTRE_DESCRIPTIONS: dict[str, tuple[str, str]] = {
    "bastion": (
        "SPECTRE — Bastion",
        "Blue Team defense layer. Wazuh SIEM orchestrating 6 LangGraph agents (sentinel, ironhide, others) for monitor + harden + respond. Port 2025.",
    ),
    "blackthorn": (
        "SPECTRE — Blackthorn",
        "Red team + DAST vulnerability scanner. OWASP ZAP integration plus Decepticon bridge for autonomous offensive operations.",
    ),
    "cloudbreak": (
        "SPECTRE — Cloudbreak",
        "Cloud security auditor. AWS, GCP, and Azure misconfiguration scanning. Surfaces IAM, network, and storage exposures.",
    ),
    "code_council": (
        "SPECTRE — Code Council",
        "12-hat adversarial security review. Each hat reviews diffs from its discipline (Black, Red, White, Blue, Purple, Gray, Green, Gold, Silver, Orange, Cyan, Bronze) and converges on a verdict.",
    ),
    "decepticon-bridge": (
        "SPECTRE — Decepticon Bridge",
        "Bridge to the Decepticon red-team agent framework. Lets Blackthorn dispatch autonomous offensive engagements without leaving SPECTRE.",
    ),
    "dossier": (
        "SPECTRE — Dossier",
        "Unified findings consolidator. Pulls outputs from every SPECTRE tool, deduplicates, scores, and renders branded PDF + Notion reports for client engagements.",
    ),
    "ember": (
        "SPECTRE — Ember",
        "Threat-intel and breach monitoring. Watches HIBP, NVD CVE feeds, and paste sites for exposure tied to the protected surface area.",
    ),
    "gauntlet": (
        "SPECTRE — Gauntlet",
        "Purple Team bridge. Runs Atomic Red Team techniques, scores Wazuh detection against MITRE ATT&CK, and tracks coverage uplift over time. Port 2026.",
    ),
    "raven": (
        "SPECTRE — Raven",
        "Recon + OSINT module. Subfinder, theHarvester, Wappalyzer, and custom asset discovery — feeds Blackthorn before an engagement.",
    ),
    "shannon": (
        "SPECTRE — Shannon",
        "Autonomous white-box AI pentester for web apps and APIs. Drives Blackthorn at depth on individual targets where deep coverage matters more than breadth.",
    ),
    "watchtower": (
        "SPECTRE — Watchtower",
        "Autonomous website intelligence agent. SEO, security headers, AI-visibility, and competitor tracking on a schedule. Dashboard included.",
    ),
    "spectre-api": (
        "SPECTRE — API",
        "FastAPI sidecar at port 2027. Exposes spectre-core SQLite (findings, engagements, scores) as REST so external dashboards and clients can read state.",
    ),
    "spectre-guide": (
        "SPECTRE — Guide",
        "Dual-audience PDF generator. Builds the operator manual (full internals) and the client brief (sanitized) from one source. Pushes to Notion hub.",
    ),
}

SPECTRE_AISEC_DESCRIPTIONS: dict[str, tuple[str, str]] = {
    "ghost-core": (
        "SPECTRE — Ghost Core",
        "Shared computer-use lib. Dispatch, audit, ledger, policy, firewall, guard, reviewer. Lets Ghost-Local and Ghost-Sandbox share defense-in-depth without duplicating code.",
    ),
    "ghost-local": (
        "SPECTRE — Ghost Local",
        "Trusted-brain computer-use agent. Runs on Andrew's Mac with native macOS app access. Used for vendor portals + cross-app workflows where session continuity matters.",
    ),
    "ghost-sandbox": (
        "SPECTRE — Ghost Sandbox",
        "Untrusted-brain computer-use agent. Ephemeral Chromium in a Hostinger container with nftables egress lockdown, PI guard, and output sanitization. For adversarial browsing.",
    ),
    "injection_corpus": (
        "SPECTRE — Injection Corpus",
        "Curated prompt-injection adversarial dataset. Drives the LLM-guard wrapper's evaluation harness so Ghost variants stay robust as upstream prompts evolve.",
    ),
    "llm_guard_wrapper": (
        "SPECTRE — LLM Guard",
        "Defense-in-depth wrapper around computer-use prompts. Vets every model input + output against the injection corpus before letting an action hit the OS.",
    ),
    "loop": (
        "SPECTRE — Ghost Loop",
        "The screenshot → think → click → repeat orchestrator. Wraps Anthropic's computer-use beta in SPECTRE's 8-layer fail-closed defense.",
    ),
}


def scan_spectre(tools: list[dict]) -> None:
    root = CODE_ROOT / "hotfixops" / "security"
    if not root.exists():
        return
    add(
        tools,
        slug="spectre",
        name="SPECTRE",
        description="Andrew's full-spectrum security platform. 13 modules across recon, red-team, blue-team, purple-team, AI-security, and reporting — Raven, Blackthorn, Bastion, Gauntlet, Ember, Cloudbreak, Watchtower, Shannon, Dossier, Code Council, Ghost (computer-use), and a REST API. Runs autonomous engagements end-to-end: discover the surface, hammer it, detect what should have caught it, and ship a branded report. Actively iterating — new tools and detections land every sprint.",
        category="spectre",
        subcategory="parent",
        location="hotfixops/security",
    )
    aisec = root / "aisec"
    for entry in sorted(root.iterdir()):
        if not entry.is_dir() or entry.name.startswith("_") or entry.name.startswith("."):
            continue
        if entry.name in SKIP_DIR_PARTS or entry.name == "shared" or entry.name == "spectre_core":
            continue
        if entry == aisec:
            continue
        if entry.name in SPECTRE_DESCRIPTIONS:
            name, desc = SPECTRE_DESCRIPTIONS[entry.name]
        else:
            pretty = entry.name.replace("-", " ").replace("_", " ").title()
            name = f"SPECTRE — {pretty}"
            data = parse_manifest(entry / "manifest.json")
            desc = first_sentence(str(data.get("description") or "")) or "SPECTRE suite module."
        add(
            tools,
            slug=slugify("spectre " + entry.name),
            name=name,
            description=desc,
            category="spectre",
            subcategory="spectre-tool",
            location=str(entry.relative_to(CODE_ROOT)),
        )
    if aisec.exists():
        for entry in sorted(aisec.iterdir()):
            if not entry.is_dir() or entry.name.startswith("_") or entry.name.startswith("."):
                continue
            if entry.name in SKIP_DIR_PARTS:
                continue
            if not (entry.name.startswith("ghost") or entry.name in {"injection_corpus", "llm_guard_wrapper", "loop"}):
                continue
            if entry.name in SPECTRE_AISEC_DESCRIPTIONS:
                name, desc = SPECTRE_AISEC_DESCRIPTIONS[entry.name]
            else:
                pretty = entry.name.replace("-", " ").replace("_", " ").title()
                name = f"SPECTRE — {pretty}"
                desc = "SPECTRE AISec module."
            add(
                tools,
                slug=slugify("spectre " + entry.name),
                name=name,
                description=desc,
                category="spectre",
                subcategory="spectre-aisec",
                location=str(entry.relative_to(CODE_ROOT)),
            )


def scan_general_tools(tools: list[dict]) -> None:
    """Allowlisted cross-project tools + individual scrapers. Skip everything
    else under general-tools/ (dev/, security/, etc. are upstream)."""
    root = CODE_ROOT / "general-tools"
    if not root.exists():
        return
    for slug, meta in GENERAL_TOOLS_ALLOWED.items():
        candidate = root / slug
        if not candidate.exists():
            continue
        add(
            tools,
            slug=slug,
            name=meta["name"],
            description=meta["description"],
            category="tooling",
            subcategory="tool",
            location=str(candidate.relative_to(CODE_ROOT)),
        )
    # Expand the Scrapers/ parent into individual scraper tools.
    scrapers = root / "Scrapers"
    if scrapers.exists():
        for entry in sorted(scrapers.iterdir()):
            if not entry.is_dir() or entry.name.startswith("_") or entry.name.startswith("."):
                continue
            if entry.name in SKIP_DIR_PARTS:
                continue
            desc = SCRAPER_DESCRIPTIONS.get(
                entry.name,
                "Web scraper / data extraction tool.",
            )
            add(
                tools,
                slug=slugify(entry.name),
                name=entry.name.replace("-", " ").title(),
                description=desc,
                category="tooling",
                subcategory="scraper",
                location=str(entry.relative_to(CODE_ROOT)),
            )


def scan_personal(tools: list[dict]) -> None:
    awd = CODE_ROOT / "andrewwebber.dev"
    if awd.exists():
        add(
            tools,
            slug="andrewwebber-dev",
            name="andrewwebber.dev",
            description="This site. Next.js 16, terminal-style portfolio, live stats wired to GitHub.",
            category="tooling",
            subcategory="site",
            location="andrewwebber.dev",
        )


def main() -> None:
    tools: list[dict] = []
    scan_design_forge(tools)
    scan_spectre(tools)
    scan_mighty_agents(tools)
    scan_mighty_skills(tools)
    scan_mighty_apps(tools)
    scan_general_tools(tools)
    scan_personal(tools)

    seen: set[str] = set()
    unique: list[dict] = []
    for t in tools:
        if t["slug"] in seen:
            continue
        seen.add(t["slug"])
        unique.append(t)

    unique = scrub_private_names(unique)
    unique.sort(key=lambda t: (t["category"], t["name"].lower()))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(unique, indent=2) + "\n")

    from collections import Counter
    by_cat = Counter(t["category"] for t in unique)
    print(f"Wrote {len(unique)} tools to {OUTPUT}", file=sys.stderr)
    for cat, n in by_cat.most_common():
        print(f"  {cat}: {n}", file=sys.stderr)
    by_domain = Counter(t.get("domain") for t in unique if t["category"] == "photo-booth")
    print(f"  photo-booth domains:", file=sys.stderr)
    for d, n in sorted(by_domain.items(), key=lambda x: -x[1]):
        print(f"    {d or '(none)'}: {n}", file=sys.stderr)
    print(json.dumps({"count": len(unique), "by_category": dict(by_cat)}))


if __name__ == "__main__":
    main()
