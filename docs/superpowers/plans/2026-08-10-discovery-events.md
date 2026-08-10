# Discovery Events Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the evidence-bounded `/discovery-events/` guide and publish it through the existing registry, Guide Hub, SEO, and acceptance-test pipeline.

**Architecture:** Keep the guide static and local. Metadata lives in `src/content/guides/index.ts`, the body lives in `src/content/guides/discovery-events.mdx`, and the route delegates to the existing ArticleLayout. The Guide Hub, sitemap, internal-link validator, and metadata helpers must consume the registry rather than duplicate route lists.

**Tech Stack:** Next.js App Router, TypeScript, local MDX, Zod metadata schema, Vitest, Playwright, Tailwind CSS.

---

### Task 1: Add the failing content contract

**Files:**
- Modify: `src/content/guides/index.ts`
- Modify: `src/lib/routes.ts`
- Create: `tests/unit/discovery-events-content.test.ts`
- Modify: `tests/unit/guides-registry.test.ts`
- Modify: `tests/unit/routes.test.ts`

- [ ] **Step 1: Write failing registry tests**

Add assertions for the new canonical metadata shape:

```ts
import { discoveryEventsMeta, GUIDE_SLUGS, guideEntries } from '@/content/guides'

it('publishes discovery events metadata from the registry', () => {
  expect(GUIDE_SLUGS).toContain('discovery-events')
  expect(discoveryEventsMeta.href).toBe('/discovery-events/')
  expect(discoveryEventsMeta.primaryKeyword).toBe('corsair cove what is a discovery event')
  expect(discoveryEventsMeta.sources.map((source) => source.url)).toEqual([
    'https://wiki.hoodedhorse.com/Corsair_Cove/Seven_Seas',
    'https://wiki.hoodedhorse.com/Corsair_Cove/Events',
    'https://wiki.hoodedhorse.com/Corsair_Cove/Quests',
    'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251',
  ])
  expect(guideEntries.some(({ meta }) => meta.slug === 'discovery-events')).toBe(true)
})
```

Add content-boundary assertions that the direct answer distinguishes the three terms and rejects unsupported promises:

```ts
it('keeps discovery-event claims evidence-bounded', () => {
  expect(discoveryEventsMeta.directAnswer).toMatch(/Discovery Point/i)
  expect(discoveryEventsMeta.directAnswer).toMatch(/quest|event/i)
  expect(discoveryEventsMeta.directAnswer).toMatch(/fixed|individual|choice/i)
  expect(discoveryEventsMeta.directAnswer).not.toMatch(/guaranteed reward|every choice/i)
})
```

Add a route test requiring `/discovery-events/` to be in `PUBLIC_ROUTES` and the existing route allowlist to remain free of unpublished routes.

- [ ] **Step 2: Run focused tests and capture RED**

Run:

```bash
npm test -- tests/unit/discovery-events-content.test.ts tests/unit/guides-registry.test.ts tests/unit/routes.test.ts
```

Expected: FAIL because `discoveryEventsMeta` and the new slug/route do not exist yet.

- [ ] **Step 3: Commit the failing test checkpoint**

```bash
git add tests/unit/discovery-events-content.test.ts tests/unit/guides-registry.test.ts tests/unit/routes.test.ts
git commit -m "test: define discovery events content contract"
```

### Task 2: Implement the guide, registry entry, and route

**Files:**
- Create: `src/content/guides/discovery-events.mdx`
- Create: `src/app/discovery-events/page.tsx`
- Modify: `src/content/guides/index.ts`
- Modify: `src/lib/routes.ts`
- Modify: `src/app/sitemap.ts`
- Create: `tests/unit/discovery-events-page.test.tsx`

- [ ] **Step 1: Add the registry metadata and route**

Add `discoveryEventsMeta` with category `Events`, verified date `2026-08-08`, five H2 TOC entries, the four approved HTTPS sources, and related links limited to `/tips/`, `/how-to-get-more-drifters/`, `/how-to-build-ship/`, and `/connect-high-buildings/`. Add the slug to `GUIDE_SLUGS`, append the entry to `guideEntries`, and add `/discovery-events/` to `PUBLIC_ROUTES`.

Create the route page using the same pattern as the existing guide pages:

```tsx
import DiscoveryEventsContent, { meta } from '@/content/guides/discovery-events.mdx'
import { ArticleLayout } from '@/components/site/article-layout'

export default function DiscoveryEventsPage() {
  return <ArticleLayout meta={meta}><DiscoveryEventsContent /></ArticleLayout>
}
```

- [ ] **Step 2: Add the MDX body**

Use exactly one H1 and five H2s matching the registry TOC:

1. What Discovery Points, Quest Lines, and Events Mean
2. Reach a Discovery Point Through the Fog
3. Prepare a Ship for the Event
4. Monitor Health, Crew, and Objectives
5. Evidence Limit: Do Not Guess Event Choices

The body must use only the approved research claims: fog-covered regions, Discovery Points, related quest/event flow, turn-based objectives, suggested ship Tier/Class, one ship entering an event at a time, Health/Crew monitoring, and the distinction between Discovery Point, quest line, and Event. Include no fixed reward, guaranteed choice, or Golden City route claim.

- [ ] **Step 3: Add focused page/render tests**

Render the compiled MDX with the existing test setup and assert one H1, the exact ordered H2 labels, at least two source links, all related links are approved internal routes, and the page uses the shared ArticleLayout shell.

- [ ] **Step 4: Run focused tests and capture GREEN**

Run:

```bash
npm test -- tests/unit/discovery-events-content.test.ts tests/unit/discovery-events-page.test.tsx tests/unit/guides-registry.test.ts tests/unit/routes.test.ts
```

Expected: all focused tests pass.

- [ ] **Step 5: Commit the implementation**

```bash
git add src/content/guides/discovery-events.mdx src/content/guides/index.ts src/app/discovery-events/page.tsx src/lib/routes.ts src/app/sitemap.ts tests/unit/discovery-events-content.test.ts tests/unit/discovery-events-page.test.tsx
git commit -m "feat: add discovery events guide"
```

### Task 3: Verify navigation, SEO, safety, and production output

**Files:**
- Modify: `tests/unit/guides-page.test.tsx`
- Modify: `tests/unit/seo.test.ts`
- Modify: `tests/e2e/site.spec.ts`
- Modify: `README.md` only if the published route inventory is explicitly listed there

- [ ] **Step 1: Extend existing integration assertions**

Require the Guide Hub to render the new registered card, the sitemap to include `/discovery-events/`, metadata to use the article type and canonical `/discovery-events/`, and content-safety tests to reject no new unsafe links.

- [ ] **Step 2: Add browser acceptance coverage**

Add `/discovery-events/` to the published-page matrix and assert desktop/mobile rendering, the one-H1 contract, ordered H2s, source links, related navigation, no horizontal overflow, no console/request errors, and a working return path to Guide Hub.

- [ ] **Step 3: Run the full verification suite**

Run:

```bash
npm test
npm run lint
npm run build
npm run test:e2e
npm audit
```

Expected: all unit tests pass, lint has zero errors, the build statically generates `/discovery-events/`, browser acceptance passes with only the existing intentional desktop mobile-only skips, and npm audit reports zero vulnerabilities.

- [ ] **Step 4: Review the diff and push**

Run `git diff --check` and inspect `git status --short --branch`. Do not stage generated `AGENTS.md`, `CLAUDE.md`, or ignored artifacts. Push the reviewed branch only after the verification commands pass.

