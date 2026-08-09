import { describe, expect, it } from 'vitest'
import {
  createGuideRegistry,
  driftersMeta,
  GUIDE_SLUGS,
  getGuideMeta,
  guideEntries,
  tipsMeta,
} from '@/content/guides'

describe('published guide registry', () => {
  it('contains exactly the four published guide slugs in editorial order', () => {
    expect(GUIDE_SLUGS).toEqual([
      'tips',
      'how-to-get-more-drifters',
      'how-to-build-ship',
      'connect-high-buildings',
    ])
    expect(guideEntries.map(({ meta }) => meta.href)).not.toContain('/mods/')
  })

  it('returns parsed metadata for a published guide and rejects an unknown slug', () => {
    const guide = getGuideMeta('how-to-build-ship')

    expect(guide.href).toBe('/how-to-build-ship/')
    expect(guide.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({ url: 'https://wiki.hoodedhorse.com/Corsair_Cove/Ships' }),
    ]))
    expect(() => getGuideMeta('mods')).toThrow('Unknown published guide: mods')
  })

  it('rejects duplicate slugs and hrefs at the registry construction boundary', () => {
    expect(() => createGuideRegistry([
      { meta: tipsMeta },
      { meta: { ...driftersMeta, slug: tipsMeta.slug } },
    ])).toThrow('Published guide slugs must be unique')

    expect(() => createGuideRegistry([
      { meta: tipsMeta },
      { meta: { ...driftersMeta, href: tipsMeta.href } },
    ])).toThrow('Published guide hrefs must be unique')
  })

  it('exposes a deeply frozen registry at runtime', () => {
    const registry = createGuideRegistry([{ meta: tipsMeta }])

    expect(Object.isFrozen(registry)).toBe(true)
    expect(Object.isFrozen(registry[0])).toBe(true)
    expect(Object.isFrozen(registry[0].meta)).toBe(true)
    expect(Object.isFrozen(registry[0].meta.sources)).toBe(true)
    expect(() => (
      registry as unknown as { push: (entry: unknown) => number }
    ).push(registry[0])).toThrow(TypeError)
    expect(() => {
      (registry[0] as unknown as { meta: { title: string } }).meta.title = 'Changed title'
    }).toThrow(TypeError)
  })
})
