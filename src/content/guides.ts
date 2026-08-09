import { guideMetadataSchema, type GuideMetadata } from '@/lib/content-schema'

export const GUIDE_SLUGS = [
  'tips',
  'how-to-get-more-drifters',
  'how-to-build-ship',
  'connect-high-buildings',
] as const

export type GuideSlug = (typeof GUIDE_SLUGS)[number]
export type GuideGroup = 'Start Here' | 'Population' | 'Ships' | 'Construction'

export const tipsMeta = guideMetadataSchema.parse({
  slug: 'tips',
  href: '/tips/',
  title: 'Corsair Cove Tips for Fetchers, Routes, and Early Settlements',
  description: 'Beginner Corsair Cove tips for checking stalled production, assigning Fetchers, and planning efficient early routes.',
  primaryKeyword: 'corsair cove tips',
  category: 'Start Here',
  directAnswer: 'When a settlement stalls, check that buildings are unpaused and connected, that Drifters are available, and that input and output storage can move goods. Each supply relationship needs its own Fetcher.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'v1.1.2.241844',
  toc: [
    { id: 'first-checks', label: 'First checks for a stalled settlement', level: 2 },
    { id: 'fetchers-and-routes', label: 'Assign Fetchers and improve routes', level: 2 },
  ],
  sources: [
    { label: "Hooded Horse Beginner's Guide", url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251' },
    { label: 'Official Wiki — Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
  ],
  related: ['/how-to-get-more-drifters/', '/how-to-build-ship/', '/connect-high-buildings/'],
})

export const driftersMeta = guideMetadataSchema.parse({
  slug: 'how-to-get-more-drifters',
  href: '/how-to-get-more-drifters/',
  title: 'How to Get More Drifters in Corsair Cove',
  description: 'Learn how Corsair Cove Drifters are gained, freed from jobs, and attracted to a new Pirate Camp.',
  primaryKeyword: 'corsair cove how to get more drifters',
  category: 'Population',
  directAnswer: 'Drifters come primarily from immigration and sea events such as Drifter or Prisoner Ships. Pause buildings to free assigned workers, and attract migration to a new Pirate Camp with beds and jobs.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'v1.1.2.241844',
  toc: [
    { id: 'where-drifters-come-from', label: 'Where Drifters come from', level: 2 },
    { id: 'free-and-attract-drifters', label: 'Free and attract Drifters', level: 2 },
  ],
  sources: [
    { label: 'Corsair Cove FAQ', url: 'https://steamcommunity.com/app/1368140/discussions/0/659359849665365626/' },
    { label: 'Official Wiki — Pirates', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Pirates' },
  ],
  related: ['/tips/', '/how-to-build-ship/', '/connect-high-buildings/'],
})

export const shipMeta = guideMetadataSchema.parse({
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
    { id: 'shipbuilding-checklist', label: 'Shipbuilding checklist', level: 2 },
    { id: 'pier-and-crew-requirements', label: 'Pier, materials, and Crew requirements', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki — Ships', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Ships' },
    { label: 'Official Wiki — Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
  ],
  related: ['/tips/', '/how-to-get-more-drifters/', '/connect-high-buildings/'],
})

export const connectionsMeta = guideMetadataSchema.parse({
  slug: 'connect-high-buildings',
  href: '/connect-high-buildings/',
  title: 'How to Connect High Buildings in Corsair Cove',
  description: 'Connect high Corsair Cove buildings with Roads, Rope Bridges, Cliff Paths, and Ladders.',
  primaryKeyword: 'corsair cove how to connect high buildings to tower',
  category: 'Construction',
  directAnswer: 'Every building needs a connection to the network. Use its green connection arrows to add Roads, Rope Bridges, Cliff Paths, or Ladders; a disconnected finished building stops working.',
  verifiedOn: '2026-08-08',
  applicableVersion: 'v1.1.2.241844',
  toc: [
    { id: 'connection-points', label: 'Find connection points', level: 2 },
    { id: 'vertical-connection-pieces', label: 'Choose vertical connection pieces', level: 2 },
  ],
  sources: [
    { label: 'Official Wiki — Buildings', url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings' },
    { label: "Hooded Horse Beginner's Guide", url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251' },
  ],
  related: ['/tips/', '/how-to-get-more-drifters/', '/how-to-build-ship/'],
})

type MutableGuideEntry = {
  group: GuideGroup
  meta: GuideMetadata
}

function freezeRecursively<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach((property) => freezeRecursively(property))
    Object.freeze(value)
  }

  return value
}

function assertUniqueGuideEntries(entries: readonly MutableGuideEntry[]) {
  const slugs = new Set(entries.map(({ meta }) => meta.slug))
  const hrefs = new Set(entries.map(({ meta }) => meta.href))

  if (slugs.size !== entries.length) {
    throw new Error('Published guide slugs must be unique')
  }

  if (hrefs.size !== entries.length) {
    throw new Error('Published guide hrefs must be unique')
  }
}

const parsedGuideEntries: MutableGuideEntry[] = [
  { group: 'Start Here', meta: tipsMeta },
  { group: 'Population', meta: driftersMeta },
  { group: 'Ships', meta: shipMeta },
  { group: 'Construction', meta: connectionsMeta },
]

assertUniqueGuideEntries(parsedGuideEntries)

export const guideEntries = freezeRecursively(parsedGuideEntries)

export function getGuideMeta(slug: string): GuideMetadata {
  const entry = guideEntries.find(({ meta }) => meta.slug === slug)

  if (!entry) {
    throw new Error(`Unknown published guide: ${slug}`)
  }

  return entry.meta
}
