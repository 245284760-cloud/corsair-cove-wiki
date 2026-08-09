import { guideMetadataSchema, type GuideMetadata } from '@/lib/content-schema'

export const GUIDE_SLUGS = [
  'tips',
  'how-to-get-more-drifters',
  'how-to-build-ship',
  'connect-high-buildings',
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
  directAnswer: 'This is not a tower-only mechanic: every building needs a connection to the network. Use its green connection arrows to add Roads, Rope Bridges, Cliff Paths, or Ladders; an unconnected building cannot begin construction or operation.',
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

const canonicalGuideMetadata = [tipsMeta, driftersMeta, shipMeta, connectionsMeta] as const

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
