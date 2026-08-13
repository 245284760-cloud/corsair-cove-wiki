import type { MetadataRoute } from 'next'
import { guideEntries } from '@/content/guides'
import { CANONICAL_ORIGIN } from '@/lib/metadata'
import { PUBLIC_ROUTES } from '@/lib/routes'

const SITE_LAST_MODIFIED = new Date('2026-08-13T00:00:00.000Z')

export default function sitemap(): MetadataRoute.Sitemap {
  const guideByHref = new Map<string, (typeof guideEntries)[number]['meta']>(
    guideEntries.map(({ meta }) => [meta.href, meta]),
  )

  return PUBLIC_ROUTES.map((route) => {
    const guide = guideByHref.get(route)
    const weekly = route === '/' || route === '/guides/' || guide?.slug === 'updates'

    return {
      url: new URL(route, CANONICAL_ORIGIN).href,
      lastModified: guide ? new Date(`${guide.verifiedOn}T00:00:00.000Z`) : SITE_LAST_MODIFIED,
      changeFrequency: weekly ? 'weekly' : 'monthly',
      priority: route === '/' ? 1 : guide ? 0.8 : 0.6,
    }
  })
}
