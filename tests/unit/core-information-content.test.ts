import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { render } from '@testing-library/react'
import {
  platformsMeta,
  priceMeta,
  releaseDateMeta,
  systemRequirementsMeta,
  troubleshootingMeta,
} from '@/content/guides'
import SystemRequirementsContent, { guideMeta as systemRequirementsGuideMeta } from '@/content/guides/system-requirements.mdx'
import { ArticleLayout } from '@/components/site/article-layout'

const coreInformationMeta = [
  platformsMeta,
  releaseDateMeta,
  priceMeta,
  systemRequirementsMeta,
  troubleshootingMeta,
]

describe('core information content contracts', () => {
  it('answers each primary search intent with the approved direct claim', () => {
    expect(platformsMeta.primaryKeyword).toBe('corsair cove ps5')
    expect(platformsMeta.directAnswer).toMatch(/Windows PC|PC Game Pass/)
    expect(platformsMeta.directAnswer).toMatch(/no official (PS5|PlayStation).*listing/i)
    expect(releaseDateMeta.directAnswer).toMatch(/July 31, 2026/)
    expect(priceMeta.directAnswer).toMatch(/€39\.99.*€29\.99|regional/i)
    expect(systemRequirementsMeta.directAnswer).toMatch(/64-bit Windows PC|Windows 10.*64-bit/i)
    expect(troubleshootingMeta.directAnswer).toMatch(/verify|repair|report/i)
  })

  it('keeps core metadata evidence-dated and internally connected', () => {
    for (const meta of coreInformationMeta) {
      expect(meta.verifiedOn).toBe('2026-08-11')
      expect(meta.sources.length).toBeGreaterThanOrEqual(2)
      expect(meta.related.length).toBeGreaterThanOrEqual(2)
    }
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
})
