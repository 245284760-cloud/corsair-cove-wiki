# Corsair Cove MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained, production-buildable English Corsair Cove wiki with a home page, Guide Hub, four evidence-bounded guides, responsive presentation, and automated content/SEO/link validation.

**Architecture:** A Next.js App Router site renders local, validated JSON and MDX through Server Components. Four explicit guide routes consume a single typed guide registry; Zod and Vitest enforce content boundaries before build, while Playwright checks the six-page production experience at desktop and mobile sizes.

**Tech Stack:** Node.js `>=20.9.0` (developer machine: `25.2.1`), npm `11.6.2`, Next.js `16.3.0`, React `19.2.8`, TypeScript `5.9.3`, Tailwind CSS `4.3.3`, `@next/mdx` `16.3.0`, Zod `4.4.3`, Vitest `4.1.10`, React Testing Library, Playwright `1.62.1`.

## Global Constraints

- Implement directly in `G:\corsaircovewiki.com`; do not create a nested website directory.
- The runtime and production build must not read `E:\Obsidian\scys\热词游戏站` or any directory outside the repository.
- Publish exactly `/`, `/guides/`, `/tips/`, `/how-to-get-more-drifters/`, `/how-to-build-ship/`, and `/connect-high-buildings/`.
- Do not publish or link `/platforms/`, `/privacy/`, `/terms/`, `/mods/`, `/golden-city-maze/`, `/tobacco/`, or `/rope/`.
- English is the only first-release language and public URLs have no `/en/` prefix.
- Canonical origin is exactly `https://corsaircovewiki.com`; public routes retain trailing slashes.
- Use Server Components by default; only theme state and the mobile menu may be Client Components.
- Do not add a CMS, database, authentication, search, comments, advertising, or runtime content API.
- Guide facts must come only from the matching `关键词素材.md` section, subject to `素材缺口.md` and `关卡3-资料源总表.md`.
- Do not add dynamic price/review claims, OSRS material, codes, mods, trainers, cheats, cracks, torrents, invented transcripts, or invented gameplay images.
- The current directory is not a Git repository. Do not initialize Git or execute commit commands until the user separately authorizes the Git stage. Each task records an exact deferred commit for later use.

---

## Planned File Map

### Project and tooling

- Create `package.json`: exact scripts, engines, and pinned packages.
- Create `package-lock.json`: npm-resolved dependency lock.
- Create `tsconfig.json`: strict TypeScript and `@/*` alias.
- Create `next.config.mjs`: MDX, GFM, slug headings, and trailing slashes.
- Create `postcss.config.mjs`: Tailwind v4 PostCSS plugin.
- Create `eslint.config.mjs`: Next.js Core Web Vitals and TypeScript rules.
- Create `vitest.config.mts`: jsdom, React, path aliases, and setup file.
- Create `playwright.config.ts`: Chromium projects and local web server.
- Create `src/test/setup.ts`: Testing Library cleanup and DOM matchers.
- Create `tests/unit/smoke.test.tsx`: baseline toolchain smoke test.
- Create `.gitignore`: Next.js, coverage, Playwright, and local environment outputs.

### Content and validation

- Create `src/lib/routes.ts`: six-route allowlist and `PublicRoute` type.
- Create `src/lib/content-schema.ts`: Zod schemas and guide metadata interfaces.
- Create `src/lib/metadata.ts`: canonical metadata helper.
- Create `src/content/homepage-content.json`: cleaned runtime home configuration.
- Create `src/content/guides.ts`: validated guide registry and lookup functions.
- Create `src/content/guides/*.mdx`: four guide bodies and metadata exports.
- Create `src/i18n/en.json`: shared English navigation/interface strings.
- Create `mdx-components.tsx`: safe MDX element mappings.

### Application

- Create `src/app/layout.tsx`, `src/app/globals.css`: root HTML, metadata defaults, providers, and theme tokens.
- Create `src/app/page.tsx`: home page.
- Create `src/app/guides/page.tsx`: Guide Hub.
- Create four explicit guide `page.tsx` files under their URL folders.
- Create `src/app/not-found.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`.
- Create `src/components/site/*`: frame, cards, article layout, callouts, navigation, and theme control.

### Research, assets, and verification

- Create `docs/research/*`: approved source copies.
- Create `public/*`: approved favicon package only.
- Create `tests/unit/*`: schema, routes, content, component, and safety tests.
- Create `tests/e2e/site.spec.ts`: six-route, responsive, navigation, SEO, and screenshot checks.
- Create `README.md`: install, verify, evidence, and content-boundary instructions.

---

