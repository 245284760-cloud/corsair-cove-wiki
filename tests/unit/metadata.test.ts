import { describe, expect, it } from 'vitest'
import { createPageMetadata } from '@/lib/metadata'

describe('page metadata', () => {
  it('creates a canonical guide metadata record at the canonical origin', () => {
    const metadata = createPageMetadata(
      '/tips/',
      'Corsair Cove Tips',
      'Verified beginner guidance for Corsair Cove logistics.',
    )

    expect(metadata.alternates?.canonical).toBe('https://corsaircovewiki.com/tips/')
    expect(metadata.openGraph).toMatchObject({
      title: 'Corsair Cove Tips',
      description: 'Verified beginner guidance for Corsair Cove logistics.',
      url: 'https://corsaircovewiki.com/tips/',
      type: 'article',
      images: [{ url: 'https://corsaircovewiki.com/opengraph-image', width: 1200, height: 630 }],
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Corsair Cove Tips',
      images: ['https://corsaircovewiki.com/twitter-image'],
    })
  })

  it('marks the home and guide index as website metadata', () => {
    expect(createPageMetadata('/', 'Corsair Cove Wiki', 'Verified guides.').openGraph).toMatchObject({ type: 'website' })
    expect(createPageMetadata('/guides/', 'Corsair Cove Guides', 'Published guides.').openGraph).toMatchObject({ type: 'website' })
  })
})
