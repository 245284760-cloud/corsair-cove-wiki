import { describe, expect, it } from 'vitest'
import { GUIDE_SLUGS, getGuideMeta, guideEntries } from '@/content/guides'

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
})