### Task 1: Bootstrap the Root Project and Preserve Approved Inputs

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `.gitignore`
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.mts`
- Create: `playwright.config.ts`
- Create: `src/test/setup.ts`
- Create: `tests/unit/smoke.test.tsx`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `mdx-components.tsx`
- Create: `docs/research/*`
- Create: `public/favicon.ico`
- Create: `public/favicon-16x16.png`
- Create: `public/favicon-32x32.png`
- Create: `public/apple-touch-icon.png`
- Create: `public/android-chrome-192x192.png`
- Create: `public/android-chrome-512x512.png`
- Create: `public/site.webmanifest`

**Interfaces:**
- Consumes: read-only source archive `E:\Obsidian\scys\热词游戏站`.
- Produces: `npm run dev`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e`; a minimal App Router page; local research and favicon copies.

- [ ] **Step 1: Verify the runtime floor and non-repository state**

Run:

```powershell
node --version
npm --version
git rev-parse --is-inside-work-tree
```

Expected: Node is `v20.9.0` or newer; npm is available; the Git command reports that the directory is not a repository.

- [ ] **Step 2: Create the pinned package manifest**

Create `package.json` with:

```json
{
  "name": "corsair-cove-wiki",
  "version": "0.1.0",
  "private": true,
  "engines": { "node": ">=20.9.0" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "check": "npm run lint && npm test && npm run build && npm run test:e2e"
  },
  "dependencies": {
    "next": "16.3.0",
    "next-themes": "0.4.6",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "zod": "4.4.3"
  },
  "devDependencies": {
    "@mdx-js/loader": "3.1.1",
    "@mdx-js/react": "3.1.1",
    "@mdx-js/rollup": "3.1.1",
    "@next/mdx": "16.3.0",
    "@playwright/test": "1.62.1",
    "@tailwindcss/postcss": "4.3.3",
    "@testing-library/dom": "10.4.1",
    "@testing-library/react": "16.3.2",
    "@types/mdx": "2.0.14",
    "@types/node": "26.2.0",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.4",
    "@vitejs/plugin-react": "6.0.5",
    "eslint": "9.39.5",
    "eslint-config-next": "16.3.0",
    "jsdom": "29.0.1",
    "postcss": "8.5.6",
    "rehype-slug": "6.0.0",
    "remark-gfm": "4.0.1",
    "tailwindcss": "4.3.3",
    "typescript": "5.9.3",
    "vite-tsconfig-paths": "6.1.1",
    "vitest": "4.1.10"
  }
}
```

Run `npm install` and require a generated `package-lock.json` with no install error.

- [ ] **Step 3: Configure TypeScript, Next.js MDX, Tailwind, ESLint, and tests**

Use strict TypeScript with `@/* -> ./src/*`. Configure `next.config.mjs` as:

```js
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: ['rehype-slug'],
  },
})

export default withMDX({
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  trailingSlash: true,
})
```

Use this `tsconfig.json` baseline:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.mts", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Use the Next.js flat ESLint configuration:

```js
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    '.next/**', 'out/**', 'build/**', 'next-env.d.ts',
    'artifacts/**', 'test-results/**', 'playwright-report/**',
  ]),
])
```

Configure Tailwind v4 with `@tailwindcss/postcss` and start `globals.css` with:

```css
@import "tailwindcss";

:root { color-scheme: light; }
.dark { color-scheme: dark; }
```

`postcss.config.mjs` is:

```js
export default { plugins: { '@tailwindcss/postcss': {} } }
```

Configure Vitest for `jsdom`, React, MDX, and `vite-tsconfig-paths`:

```ts
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] }) },
    tsconfigPaths(),
    react({ include: /\.(js|jsx|ts|tsx|md|mdx)$/ }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

Configure Playwright with `baseURL: 'http://127.0.0.1:3000'`, Chromium, `webServer.command: 'npm run dev'`, and `reuseExistingServer: !process.env.CI`.

- [ ] **Step 4: Create the minimal smoke page and MDX hook**

Create `src/app/layout.tsx` with `<html lang="en" suppressHydrationWarning>` and a required `<body>`. Create `src/app/page.tsx` with one H1, `Corsair Cove Wiki`. Create `mdx-components.tsx` exporting `useMDXComponents(): MDXComponents`. Create `tests/unit/smoke.test.tsx` that renders the page and asserts `screen.getByRole('heading', { level: 1, name: 'Corsair Cove Wiki' })` exists.

- [ ] **Step 5: Copy approved research and favicon files without changing the archive**

Copy these source files into `docs/research/`: `关键词.md`, `keywords.json`, `页面矩阵规划.md`, `关键词素材.md`, `首页素材.md`, `关卡3-资料源总表.md`, `素材缺口.md`, `homepage-development-audit.json`, `homepage-content.json`, `网站开发资料总交接.md`, and `docs/superpowers/specs/2026-08-09-corsair-cove-level-4-site-design.md` (rename the last file only if needed to avoid a collision).

Copy only the seven approved favicon/manifest files listed in **Files** from `E:\Obsidian\scys\热词游戏站\corsair-cove\favicon\` to `public\`. Do not copy the generated source image, previews, or ZIP.

- [ ] **Step 6: Verify the baseline**

Run:

```powershell
npm run lint
npm test
npm run build
```

Expected: lint and build pass; Vitest exits successfully even if the initial suite contains only the smoke test.

- [ ] **Step 7: Record the deferred checkpoint**

Deferred commit message: `chore: bootstrap Corsair Cove wiki`. Do not run Git commands before the separately authorized Git stage.

---

### Task 2: Define the Six-Route and Content Contracts

**Files:**
- Create: `src/lib/routes.ts`
- Create: `src/lib/content-schema.ts`
- Create: `src/lib/metadata.ts`
- Create: `src/i18n/en.json`
- Create: `tests/unit/routes.test.ts`
- Create: `tests/unit/content-schema.test.ts`
- Create: `tests/unit/metadata.test.ts`

**Interfaces:**
- Consumes: canonical origin `https://corsaircovewiki.com`.
- Produces: `PUBLIC_ROUTES`, `PublicRoute`, `GuideMetadata`, `GuideSource`, `guideMetadataSchema`, `homeContentSchema`, and `createPageMetadata()`.

- [ ] **Step 1: Write failing route and schema tests**

```ts
expect(PUBLIC_ROUTES).toEqual([
  '/',
  '/guides/',
  '/tips/',
  '/how-to-get-more-drifters/',
  '/how-to-build-ship/',
  '/connect-high-buildings/',
])

expect(() => guideMetadataSchema.parse({ ...validGuide, href: '/mods/' }))
  .toThrow()
expect(createPageMetadata('/tips/', validGuide.title, validGuide.description)
  .alternates?.canonical).toBe('https://corsaircovewiki.com/tips/')
```

- [ ] **Step 2: Run tests and verify the missing-module failure**

Run `npm test -- tests/unit/routes.test.ts tests/unit/content-schema.test.ts tests/unit/metadata.test.ts`.

Expected: FAIL because the three implementation modules do not exist.

- [ ] **Step 3: Implement route and metadata types**

```ts
export const PUBLIC_ROUTES = [
  '/', '/guides/', '/tips/', '/how-to-get-more-drifters/',
  '/how-to-build-ship/', '/connect-high-buildings/',
] as const

export type PublicRoute = (typeof PUBLIC_ROUTES)[number]
export type GuideRoute = Exclude<PublicRoute, '/' | '/guides/'>
```

`GuideMetadata` must contain `slug`, `href`, `title`, `description`, `primaryKeyword`, `category`, `directAnswer`, `verifiedOn`, `applicableVersion`, `toc`, `sources`, and `related`. Zod must require HTTPS source URLs, ISO date `2026-08-08`, at least one H2 TOC entry, at least two sources, and a guide route from the four-item guide allowlist.

`createPageMetadata(route, title, description)` returns Next.js `Metadata` with title, description, canonical, and Open Graph URL/title/description/type `article` for guides and `website` for `/` and `/guides/`.

- [ ] **Step 4: Add the English interface boundary**

Create `src/i18n/en.json` with keys for `siteName`, `nav.home`, `nav.guides`, `article.verified`, `article.version`, `article.contents`, `article.sources`, `article.related`, `theme.light`, `theme.dark`, and `mobileMenu.open/close`. Do not add other-language files.

- [ ] **Step 5: Run focused and full tests**

Run `npm test -- tests/unit/routes.test.ts tests/unit/content-schema.test.ts tests/unit/metadata.test.ts`, then `npm test`.

Expected: PASS.

- [ ] **Step 6: Record the deferred checkpoint**

Deferred commit message: `feat: define published content contracts`.

---

### Task 3: Build the Accessible Site Frame and Visual Tokens

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/components/site/theme-provider.tsx`
- Create: `src/components/site/theme-toggle.tsx`
- Create: `src/components/site/mobile-nav.tsx`
- Create: `src/components/site/site-header.tsx`
- Create: `src/components/site/site-footer.tsx`
- Create: `src/components/site/page-shell.tsx`
- Create: `tests/unit/site-frame.test.tsx`

**Interfaces:**
- Consumes: `PublicRoute` and English interface strings.
- Produces: `ThemeProvider`, `ThemeToggle`, `MobileNav`, `SiteHeader`, `SiteFooter`, and `PageShell`.

- [ ] **Step 1: Write failing accessibility-focused component tests**

```tsx
render(<SiteHeader />)
expect(screen.getByRole('link', { name: 'Corsair Cove Wiki' }).getAttribute('href')).toBe('/')
expect(screen.getByRole('link', { name: 'Guides' }).getAttribute('href')).toBe('/guides/')
expect(screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')).toBe('false')

render(<SiteFooter />)
expect(screen.queryByRole('link', { name: 'Privacy Policy' })).toBeNull()
expect(screen.queryByRole('link', { name: 'Terms of Service' })).toBeNull()
```

- [ ] **Step 2: Run the test and verify it fails**

Run `npm test -- tests/unit/site-frame.test.tsx`.

Expected: FAIL because the site-frame components are absent.

- [ ] **Step 3: Implement the frame with two client-only islands**

`ThemeProvider`, `ThemeToggle`, and `MobileNav` may use `'use client'`. `SiteHeader`, `SiteFooter`, and `PageShell` remain Server Components. Header navigation exposes only `/` and `/guides/`; footer exposes the approved Steam, Microsoft Store, official Wiki, Discord, YouTube, and developer HTTPS URLs, followed by the unofficial-site disclaimer.

- [ ] **Step 4: Implement design tokens and responsive safety**

Define CSS custom properties for the documented light/dark HSL values and use Tailwind v4 `@theme inline` aliases. Include visible `:focus-visible` rings, `overflow-wrap:anywhere` for article URLs, contained horizontal table scrolling, `prefers-reduced-motion`, and a readable article width. Gold is restricted to CTAs; red is restricted to callouts.

- [ ] **Step 5: Run tests, lint, and build**

Run `npm test -- tests/unit/site-frame.test.tsx`, `npm run lint`, and `npm run build`.

Expected: PASS; build output contains only the current root route at this stage.

- [ ] **Step 6: Record the deferred checkpoint**

Deferred commit message: `feat: add responsive site frame`.

---

### Task 4: Validate the Clean Home Configuration and Build the Home Page

**Files:**
- Create: `src/content/homepage-content.json`
- Modify: `src/lib/content-schema.ts`
- Create: `src/lib/home-content.ts`
- Create: `src/components/site/hero.tsx`
- Create: `src/components/site/stats-strip.tsx`
- Create: `src/components/site/guide-card.tsx`
- Modify: `src/app/page.tsx`
- Create: `tests/unit/home-content.test.ts`
- Create: `tests/unit/home-page.test.tsx`

**Interfaces:**
- Consumes: source copy `docs/research/homepage-content.json`, `homeContentSchema`, and published guide routes.
- Produces: `homeContent`, `Hero`, `StatsStrip`, `GuideCard`, and complete `/` page metadata/markup.

- [ ] **Step 1: Write failing configuration tests**

Tests must assert:

```ts
expect(homeContent.home.hero.stats).toEqual([
  'Released Jul 31, 2026', '50+ Goods',
  '4 Principle Paths', '62 Steam Achievements',
])
expect(allInternalLinks(homeContent).sort()).toEqual([
  '/connect-high-buildings/', '/guides/', '/how-to-build-ship/',
  '/how-to-get-more-drifters/', '/tips/',
])
expect(JSON.stringify(homeContent)).not.toMatch(/\/platforms\/|\/privacy\/|\/terms\//)
```

The home description must not claim currently unpublished price, platform, system-requirement, or troubleshooting coverage.

- [ ] **Step 2: Run the test and verify it fails**

Run `npm test -- tests/unit/home-content.test.ts tests/unit/home-page.test.tsx`.

Expected: FAIL because the clean runtime configuration and page components are absent.

- [ ] **Step 3: Create the cleaned runtime JSON**

Copy the approved source configuration, then make only these scope corrections in the runtime copy:

- Remove `tertiaryCta` and `tertiaryCtaHref`.
- Remove `privacyPolicy`, `privacyPolicyHref`, `termsOfService`, and `termsOfServiceHref`.
- Change both metadata descriptions to: `Corsair Cove wiki with verified beginner guides for drifters, ships, Fetchers, logistics, and vertical building.`
- Change footer `about` so it lists only drifters, ships, logistics, and vertical building.
- Remove `platforms` from the metadata keywords.
- Remove `sidebarCodes`; do not replace it with a Codes feature.

Keep the four statistics, Start Here cards, stable game facts, approved external links, theme data, language priority record, and maintenance limitations unchanged.

- [ ] **Step 4: Validate on import and implement the home page**

`src/lib/home-content.ts` calls `homeContentSchema.parse(rawHomeContent)` at module load so a bad field fails tests/build. The home page renders Header → Hero → Stats → four Start Here cards → What is Corsair Cove → final CTA → Footer. It has one H1 and uses `createPageMetadata('/', ...)`.

- [ ] **Step 5: Run focused tests and production build**

Run `npm test -- tests/unit/home-content.test.ts tests/unit/home-page.test.tsx`, `npm run lint`, and `npm run build`.

Expected: PASS; rendered home links remain within the six-page allowlist.

- [ ] **Step 6: Record the deferred checkpoint**

Deferred commit message: `feat: build validated wiki homepage`.

---

### Task 5: Create the Typed Guide Registry and Guide Hub

**Files:**
- Create: `src/content/guides.ts`
- Create: `src/app/guides/page.tsx`
- Create: `src/components/site/breadcrumbs.tsx`
- Create: `tests/unit/guides-registry.test.ts`
- Create: `tests/unit/guides-page.test.tsx`

**Interfaces:**
- Consumes: `GuideMetadata`, the four-route allowlist, and the approved facts/source URLs in `docs/research/关键词素材.md`.
- Produces: `GUIDE_SLUGS`, four validated metadata constants, metadata-only `guideEntries`, `getGuideMeta(slug)`, `Breadcrumbs`, and `/guides/`.

- [ ] **Step 1: Write failing registry and hub tests**

```ts
expect(GUIDE_SLUGS).toEqual([
  'tips', 'how-to-get-more-drifters',
  'how-to-build-ship', 'connect-high-buildings',
])
expect(guideEntries.map(({ meta }) => meta.href)).not.toContain('/mods/')

render(<GuidesPage />)
expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
expect(screen.getAllByRole('link').filter(link =>
  GUIDE_SLUGS.some(slug => link.getAttribute('href') === `/${slug}/`)
)).toHaveLength(4)
```

- [ ] **Step 2: Run tests and verify they fail**

Run `npm test -- tests/unit/guides-registry.test.ts tests/unit/guides-page.test.tsx`.

Expected: FAIL because the registry and hub are absent.

- [ ] **Step 3: Implement the metadata-only registry contract**

Define a four-item `GUIDE_SLUGS` tuple and complete `tipsMeta`, `driftersMeta`, `shipMeta`, and `connectionsMeta` objects. Parse all four with Zod, reject duplicate slugs/hrefs, expose them as immutable `guideEntries` in Start Here, Population, Ships, Construction order, and implement `getGuideMeta(slug)` so an unknown slug throws `Unknown published guide: <slug>`. The registry contains metadata only; it never imports React or MDX, so the Guide Hub and unit tests stay independently buildable before the article bodies are added. Each later MDX file re-exports its matching metadata constant as `guideMeta`, preserving the required per-guide metadata interface without duplicating values.

- [ ] **Step 4: Implement the Guide Hub**

Render Breadcrumbs, one H1 (`Corsair Cove Guides`), a direct introduction, and four task groups/cards derived from the registry. Do not mention unavailable pages as clickable elements. Use title `Corsair Cove Guides – Tips, Drifters, Ships & Building` and a description limited to the four published guide subjects.

- [ ] **Step 5: Run the registry and hub suites**

Run `npm test -- tests/unit/guides-registry.test.ts tests/unit/guides-page.test.tsx`, then `npm run lint` and `npm run build`.

Expected: PASS. The Guide Hub exposes four allowed routes from validated metadata without importing not-yet-created article bodies.

- [ ] **Step 6: Record the deferred checkpoint**

Deferred commit message: `feat: add published guide registry and hub`.

---

### Task 6: Build the Article System and Beginner Tips Guide

**Files:**
- Create: `src/components/site/article-layout.tsx`
- Create: `src/components/site/article-toc.tsx`
- Create: `src/components/site/callout.tsx`
- Modify: `mdx-components.tsx`
- Create: `src/content/guides/tips.mdx`
- Create: `src/app/tips/page.tsx`
- Create: `tests/unit/article-layout.test.tsx`
- Create: `tests/unit/tips-content.test.ts`

**Interfaces:**
- Consumes: `GuideMetadata`, `createPageMetadata()`, and `getGuideMeta('tips')`.
- Produces: `ArticleLayout`, `ArticleToc`, `Callout`, `guideMeta` and default MDX content from `tips.mdx`, and `/tips/`.

- [ ] **Step 1: Write failing article/content tests**

Assert one H1, visible verification/version labels, a TOC linked to H2 IDs, at least two HTTPS sources, and absence of `OSRS`, `codes`, `trainer`, `crack`, and `torrent`. Assert the direct answer includes the four first checks: paused state, connection, free Drifters, and input/output storage.

- [ ] **Step 2: Run tests and verify they fail**

Run `npm test -- tests/unit/article-layout.test.tsx tests/unit/tips-content.test.ts`.

Expected: FAIL because layout and MDX content are absent.

- [ ] **Step 3: Implement article presentation and safe MDX mappings**

`ArticleLayout` accepts `{ meta: GuideMetadata; children: ReactNode }`. It renders Breadcrumbs, H1, direct answer, `2026-08-08`, applicable version, TOC, prose body, related-guide cards, sources, and disclaimer. `mdx-components.tsx` maps `a` to internal `next/link` links or external links with `rel="noopener noreferrer"`; tables are wrapped in a locally scrollable container.

- [ ] **Step 4: Write the evidence-bounded Tips MDX**

Re-export the registry value with `export { tipsMeta as guideMeta } from '@/content/guides'`. The registered metadata uses primary keyword `corsair cove tips`, a description focused on Fetchers/logistics, and applicable version `Full release; sources checked 2026-08-08`. Body H2 sections must be:

```mdx
## Check Why a Building Stopped
- paused state
- network connection
- available Drifters
- input shortage or full output storage

## Assign Fetchers to a Specific Source
- one Fetcher route per input relationship
- green/yellow/red route efficiency
- warehouse hubs for longer supply chains

## Protect Labor and Cohesion
- pause low-priority production to release workers
- avoid unnecessary All Hands on Deck labor
- Cohesion reaching zero ends the game

## Expand Pirate Camps Deliberately
- each camp serves residents in its own area
- prepare housing, Galley, Tavern, and logistics together

## Plan Around Piers and Consumers
- cluster related production
- support Pier material and crew-upkeep demand nearby
```

Use only the four source URLs listed in the Tips section of `docs/research/关键词素材.md`.

- [ ] **Step 5: Implement the explicit route and verify**

`src/app/tips/page.tsx` imports `TipsContent` and `guideMeta`, exports metadata via `createPageMetadata`, and renders `ArticleLayout`. The content test asserts that the MDX `guideMeta` export is the same object returned by `getGuideMeta('tips')`. Run the two focused tests, then `npm run lint` and `npm run build`.

Expected: PASS; `/tips/` builds and no production fallback or absent MDX import is present.

- [ ] **Step 6: Record the deferred checkpoint**

Deferred commit message: `feat: add beginner tips guide`.

---

### Task 7: Add the Get More Drifters Guide

**Files:**
- Create: `src/content/guides/how-to-get-more-drifters.mdx`
- Create: `src/app/how-to-get-more-drifters/page.tsx`
- Create: `tests/unit/drifters-content.test.ts`

**Interfaces:**
- Consumes: `ArticleLayout`, `GuideMetadata`, and the published guide registry.
- Produces: `guideMeta`, default Drifters MDX content, and `/how-to-get-more-drifters/`.

- [ ] **Step 1: Write the failing guide test**

Require keyword `corsair cove how to get more drifters`, direct answer stating that population does not simply grow naturally, ISO verification date, four approved sources, and the distinction between Drifters and Swabbies.

- [ ] **Step 2: Run the test and verify it fails**

Run `npm test -- tests/unit/drifters-content.test.ts`.

Expected: FAIL because the MDX module is absent.

- [ ] **Step 3: Write the guide metadata export and body**

Start with `export { driftersMeta as guideMeta } from '@/content/guides'`. Use these H2 sections and facts:

```mdx
## Get Drifters from Events
- immigration encounters and Drifter/Prisoner Ship events are core sources

## Release Existing Workers
- Drifters fill open jobs automatically
- pausing production releases labor immediately

## Move Population Between Camps
- players cannot drag Drifters between camps
- beds plus jobs attract migration to a new camp

## Use the Notoriety Path
- Statue increases recruits per event
- Rising Sun unlocks at 7 Notoriety and exchanges Coins for Drifters

## Do Not Confuse Drifters with Swabbies
- Swabbies are baseline ship crew with Stew and Booze upkeep
```

Sources are the FAQ, Pirates Wiki, Buildings Wiki, and official Beginner’s Guide URLs from the matching research section. Mark Rising Sun as a single official-source detail rather than cross-source consensus.

- [ ] **Step 4: Implement the route and run verification**

Create the explicit route using the same ArticleLayout contract as Tips. Run `npm test -- tests/unit/drifters-content.test.ts` and `npm run lint`.

Expected: PASS.

- [ ] **Step 5: Record the deferred checkpoint**

Deferred commit message: `feat: add Drifter population guide`.

---

### Task 8: Add the Shipbuilding Guide

**Files:**
- Create: `src/content/guides/how-to-build-ship.mdx`
- Create: `src/app/how-to-build-ship/page.tsx`
- Create: `tests/unit/ship-content.test.ts`

**Interfaces:**
- Consumes: `ArticleLayout`, `GuideMetadata`, and the guide registry.
- Produces: `guideMeta`, default shipbuilding MDX content, and `/how-to-build-ship/`.

- [ ] **Step 1: Write the failing content test**

Assert the diagnostic order is exactly unlock → pier → connection → resources → crew, every numeric claim carries the verification date context, and the source list contains Ships, Buildings, Compass, and the official Beginner’s Guide.

- [ ] **Step 2: Run the test and verify it fails**

Run `npm test -- tests/unit/ship-content.test.ts`.

Expected: FAIL because the guide is absent.

- [ ] **Step 3: Write the evidence-bounded ship guide**

Start with `export { shipMeta as guideMeta } from '@/content/guides'`. Use these H2 sections:

```mdx
## Unlock the Ship and Pier
- Compass Principle Points unlock new ship classes and related buildings
- the Landlubber starts with the Shallow Pier path

## Build and Connect the Correct Pier
- Shallow Pier belongs on a Pier Slot
- the pier must connect to the road or rope-bridge network

## Supply the Listed Materials
- Landlubber: 15 Planks plus Swabbies
- Shallow Pier: 30 Planks
- do not generalize one cost to every ship tier

## Check Crew Availability
- crew is distinct from free settlement labor
- Patch #2 corrected a displayed crew-upkeep number; do not repeat the old display

## Diagnose a Disabled Build Button
1. unlock
2. matching pier
3. network connection
4. exact resources
5. required crew
```

The article may state the source-checked count of 29 ships and the documented Tier 2 examples only with the verification date and official Ships table link. It must warn that ship values can change by version.

- [ ] **Step 4: Implement the route and run verification**

Run `npm test -- tests/unit/ship-content.test.ts` and `npm run lint`.

Expected: PASS.

- [ ] **Step 5: Record the deferred checkpoint**

Deferred commit message: `feat: add shipbuilding guide`.

---

### Task 9: Add the High-Building Connection Guide and Verify the Complete Set

**Files:**
- Create: `src/content/guides/connect-high-buildings.mdx`
- Create: `src/app/connect-high-buildings/page.tsx`
- Create: `tests/unit/connections-content.test.ts`
- Modify: `tests/unit/guides-registry.test.ts`
- Modify: `tests/unit/guides-page.test.tsx`

**Interfaces:**
- Consumes: `ArticleLayout`, `connectionsMeta`, and the existing four-entry metadata registry.
- Produces: `guideMeta`, default connection MDX content, `/connect-high-buildings/`, and a complete registry-to-route consistency check.

- [ ] **Step 1: Write the failing connection guide test**

Require the direct answer to reject a fabricated tower-only mechanic and identify green connection arrows, Roads, Rope Bridges, Cliff Paths, and Ladders. Require both approved sources and an evidence limitation about future screenshots.

- [ ] **Step 2: Run the test and verify it fails**

Run `npm test -- tests/unit/connections-content.test.ts`.

Expected: FAIL because the guide is absent.

- [ ] **Step 3: Write the connection guide**

Start with `export { connectionsMeta as guideMeta } from '@/content/guides'`.

```mdx
## Find the Building Connection Node
- select the building and locate its green connection arrow
- automatic connection can fail on steep terrain

## Choose the Correct Connection Piece
- Road for ordinary ground
- Rope Bridge for water or gaps
- Cliff Path or Ladder for vertical cliff faces

## Wait for Construction to Finish
- an unconnected building cannot begin construction or operation

## Diagnose a Slow Route
- green/yellow/red route colors indicate transport efficiency
- distinguish a complete but inefficient route from a broken route

## Evidence Limit
- no approved gameplay screenshot exists yet
- current full-release UI evidence overrides future textual mismatch
```

- [ ] **Step 4: Verify registry-to-file consistency**

For every `GUIDE_SLUGS` entry, assert that `src/content/guides/<slug>.mdx` and `src/app/<slug>/page.tsx` exist, the MDX re-exports the matching metadata constant, and every related slug resolves through `getGuideMeta()`. Do not make the registry import React components.

- [ ] **Step 5: Run the formerly red registry and hub suites**

Run:

```powershell
npm test -- tests/unit/connections-content.test.ts tests/unit/guides-registry.test.ts tests/unit/guides-page.test.tsx
npm test
npm run lint
npm run build
```

Expected: all PASS; production build lists all six public routes.

- [ ] **Step 6: Record the deferred checkpoint**

Deferred commit message: `feat: complete verified starter guide set`.

---

### Task 10: Add SEO Files, 404 Handling, and Production Safety Scans

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/not-found.tsx`
- Create: `tests/unit/seo.test.ts`
- Create: `tests/unit/content-safety.test.ts`
- Create: `tests/unit/internal-links.test.ts`

**Interfaces:**
- Consumes: `PUBLIC_ROUTES`, guide registry, home content, and raw MDX files.
- Produces: six-entry sitemap, production robots policy, custom 404, and build-blocking safety suite.

- [ ] **Step 1: Write failing SEO/link/safety tests**

```ts
expect((await sitemap()).map(item => item.url)).toEqual(
  PUBLIC_ROUTES.map(route => new URL(route, 'https://corsaircovewiki.com').href)
)
expect((await robots()).sitemap).toBe('https://corsaircovewiki.com/sitemap.xml')
expect(discoveredInternalLinks.sort()).toEqual(
  discoveredInternalLinks.filter(link => PUBLIC_ROUTES.includes(link as PublicRoute)).sort()
)
```

Scan runtime JSON, TSX, and MDX—not `docs/research/`—for `/platforms/`, `/privacy/`, `/terms/`, `/mods/`, `/golden-city-maze/`, `/tobacco/`, `/rope/`, `OSRS`, `second pirate camp`, `cheat engine`, `crack`, `torrent`, and fabricated Codes headings. Add targeted patterns for `$`/`USD`/discount/review-percentage claims in visible site content.

- [ ] **Step 2: Run tests and verify they fail**

Run `npm test -- tests/unit/seo.test.ts tests/unit/content-safety.test.ts tests/unit/internal-links.test.ts`.

Expected: FAIL until metadata routes and scanners exist; if the scanner finds research-only terms, correct its runtime-only file scope instead of deleting audit evidence.

- [ ] **Step 3: Implement sitemap, robots, and 404**

Sitemap returns exactly six `MetadataRoute.Sitemap` entries, each based on the canonical origin and without invented change dates. Robots allows `/`, points to the production sitemap, and does not mention unpublished routes. The 404 uses the site frame, a single H1, and links only to `/` and `/guides/`.

- [ ] **Step 4: Implement internal-link and content-safety utilities in tests**

Normalize internal paths to trailing-slash form before comparison. Ignore hash fragments and approved HTTPS external URLs. On failure, report the exact file and matched string so the author can correct the source rather than weaken the test.

- [ ] **Step 5: Run all automated checks**

Run `npm test`, `npm run lint`, and `npm run build`.

Expected: PASS; build produces the six routes plus framework metadata endpoints and the custom 404 behavior.

- [ ] **Step 6: Record the deferred checkpoint**

Deferred commit message: `feat: enforce SEO and content safety`.

---

### Task 11: Add Production-Like Browser Verification and Documentation

**Files:**
- Create: `tests/e2e/site.spec.ts`
- Create: `tests/e2e/helpers.ts`
- Modify: `playwright.config.ts`
- Create: `artifacts/screenshots/.gitkeep`
- Create: `README.md`

**Interfaces:**
- Consumes: six built pages and Chromium.
- Produces: repeatable browser assertions, three required screenshot artifacts, and operator documentation.

- [ ] **Step 1: Write failing six-route E2E tests**

For every route in `PUBLIC_ROUTES`, assert HTTP 200, exactly one H1, nonempty title/description/canonical, no failed same-origin requests, no console errors, no broken images, and `document.documentElement.scrollWidth <= window.innerWidth`.

Add user-flow tests:

```ts
await page.goto('/')
await page.getByRole('link', { name: 'Beginner Tips' }).first().click()
await expect(page).toHaveURL(/\/tips\/$/)
await expect(page.getByRole('heading', { level: 1 })).toContainText('Tips')

await page.goto('/guides/')
for (const name of ['Beginner Tips', 'Get More Drifters', 'Build Your First Ship', 'Connect High Buildings']) {
  await expect(page.getByRole('link', { name })).toBeVisible()
}
```

Verify the mobile menu at `390 × 844`, theme toggle keyboard operation, table containment, and custom 404 for `/not-a-published-page/`.

- [ ] **Step 2: Run E2E and verify any real failures**

Run `npx playwright install chromium`, then `npm run test:e2e`.

Expected before final fixes: tests expose any missing selectors, overflow, metadata, navigation, or browser errors. Fix production code; do not relax assertions that express the approved design.

- [ ] **Step 3: Save the required screenshots**

At desktop `1440 × 900` and mobile `390 × 844`, capture the home page, Guide Hub, and `/tips/` to deterministic paths under `artifacts/screenshots/`. Disable animations and wait for `document.fonts.ready` before capture.

- [ ] **Step 4: Write the operator README**

Document:

- Node.js `>=20.9.0` and `npm install`.
- `npm run dev`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:e2e`.
- The exact six-page scope and canonical origin.
- `docs/research/` as audit material and `src/content/` as runtime input.
- The source-priority order from the design spec.
- How to add a guide: verify green status, add MDX metadata/body, add explicit route, register it, update allowed routes, tests, sitemap, and links in one reviewed change.
- A warning that Git initialization, GitHub, Vercel, and Cloudflare are later authorized stages.

- [ ] **Step 5: Run the complete local acceptance sequence**

Run:

```powershell
npm run lint
npm test
npm run build
npm run test:e2e
```

Expected: all commands exit `0`; six routes pass in Chromium at both target viewports; screenshots exist for home, Guide Hub, and Tips; no runtime reads refer to `E:\Obsidian\scys\热词游戏站`.

- [ ] **Step 6: Record the deferred checkpoint**

Deferred commit message: `test: complete MVP browser acceptance`.

---

## Post-Plan Authorization Gates

These stages are intentionally not implementation tasks in this plan:

1. Initialize Git and reconstruct the recorded task checkpoints, or create one reviewed initial commit if the user prefers a single baseline.
2. Create or connect the user-selected GitHub repository and push.
3. Deploy to Vercel and verify the assigned deployment URL.
4. Configure Cloudflare DNS only with values supplied by Vercel.

Each stage changes external or repository state and requires separate user authorization.
