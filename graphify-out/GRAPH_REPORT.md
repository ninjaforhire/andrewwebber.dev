# Graph Report - andrewwebber.dev  (2026-05-20)

## Corpus Check
- 47 files · ~95,309 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 110 nodes · 87 edges · 9 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 26|Community 26]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 8 edges
2. `main()` - 6 edges
3. `fetch_all_pages()` - 4 edges
4. `extract_rich_text()` - 4 edges
5. `parse_blocks()` - 4 edges
6. `props_to_entry()` - 4 edges
7. `walk()` - 4 edges
8. `fetchGitHubStats()` - 4 edges
9. `getPostBySlug()` - 4 edges
10. `main()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `fetch_all_pages()` --calls--> `POST()`  [INFERRED]
  scripts/export-journey-json.py → src/app/api/consultation/route.ts
- `fetch_all_pages()` --calls--> `GET()`  [INFERRED]
  scripts/export-journey-json.py → src/app/api/stats/route.ts
- `fetch_page_blocks()` --calls--> `GET()`  [INFERRED]
  scripts/export-journey-json.py → src/app/api/stats/route.ts
- `extract_rich_text()` --calls--> `GET()`  [INFERRED]
  scripts/export-journey-json.py → src/app/api/stats/route.ts
- `parse_blocks()` --calls--> `GET()`  [INFERRED]
  scripts/export-journey-json.py → src/app/api/stats/route.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.61
Nodes (7): extract_rich_text(), fetch_all_pages(), fetch_page_blocks(), main(), parse_blocks(), props_to_entry(), GET()

### Community 1 - "Community 1"
Cohesion: 0.39
Nodes (6): countAgents(), countLOC(), countSkills(), getClaudeUsage(), run(), walk()

### Community 2 - "Community 2"
Cohesion: 0.36
Nodes (6): calculateReadingTime(), getAllPosts(), getPostBySlug(), BlogPostPage(), generateMetadata(), generateStaticParams()

### Community 3 - "Community 3"
Cohesion: 0.6
Nodes (4): fetchGitHubStats(), loadDayStreak(), loadOverrides(), timed()

### Community 5 - "Community 5"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 6 - "Community 6"
Cohesion: 0.83
Nodes (3): count_commits(), count_loc(), main()

### Community 8 - "Community 8"
Cohesion: 0.67
Nodes (1): POST()

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (2): What I Build, Why This Site

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (1): This is NOT the Next.js you know

## Knowledge Gaps
- **6 isolated node(s):** `code:bash (npm run dev)`, `Learn More`, `Deploy on Vercel`, `This is NOT the Next.js you know`, `What I Build` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 8`** (3 nodes): `POST()`, `route.ts`, `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (3 nodes): `What I Build`, `Why This Site`, `hello-world.mdx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `AGENTS.md`, `This is NOT the Next.js you know`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `main()` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `run()` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `GET()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `GET()` (e.g. with `fetch_all_pages()` and `fetch_page_blocks()`) actually correct?**
  _`GET()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `fetch_all_pages()` (e.g. with `POST()` and `GET()`) actually correct?**
  _`fetch_all_pages()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `code:bash (npm run dev)`, `Learn More`, `Deploy on Vercel` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._