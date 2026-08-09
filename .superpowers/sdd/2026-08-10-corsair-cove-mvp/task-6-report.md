# Task 6 Report — Beginner Tips Guide

## Result

- Added the reusable article system (`ArticleLayout`, `ArticleToc`, and `Callout`) and the explicit static `/tips/` route.
- Added `tips.mdx`, which directly re-exports `tipsMeta` as `guideMeta` and contains only the five required, evidence-bounded Tips sections.
- Updated the Tips registry entry to use the required primary keyword, full-release applicability label, five MDX-backed TOC entries, and exactly the four approved HTTPS sources.
- Added safe MDX mappings: internal routes use `next/link`; HTTPS links use `noopener noreferrer`; tables receive a local horizontal-scroll wrapper.

## TDD evidence

### RED

Command:

```text
npm test -- tests/unit/article-layout.test.tsx tests/unit/tips-content.test.ts
```

Before implementation, both suites failed during module resolution because `ArticleLayout` and `tips.mdx` did not exist (0 tests executed; 2 failed test files). The expected absent-feature failure was observed.

### GREEN

Focused command after implementation:

```text
npm test -- tests/unit/article-layout.test.tsx tests/unit/tips-content.test.ts
```

Result: 2 test files passed, 3 tests passed. The tests render `ArticleLayout` and compiled `tips.mdx`, verify one H1, direct-answer checks, version/date labels, TOC targets matching compiled H2 IDs, source boundaries, and prohibited terms.

## Verification

| Command | Result |
|---|---|
| `npm test` | 11 files passed, 28 tests passed |
| `npm run lint` | Passed with 0 errors; one pre-existing warning in `postcss.config.mjs` |
| `npm run build` | Passed; `/tips/` is statically generated |
| `git diff --check` | Passed |

## Files

- Added: `src/components/site/article-layout.tsx`, `article-toc.tsx`, `callout.tsx`
- Added: `src/content/guides/tips.mdx`, `src/app/tips/page.tsx`, `src/types/mdx.d.ts`
- Added: `tests/unit/article-layout.test.tsx`, `tests/unit/tips-content.test.ts`
- Updated: `src/content/guides.ts`, `mdx-components.tsx`, `tsconfig.json`, `vitest.config.mts`

## Commit

- `feat: add beginner tips guide` (this report is included in that commit)

## Self-review and concerns

- Confirmed the MDX has no screenshots, no unapproved URLs, and none of `OSRS`, `codes`, `trainer`, `crack`, or `torrent`.
- Confirmed related-guide cards are resolved from the published registry, not duplicated inside the page.
- The `src/content/guides/` folder required by the MDX path shadows the pre-existing `src/content/guides.ts` basename for some resolvers. Exact TypeScript and Vitest aliases preserve the existing `@/content/guides` registry contract; the production build confirms the route compiles.
- `tips.mdx` is a direct source-level re-export of `tipsMeta`. Vitest executes compiled MDX and TypeScript modules in separate transform contexts, so the behavioral test uses `toStrictEqual` rather than reference identity while still guarding against duplicated metadata through the direct re-export and exact registry/source contract.
