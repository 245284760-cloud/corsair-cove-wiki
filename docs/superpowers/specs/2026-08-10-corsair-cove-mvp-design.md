# Corsair Cove MVP Website Design

> Confirmed: 2026-08-10  
> Target domain: `https://corsaircovewiki.com`  
> Source archive: `E:\Obsidian\scys\热词游戏站`

## 1. Goal

Build an independent, English-language Corsair Cove strategy wiki that can be installed, built, and deployed from `G:\corsaircovewiki.com` without reading files from the Obsidian archive at runtime. The first release contains a home page, a Guide Hub, and four verified guides. It must provide reliable task-oriented navigation, baseline technical SEO, responsive layouts, and a fact boundary that prevents unsupported game claims from entering the build.

## 2. Confirmed Scope

The first release contains exactly these six public pages:

| Page | URL | Purpose |
|---|---|---|
| Home | `/` | Explain the site, show stable facts, and route readers to the four starter guides |
| Guide Hub | `/guides/` | Group and expose only published guides |
| Beginner Tips | `/tips/` | Explain verified beginner checks, Fetchers, logistics, camps, and Cohesion risks |
| Get More Drifters | `/how-to-get-more-drifters/` | Explain verified population sources, labor release, camp migration, and Notoriety options |
| Build Your First Ship | `/how-to-build-ship/` | Diagnose ship construction through unlocks, piers, connections, resources, and crew |
| Connect High Buildings | `/connect-high-buildings/` | Explain connection nodes, roads, rope bridges, cliff paths, ladders, and route efficiency |

The first release excludes:

- The red-light `/mods/` and `/golden-city-maze/` pages.
- The yellow-light `/platforms/`, `/tobacco/`, and `/rope/` pages.
- `/privacy/` and `/terms/` until approved legal copy exists.
- Databases, a CMS, authentication, search, comments, advertising, and runtime content APIs.
- Non-English pages and an `/en/` URL prefix.
- Dynamic prices, discounts, review counts, review percentages, and unsupported game claims.
- OSRS material, codes, trainers, cheats, cracks, torrents, and unmarked Demo behavior.

The copied runtime home-page configuration will omit the unpublished `/platforms/`, `/privacy/`, and `/terms/` links. The source archive remains unchanged.

## 3. Chosen Approach

Use a configuration-driven home page, local MDX guide content, an explicit published-guide registry, and explicit Next.js App Router routes. This keeps content reviewable without introducing a CMS or a third-party content collection system for four articles.

The rejected alternatives are:

- A content collection framework such as Velite or Contentlayer, because it adds compatibility and build complexity without a first-release need.
- Pure TSX article content, because it couples long-form facts to presentation code and makes source auditing harder.

## 4. Project Boundary and Structure

The website lives directly in `G:\corsaircovewiki.com`; it is not nested in another `corsair-cove-site` directory.

```text
G:\corsaircovewiki.com\
├── docs\
│   ├── research\
│   └── superpowers\
├── public\
├── src\
│   ├── app\
│   ├── components\site\
│   ├── content\
│   │   ├── guides\
│   │   ├── guides.ts
│   │   └── homepage-content.json
│   ├── i18n\en.json
│   └── lib\
├── mdx-components.tsx
├── package.json
└── README.md
```

Approved research files are copied into `docs/research/` for traceability. Production code and builds must not reference `E:\Obsidian\scys\热词游戏站` or any parent directory.

## 5. Architecture and Data Flow

```text
approved local JSON, MDX, and guide registry
                    ↓
          Next.js Server Components
                    ↓
       statically generated HTML + metadata
                    ↓
       local verification and Vercel deploy
```

- The home page reads `src/content/homepage-content.json`; presentational components do not duplicate its copy.
- The Guide Hub, home-page guide cards, related-guide blocks, sitemap, and internal-link checks consume `src/content/guides/index.ts` as the single published-guide registry.
- Each guide owns one MDX file under `src/content/guides/`; the registry uses that directory's `index.ts` to avoid a file/directory module collision.
- Each public route is explicit rather than generated from arbitrary filenames.
- Server Components are the default. Only the mobile menu and theme control may be Client Components.
- Static builds make missing or malformed content a build-time failure instead of a runtime fetch failure.

## 6. Components and Responsibilities

- `SiteHeader`: site identity, desktop navigation, mobile menu, and theme control.
- `Hero`: fan-made positioning, concise game description, and published calls to action.
- `StatsStrip`: the four stable facts only—release date, 50+ Goods, 4 Principle Paths, and 62 Steam Achievements.
- `GuideCard`: a consistent published-guide summary and link.
- `Breadcrumbs`: hierarchy for the Guide Hub and guide pages.
- `ArticleLayout`: H1, direct answer, verification date, applicable version, table of contents, body, related guides, and sources.
- `Callout`: warnings, common errors, evidence limitations, and version-sensitive notes.
- `SiteFooter`: approved official external links, copyright text, and the unofficial fan-site disclaimer. It does not output links to absent legal pages.

Components receive validated content and remain unaware of the Obsidian source archive.

## 7. Page Composition

### 7.1 Home

