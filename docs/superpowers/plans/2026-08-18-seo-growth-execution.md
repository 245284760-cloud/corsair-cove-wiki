# SEO Growth Execution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reuse the existing GitHub maintenance foundation to ship trustworthy engagement measurement, clearer search-intent pages, stronger homepage task routing, and an operational GA4/GSC follow-up process.

**Architecture:** Keep the static Next.js App Router architecture and canonical guide registry. Extend the existing typed `gtag` wrapper and tracked-link components rather than adding another analytics package, keep factual guide copy in the existing MDX/metadata registry, and harden the existing GitHub production smoke workflow instead of creating a parallel monitoring system.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript 5.9, MDX, Vitest + Testing Library, Playwright, GitHub Actions, GA4, Google Search Console.

---

### Task 1: Harden and right-size the existing GitHub production monitor

**Files:**
- Modify: `.github/workflows/production-smoke.yml`
- Modify: `scripts/production-smoke.mjs`
- Modify: `tests/unit/production-smoke.test.ts`
- Modify: `tests/unit/toolchain-contract.test.ts`

- [ ] **Step 1: Write failing smoke-contract tests**

Add tests that require:

```ts
expect(workflow).toContain("cron: '17 */6 * * *'")
expect(workflow).not.toContain("cron: '7,37 * * * *'")
```

and a healthy fetcher that returns security headers, a homepage containing `G-YSGBPS7G81`, robots with the canonical sitemap, and a sitemap containing all critical URLs. Expect:

```ts
await expect(checkProduction(fetcher)).resolves.toEqual({
  checked: 6,
  sitemapUrls: 20,
})
```

Add negative tests for a missing GA measurement ID and a missing `x-content-type-options: nosniff` header.

- [ ] **Step 2: Run the focused tests and verify RED**

Run:

```powershell
npm test -- tests/unit/production-smoke.test.ts tests/unit/toolchain-contract.test.ts
```

Expected: failures for the old twice-hourly cron, five checked resources, absent analytics assertion, and absent response-header assertion.

- [ ] **Step 3: Implement the minimal monitor changes**

Change the schedule to:

```yaml
on:
  schedule:
    - cron: '17 */6 * * *'
  workflow_dispatch:
```

Update `checkProduction` to check `/`, `/guides/`, `/tips/`, and `/search/`; require title, canonical metadata, and `x-content-type-options: nosniff` for every HTML route; require the GA measurement ID on `/`; require robots to reference the canonical sitemap; and require the sitemap to contain at least 20 URLs plus `/tips/`, `/guides/`, and `/search/`. Keep the return value `{ checked: 6, sitemapUrls }`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the Step 2 command. Expected: both files pass.

- [ ] **Step 5: Run the production smoke locally**

Run:

```powershell
npm run smoke:production
```

Expected: JSON with `checked: 6`, a sitemap count of at least 20, and exit code 0.

### Task 2: Add actionable GA4 engagement events

**Files:**
- Create: `src/components/site/guide-engagement-tracker.tsx`
- Create: `tests/unit/guide-engagement-tracker.test.tsx`
- Modify: `src/lib/analytics.ts`
- Modify: `src/components/site/guide-card.tsx`
- Modify: `src/components/site/guide-search.tsx`
- Modify: `src/components/site/article-layout.tsx`
- Modify: `tests/unit/analytics.test.tsx`
- Modify: `tests/unit/guide-search.test.tsx`
- Modify: `tests/unit/article-layout.test.tsx`

- [ ] **Step 1: Write failing tests for the event vocabulary and related-guide clicks**

Require the typed event vocabulary to accept:

```ts
'guide_click' | 'source_click' | 'internal_search' | 'guide_engaged' | 'related_guide_click'
```

Render `ArticleLayout`, click a related guide, and expect:

```ts
expect(gtag).toHaveBeenCalledWith('event', 'related_guide_click', {
  link_url: related.href,
  link_title: related.title,
})
```

