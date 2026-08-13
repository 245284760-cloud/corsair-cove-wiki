import { describe, expect, it } from 'vitest'
import { getContentFreshness, getReviewCadenceDays } from '@/lib/content-freshness'
import { guideEntries, tipsMeta, updatesMeta } from '@/content/guides'

describe('guide content freshness', () => {
  it('reviews volatile support and commerce pages every seven days', () => {
    expect(getReviewCadenceDays(updatesMeta)).toBe(7)
  })

  it('reviews stable mechanics pages every thirty days', () => {
    expect(getReviewCadenceDays(tipsMeta)).toBe(30)
  })

  it('calculates age and next review from the verified date in UTC', () => {
    expect(getContentFreshness(updatesMeta, new Date('2026-08-18T12:00:00Z'))).toEqual({
      ageDays: 6,
      cadenceDays: 7,
      nextReviewOn: '2026-08-19',
      stale: false,
    })
    expect(getContentFreshness(updatesMeta, new Date('2026-08-20T00:00:00Z')).stale).toBe(true)
  })

  it('keeps every published guide inside its review cadence', () => {
    const stale = guideEntries
      .filter(({ meta }) => getContentFreshness(meta).stale)
      .map(({ meta }) => meta.slug)

    expect(stale).toEqual([])
  })
})
