#!/usr/bin/env python3
"""Scan ~/Desktop/_Code for tools Andrew built.

THE RULE:
A "tool" = a discrete thing Andrew built. Discovered by walking these
subtrees of ~/Desktop/_Code. Each row in the output = exactly one tool.
Categories are derived from location, not content.

| Subtree                                        | What counts                        | Category     |
|------------------------------------------------|------------------------------------|--------------|
| mighty/agents/**/manifest.json                 | each agent dir (recursive)         | photo-booth  |
| mighty/skills/<cat>/<skill>/SKILL.md           | each skill dir                     | photo-booth  |
| mighty/apps/<name>/                            | each standalone app                | photo-booth  |
| forge/                                         | Design Forge parent                | design-forge |
| forge/execution/wings/<name>/                  | each wing                          | design-forge |
| hotfixops/security/<dir>/                      | each Spectre tool                  | spectre      |
| hotfixops/security/aisec/<sub>/                | each Ghost variant                 | spectre      |
| general-tools/<dir>/                           | each global tool                   | global       |
| andrewwebber.dev/                              | this site                          | global       |

Excludes any path under: .worktrees/, .cache/, _archive/, _reference/,
node_modules/, vendor/, __pycache__/, graphify-out/, .git/.

Explicit SKIP list (downloaded/upstream things Andrew did not author):
  - huashu-design

Output: src/data/mighty-tools.json (kept name for backwards compat).
"""

from __future__ import annotations

import json
import pathlib
import sys

CODE_ROOT = pathlib.Path.home() / "Desktop" / "_Code"
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

# Curated names + descriptions for high-signal tools. Anything not in this map
# falls back to manifest/SKILL.md metadata or the directory basename.
CURATED: dict[str, dict[str, str]] = {
    "design-forge": {
        "name": "Design Forge",
        "description": "AI-powered design automation. Multi-provider image + video generation, brand-aware template engine, Notion-driven asset pipeline.",
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


def add(tools: list[dict], *, slug: str, name: str, description: str, category: str, subcategory: str, location: str) -> None:
    if slug in SKIP_TOOL_SLUGS:
        return
    tools.append({
        "slug": slug,
        "name": name,
        "description": description,
        "category": category,
        "subcategory": subcategory,
        "source": subcategory,
        "location": location,
    })


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
            category="photo-booth",
            subcategory="agent",
            location=str(manifest.parent.relative_to(CODE_ROOT)),
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
        desc = first_sentence(fm.get("description", ""))
        if not desc:
            desc = "MIGHTY skill."
        add(
            tools,
            slug=slug,
            name=name,
            description=desc,
            category="photo-booth",
            subcategory="skill",
            location=str(skill_md.parent.relative_to(CODE_ROOT)),
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
            description=f"Standalone app under mighty/apps.",
            category="photo-booth",
            subcategory="app",
            location=str(entry.relative_to(CODE_ROOT)),
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
            desc = f"Design Forge wing."
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
    # name override, description
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


def scan_global_tools(tools: list[dict]) -> None:
    root = CODE_ROOT / "general-tools"
    if not root.exists():
        return
    for entry in sorted(root.iterdir()):
        if not entry.is_dir() or entry.name.startswith("_") or entry.name.startswith("."):
            continue
        if entry.name in SKIP_DIR_PARTS:
            continue
        name = entry.name.replace("-", " ").title()
        add(
            tools,
            slug=slugify(entry.name),
            name=name,
            description="Cross-project tool — runs across all of Andrew's repos, not just MIGHTY.",
            category="global",
            subcategory="global-tool",
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
            category="global",
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
    scan_global_tools(tools)
    scan_personal(tools)

    # Dedup by slug. First occurrence wins so curated forge/spectre entries
    # take precedence over any name collisions in mighty.
    seen: set[str] = set()
    unique: list[dict] = []
    for t in tools:
        if t["slug"] in seen:
            continue
        seen.add(t["slug"])
        unique.append(t)

    unique.sort(key=lambda t: (t["category"], t["name"].lower()))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(unique, indent=2) + "\n")

    from collections import Counter
    by_cat = Counter(t["category"] for t in unique)
    print(f"Wrote {len(unique)} tools to {OUTPUT}", file=sys.stderr)
    for cat, n in by_cat.most_common():
        print(f"  {cat}: {n}", file=sys.stderr)
    print(json.dumps({"count": len(unique), "by_category": dict(by_cat)}))


if __name__ == "__main__":
    main()
