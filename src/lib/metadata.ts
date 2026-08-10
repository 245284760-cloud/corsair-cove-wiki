import type { Metadata } from 'next'
import type { PublicRoute } from '@/lib/routes'

export const CANONICAL_ORIGIN = 'https://corsaircovewiki.com'

export function createPageMetadata(
  route: PublicRoute,
  title: string,
  description: string,
): Metadata {
  const url = `${CANONICAL_ORIGIN}${route}`
  const type = route === '/' || route === '/guides/' ? 'website' : 'article'

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type },
  }
}
