# Core Information Pages Design

## Scope

Add five evidence-backed English information pages to `corsaircovewiki.com`:

1. `/platforms/`
2. `/release-date/`
3. `/price/`
4. `/system-requirements/`
5. `/troubleshooting/`

The batch fills high-demand search entry points that are missing from the current seven-route site. It does not add separate PS5, Xbox, Game Pass, crash, bug, or connection-issue pages. Those intents are deliberately consolidated into the five routes above to avoid thin pages and keyword cannibalization.

## Product decision

Use five focused pages rather than one broad game-information page or a larger batch of narrow pages.

- `platforms`, `release-date`, and `price` remain separate because they answer distinct search intents.
- PS5, Xbox, Switch, and Game Pass questions live on `/platforms/` until Search Console data demonstrates enough distinct demand and evidence for separate pages.
- Crash, bug, startup, save, performance, and connection questions live on `/troubleshooting/` as sections, not standalone routes.
- Resource and long-tail pages such as `/tobacco/`, `/rope/`, `/mods/`, `/multiplayer/`, and `/golden-city-maze/` remain deferred until this batch is indexed and query data is available.

## Information architecture

The five routes become published guide-registry entries so they inherit the existing ArticleLayout, source list, verification metadata, related cards, sitemap generation, canonical metadata, and Guide Hub grouping.

Use two new Guide Hub groups:

- `Game Info`: platforms, release date, price, and system requirements.
- `Support`: troubleshooting.

Update the home page with one compact `Game information` entry area that links to the four Game Info pages and troubleshooting. Do not create a new `/game-info/` hub in this batch. The existing `/guides/` route remains the complete content index.

Every new page must link to at least two other pages in this batch where the relationship is natural. Examples:

- Platforms links to release date, price, and system requirements.
- Release date links to platforms and price.
- Price links to platforms and release date.
- System requirements links to platforms and troubleshooting.
- Troubleshooting links to system requirements and the most relevant gameplay guides.

## Shared architecture and data flow

1. Extend `PUBLIC_ROUTES` and `GUIDE_ROUTES` with the five trailing-slash routes.
2. Add one MDX content file and one explicit App Router page per route, following the existing guide pattern.
3. Add five metadata records to the canonical guide registry and let the Guide Hub derive its groups and cards from registry data.
4. Replace the metadata schema's fixed `verifiedOn: '2026-08-08'` literal with a strict ISO `YYYY-MM-DD` date-string validation so new research can carry its actual verification date without weakening validation.
5. Reuse `ArticleLayout`; do not introduce a second article renderer or duplicate source/related-page logic.
6. Extend the home-content schema and content only as much as necessary to render the compact Game Information entry area.
7. Keep all content static at build time. No runtime store-price requests, CMS, database, or client-side platform detection are allowed.

## Evidence and freshness policy

All factual claims must be re-verified immediately before writing. Current dates, prices, platforms, subscription availability, system requirements, and known issues are temporally unstable and must not be copied from the August 8 keyword research as facts.

Source priority:

1. Official developer or publisher announcements and support pages.
2. Official Steam, Xbox, PlayStation, or Nintendo store listings.
3. Official Corsair Cove Wiki pages.
4. Reputable secondary sources only when an official source does not answer the question; secondary-only claims must be qualified.

Rules:

- Absence of a console-store listing is not proof that a console version will never exist. Use `not announced` or `no official listing found as of <date>` when that is the supported conclusion.
- Display a numeric price only when an official store exposes it at verification time. Identify currency and region. Also provide an official-store link because regional prices and discounts change.
- Distinguish release date, current release state, and future roadmap claims.
- Copy system requirements exactly enough to preserve CPU, memory, GPU, storage, OS, and architecture meaning; do not invent performance targets.
- Troubleshooting steps must identify whether they come from an official instruction, a platform-standard diagnostic, or a clearly labeled workaround. Do not promise that a workaround will fix every installation.
- Every page displays its actual `verifiedOn` date and an applicable-version or availability note.

## Page content contracts

### Platforms

Primary intent: `corsair cove ps5`, with Xbox, Switch, Game Pass, and broader platform variants consolidated on the same page. The route remains `/platforms/` because the answer covers more than PlayStation.

Required sections:

1. Direct answer with a compact confirmed-availability table.
2. PC storefront availability.
3. PS5 and PlayStation status.
4. Xbox and Game Pass status.
5. Nintendo Switch status.
6. How future platform announcements will be verified.

The table must separate `Confirmed`, `Not announced`, and `Unavailable` rather than treating them as synonyms.

