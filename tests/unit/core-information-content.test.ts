import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { render } from '@testing-library/react'
import {
  platformsMeta,
  priceMeta,
  releaseDateMeta,
  systemRequirementsMeta,
  troubleshootingMeta,
  resourcesMeta,
  productionChainsMeta,
} from '@/content/guides'
import SystemRequirementsContent, { guideMeta as systemRequirementsGuideMeta } from '@/content/guides/system-requirements.mdx'
import PlatformsContent, { guideMeta as platformsGuideMeta } from '@/content/guides/platforms.mdx'
import ReleaseDateContent, { guideMeta as releaseDateGuideMeta } from '@/content/guides/release-date.mdx'
import PriceContent, { guideMeta as priceGuideMeta } from '@/content/guides/price.mdx'
import TroubleshootingContent, { guideMeta as troubleshootingGuideMeta } from '@/content/guides/troubleshooting.mdx'
import ResourcesContent, { guideMeta as resourcesGuideMeta } from '@/content/guides/resources.mdx'
import ProductionChainsContent, { guideMeta as productionChainsGuideMeta } from '@/content/guides/production-chains.mdx'
import { ArticleLayout } from '@/components/site/article-layout'

const coreInformationMeta = [
  platformsMeta,
  releaseDateMeta,
  priceMeta,
  systemRequirementsMeta,
  troubleshootingMeta,
  resourcesMeta,
  productionChainsMeta,
]

const coreInformationArticles = [
  [platformsGuideMeta, PlatformsContent],
  [releaseDateGuideMeta, ReleaseDateContent],
  [priceGuideMeta, PriceContent],
  [systemRequirementsGuideMeta, SystemRequirementsContent],
  [troubleshootingGuideMeta, TroubleshootingContent],
  [resourcesGuideMeta, ResourcesContent],
  [productionChainsGuideMeta, ProductionChainsContent],
] as const

describe('core information content contracts', () => {
  it('answers each primary search intent with the approved direct claim', () => {
    expect(platformsMeta.primaryKeyword).toBe('corsair cove ps5')
    expect(platformsMeta.directAnswer).toMatch(/Windows PC|PC Game Pass/)
    expect(platformsMeta.directAnswer).toMatch(/no official (PS5|PlayStation).*listing/i)
    expect(releaseDateMeta.directAnswer).toMatch(/July 31, 2026/)
    expect(priceMeta.directAnswer).toMatch(/EUR 39\.99.*EUR 29\.99|regional/i)
    expect(systemRequirementsMeta.directAnswer).toMatch(/64-bit Windows PC|Windows 10.*64-bit/i)
    expect(troubleshootingMeta.directAnswer).toMatch(/verify|repair|report/i)
    expect(priceMeta.directAnswer).toContain('EUR 39.99')
    expect(priceMeta.directAnswer).toContain('EUR 29.99')
  })

  it('keeps core metadata evidence-dated and internally connected', () => {
    for (const meta of coreInformationMeta) {
      expect(['2026-08-11', '2026-08-12']).toContain(meta.verifiedOn)
      expect(meta.sources.length).toBeGreaterThanOrEqual(2)
      expect(meta.related.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('exposes maintenance-aware price sale status', async () => {
    const { getPriceSnapshotStatus } = await import('@/content/guides/price-meta')
    expect(getPriceSnapshotStatus(new Date('2026-08-13T12:00:00Z'))).toBe('sale-active')
    expect(getPriceSnapshotStatus(new Date('2026-08-15T12:00:00Z'))).toBe('sale-ended')
  })

  it('renders the system requirements guide with the approved sections and specs', () => {
    const { container } = render(createElement(ArticleLayout, { meta: systemRequirementsGuideMeta }, createElement(SystemRequirementsContent)))

    expect(systemRequirementsGuideMeta.href).toBe('/system-requirements/')
    expect(Array.from(container.querySelectorAll('.article-content h2')).map((heading) => heading.textContent)).toEqual([
      'Supported operating system',
      'Minimum requirements',
      'Recommended requirements',
      'Storage and hardware notes',
      'Check your PC before buying',
      'Fix startup or performance problems',
    ])
    expect(container.textContent).toContain('Windows 10 64-bit')
    expect(container.textContent).toContain('GTX 1660 Super 6 GB')
    expect(container.textContent).toContain('RTX 2070 8 GB')
  })

  it('renders each core information page as a complete article contract', () => {
    for (const [meta, Content] of coreInformationArticles) {
      const { container } = render(createElement(ArticleLayout, { meta }, createElement(Content)))

      expect(container.querySelectorAll('h1')).toHaveLength(1)
      expect(Array.from(container.querySelectorAll('.article-content h2')).map((heading) => heading.textContent?.toLowerCase())).toEqual(
        meta.toc.map(({ label }) => label.toLowerCase()),
      )
      expect(container.querySelector('[aria-labelledby="sources-heading"]')).not.toBeNull()
      expect(container.querySelector('[aria-labelledby="related-guides-heading"]')).not.toBeNull()
    }
  })
})
