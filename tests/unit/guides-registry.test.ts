import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  createGuideRegistry,
  discoveryEventsMeta,
  driftersMeta,
  GUIDE_SLUGS,
  getGuideMeta,
  guideGroups,
  guideEntries,
  tipsMeta,
} from '@/content/guides'

const metadataExportBySlug = {
  tips: 'tipsMeta',
  'how-to-get-more-drifters': 'driftersMeta',
  'how-to-build-ship': 'shipMeta',
  'connect-high-buildings': 'connectionsMeta',
  'discovery-events': 'discoveryEventsMeta',
  platforms: 'platformsMeta',
  'release-date': 'releaseDateMeta',
  price: 'priceMeta',
  'system-requirements': 'systemRequirementsMeta',
  troubleshooting: 'troubleshootingMeta',
} as const

describe('published guide registry', () => {
  it('contains exactly the five published guide slugs in editorial order', () => {
    expect(GUIDE_SLUGS).toEqual([
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
    ])
    expect(guideGroups).toEqual(expect.arrayContaining(['Game Info', 'Support']))
    expect(guideEntries.map(({ meta }) => meta.href)).not.toContain('/mods/')
  })

  it('publishes the discovery events entry from the registry', () => {
    expect(discoveryEventsMeta.slug).toBe('discovery-events')
    expect(guideEntries.some(({ meta }) => meta === discoveryEventsMeta)).toBe(true)
  })

  it('keeps every registry guide backed by an explicit MDX file and article route', () => {
    for (const slug of GUIDE_SLUGS) {
      const contentPath = join(process.cwd(), 'src', 'content', 'guides', `${slug}.mdx`)
      const routePath = join(process.cwd(), 'src', 'app', slug, 'page.tsx')

      expect(existsSync(contentPath), `missing guide content for ${slug}`).toBe(true)
      expect(existsSync(routePath), `missing guide route for ${slug}`).toBe(true)
      expect(readFileSync(contentPath, 'utf8')).toContain(
        `export { ${metadataExportBySlug[slug]} as guideMeta } from '@/content/guides'`,
      )

      for (const relatedHref of getGuideMeta(slug).related) {
        const relatedSlug = relatedHref.slice(1, -1)
        expect(getGuideMeta(relatedSlug).slug).toBe(relatedSlug)
      }
    }
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

  it('normalizes non-canonical metadata before publishing it in a registry', () => {
    const unnormalizedMeta = { ...tipsMeta, title: '  Trimmed Corsair Cove Tips  ' }
    const registry = createGuideRegistry([{ meta: unnormalizedMeta }])

    expect(registry[0].meta).not.toBe(unnormalizedMeta)
    expect(registry[0].meta.title).toBe('Trimmed Corsair Cove Tips')
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
