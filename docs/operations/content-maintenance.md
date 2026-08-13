# Content Maintenance

## Source priority

1. Official game announcements and patch notes.
2. Developer or publisher statements.
3. Hooded Horse official community wiki revision history.
4. Official Steam guides and developer-marked discussion answers.
5. Independent reporting only when the primary source does not cover the claim.

## Review cadence

- 7 days: updates, troubleshooting, platforms, price, system requirements.
- 14 days: ships, resources, production chains, exploration, discovery events.
- 30 days: stable mechanics and resource-specific guides.

## Weekly review

1. Run `npm run content:freshness`.
2. Check official announcements, Steam pinned discussions, and relevant official-wiki revisions.
3. Open Search Console Performance and compare the latest 28 days with the previous 28 days.
4. Refresh stale pages only after reopening their cited sources.
5. Update `verifiedOn` and `applicableVersion` in the same commit as factual edits.
6. Update `/updates/` when a patch changes player-visible behavior.

## New-page gate

A new page requires either a recurring Search Console query not answered by an existing page or a complete official evidence set. Prefer updating or expanding an existing page when search intent overlaps. Review a new page after six to eight weeks; merge, rewrite, or retire it if it has no meaningful impressions and no navigation value.

## Prohibited shortcuts

- Do not change only `verifiedOn` without reopening sources.
- Do not publish fixed event outcomes, hidden values, platform rumors, or unsupported patch claims.
- Do not copy official-wiki text; synthesize facts and cite the source.
- Do not create multiple pages targeting the same search intent.
