import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'
import robots from '@/app/robots'
import NotFound from '@/app/not-found'
import { metadata as discoveryEventsMetadata } from '@/app/discovery-events/page'
import { discoveryEventsMeta } from '@/content/guides'
import { CANONICAL_ORIGIN } from '@/lib/metadata'
import { PUBLIC_ROUTES } from '@/lib/routes'
import { metadata as platformsMetadata } from '@/app/platforms/page'
import { metadata as releaseDateMetadata } from '@/app/release-date/page'
import { metadata as priceMetadata } from '@/app/price/page'
import { metadata as systemRequirementsMetadata } from '@/app/system-requirements/page'
import { metadata as troubleshootingMetadata } from '@/app/troubleshooting/page'

describe('production SEO routes', () => {
  it('publishes every canonical public URL in the sitemap, including discovery events', async () => {
    const urls = (await sitemap()).map((item) => item.url)

    expect(urls).toContain('https://corsaircovewiki.com/discovery-events/')
    expect(urls).toEqual(
      PUBLIC_ROUTES.map((route) => new URL(route, CANONICAL_ORIGIN).href),
    )
  })

  it('keeps all twelve published routes on unique canonical URLs', async () => {
    const urls = (await sitemap()).map((item) => item.url)

    expect(PUBLIC_ROUTES).toHaveLength(12)
    expect(urls).toHaveLength(12)
    expect(new Set(urls).size).toBe(urls.length)
    expect(urls.every((url) => url.startsWith(`${CANONICAL_ORIGIN}/`))).toBe(true)
  })

  it('publishes canonical article metadata for each new core information route', () => {
    const metadata = [
      platformsMetadata,
      releaseDateMetadata,
      priceMetadata,
      systemRequirementsMetadata,
      troubleshootingMetadata,
    ]

    const canonicals = metadata.map((item) => item.alternates?.canonical)
    expect(canonicals).toEqual([
      'https://corsaircovewiki.com/platforms/',
      'https://corsaircovewiki.com/release-date/',
      'https://corsaircovewiki.com/price/',
      'https://corsaircovewiki.com/system-requirements/',
      'https://corsaircovewiki.com/troubleshooting/',
    ])
    expect(new Set(canonicals).size).toBe(canonicals.length)
  })

  it('publishes discovery events as canonical article metadata', () => {
    const canonicalUrl = new URL(discoveryEventsMeta.href, CANONICAL_ORIGIN).href

    expect(discoveryEventsMetadata.alternates?.canonical).toBe(canonicalUrl)
    expect(discoveryEventsMetadata.openGraph).toMatchObject({
      url: canonicalUrl,
      type: 'article',
    })
  })

  it('points production robots policy at the canonical sitemap without unpublished routes', async () => {
    const policy = await robots()

    expect(policy).toMatchObject({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://corsaircovewiki.com/sitemap.xml',
    })
    expect(JSON.stringify(policy)).not.toMatch(/platforms|privacy|terms|mods/i)
  })

  it('renders a single-heading 404 with links only to the home and guides index', () => {
    render(createElement(NotFound))

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href')).sort()).toEqual(['/', '/guides/'])
  })
})