1. Header.
2. Hero with primary links to `/tips/` and `/guides/`.
3. Four stable statistics.
4. Start Here cards for the four published guides.
5. Verified “What is Corsair Cove?” content.
6. Final Guide Hub call to action.
7. Footer.

The unpublished `/platforms/` tertiary action is absent.

### 7.2 Guide Hub

1. Breadcrumbs.
2. One H1 and a short direct introduction.
3. Task-oriented groups covering Start Here, Population, Ships, and Construction.
4. Cards derived only from the published-guide registry.
5. Footer.

The hub may describe future coverage in plain text only if it creates no unpublished internal link.

### 7.3 Guide Articles

1. Breadcrumbs.
2. One H1.
3. Direct answer.
4. Verification date and applicable version.
5. Table of contents.
6. H2/H3 body content.
7. Common mistakes, evidence limitations, or version risks.
8. Next Steps and Related Guides drawn from the registry.
9. Source list.
10. Footer.

The opening answer addresses the page’s primary search intent without an extended preamble.

## 8. Content and Fact Rules

The source-of-truth priority is:

1. `素材缺口.md` prohibitions and conflicts.
2. `关卡3-资料源总表.md` page status.
3. `homepage-development-audit.json` sources, dates, and limitations.
4. The relevant sections of `关键词素材.md` and `首页素材.md`.
5. `homepage-content.json` display configuration.
6. `页面矩阵规划.md` and `keywords.json` search intent.
7. `网站开发资料总交接.md` summaries.

Each guide MDX file is derived only from its matching section in `关键词素材.md`. Every guide must contain a unique title, description, primary keyword, direct answer, verification date, applicable version, body, and sources.

Writers must shorten content or state a limitation when the evidence is insufficient. They must not invent numbers, recipes, locations, characters, mechanisms, routes, platform promises, video transcripts, or screenshots. Until approved in-game screenshots exist, page presentation uses CSS backgrounds and the approved favicon assets; it does not simulate gameplay imagery.

## 9. Visual System and Responsive Behavior

- Navigation uses the proposed teal family; article surfaces use a light parchment family.
- Gold is limited to primary actions and small highlights.
- Pirate red is limited to warnings and risks.
- Dark mode uses the documented deep blue page background and adjusted teal/gold accents.
- Color values are editorial choices, not official brand colors.
- At approximately `1440 × 900`, navigation, cards, and article measures use the available desktop width without oversized text lines.
- At approximately `390 × 844`, the navigation collapses, cards stack, tables scroll within their own container, and long URLs wrap without causing page-level horizontal overflow.
- Focus states, semantic landmarks, keyboard-operable menus, sufficient contrast, and reduced-motion preferences are included in component acceptance criteria.

## 10. SEO

- The canonical origin is `https://corsaircovewiki.com`.
- The document language is English through `<html lang="en">`.
- Every page has a unique title, description, canonical URL, and baseline Open Graph metadata.
- Every page has exactly one H1; heading levels do not skip from H1 to H3 or from H2 to H4.
- The primary keyword appears naturally in the title, description, H1, and opening answer.
- `sitemap.xml` contains exactly the six public pages.
- `robots.txt` points to the production sitemap and permits public-page crawling.
- Unknown routes use a custom 404 page and are not included in navigation or the sitemap.

## 11. Validation and Failure Strategy

The build fails when:

- The home-page JSON is missing a required field or contains an unapproved internal route.
- A guide lacks required metadata, a direct answer, body content, or sources.
- The guide registry points to an absent route or MDX document.
- Any internal navigation target falls outside the six-page allowlist.
- Published content contains a red-light page link, a known prohibited OSRS phrase, fabricated codes, a dynamic price claim, or a known conflicted conclusion.

Automated verification covers:

- Home-page configuration schema and allowed links.
- Guide metadata and published registry consistency.
- Internal link integrity and six-route allowlisting.
- Unique metadata, canonical URLs, one-H1 rules, and heading order.
- Prohibited-content scans tied to the documented fact rules.
- `npm run lint`, `npm test`, and `npm run build`.

Browser verification covers all six production pages at desktop and mobile viewports. It checks for 404 responses, console errors, broken images, inaccessible navigation, page-level horizontal overflow, malformed tables, and missing metadata. Acceptance evidence includes screenshots of the home page, Guide Hub, and `/tips/` at the agreed viewports.

## 12. Completion Criteria

The MVP is complete only when:

- A fresh clone can install and build without access to the Obsidian archive.
- All six pages render and link to one another only through approved routes.
- The home page contains the confirmed structure and four working Start Here cards.
- The Guide Hub exposes exactly the four verified guides.
- Every guide displays its verification date, applicable version, source list, and evidence-bounded content.
- Automated lint, test, and production build commands pass.
- Desktop and mobile browser checks pass without console errors, broken assets, or page overflow.
- SEO output contains unique metadata, correct heading structure, the six-page sitemap, and the production canonical origin.
- Red-light, yellow-light, dynamic, conflicted, and fabricated material is absent from the production result.

Git initialization, remote creation, pushing, Vercel deployment, and Cloudflare DNS changes are separate authorized stages after local verification.
