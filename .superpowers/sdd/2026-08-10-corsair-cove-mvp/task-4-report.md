# Task 4 Report: Validated Wiki Homepage

## Outcome

Created the validated runtime homepage configuration and the server-rendered home-page sections: Hero, stats strip, four Start Here guide cards, game overview, and final CTA. The existing root layout supplies the shared Header and Footer around this page.

## TDD evidence

### RED

Command:

```text
npm test -- tests/unit/home-content.test.ts tests/unit/home-page.test.tsx
```

Result before implementation: exit 1. `tests/unit/home-content.test.ts` could not resolve `@/lib/home-content`; all three home-page tests failed because the page still rendered only the placeholder `Corsair Cove Wiki` H1 and did not export metadata.

### GREEN

After adding the runtime content loader, shared components, and homepage composition, the focused command passed:

```text
Test Files  2 passed (2)
Tests  6 passed (6)
```

## Verification

```text
npm test
Test Files  7 passed (7)
Tests  19 passed (19)

npm run lint
Exit 0; 0 errors. One existing warning remains in postcss.config.mjs:
import/no-anonymous-default-export.

npm run build
Exit 0; Next.js compiled, type-checked, and prerendered / as a static route.

git diff --check
Exit 0.
```

## Files

- Created `src/content/homepage-content.json` as the validated runtime copy.
- Created `src/lib/home-content.ts` to parse that JSON at module load.
- Exported `HomeContent` from `src/lib/content-schema.ts` for typed rendering props.
- Created `src/components/site/hero.tsx`, `stats-strip.tsx`, and `guide-card.tsx`.
- Replaced `src/app/page.tsx` placeholder markup with the homepage and `createPageMetadata('/', ...)` metadata.
- Created content and rendered-page behavior tests in `tests/unit/home-content.test.ts` and `tests/unit/home-page.test.tsx`.

## Scope audit and self-review

- Runtime copy removes tertiary platform CTA, legal links, `sidebarCodes`, and `platforms` keywords.
- Both requested metadata descriptions use the approved beginner-guide wording; footer coverage lists only drifters, ships, logistics, and vertical building.
- Stable hero statistics are unchanged; Start Here cards, facts, external links, theme data, language priority, and maintenance limits are preserved.
- Content tests use independent literal assertions, inspect the parsed runtime object, and restrict internal values to `PUBLIC_ROUTES`. Rendered-page tests enforce one H1 and validate all Start Here destinations.
- No images, dependencies, unpublished routes, invented game facts, or source-document edits were introduced.

## Concern

The lint warning in `postcss.config.mjs` pre-existed this task and is outside the requested homepage scope; lint exits successfully with zero errors.

## Commit

Deferred commit subject: `feat: build validated wiki homepage`
