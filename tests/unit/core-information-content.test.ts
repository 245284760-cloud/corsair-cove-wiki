import { describe, expect, it } from 'vitest'
import {
  platformsMeta,
  priceMeta,
  releaseDateMeta,
  systemRequirementsMeta,
  troubleshootingMeta,
} from '@/content/guides'

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
    expect(priceMeta.directAnswer).toMatch(/France.*August 11, 2026|regional/i)
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
})
