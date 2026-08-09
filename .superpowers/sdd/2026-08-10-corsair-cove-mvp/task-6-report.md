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
- `tips.mdx` is a direct source-level re-export of `tipsMeta`; Fix Round 1 verifies exact identity with `toBe(getGuideMeta('tips'))`.

## Fix Round 1 — Metadata and MDX Link Hardening

### RED

The following focused regressions were written and run before the fixes:

```text
npm test -- tests/unit/article-layout.test.tsx tests/unit/tips-content.test.ts tests/unit/mdx-components.test.tsx
```

Result: 3 test files ran; 7 tests failed and 2 passed. The meaningful failures were:

- `guideMeta` failed exact reference identity against `getGuideMeta('tips')`.
- Authored `target="_self"` overrode the required HTTPS `_blank` target.
- Protocol-relative, HTTP, JavaScript, and fragment hrefs rendered instead of being rejected.

After narrowing the Next `Link` rendering expectation to its normalized `/tips` href, the MDX mapping regression remained RED with 5 expected failures (the overridden external attributes and four rejected href cases).

### Root cause and fix

- `createGuideRegistry()` validated each metadata object by parsing it and then stored the parsed clone. `tips.mdx` re-exported `tipsMeta`, while `getGuideMeta('tips')` returned that clone. The registry now validates the input but preserves and freezes the original registry object, so both access paths have exact identity.
- The registry module moved from `src/content/guides.ts` to canonical `src/content/guides/index.ts`, eliminating the basename collision with the MDX directory. Existing `@/content/guides` imports continue to resolve through the normal directory index. Vitest retains one exact alias because its MDX transform does not resolve that directory import on its own.
- HTTPS MDX links now spread authored props first and then force `href`, `target="_blank"`, and `rel="noopener noreferrer"`. Only a single-leading-slash route is internal; every other scheme, protocol-relative URL, fragment, or missing href throws a visible `Unsupported MDX link` error.
- The ArticleLayout test now renders compiled `TipsContent` with its matching `guideMeta`, then verifies every TOC href resolves to its compiled H2 ID.

### GREEN and verification

| Command | Result |
|---|---|
| `npm test -- tests/unit/article-layout.test.tsx tests/unit/tips-content.test.ts tests/unit/mdx-components.test.tsx` | 3 files passed, 9 tests passed |
| `npm test` | 12 files passed, 34 tests passed |
| `npm run lint` | Passed with 0 errors; the same pre-existing `postcss.config.mjs` warning remains |
| `npm run build` | Passed; `/tips/` remains statically generated |
| `git diff --check` | Passed |
