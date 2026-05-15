# Graph Report - andrewwebber.dev  (2026-05-11)

## Corpus Check
- 49 files · ~93,859 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 178 nodes · 262 edges · 20 communities (14 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

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
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 29 edges
2. `getAllPosts()` - 5 edges
3. `getPostBySlug()` - 5 edges
4. `walk()` - 4 edges
5. `WorkPageContent()` - 3 edges
6. `GET()` - 3 edges
7. `Button()` - 3 edges
8. `CharacterStats()` - 3 edges
9. `CertTimeline()` - 3 edges
10. `ServiceTier()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `BlogPage()` --calls--> `getAllPosts()`  [EXTRACTED]
  src/app/blog/page.tsx → src/lib/blog.ts
- `generateStaticParams()` --calls--> `getAllPosts()`  [EXTRACTED]
  src/app/blog/[slug]/page.tsx → src/lib/blog.ts
- `generateMetadata()` --calls--> `getPostBySlug()`  [EXTRACTED]
  src/app/blog/[slug]/page.tsx → src/lib/blog.ts
- `BlogPostPage()` --calls--> `getPostBySlug()`  [EXTRACTED]
  src/app/blog/[slug]/page.tsx → src/lib/blog.ts
- `WorkPageContent()` --calls--> `cn()`  [EXTRACTED]
  src/app/work/WorkPageContent.tsx → src/lib/utils.ts

## Communities (20 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (19): DayCard(), DayCardProps, EraFilter(), EraFilterProps, JourneyTimeline(), JourneyTimelineProps, journeyData, StatsHeader() (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (13): TypeWriter(), TypeWriterProps, ConsultationForm(), FormData, SERVICES, ContactForm(), InquiryPill(), cn() (+5 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (11): metadata, CERT_CATEGORIES, Certification, CERTIFICATIONS, CATEGORY_ACCENTS, CertTimeline(), CharacterStats(), CharacterStatsStrip() (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (11): AnimatedNumber(), formatNumber(), FormatType, StatProps, StatsCounter(), StatsCounterProps, DIVIDER_COLORS, HeroSection() (+3 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (11): ALL_TAGS, Project, PROJECTS, BusinessCard(), BusinessCardProps, ACCENT_BG, ACCENT_BORDER, ACCENT_TEXT (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (12): BlogPage(), metadata, BLOG_DIR, BlogPost, calculateReadingTime(), getAllPosts(), getPostBySlug(), BlogCard() (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (10): BOOT_LINES, LoadingScreen(), WELCOME_LINES, metadata, LenisProvider(), ACCENT_COLORS, NAV_ITEMS, NavRail() (+2 more)

### Community 7 - "Community 7"
Cohesion: 0.19
Nodes (12): agents, claude, CODE_ROOT, countAgents(), countLOC(), countSkills(), getClaudeUsage(), loc (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.6
Nodes (4): fetchGitHubStats(), GET(), loadOverrides(), StatsOverrides

### Community 9 - "Community 9"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **53 isolated node(s):** `config`, `eslintConfig`, `nextConfig`, `CODE_ROOT`, `OUT` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 1` to `Community 0`, `Community 2`, `Community 4`, `Community 5`, `Community 6`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **Why does `CertTimeline()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `ContactForm()` connect `Community 1` to `Community 2`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `config`, `eslintConfig`, `nextConfig` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._