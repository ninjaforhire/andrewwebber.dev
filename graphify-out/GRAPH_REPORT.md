# Graph Report - andrewwebber.dev  (2026-05-29)

## Corpus Check
- 123 files · ~529,828 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 987 nodes · 1332 edges · 103 communities (90 shown, 13 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e02b6e4c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 51 edges
2. `per_repo` - 35 edges
3. `compilerOptions` - 16 edges
4. `GET()` - 14 edges
5. `GET()` - 14 edges
6. `main()` - 12 edges
7. `enabledPlugins` - 11 edges
8. `add()` - 11 edges
9. `add()` - 11 edges
10. `main()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `cn()` --calls--> `clsx`  [INFERRED]
  src/lib/utils.ts → package.json
- `preflight()` --calls--> `next`  [INFERRED]
  scripts/youtube_to_ll.py → package.json
- `count_commits_for_repo()` --calls--> `add()`  [INFERRED]
  scripts/refresh-stats.py → scripts/scan-tools.py
- `ConsultingCard()` --calls--> `cn()`  [EXTRACTED]
  src/components/sections/ConsultingSection.tsx → src/lib/utils.ts
- `Card()` --calls--> `cn()`  [EXTRACTED]
  src/app/lab/consulting-preview/page.tsx → src/lib/utils.ts

## Communities (103 total, 13 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (20): gh(), list_repos(), count_commits_for_repo(), count_live_agents(), count_loc_in_repo(), count_skills(), count_tools(), fetch_claude_2026() (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (33): add(), first_sentence(), has_skip_part(), main(), parse_manifest(), parse_skill_frontmatter(), scan_design_forge(), scan_global_tools() (+25 more)

### Community 2 - "Community 2"
Cohesion: 0.26
Nodes (15): extract_rich_text(), fetch_all_pages(), fetch_page_blocks(), main(), parse_blocks(), props_to_entry(), fetch_claude_2026(), Scoped to calendar year 2026. Honest sum across non-gap blocks. (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (25): getAllPosts(), getAllVlogs(), getVlogBySlug(), readingTime(), VlogPost, VLOGS_DIR, generateMetadata(), generateStaticParams() (+17 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (44): dependencies, @base-ui/react, class-variance-authority, clsx, framer-motion, gray-matter, gsap, @gsap/react (+36 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (25): FocusAudio(), FocusMode, VALID_MODES, Mode, MODES, Props, SoundPicker(), VALID_IDS (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (15): accentFor(), CATEGORY_ACCENT, CATEGORY_LABELS, CATEGORY_ORDER, CODE_COUNCIL, FEATURED, FEATURED_SLUGS, PHOTO_BOOTH_DOMAINS (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (11): BOOT_LINES, LoadingScreen(), WELCOME_LINES, TypeWriter(), TypeWriterProps, ContactForm(), InquiryPill(), cn() (+3 more)

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 9 - "Community 9"
Cohesion: 0.83
Nodes (3): count_commits(), count_loc(), main()

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (10): slugify(), walkAgents(), MIGHTY_ROOT, OUTPUT, seen, slugify(), ToolEntry, tools (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.09
Nodes (16): AnimatedNumber(), formatNumber(), FormatType, LiveStats, StatProps, StatsCounter(), ZERO, DIVIDER_COLORS (+8 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (21): calculateReadingTime(), Comments(), GISCUS, getPostBySlug(), LikeButton(), LikeButtonProps, blogMDXComponents, Props (+13 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (22): CalcomEmbed(), CalcomEmbedProps, ACCENT, Guide, GuideCard(), STORE_LABELS, Hero(), mergeTools() (+14 more)

### Community 14 - "Community 14"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (20): agents_live, claude_hours, claude_sessions, claude_tokens, countedAt, github_commits, github_loc, live_agents_registry (+12 more)

### Community 18 - "Community 18"
Cohesion: 0.05
Nodes (35): items, lastUpdated, total, currentEra, entries, lastUpdated, totalDays, CourseItem (+27 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 20 - "Community 20"
Cohesion: 0.28
Nodes (4): metadata, DesignRequestForm(), PolicyBlock(), RULES

### Community 21 - "Community 21"
Cohesion: 0.14
Nodes (10): ASCII, LINEART_SVG, metadata, ROOT, Phase, PHASE_MS, PortraitGlitch(), Props (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.16
Nodes (5): CharacterStats(), CharacterStatsStrip(), DISCIPLINES, statsPath(), stripStatsPath()

### Community 23 - "Community 23"
Cohesion: 0.25
Nodes (6): Phase, PHASE_MS, PortraitEmbedded(), Props, RainCol, WORDS

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (10): Is AI coming for developer jobs?, One honest question for you, The discipline AI cannot replace, The mistakes look correct, The things that will trip you up, Two assistants on the same files will fight, What a year of Claude Code taught me, What changed yesterday when I added Codex (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (10): code:bash (cd /Users/mightydesigncenter/Desktop/_Code && python3 export), code:bash (git add src/data/journey-2026.json), code:bash (cd /Users/mightydesigncenter/Desktop/_Code/andrewwebber.dev ), Context, Step 1 — Pull from Notion, Step 2 — Report new entries, Step 3 — Commit and push, Step 4 — Deploy to Vercel (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.20
Nodes (9): agentsLive, claudeHours, claudeTokens, commitsShipped, linesOfCode, repos, skills, tools (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.43
Nodes (5): extract_meta_from_callout(), gtext(), main(), query_all(), Pull the metadata callout block to recover Author/Duration/Rating/ASIN/Cover.

### Community 28 - "Community 28"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/mpb-site

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (3): buildCommand, framework, outputDirectory

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/Agents

### Community 32 - "Community 32"
Cohesion: 0.25
Nodes (5): CourseItem, LearningLibrary(), SOURCE_BADGE, TYPE_FILTERS, TypeFilter

### Community 33 - "Community 33"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/andrewwebber.dev

### Community 34 - "Community 34"
Cohesion: 0.40
Nodes (5): commits, files, loc, per_repo, ninjaforhire/Biometric-Lab

### Community 35 - "Community 35"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/BoothBook

### Community 36 - "Community 36"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/claude-config

### Community 37 - "Community 37"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/cli-printing-press

### Community 38 - "Community 38"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/_Code

### Community 39 - "Community 39"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/deconstructed-studio

### Community 40 - "Community 40"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/design-request-agent

### Community 41 - "Community 41"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/dotfiles

### Community 42 - "Community 42"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/everything-claude-code

### Community 43 - "Community 43"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/forge

### Community 44 - "Community 44"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/General-Tools

### Community 50 - "Community 50"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/gstack

### Community 51 - "Community 51"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/hotfixops

### Community 53 - "Community 53"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/hotfixops-site

### Community 54 - "Community 54"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/workspace-config

### Community 55 - "Community 55"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/Iris-Studio

### Community 56 - "Community 56"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/MIGHTY-Apps

### Community 57 - "Community 57"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/mighty

### Community 58 - "Community 58"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/mighty-gallery

### Community 59 - "Community 59"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/mighty-gobbla

### Community 60 - "Community 60"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/mighty-playbook

### Community 61 - "Community 61"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/mighty-skills

### Community 62 - "Community 62"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/mightyphotobooths

### Community 63 - "Community 63"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/mpb-ai-gen-tool

### Community 64 - "Community 64"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/Notion-Tools

### Community 65 - "Community 65"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/pp-libraries

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/Scrapers

### Community 67 - "Community 67"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/snappic-site-builder

### Community 68 - "Community 68"
Cohesion: 0.38
Nodes (5): CERT_CATEGORIES, Certification, CERTIFICATIONS, CATEGORY_ACCENTS, CertTimeline()

### Community 69 - "Community 69"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/terminal-gloss

### Community 70 - "Community 70"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/terminal-karaoke

### Community 71 - "Community 71"
Cohesion: 0.50
Nodes (4): commits, files, loc, ninjaforhire/Video-Agent

### Community 72 - "Community 72"
Cohesion: 0.14
Nodes (13): enabledPlugins, caveman@caveman, design-extract@design-extract, exa@claude-plugins-official, frontend-design@claude-plugins-official, greptile@claude-plugins-official, mighty@mighty, playground@claude-plugins-official (+5 more)

### Community 73 - "Community 73"
Cohesion: 0.20
Nodes (10): andrewwebber.dev — Personal Portfolio + Blog, Blog Pipeline, code:bash (npm run dev          # next dev (Turbopack)), Commands, Directory Map, graphify, Hard Rules, Stack (+2 more)

### Community 76 - "Community 76"
Cohesion: 0.16
Nodes (14): agents, claude, CODE_ROOT, countAgents(), countLOC(), countSkills(), loc, OUT (+6 more)

### Community 77 - "Community 77"
Cohesion: 0.18
Nodes (8): CHAPTERS, LINEART_SVG, metadata, ROOT, Phase, PHASE_MS, PortraitFigure(), Props

### Community 78 - "Community 78"
Cohesion: 0.33
Nodes (8): build_ascii(), build_body_mask(), build_lineart_svg(), build_svg(), main(), Build 4 portrait artifacts from a single source photo.  Inputs:  public/images/p, Return an HxW uint8 alpha mask: ~255 inside body, 0 outside, feathered edges., Return an HxW uint8 alpha mask: ~255 inside body, 0 outside, feathered edges.

### Community 79 - "Community 79"
Cohesion: 0.20
Nodes (3): ACCENT, Card(), CardProps

### Community 80 - "Community 80"
Cohesion: 0.35
Nodes (10): create_ll_page(), get_status(), gtext(), has_ll_relation(), load_config(), main(), ntn_call(), query_all() (+2 more)

### Community 81 - "Community 81"
Cohesion: 0.22
Nodes (8): items, lastUpdated, meta, displayCap, totalBooks, totalCompleted, totalInProgress, totalInQueue

### Community 83 - "Community 83"
Cohesion: 0.39
Nodes (7): extract(), get_date(), get_status(), gtext(), load_config(), main(), query_all()

### Community 84 - "Community 84"
Cohesion: 0.40
Nodes (4): ACCENT_CLASSES, ServiceCard(), ServiceCardProps, ServiceItem

### Community 85 - "Community 85"
Cohesion: 0.14
Nodes (11): a, channelEl, d, dateStr, hEl, meta, out, sections (+3 more)

### Community 86 - "Community 86"
Cohesion: 0.18
Nodes (12): Stat(), Home(), count_commits_for_repo(), count_live_agents(), count_loc_in_repo(), count_skills(), is_skippable(), load_prev() (+4 more)

### Community 87 - "Community 87"
Cohesion: 0.21
Nodes (8): ALL_TAGS, Project, PROJECTS, ACCENT_BG, ACCENT_BORDER, ACCENT_TEXT, ProjectCard(), Props

### Community 88 - "Community 88"
Cohesion: 0.73
Nodes (5): create_db(), main(), ntn(), patch_data_source_properties(), resolve_dsid()

### Community 89 - "Community 89"
Cohesion: 0.50
Nodes (3): data_source_id, db_id, ll_db_id

### Community 90 - "Community 90"
Cohesion: 0.40
Nodes (3): ConsultationForm(), FormData, SERVICES

### Community 91 - "Community 91"
Cohesion: 0.20
Nodes (4): ACCENT, ConsultingCard(), ConsultingCardProps, ConsultingSection()

### Community 92 - "Community 92"
Cohesion: 0.29
Nodes (8): count_tools(), Tools = entries in src/data/mighty-tools.json, written by scan-tools.py.      Th, Treeless clone: full commit history (cheap), no blobs until checkout., shallow_clone(), getClaudeUsage(), run(), getClaudeUsage(), run()

### Community 93 - "Community 93"
Cohesion: 0.26
Nodes (10): extract_from_lockup(), extract_from_video_renderer(), is_signed_in(), main(), parse_browse_response(), _parse_duration(), Walk a /youtubei/v1/browse response. Return (entries_with_date, continuation_tok, True only when current page is YT history + shows signed-in content. (+2 more)

### Community 94 - "Community 94"
Cohesion: 1.00
Nodes (3): data_files_changed(), main(), run()

### Community 98 - "Community 98"
Cohesion: 0.46
Nodes (7): classify_topics(), enrich_one(), extract_meta(), fetch_watch_page(), load_raw(), main(), should_skip()

### Community 99 - "Community 99"
Cohesion: 0.27
Nodes (12): next, body_blocks(), build_props(), create_page(), existing_urls(), fetch_schema(), main(), ntn_api() (+4 more)

### Community 100 - "Community 100"
Cohesion: 0.40
Nodes (3): MatrixRain(), RainCol, WORDS

### Community 102 - "Community 102"
Cohesion: 0.50
Nodes (3): ACCENT_CLASSES, ServiceTier(), ServiceTierProps

## Knowledge Gaps
- **422 isolated node(s):** `buildCommand`, `outputDirectory`, `framework`, `config`, `tools` (+417 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 7` to `Community 32`, `Community 97`, `Community 3`, `Community 68`, `Community 101`, `Community 6`, `Community 102`, `Community 5`, `Community 4`, `Community 12`, `Community 13`, `Community 79`, `Community 18`, `Community 84`, `Community 87`, `Community 90`, `Community 91`?**
  _High betweenness centrality (0.198) - this node is a cross-community bridge._
- **Why does `add()` connect `Community 1` to `Community 5`, `Community 86`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `toggleTheme()` connect `Community 5` to `Community 1`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Are the 11 inferred relationships involving `GET()` (e.g. with `fetch_all_pages()` and `fetch_page_blocks()`) actually correct?**
  _`GET()` has 11 INFERRED edges - model-reasoned connections that need verification._
- **What connects `buildCommand`, `outputDirectory`, `framework` to the rest of the system?**
  _446 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.0873015873015873 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._