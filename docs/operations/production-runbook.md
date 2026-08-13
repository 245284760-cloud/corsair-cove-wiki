# Production Runbook

## Production inventory

- Canonical origin: `https://corsaircovewiki.com`
- Application hosting: Vercel
- DNS and edge: Cloudflare
- Source repository: GitHub `245284760-cloud/corsair-cove-wiki`
- Analytics: GA4 measurement ID `G-YSGBPS7G81`
- Advertising: Adsterra native banner on guide articles

## Severity

- SEV-1: domain unavailable, DNS/SSL failure, or all public pages return 5xx.
- SEV-2: one critical route fails, deployment is broken, analytics disappears site-wide, or layout prevents reading guides.
- SEV-3: stale claim, broken external source, minor visual regression, or non-critical dependency warning.

## Response targets

- SEV-1: acknowledge within 10 minutes; restore or roll back within 30 minutes.
- SEV-2: acknowledge within 4 hours; fix or roll back within one business day.
- SEV-3: triage in the weekly maintenance review.

## Incident response

1. Confirm from a second network with `/`, `/guides/`, `/robots.txt`, and `/sitemap.xml`.
2. Check GitHub Actions and the latest Vercel production deployment.
3. If the latest deployment caused the incident, promote the previous known-good Vercel deployment.
4. If DNS or SSL is responsible, inspect Cloudflare without deleting working records.
5. Re-run `npm run smoke:production` after recovery.
6. Record start time, cause, affected routes, recovery action, and prevention follow-up.

## Release checklist

1. Confirm every changed factual claim has a current HTTPS source.
2. Run `npm run lint -- --max-warnings=0`, `npm test`, `npm run build`, and `npm run test:e2e`.
3. Inspect the Vercel Preview at desktop and 390 × 844 mobile width.
4. Merge only after required GitHub checks pass.
5. Confirm the production canonical URL, GA script, sitemap, and security headers.
6. Run `npm run smoke:production`.

## Rollback

Use Vercel's previous production deployment promotion for code regressions. Reverting the Git commit is the permanent follow-up; do not rewrite `main` history.
