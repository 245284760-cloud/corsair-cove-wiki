# Corsair Cove Wiki

An independent, English-language Corsair Cove strategy wiki. Its canonical production origin is `https://corsaircovewiki.com`.

## Requirements and local commands

Use Node.js `^20.19.0 || ^22.13.0 || >=24.0.0` and npm. This range exactly matches the installed `jsdom` 29.0.1 runtime contract and is stricter than the current `@playwright/test` 1.62.1 requirement.

```powershell
npm install
npm run dev
npm run lint
npm test
npm run build
npm run test:e2e
```

`npm run dev` starts the local development server. The E2E command uses Chromium; on a new machine run `npx playwright install chromium` once before it. The E2E suite always runs `npm run build && npm run start` itself and refuses to reuse an arbitrary process on port 3000, then checks both 1440 x 900 and 390 x 844 viewports and writes deterministic screenshots to `artifacts/screenshots/`.

## Published MVP scope

Only these seven public pages are in scope:

- `/`
- `/guides/`
- `/tips/`
- `/how-to-get-more-drifters/`
- `/how-to-build-ship/`
- `/connect-high-buildings/`
- `/discovery-events/`

The site is intentionally not a live reader of the research archive. `docs/research/` is an audit trail used to substantiate content; `src/content/` is the validated runtime input bundled with the site.

The source-of-truth priority is:

1. `素材缺口.md` prohibitions and conflicts.
2. `关卡3-资料源总表.md` page status.
3. `homepage-development-audit.json` sources, dates, and limitations.
4. Relevant sections of `关键词素材.md` and `首页素材.md`.
5. `homepage-content.json` display configuration.
6. `页面矩阵规划.md` and `keywords.json` search intent.
7. `网站开发资料总交接.md` summaries.

## Adding a guide

Start from a green local checkout. In one reviewed change, add the guide MDX metadata and body under `src/content/guides/`, create its explicit route page, register it in the guide registry, add the route to the allowed public routes, and update the route, content, sitemap, navigation/link, and E2E tests. Then run lint, unit tests, build, and browser acceptance again. Do not publish claims beyond the evidence hierarchy above.

## Authorization boundary

This repository intentionally stops before external delivery. Git initialization/checkpoint reconstruction, GitHub repository connection or push, Vercel deployment, and Cloudflare DNS configuration are later stages that require separate authorization. Cloudflare values must come from the Vercel deployment selected by the user.