### Release date

Primary intent: `corsair cove release date`.

Required sections:

1. Direct answer stating the officially verified date and current release state.
2. Release timeline, limited to verified milestones.
3. Early Access, demo, and full-release distinctions where applicable.
4. Platform-specific timing only when officially announced.
5. Where to verify future updates.

Do not use speculative countdowns or inferred future dates.

### Price

Primary intent: `corsair cove price`.

Required sections:

1. Direct answer with verification date, currency, region, and official store.
2. Base edition and any officially listed editions or bundles.
3. Regional pricing and sale caveat.
4. Subscription availability linked to the platforms page.
5. Safe purchase links to official storefronts.

The page remains useful when the numeric price changes: its prose must direct readers to the official store and avoid presenting a temporary discount as the permanent base price.

### System requirements

Primary intent: `corsair cove system requirements`.

Required sections:

1. Direct answer and supported operating-system scope.
2. Minimum requirements table.
3. Recommended requirements table, if officially published.
4. Storage, architecture, and input notes where verified.
5. Practical pre-purchase checks without invented FPS or resolution guarantees.
6. Link to troubleshooting for startup or performance problems.

### Troubleshooting

Primary intent: `corsair cove crash`, consolidating bugs and connection-issue variants.

Required sections:

1. A fast diagnostic checklist ordered from safest to most disruptive.
2. Startup and crash problems.
3. Performance or graphics problems.
4. Save or settings problems, only where evidence exists.
5. Connection or platform-service problems, only where applicable.
6. How to collect version, logs, hardware, and reproduction steps before requesting support.
7. Official support and known-issues links.

Do not recommend deleting saves, configuration directories, or other user data without an explicit backup step and a precise, verified target.

## SEO and metadata

- Each route has one unique primary keyword, title, description, canonical URL, H1, and direct answer.
- Titles must describe the current answer without clickbait or unsupported certainty.
- Open Graph metadata continues to use the existing metadata helper.
- Each page appears exactly once in sitemap output.
- Keep the existing trailing-slash convention.
- Do not add FAQ structured data in this batch. Visible FAQ-style questions are allowed, but schema markup is deferred until content stability and eligibility are reviewed.
- Update Guide Hub and home-page descriptions so the new coverage is represented without keyword stuffing.

## UX and accessibility

Reuse existing typography, breadcrumbs, table of contents, callouts, source list, related cards, light/dark themes, and responsive widths.

- Every page has exactly one H1.
- H2 order matches registry TOC order.
- Status and requirements tables include semantic headers and remain horizontally usable on narrow screens.
- Status must not be communicated by color alone.
- External store and source links identify their destination in visible text.
- Links and interactive controls retain keyboard-visible focus styles.

## Testing and acceptance

Use a test-first implementation sequence.

1. Add failing route and registry tests for the five exact trailing-slash URLs, unique slugs, groups, related-route validity, source requirements, and variable ISO verification dates.
2. Add failing content-contract tests for each page's direct answer, required sections, evidence language, and prohibited overclaims.
3. Add failing render tests requiring ArticleLayout, one H1, ordered H2s, sources, and related cards.
4. Add failing home and Guide Hub tests for discoverability of all five pages.
5. Implement metadata, MDX, pages, navigation, and home content until focused tests pass.
6. Run the full unit suite, type checks, lint, production build, and Playwright acceptance suite.

Acceptance requires:

- All twelve public routes are statically generated and return successful pages.
- All five new routes appear in the sitemap, Guide Hub, and home-page entry area.
- Canonical URLs and Open Graph URLs match the production trailing-slash URLs.
- No related link points to an unpublished route.
- No unsafe, mixed-content, or dummy source URL is present.
- Desktop and mobile rendering has no overflow, inaccessible table structure, console error, or failed first-party request.
- Content tests reject unsupported platform certainty, speculative release dates, ambiguous prices, invented system performance, and destructive troubleshooting without backup guidance.

## Out of scope

- Separate PS5, Xbox, Switch, Game Pass, crash, bug, or connection routes.
- Live price APIs, automatic currency localization, or store scraping at runtime.
- Affiliate integration, ad-layout changes, analytics-event changes, or Search Console configuration.
- New screenshots, videos, interactive compatibility checkers, comparison tools, or a dedicated Game Info hub.
- `/tobacco/`, `/rope/`, `/mods/`, `/multiplayer/`, `/golden-city-maze/`, and other long-tail pages.
- Deployment, Cloudflare, domain, or advertising configuration changes.
