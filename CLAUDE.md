@AGENTS.md

# andrewwebber.dev — Personal Portfolio + Blog

Next.js 16.2.4 + React 19.2 + Tailwind v4. Terminal/creative hybrid. Vercel deploy. Personal voice, NOT MIGHTY corporate.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 App Router, Turbopack |
| Styling | Tailwind v4 — **NO `@tailwindcss/typography` plugin** |
| MDX | `next-mdx-remote/rsc` + custom component map in `src/components/blog/MDXComponents.tsx` |
| 3D | @react-three/fiber + drei |
| Motion | framer-motion, gsap, @gsap/react, lenis |
| Audio | howler |
| Forms | react-hook-form + @hookform/resolvers |
| Comments | Giscus (`ninjaforhire/andrewwebber.dev`, `R_kgDOSMcXvQ`) |
| Deploy | Vercel (`vercel.json`) |

## Commands

```bash
npm run dev          # next dev (Turbopack)
npm run build        # next build
npm run lint
npm run scan-tools   # npx tsx scripts/scan-mighty-tools.ts — refresh tool count
```

## Directory Map

| Dir | Purpose |
|---|---|
| `src/app/` | App Router routes (home, blog, projects, etc.) |
| `src/components/` | UI components + blog MDX map |
| `src/content/blog/` | `<slug>.mdx` blog posts |
| `src/data/` | Static data (projects, milestones, tools) |
| `src/lib/` | `blog.ts` (getPostBySlug), util helpers |
| `public/images/blog/<slug>/` | sips-compressed JPEGs ~400 KB |
| `scripts/` | Maintenance scripts |
| `overrides.json` | per-project overrides for tool scanner |

## Blog Pipeline

Full spec lives in memory: **`~/.claude/projects/-Users-mightydesigncenter-Desktop--Code/memory/reference_awd_blog_system.md`** — load before any blog write/edit.

Key rules (load the memory file for the rest):
- MDX component map handles styling — never `prose-*` classes.
- Figcaption fix: `figcaption p { margin:0; font-size:inherit; line-height:inherit; }` in `src/app/globals.css`.
- Frontmatter: title (Title Case), description, date (YYYY-MM-DD), tags array.
- Image figure: `<figure className="not-prose my-12 md:my-16">` + sized `<img>` + uppercase mono caption.
- Exactly ONE MIGHTY backlink per personal post, natural anchor only.

## Voice — HARD

No em dashes. No "so/or/but" sentence-starts. No AI vocab (delve, crucial, robust, comprehensive, nuanced, multifaceted, furthermore, moreover, pivotal, landscape, tapestry, underscore, foster, showcase, intricate, vibrant, fundamental, interplay). Conversational, 2-3 sentence paragraphs max. No walls of text. Target 8-10 min read. Define jargon early.

## Stats / Tools Count

Counts are **monotonic ratchets** — never decrease. Andrew-authored only, walk full `~/Desktop/_Code`. Every SPECTRE module + Forge wing = 1 tool. huashu/upstream excluded. Methodology: see memory `feedback_awd_tools_count_rule.md` + `feedback_awd_stats_honest.md`. Any AWD edit must refresh `JourneyTeaser` + layout meta — see `feedback_awd_timeline_refresh.md`.

## Hard Rules

- **This is NOT the Next.js you know** — heed `node_modules/next/dist/docs/`.
- Personal voice only, no corporate AI tells.
- No client-side secrets, no analytics that leak PII.
- Single MIGHTY backlink per blog post, never more.

## graphify

`graphify-out/GRAPH_REPORT.md` covers structure but React/MDX bodies are best read directly.