- [ ] **Step 2: Write failing tests for internal search**

Filter the guide search with `ships`, click the remaining result, and expect:

```ts
expect(gtag).toHaveBeenCalledWith('event', 'internal_search', {
  search_term: 'ships',
  result_count: 1,
  link_url: '/ships/',
})
```

The link must still navigate to `/ships/` when analytics is unavailable.

- [ ] **Step 3: Write failing tests for engaged-guide tracking**

Use fake timers and a mocked scrollable document. Require one `guide_engaged` event after 60 seconds and one event when scroll depth first reaches 75%. Repeated timers and scroll events must not send duplicates. Parameters:

```ts
{
  article_slug: 'tips',
  engagement_trigger: 'time' | 'scroll',
}
```

- [ ] **Step 4: Run focused tests and verify RED**

Run:

```powershell
npm test -- tests/unit/analytics.test.tsx tests/unit/guide-search.test.tsx tests/unit/guide-engagement-tracker.test.tsx tests/unit/article-layout.test.tsx
```

Expected: failures because the new event names, component, and event wiring do not exist.

- [ ] **Step 5: Implement the typed event and component changes**

Extend `AnalyticsEventName`. Add an optional `eventName` prop to `GuideCard`, defaulting to `guide_click`. Use `related_guide_click` for ArticleLayout's related cards. Replace search-result anchors with `TrackedLink` using the normalized query, result count, and destination. Add a client-only `GuideEngagementTracker` that sends exactly one event per article view after either the first 60-second timer or the first 75%-scroll threshold, and render it from `ArticleLayout`.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run the Step 4 command. Expected: all focused tests pass with no duplicate-event failures.

### Task 3: Make the existing Tips page answer Fetcher search intent

**Files:**
- Modify: `src/content/guides/index.ts`
- Modify: `src/content/guides/tips.mdx`
- Modify: `tests/unit/tips-content.test.ts`

- [ ] **Step 1: Write failing content tests**

Require the Tips metadata to use:

```ts
title: 'How to Get and Assign Fetchers in Corsair Cove'
primaryKeyword: 'corsair cove how to get more fetchers'
```

Require the direct answer to explain that Fetchers are assigned from available labor rather than recruited as a separate population. Require these exact H2 headings:

```ts
[
  'How to Get More Fetchers',
  'Create and Assign a Fetcher Route',
  'Read Route Efficiency',
  'Fix a Fetcher That Is Not Working',
  'Plan Multiple Input Relationships',
]
```

Require rendered copy to mention free Drifters, one Fetcher route per input relationship, route efficiency colors, missing inputs, full output storage, and warehouse hubs. Preserve the four approved HTTPS sources and all existing content-safety assertions.

- [ ] **Step 2: Run the Tips tests and verify RED**

Run:

```powershell
npm test -- tests/unit/tips-content.test.ts
```

Expected: failures against the old broad Tips title and old H2 structure.

- [ ] **Step 3: Implement the Fetcher-focused metadata and MDX**

Use this direct-answer meaning without unsupported game claims:

```text
You do not recruit Fetchers as a separate population. Free Drifters by pausing lower-priority work, then assign one Fetcher route for each input relationship. If a route stalls, check the building state, connection, available labor, missing input, full output storage, and route efficiency before adding more buildings.
```

Implement the five tested sections with concise steps and a troubleshooting table. Keep all facts inside the evidence boundaries of the existing Beginner Guide, official Buildings/Pirates pages, and Ultimate Production Guide.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the Step 2 command. Expected: the focused content test passes.

### Task 4: Route homepage visitors directly to common tasks and separate the guide directory intent

**Files:**
- Modify: `src/content/homepage-content.json`
- Modify: `src/app/guides/page.tsx`
- Modify: `tests/unit/home-content.test.ts`
- Modify: `tests/unit/home-page.test.tsx`
- Modify: `tests/unit/guides-page.test.tsx`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write failing homepage and guide-directory tests**

