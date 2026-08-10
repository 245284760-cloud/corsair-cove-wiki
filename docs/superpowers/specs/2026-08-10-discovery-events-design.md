# Discovery Events Guide Design

## Scope

Add one evidence-bounded English guide at `/discovery-events/` for the Corsair Cove MVP extension. The page answers what a Discovery Event is and how a player reaches one, using only the approved research copied under `docs/research` and the four approved sources listed below.

This change does not add an event database, interactive event simulator, new API, screenshots, video-derived claims, fixed reward tables, or step-by-step answers for individual event choices. Golden City Maze remains a separate red-light topic and is not published by this change.

## Evidence boundary

The guide may use these approved sources:

1. Official Wiki — Seven Seas: `https://wiki.hoodedhorse.com/Corsair_Cove/Seven_Seas`
2. Official Wiki — Events: `https://wiki.hoodedhorse.com/Corsair_Cove/Events`
3. Official Wiki — Quests: `https://wiki.hoodedhorse.com/Corsair_Cove/Quests`
4. Hooded Horse Beginner's Guide: `https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251`

The page may state that fog-covered sea regions can be explored from Discovery Points; discovery can start or expose an area's quest/event flow; events are turn-based and provide objectives plus suggested ship Tier/Class; one ship enters an event at a time; and ship Health/Crew must be monitored. It must distinguish Discovery Point, an area's quest line, and an individual Event. It must not assert a fixed event reward, a universal choice outcome, or a complete Golden City route.

## Content contract

Registry metadata will use:

- `slug`: `discovery-events`
- `href`: `/discovery-events/`
- `title`: an English title targeting `corsair cove what is a discovery event`
- `category`: `Events`; extend the registry category vocabulary and let the existing Guide Hub render the new group from registry data
- `primaryKeyword`: `corsair cove what is a discovery event`
- `verifiedOn`: `2026-08-08`
- `applicableVersion`: `Full release; sources checked 2026-08-08`
- 4–5 H2 entries covering: what the terms mean, how to reach a Discovery Point, how to prepare a ship, what to monitor during the event, and the evidence limit
- at least two HTTPS sources, preserving the exact approved URLs
- related links limited to published internal routes, including `/tips/`, `/how-to-get-more-drifters/`, `/how-to-build-ship/`, and `/connect-high-buildings/`

The direct answer must explicitly say that a Discovery Point, quest line, and Event are related but not interchangeable, and that the guide does not provide fixed answers for individual event choices.

## Architecture and data flow

1. Add `src/content/guides/discovery-events.mdx` with the guide body and metadata re-export pattern used by current guides.
2. Add `discoveryEventsMeta` to `src/content/guides/index.ts`, extend `GUIDE_SLUGS`, and append the entry to `guideEntries`.
3. Add `/discovery-events/` to the published route allowlist and create its explicit App Router page using the shared ArticleLayout.
4. Let the existing Guide Hub derive its card and group data from the registry; do not hard-code a second guide list.
5. Extend sitemap, metadata, route, content-safety, link, and page tests only where the new published route requires it.
6. Keep runtime behavior static and local. No filesystem reads outside the repository, network calls, CMS, database, or runtime content fetches are allowed.

## UX and accessibility

Use the existing frame, typography, light/dark theme tokens, breadcrumbs, article TOC, callouts, source list, and related-guide links. The page must have exactly one H1, ordered H2 headings matching the registry TOC, keyboard-visible focus states, readable tables or lists without horizontal overflow, and the same desktop/mobile behavior as existing guides.

## Testing and acceptance

Test-first sequence:

1. Add failing registry/content tests for the new slug, exact route, direct-answer boundaries, approved sources, TOC order, and related-link allowlist.
2. Add a failing page/render test requiring the route to use the shared ArticleLayout and expose one H1, the ordered H2s, sources, and related links.
3. Implement the registry, page, and MDX content until focused tests pass.
4. Run the full unit suite, lint, production build, and Playwright acceptance suite. Confirm `/discovery-events/` is statically generated, appears in the Guide Hub and sitemap, has no unsafe links, and renders without console/request errors at desktop and mobile sizes.

## Out of scope and deferred risks

- Individual event decision walkthroughs and reward guarantees remain deferred until reproducible evidence exists.
- Golden City Maze remains unpublished because available sources conflict on route/ring classification and do not provide a reliable step-by-step path.
- No changes to Cloudflare, Vercel, GitHub, domain records, or unrelated existing guides are part of this content task.
