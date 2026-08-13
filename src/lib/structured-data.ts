import type { ReadonlyGuideMetadata } from '@/content/guides'
import { CANONICAL_ORIGIN } from '@/lib/metadata'

export function createArticleJsonLd(meta: ReadonlyGuideMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: meta.title,
    description: meta.description,
    dateModified: meta.verifiedOn,
    inLanguage: 'en',
    mainEntityOfPage: `${CANONICAL_ORIGIN}${meta.href}`,
  } as const
}

export function createBreadcrumbJsonLd(meta: ReadonlyGuideMetadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${CANONICAL_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${CANONICAL_ORIGIN}/guides/` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: `${CANONICAL_ORIGIN}${meta.href}` },
    ],
  } as const
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