Require hero CTAs to point to `/tips/` and `/search/`. Require the Start Here heading `Solve the Most Common Corsair Cove Problems` and these five cards:

```text
Assign Fetchers -> /tips/
Get More Drifters -> /how-to-get-more-drifters/
Build Your First Ship -> /how-to-build-ship/
Fix Stalled Production -> /production-chains/
Connect High Buildings -> /connect-high-buildings/
```

Require the guide directory metadata title to be `Corsair Cove Guide Directory – Gameplay & Support`, distinct from the homepage title. Update the mobile and desktop homepage contract to require visible links for Assign Fetchers, Search Guides, and Fix Stalled Production.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```powershell
npm test -- tests/unit/home-content.test.ts tests/unit/home-page.test.tsx tests/unit/guides-page.test.tsx
```

Expected: failures for old CTA destinations, four cards, old heading, and old guide-directory metadata.

- [ ] **Step 3: Implement the content changes**

Update only validated homepage JSON and the static guides metadata. Keep the single H1, all published-route validation, existing factual statistics, game-information cards, and contrast-safe color roles unchanged.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run the Step 2 command. Expected: all focused tests pass.

- [ ] **Step 5: Run the relevant browser tests**

Run:

```powershell
npx playwright test tests/e2e/site.spec.ts --grep "home|Guide Hub"
```

Expected: desktop and mobile homepage/Guide Hub tests pass.

### Task 5: Document the external GA4 and Search Console operations that code cannot perform

**Files:**
- Create: `docs/operations/analytics-growth-runbook.md`
- Modify: `docs/operations/production-runbook.md`
- Modify: `README.md`

- [ ] **Step 1: Add the analytics growth runbook**

Document exact GA4 administrator actions: verify `vercel.com / referral` before adding it to unwanted referrals; define internal traffic using the maintainer's current public IP without committing the IP; activate the internal-traffic data filter in testing mode before switching it active; mark `guide_engaged`, `internal_search`, and `related_guide_click` as key events; and validate each event in DebugView and Realtime.

Document exact GSC actions: record the release date, request indexing only for changed canonical URLs, compare 28 days versus previous 28 days after enough data exists, and export query/page/country/device dimensions. Include the baseline values captured on 2026-08-18: 44 clicks, 576 impressions, 7.6% CTR, average position 7.4; GA4 145 active users, 143 new users, 11 seconds average engagement, and 791 events for 2026-07-21 through 2026-08-17.

- [ ] **Step 2: Link the runbook from operations documentation**

Add a release-checklist entry in `production-runbook.md` and an Operations link in README. Do not store account identifiers, email addresses, IP addresses, cookies, exported analytics data, or credentials.

- [ ] **Step 3: Verify documentation links**

Run:

```powershell
rg -n "analytics-growth-runbook|guide_engaged|internal_search|related_guide_click" README.md docs/operations
```

Expected: README and production runbook link the new document, and the new document lists all three events.

### Task 6: Full integration verification

**Files:**
- Verify all files changed by Tasks 1–5

- [ ] **Step 1: Run lint with zero warnings**

```powershell
npm run lint -- --max-warnings=0
```

- [ ] **Step 2: Run all unit tests**

```powershell
npm test
```

- [ ] **Step 3: Run the production build**

```powershell
npm run build
```

- [ ] **Step 4: Run all Playwright tests**

```powershell
npm run test:e2e
```

- [ ] **Step 5: Run the live production smoke without assuming it tests unshipped code**

```powershell
npm run smoke:production
```

Interpretation: this confirms the currently deployed site is healthy. The strengthened checks only validate the new implementation after it is deployed.

- [ ] **Step 6: Review the final diff**

Confirm no secrets, account email, public IP, analytics exports, build artifacts, or unrelated user files are included. Confirm every plan requirement maps to a changed file or the external-operations runbook.
