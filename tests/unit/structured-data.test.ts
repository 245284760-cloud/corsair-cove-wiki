import { describe, expect, it } from 'vitest'
import { createArticleJsonLd, createBreadcrumbJsonLd, serializeJsonLd } from '@/lib/structured-data'
import { tipsMeta } from '@/content/guides'

describe('structured data', () => {
  it('describes a guide as an English article at its canonical URL', () => {
    expect(createArticleJsonLd(tipsMeta)).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: tipsMeta.title,
      description: tipsMeta.description,
      dateModified: tipsMeta.verifiedOn,
      inLanguage: 'en',
      mainEntityOfPage: `https://corsaircovewiki.com${tipsMeta.href}`,
    })
  })

  it('publishes Home, Guides, and the article as ordered breadcrumbs', () => {
    const breadcrumbs = createBreadcrumbJsonLd(tipsMeta)
    expect(breadcrumbs.itemListElement).toHaveLength(3)
    expect(breadcrumbs.itemListElement[2]).toMatchObject({
      position: 3,
      name: tipsMeta.title,
      item: `https://corsaircovewiki.com${tipsMeta.href}`,
    })
  })

  it('escapes opening angle brackets before embedding JSON in HTML', () => {
    expect(serializeJsonLd({ value: '</script>' })).toBe('{"value":"\\u003c/script>"}')
  })
})
