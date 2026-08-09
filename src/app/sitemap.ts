import type { MetadataRoute } from 'next'
import { CANONICAL_ORIGIN } from '@/lib/metadata'
import { PUBLIC_ROUTES } from '@/lib/routes'

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((route) => ({
    url: new URL(route, CANONICAL_ORIGIN).href,
  }))
}
