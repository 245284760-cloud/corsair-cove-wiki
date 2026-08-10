import { guideEntries } from '@/content/guides'

type Assert<T extends true> = T
type HasPush<T> = T extends { push: (...values: never[]) => unknown } ? true : false

type _registryHasNoPushMethod = Assert<HasPush<typeof guideEntries> extends false ? true : false>

// @ts-expect-error Published entries are a readonly registry.
guideEntries.push(guideEntries[0])

// @ts-expect-error Published metadata is deeply readonly.
guideEntries[0].meta.title = 'Changed title'

export type GuideRegistryTypecheck = _registryHasNoPushMethod
