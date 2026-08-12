import { guideMetadataSchema, type GuideMetadata } from '@/lib/content-schema'
import { priceMeta as parsedPriceMeta } from '@/content/guides/price-meta'

export const GUIDE_SLUGS = [
  'tips',
  'how-to-get-more-drifters',
  'how-to-build-ship',
  'connect-high-buildings',
  'discovery-events',
  'platforms',
  'release-date',
  'price',
  'system-requirements',
  'troubleshooting',
  'resources',
  'production-chains',
  'ships',
  'exploration',
  'updates',
  'tobacco',
  'rope',
] as const

export type GuideSlug = (typeof GUIDE_SLUGS)[number]
export type DeepReadonly<T> = T extends readonly (infer Item)[]
  ? readonly DeepReadonly<Item>[]
  : T extends object
    ? { readonly [Key in keyof T]: DeepReadonly<T[Key]> }
    : T
export type ReadonlyGuideMetadata = DeepReadonly<GuideMetadata>
export type GuideGroup = GuideMetadata['category']

const parsedTipsMeta = guideMetadataSchema.parse({
  slug: 'tips',
  href: '/tips/',
  title: 'Corsair Cove Tips for Fetchers, Routes, and Early Settlements',
  description: 'Beginner Corsair Cove tips for checking stalled production, assigning Fetchers, and planning efficient early routes.',
  primaryKeyword: 'corsair cove tips',
  category: 'Start Here',
  directAnswer: 'For a stopped building, check its paused state, network connection, free Drifters, and input and output storage before changing anything. Each input relationship needs its own Fetcher.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'Full release; sources checked 2026-08-08',
  toc: [
    { id: 'check-why-a-building-stopped', label: 'Check Why a Building Stopped', level: 2 },
    { id: 'assign-fetchers-to-a-specific-source', label: 'Assign Fetchers to a Specific Source', level: 2 },
    { id: 'protect-labor-and-cohesion', label: 'Protect Labor and Cohesion', level: 2 },
    { id: 'expand-pirate-camps-deliberately', label: 'Expand Pirate Camps Deliberately', level: 2 },
    { id: 'plan-around-piers-and-consumers', label: 'Plan Around Piers and Consumers', level: 2 },
  ],
  sources: [
    { label: "Hooded Horse Beginner's Guide", url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251' },
    { label: 'Official Wiki — Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
    { label: 'Official Wiki — Pirates', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Pirates' },
    { label: 'Ultimate Production Guide', url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3774343866' },
  ],
  related: ['/how-to-get-more-drifters/', '/how-to-build-ship/', '/connect-high-buildings/'],
})

const parsedDriftersMeta = guideMetadataSchema.parse({
  slug: 'how-to-get-more-drifters',
  href: '/how-to-get-more-drifters/',
  title: 'How to Get More Drifters in Corsair Cove',
  description: 'Learn how Corsair Cove Drifters are gained, freed from jobs, and attracted to a new Pirate Camp.',
  primaryKeyword: 'corsair cove how to get more drifters',
  category: 'Population',
  directAnswer: 'Corsair Cove population does not simply grow naturally. Drifters come primarily from immigration and sea events such as Drifter or Prisoner Ships. Pause buildings to free assigned workers, and attract migration to a new Pirate Camp with beds and jobs.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'v1.1.2.241844',
  toc: [
    { id: 'get-drifters-from-events', label: 'Get Drifters from Events', level: 2 },
    { id: 'release-existing-workers', label: 'Release Existing Workers', level: 2 },
    { id: 'move-population-between-camps', label: 'Move Population Between Camps', level: 2 },
    { id: 'use-the-notoriety-path', label: 'Use the Notoriety Path', level: 2 },
    { id: 'do-not-confuse-drifters-with-swabbies', label: 'Do Not Confuse Drifters with Swabbies', level: 2 },
  ],
  sources: [
    { label: 'Corsair Cove FAQ', url: 'https://steamcommunity.com/app/1368140/discussions/0/659359849665365626/' },
    { label: 'Official Wiki — Pirates', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Pirates' },
    { label: 'Official Wiki — Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
    { label: "Hooded Horse Beginner's Guide", url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251' },
  ],
  related: ['/tips/', '/how-to-build-ship/', '/connect-high-buildings/'],
})

const parsedShipMeta = guideMetadataSchema.parse({
  slug: 'how-to-build-ship',
  href: '/how-to-build-ship/',
  title: 'How to Build a Ship in Corsair Cove',
  description: 'Build Corsair Cove ships by checking Compass unlocks, matching Piers, connections, materials, and Crew.',
  primaryKeyword: 'corsair cove how to build ship',
  category: 'Ships',
  directAnswer: 'To build a ship, unlock its class through the Compass, use the matching Pier, connect that Pier to the network, then meet the ship’s listed material and Crew requirements.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'v1.1.2.241844',
  toc: [
    { id: 'unlock-the-ship-and-pier', label: 'Unlock the Ship and Pier', level: 2 },
    { id: 'build-and-connect-the-correct-pier', label: 'Build and Connect the Correct Pier', level: 2 },
    { id: 'supply-the-listed-materials', label: 'Supply the Listed Materials', level: 2 },
    { id: 'check-crew-availability', label: 'Check Crew Availability', level: 2 },
    { id: 'diagnose-a-disabled-build-button', label: 'Diagnose a Disabled Build Button', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki — Ships', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Ships' },
    { label: 'Official Wiki — Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
    { label: 'Official Wiki - Compass', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Compass' },
    { label: "Hooded Horse Beginner's Guide", url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251' },
  ],
  related: ['/tips/', '/how-to-get-more-drifters/', '/connect-high-buildings/'],
})

const parsedConnectionsMeta = guideMetadataSchema.parse({
  slug: 'connect-high-buildings',
  href: '/connect-high-buildings/',
  title: 'How to Connect High Buildings in Corsair Cove',
  description: 'Connect high Corsair Cove buildings with Roads, Rope Bridges, Cliff Paths, and Ladders.',
  primaryKeyword: 'corsair cove how to connect high buildings to tower',
  category: 'Construction',
  directAnswer: 'This is not a tower-only mechanic: only certain key connection hubs show green connection arrows and need a route to the network; some buildings do not require a connection. At an eligible hub, use Roads, Rope Bridges, Cliff Paths, or Ladders to complete its required route before construction or operation.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'v1.1.2.241844',
  toc: [
    { id: 'find-the-building-connection-node', label: 'Find the Building Connection Node', level: 2 },
    { id: 'choose-the-correct-connection-piece', label: 'Choose the Correct Connection Piece', level: 2 },
    { id: 'wait-for-construction-to-finish', label: 'Wait for Construction to Finish', level: 2 },
    { id: 'diagnose-a-slow-route', label: 'Diagnose a Slow Route', level: 2 },
    { id: 'evidence-limit', label: 'Evidence Limit', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki — Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
    { label: "Hooded Horse Beginner's Guide", url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251' },
  ],
  related: ['/tips/', '/how-to-get-more-drifters/', '/how-to-build-ship/'],
})

const parsedDiscoveryEventsMeta = guideMetadataSchema.parse({
  slug: 'discovery-events',
  href: '/discovery-events/',
  title: 'What Is a Discovery Event in Corsair Cove?',
  description: 'Learn how Corsair Cove Discovery Points, quest lines, and Events connect, how to reach them, and what to monitor aboard your ship.',
  primaryKeyword: 'corsair cove what is a discovery event',
  category: 'Events',
  directAnswer: 'A Discovery Point, quest line, and Event are related but not interchangeable. A Discovery Point lets a ship explore a fog-covered region, which can start or expose that area\u2019s quest and event flow. This guide does not provide fixed answers for individual event choices.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'Full release; sources checked 2026-08-08',
  toc: [
    { id: 'what-discovery-points-quest-lines-and-events-mean', label: 'What Discovery Points, Quest Lines, and Events Mean', level: 2 },
    { id: 'reach-a-discovery-point-through-the-fog', label: 'Reach a Discovery Point Through the Fog', level: 2 },
    { id: 'prepare-a-ship-for-the-event', label: 'Prepare a Ship for the Event', level: 2 },
    { id: 'monitor-health-crew-and-objectives', label: 'Monitor Health, Crew, and Objectives', level: 2 },
    { id: 'evidence-limit-do-not-guess-event-choices', label: 'Evidence Limit: Do Not Guess Event Choices', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki \u2014 Seven Seas', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Seven_Seas' },
    { label: 'Official Wiki \u2014 Events', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Events' },
    { label: 'Official Wiki \u2014 Quests', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Quests' },
    { label: "Hooded Horse Beginner's Guide", url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251' },
  ],
  related: ['/tips/', '/how-to-get-more-drifters/', '/how-to-build-ship/', '/connect-high-buildings/'],
})

const parsedPlatformsMeta = guideMetadataSchema.parse({
  slug: 'platforms',
  href: '/platforms/',
  title: 'Corsair Cove Platforms: PC, PS5, Xbox, and Switch Status',
  description: 'Check Corsair Cove availability on PC stores and Game Pass, plus the verified PlayStation, Xbox console, and Nintendo Switch status.',
  primaryKeyword: 'corsair cove ps5',
  category: 'Game Info',
  directAnswer: 'Corsair Cove is available on Windows PC through Steam and the Microsoft Store, and it joined PC Game Pass and Game Pass Ultimate on July 31, 2026. The Microsoft listing says Play with PC; no official PS5 or Nintendo Switch listing was found as of August 11, 2026.',
  verifiedOn: '2026-08-11',
  applicableVersion: 'Full release; availability checked 2026-08-11',
  toc: [
    { id: 'confirmed-availability', label: 'Confirmed Availability', level: 2 },
    { id: 'windows-pc-stores', label: 'Windows PC Stores', level: 2 },
    { id: 'playstation-status', label: 'PlayStation Status', level: 2 },
    { id: 'xbox-and-game-pass-status', label: 'Xbox and Game Pass Status', level: 2 },
    { id: 'nintendo-switch-status', label: 'Nintendo Switch Status', level: 2 },
    { id: 'how-to-verify-future-announcements', label: 'How to Verify Future Announcements', level: 2 },
  ],
  sources: [
    { label: 'Steam full game listing', url: 'https://store.steampowered.com/app/1368140/Corsair_Cove/' },
    { label: 'Microsoft Store listing', url: 'https://www.xbox.com/en-us/games/store/corsair-cove/9phs0189k408' },
    { label: 'Xbox Wire Game Pass announcement', url: 'https://news.xbox.com/en-us/2026/07/21/xbox-game-pass-july-2026-wave-2/' },
  ],
  related: ['/release-date/', '/price/', '/system-requirements/'],
})

const parsedReleaseDateMeta = guideMetadataSchema.parse({
  slug: 'release-date',
  href: '/release-date/',
  title: 'Corsair Cove Release Date and Demo Timeline',
  description: 'See the verified Corsair Cove full-game and free demo release dates without speculative console timelines.',
  primaryKeyword: 'corsair cove release date',
  category: 'Game Info',
  directAnswer: 'Corsair Cove released for Windows PC on July 31, 2026. Its free Steam demo released on May 28, 2026 and remains a separate download.',
  verifiedOn: '2026-08-11',
  applicableVersion: 'Full release; dates checked 2026-08-11',
  toc: [
    { id: 'current-release-status', label: 'Current Release Status', level: 2 },
    { id: 'release-timeline', label: 'Release Timeline', level: 2 },
    { id: 'demo-and-full-game', label: 'Demo and Full Game', level: 2 },
    { id: 'platform-specific-timing', label: 'Platform-Specific Timing', level: 2 },
    { id: 'where-to-verify-updates', label: 'Where to Verify Updates', level: 2 },
  ],
  sources: [
    { label: 'Steam full game listing', url: 'https://store.steampowered.com/app/1368140/Corsair_Cove/' },
    { label: 'Steam demo listing', url: 'https://store.steampowered.com/app/3858730/Corsair_Cove/' },
  ],
  related: ['/platforms/', '/price/', '/system-requirements/'],
})

const parsedSystemRequirementsMeta = guideMetadataSchema.parse({
  slug: 'system-requirements',
  href: '/system-requirements/',
  title: 'Corsair Cove System Requirements for Windows PC',
  description: 'Compare the official Corsair Cove minimum and recommended Windows PC specifications before buying or troubleshooting.',
  primaryKeyword: 'corsair cove system requirements',
  category: 'Game Info',
  directAnswer: 'Corsair Cove requires a 64-bit Windows PC. The official minimum lists Windows 10, 8 GB RAM, DirectX 12, 30 GB available storage, and an SSD recommendation; compare the full CPU and GPU requirements below.',
  verifiedOn: '2026-08-11',
  applicableVersion: 'Full release; requirements checked 2026-08-11',
  toc: [
    { id: 'supported-operating-system', label: 'Supported Operating System', level: 2 },
    { id: 'minimum-requirements', label: 'Minimum Requirements', level: 2 },
    { id: 'recommended-requirements', label: 'Recommended Requirements', level: 2 },
    { id: 'storage-and-hardware-notes', label: 'Storage and Hardware Notes', level: 2 },
    { id: 'check-your-pc-before-buying', label: 'Check Your PC Before Buying', level: 2 },
    { id: 'fix-startup-or-performance-problems', label: 'Fix Startup or Performance Problems', level: 2 },
  ],
  sources: [
    { label: 'Steam full game listing', url: 'https://store.steampowered.com/app/1368140/Corsair_Cove/' },
    { label: 'Microsoft Store listing', url: 'https://www.xbox.com/en-us/games/store/corsair-cove/9phs0189k408' },
  ],
  related: ['/platforms/', '/troubleshooting/', '/how-to-build-ship/'],
})

const parsedTroubleshootingMeta = guideMetadataSchema.parse({
  slug: 'troubleshooting',
  href: '/troubleshooting/',
  title: 'Corsair Cove Troubleshooting: Crashes, Performance, and Reports',
  description: 'Use a safe Corsair Cove diagnostic checklist for startup, crash, performance, save, and store issues before reporting a bug.',
  primaryKeyword: 'corsair cove crash',
  category: 'Support',
  directAnswer: 'Start with a restart and updates, then use Steam file verification or Windows app Repair for the store you installed from. If the problem continues, collect the game version, hardware, reproduction steps, screenshots, and save evidence before reporting it.',
  verifiedOn: '2026-08-11',
  applicableVersion: 'Full release; support steps checked 2026-08-11',
  toc: [
    { id: 'fast-diagnostic-checklist', label: 'Fast Diagnostic Checklist', level: 2 },
    { id: 'startup-and-crash-problems', label: 'Startup and Crash Problems', level: 2 },
    { id: 'performance-and-graphics-problems', label: 'Performance and Graphics Problems', level: 2 },
    { id: 'save-and-settings-problems', label: 'Save and Settings Problems', level: 2 },
    { id: 'microsoft-store-and-pc-game-pass-problems', label: 'Microsoft Store and PC Game Pass Problems', level: 2 },
    { id: 'collect-a-useful-bug-report', label: 'Collect a Useful Bug Report', level: 2 },
    { id: 'official-support-and-known-issues', label: 'Official Support and Known Issues', level: 2 },
  ],
  sources: [
    { label: 'Steam file verification support', url: 'https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB' },
    { label: 'Microsoft app repair support', url: 'https://support.microsoft.com/en-us/windows/apps/repair-apps-and-programs-in-windows' },
    { label: 'Steam discussions and reporting hub', url: 'https://steamcommunity.com/app/1368140/discussions/' },
    { label: 'Developer reporting guidance', url: 'https://steamcommunity.com/app/1368140/discussions/0/570414055657832894/' },
  ],
  related: ['/system-requirements/', '/platforms/', '/tips/'],
})

const parsedResourcesMeta = guideMetadataSchema.parse({
  slug: 'resources',
  href: '/resources/',
  title: 'Corsair Cove Resources: Construction, Upkeep, and Intermediate Goods',
  description: 'Understand Corsair Cove resource categories, stockpiles, production inputs, and consumption without guessing hidden values.',
  primaryKeyword: 'corsair cove resources',
  category: 'Resources',
  directAnswer: 'Corsair Cove resources fall into construction, upkeep, and intermediate categories. Keep construction stockpiles ready, watch net upkeep production, and trace intermediate inputs through the production chain overview.',
  verifiedOn: '2026-08-12',
  applicableVersion: 'Full release; official resource guide checked 2026-08-12',
  toc: [
    { id: 'resource-categories', label: 'Resource Categories', level: 2 },
    { id: 'construction-resources', label: 'Construction Resources', level: 2 },
    { id: 'upkeep-resources', label: 'Upkeep Resources', level: 2 },
    { id: 'intermediate-resources', label: 'Intermediate Resources', level: 2 },
    { id: 'how-to-read-a-resource-chain', label: 'How to Read a Resource Chain', level: 2 },
    { id: 'stockpile-and-net-production-checks', label: 'Stockpile and Net Production Checks', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki Resources', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Resources' },
    { label: 'Official Wiki Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
  ],
  related: ['/production-chains/', '/how-to-build-ship/', '/tips/'],
})

const parsedProductionChainsMeta = guideMetadataSchema.parse({
  slug: 'production-chains',
  href: '/production-chains/',
  title: 'Corsair Cove Production Chains: Inputs, Outputs, and Fetchers',
  description: 'Trace Corsair Cove production chains, assign Fetchers, and diagnose stalled inputs and outputs using the official chain rules.',
  primaryKeyword: 'corsair cove production chains',
  category: 'Resources',
  directAnswer: 'A Corsair Cove production chain works only when each building has its required input, output storage room, workers, and Fetcher routes. Use the production overview to trace missing links before adding more buildings.',
  verifiedOn: '2026-08-12',
  applicableVersion: 'Full release; official production guidance checked 2026-08-12',
  toc: [
    { id: 'start-with-the-chain-overview', label: 'Start with the Chain Overview', level: 2 },
    { id: 'inputs-outputs-and-ratios', label: 'Inputs, Outputs, and Ratios', level: 2 },
    { id: 'assign-fetchers-per-route', label: 'Assign Fetchers per Route', level: 2 },
    { id: 'diagnose-a-stalled-building', label: 'Diagnose a Stalled Building', level: 2 },
    { id: 'route-efficiency-and-layout', label: 'Route Efficiency and Layout', level: 2 },
    { id: 'safe-expansion-order', label: 'Safe Expansion Order', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki Resources', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Resources' },
    { label: 'Official Wiki Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
    { label: 'Official Wiki Pirates', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Pirates' },
  ],
  related: ['/resources/', '/tips/', '/connect-high-buildings/'],
})

const parsedShipsMeta = guideMetadataSchema.parse({
  slug: 'ships', href: '/ships/', title: 'Corsair Cove Ships: Tiers, Paths, and Crew',
  description: 'Use the official Corsair Cove ship rules to understand tiers, Principle Paths, crew, stats, and construction requirements.',
  primaryKeyword: 'corsair cove ships', category: 'Ships',
  directAnswer: 'Corsair Cove ships run from Tier 1 through Tier 6. Higher tiers require more investment, while Principle Path classes specialize in different stats; Health and Crew reaching zero loses the battle.',
  verifiedOn: '2026-08-12', applicableVersion: 'Full release; official Ships page checked 2026-08-12',
  toc: [
    { id: 'ship-tiers-and-investment', label: 'Ship Tiers and Investment', level: 2 },
    { id: 'principle-path-classes', label: 'Principle Path Classes', level: 2 },
    { id: 'crew-and-core-stats', label: 'Crew and Core Stats', level: 2 },
    { id: 'construction-and-piers', label: 'Construction and Piers', level: 2 },
    { id: 'choose-by-quest-recommendation', label: 'Choose by Quest Recommendation', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki Ships', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Ships' },
    { label: 'Official Wiki Compass', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Compass' },
    { label: 'Official Wiki Events', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Events' },
  ], related: ['/exploration/', '/how-to-build-ship/', '/resources/'],
})

const parsedExplorationMeta = guideMetadataSchema.parse({
  slug: 'exploration', href: '/exploration/', title: 'Corsair Cove Exploration: Seven Seas and Events',
  description: 'Understand Discovery Points, regional fog, event travel, quest lines, and ship recommendations from the official Corsair Cove references.',
  primaryKeyword: 'corsair cove exploration', category: 'Ships',
  directAnswer: 'Explore the Seven Seas by sending a built and crewed ship to Discovery Points. Regions reveal events and quest lines, travel takes real time, and event pages recommend a ship class and tier without exposing every objective in advance.',
  verifiedOn: '2026-08-12', applicableVersion: 'Full release; official Seven Seas and Events pages checked 2026-08-12',
  toc: [
    { id: 'discover-regions', label: 'Discover Regions', level: 2 },
    { id: 'travel-and-embarking', label: 'Travel and Embarking', level: 2 },
    { id: 'regional-quest-lines', label: 'Regional Quest Lines', level: 2 },
    { id: 'event-objectives-and-loss', label: 'Event Objectives and Loss', level: 2 },
    { id: 'where-the-official-map-stops', label: 'Where the Official Map Stops', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki Seven Seas', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Seven_Seas' },
    { label: 'Official Wiki Events', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Events' },
    { label: 'Official Wiki Quests', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Quests' },
  ], related: ['/ships/', '/discovery-events/', '/how-to-build-ship/'],
})

const parsedUpdatesMeta = guideMetadataSchema.parse({
  slug: 'updates', href: '/updates/', title: 'Corsair Cove Updates and Known Issues',
  description: 'Track official Corsair Cove announcements, pinned crash fixes, bug-report guidance, and the boundary between confirmed issues and community reports.',
  primaryKeyword: 'corsair cove updates known issues', category: 'Support',
  directAnswer: 'Use the official Steam discussion hub and Hooded Horse pinned posts for current fixes and known issues. This page links the official reporting paths and does not convert unconfirmed community topics into bug facts.',
  verifiedOn: '2026-08-12', applicableVersion: 'Full release; official Steam discussion hub checked 2026-08-12',
  toc: [
    { id: 'official-update-sources', label: 'Official Update Sources', level: 2 },
    { id: 'currently-pinned-support-topics', label: 'Currently Pinned Support Topics', level: 2 },
    { id: 'how-to-separate-confirmed-issues', label: 'How to Separate Confirmed Issues', level: 2 },
    { id: 'reporting-paths', label: 'Reporting Paths', level: 2 },
  ],
  sources: [
    { label: 'Official Steam Discussions', url: 'https://steamcommunity.com/app/1368140/discussions/' },
    { label: 'Steam bug and crash reports forum', url: 'https://steamcommunity.com/app/1368140/discussions/23/' },
    { label: 'Steam developer reporting thread', url: 'https://steamcommunity.com/app/1368140/discussions/0/570414055657832894/' },
  ], related: ['/troubleshooting/', '/system-requirements/', '/release-date/'],
})

const parsedTobaccoMeta = guideMetadataSchema.parse({
  slug: 'tobacco', href: '/tobacco/', title: 'Corsair Cove Tobacco: Verified Marketplace Facts',
  description: 'See what the official Corsair Cove references confirm about Tobacco consumption and what remains unverified about acquisition.',
  primaryKeyword: 'corsair cove tobacco', category: 'Resources',
  directAnswer: 'The official Resources page lists Tobacco as having no island production building, while the Pirates page lists Tobacco as upkeep for Buccaneers. The official sources checked do not confirm a first acquisition event or location.',
  verifiedOn: '2026-08-12', applicableVersion: 'Full release; official Resources, Buildings, and Pirates pages checked 2026-08-12',
  toc: [
    { id: 'confirmed-tobacco-facts', label: 'Confirmed Tobacco Facts', level: 2 },
    { id: 'buccaneer-upkeep', label: 'Buccaneer Upkeep', level: 2 },
    { id: 'what-the-sources-do-not-confirm', label: 'What the Sources Do Not Confirm', level: 2 },
    { id: 'safe-verification-path', label: 'Safe Verification Path', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki Resources', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Resources' },
    { label: 'Official Wiki Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
    { label: 'Official Wiki Pirates', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Pirates' },
  ], related: ['/resources/', '/production-chains/', '/ships/'],
})

const parsedRopeMeta = guideMetadataSchema.parse({
  slug: 'rope', href: '/rope/', title: 'Corsair Cove Rope: Rope Maker and Fibre Inputs',
  description: 'Use the official Corsair Cove building and resource tables to verify Rope Maker inputs, workers, construction cost, and output.',
  primaryKeyword: 'corsair cove rope', category: 'Resources',
  directAnswer: 'The official tables list Rope Maker as a Ships production building using Fibre, staffed by 2 Greenhands, costing 25 Planks, and producing 4 Rope per minute from 8 Fabric. The sources do not establish a complete island route or placement map.',
  verifiedOn: '2026-08-12', applicableVersion: 'Full release; official Resources and Buildings pages checked 2026-08-12',
  toc: [
    { id: 'verified-rope-maker-facts', label: 'Verified Rope Maker Facts', level: 2 },
    { id: 'fibre-input-boundary', label: 'Fibre Input Boundary', level: 2 },
    { id: 'production-and-transport-checks', label: 'Production and Transport Checks', level: 2 },
    { id: 'what-is-not-published', label: 'What Is Not Published', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki Resources', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Resources' },
    { label: 'Official Wiki Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
  ], related: ['/resources/', '/production-chains/', '/ships/'],
})

type ParsedGuideEntry = {
  meta: ReadonlyGuideMetadata
}

export type GuideEntry = DeepReadonly<ParsedGuideEntry>
export type GuideRegistry = readonly GuideEntry[]
export type GuideRegistryInput = Readonly<{
  meta: GuideMetadata | ReadonlyGuideMetadata
}>

function freezeRecursively<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach((property) => freezeRecursively(property))
    Object.freeze(value)
  }

  return value
}

function assertUniqueGuideEntries(entries: readonly ParsedGuideEntry[]) {
  const slugs = new Set(entries.map(({ meta }) => meta.slug))
  const hrefs = new Set(entries.map(({ meta }) => meta.href))

  if (slugs.size !== entries.length) {
    throw new Error('Published guide slugs must be unique')
  }

  if (hrefs.size !== entries.length) {
    throw new Error('Published guide hrefs must be unique')
  }
}

export const tipsMeta: ReadonlyGuideMetadata = freezeRecursively(parsedTipsMeta)
export const driftersMeta: ReadonlyGuideMetadata = freezeRecursively(parsedDriftersMeta)
export const shipMeta: ReadonlyGuideMetadata = freezeRecursively(parsedShipMeta)
export const connectionsMeta: ReadonlyGuideMetadata = freezeRecursively(parsedConnectionsMeta)
export const discoveryEventsMeta: ReadonlyGuideMetadata = freezeRecursively(parsedDiscoveryEventsMeta)
export const platformsMeta: ReadonlyGuideMetadata = freezeRecursively(parsedPlatformsMeta)
export const releaseDateMeta: ReadonlyGuideMetadata = freezeRecursively(parsedReleaseDateMeta)
export const priceMeta: ReadonlyGuideMetadata = freezeRecursively(parsedPriceMeta)
export const systemRequirementsMeta: ReadonlyGuideMetadata = freezeRecursively(parsedSystemRequirementsMeta)
export const troubleshootingMeta: ReadonlyGuideMetadata = freezeRecursively(parsedTroubleshootingMeta)
export const resourcesMeta: ReadonlyGuideMetadata = freezeRecursively(parsedResourcesMeta)
export const productionChainsMeta: ReadonlyGuideMetadata = freezeRecursively(parsedProductionChainsMeta)
export const shipsMeta: ReadonlyGuideMetadata = freezeRecursively(parsedShipsMeta)
export const explorationMeta: ReadonlyGuideMetadata = freezeRecursively(parsedExplorationMeta)
export const updatesMeta: ReadonlyGuideMetadata = freezeRecursively(parsedUpdatesMeta)
export const tobaccoMeta: ReadonlyGuideMetadata = freezeRecursively(parsedTobaccoMeta)
export const ropeMeta: ReadonlyGuideMetadata = freezeRecursively(parsedRopeMeta)

const canonicalGuideMetadata = [tipsMeta, driftersMeta, shipMeta, connectionsMeta, discoveryEventsMeta, platformsMeta, releaseDateMeta, priceMeta, systemRequirementsMeta, troubleshootingMeta, resourcesMeta, productionChainsMeta, shipsMeta, explorationMeta, updatesMeta, tobaccoMeta, ropeMeta] as const

export function createGuideRegistry(entries: readonly GuideRegistryInput[]): GuideRegistry {
  const parsedGuideEntries = entries.map(({ meta }) => {
    const parsedMeta = guideMetadataSchema.parse(meta)
    const canonicalMeta = canonicalGuideMetadata.find((candidate) => candidate === meta)

    return { meta: canonicalMeta ?? freezeRecursively(parsedMeta) as ReadonlyGuideMetadata }
  })

  assertUniqueGuideEntries(parsedGuideEntries)

  return freezeRecursively(parsedGuideEntries) as GuideRegistry
}

export const guideEntries = createGuideRegistry([
  { meta: tipsMeta },
  { meta: driftersMeta },
  { meta: shipMeta },
  { meta: connectionsMeta },
  { meta: discoveryEventsMeta },
  { meta: platformsMeta },
  { meta: releaseDateMeta },
  { meta: priceMeta },
  { meta: systemRequirementsMeta },
  { meta: troubleshootingMeta },
  { meta: resourcesMeta },
  { meta: productionChainsMeta },
  { meta: shipsMeta },
  { meta: explorationMeta },
  { meta: updatesMeta },
  { meta: tobaccoMeta },
  { meta: ropeMeta },
])

export const guideGroups = freezeRecursively(
  Array.from(new Set(guideEntries.map(({ meta }) => meta.category))),
) as readonly GuideGroup[]

export function getGuideMeta(slug: string): ReadonlyGuideMetadata {
  const entry = guideEntries.find(({ meta }) => meta.slug === slug)

  if (!entry) {
    throw new Error(`Unknown published guide: ${slug}`)
  }

  return entry.meta
}
