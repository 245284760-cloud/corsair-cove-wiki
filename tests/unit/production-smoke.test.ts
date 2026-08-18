import { describe, expect, it, vi } from 'vitest'
import { checkProduction } from '../../scripts/production-smoke.mjs'

const origin = 'https://corsaircovewiki.com'
const criticalPaths = ['/', '/guides/', '/tips/', '/search/'] as const
const measurementId = 'G-YSGBPS7G81'
const healthyHtml = `<html><title>Corsair Cove</title><link rel="canonical"><script>${measurementId}</script>`

type PageOverride = {
  html?: string
  status?: number
}

function createFetcher({
  pageOverrides = {},
  sitemapPaths = criticalPaths,
  homepageHeader = 'NoSnIfF',
}: {
  pageOverrides?: Partial<Record<(typeof criticalPaths)[number], PageOverride>>
  sitemapPaths?: readonly string[]
  homepageHeader?: string | null
} = {}) {
  return vi.fn(async (url: RequestInfo | URL) => {
    const pathname = new URL(String(url)).pathname
    if (pathname === '/robots.txt') {
      return new Response(`User-Agent: *\nSitemap: ${origin}/sitemap.xml`)
    }
    if (pathname === '/sitemap.xml') {
      return new Response(
        sitemapPaths.map((path) => `<loc>${origin}${path}</loc>`).join(''),
      )
    }

    const override = pageOverrides[pathname as (typeof criticalPaths)[number]]
    const headers =
      pathname === '/' && homepageHeader !== null
        ? { 'X-Content-Type-Options': homepageHeader }
        : undefined
    return new Response(override?.html ?? healthyHtml, {
      status: override?.status ?? 200,
      headers,
    })
  })
}

describe('production smoke check', () => {
  it('accepts every healthy critical page and a sitemap containing only the critical URLs', async () => {
    const fetcher = createFetcher()

    await expect(checkProduction(fetcher)).resolves.toEqual({ checked: 6, sitemapUrls: 4 })
    expect(fetcher.mock.calls.map(([url]) => String(url))).toEqual([
      `${origin}/`,
      `${origin}/guides/`,
      `${origin}/tips/`,
      `${origin}/search/`,
      `${origin}/robots.txt`,
      `${origin}/sitemap.xml`,
    ])
  })

  describe.each(criticalPaths)('%s page', (path) => {
    it('rejects a non-success response', async () => {
      const fetcher = createFetcher({ pageOverrides: { [path]: { status: 503 } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(`${path} returned 503`)
    })

    it('rejects HTML without a title', async () => {
      const html = `<html><link rel="canonical"><script>${measurementId}</script>`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(`${path} is missing title or canonical metadata`)
    })

    it('rejects HTML without a canonical', async () => {
      const html = `<html><title>Corsair Cove</title><script>${measurementId}</script>`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(`${path} is missing title or canonical metadata`)
    })

    it('rejects HTML without the production GA measurement id', async () => {
      const html = '<html><title>Corsair Cove</title><link rel="canonical">'
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `${path} is missing GA measurement id ${measurementId}`,
      )
    })
  })

  it('rejects a homepage without the nosniff response header', async () => {
    const fetcher = createFetcher({ homepageHeader: null })

    await expect(checkProduction(fetcher)).rejects.toThrow('x-content-type-options must be nosniff')
  })

  it('rejects a homepage whose content type options header is not nosniff', async () => {
    const fetcher = createFetcher({ homepageHeader: 'sameorigin' })

    await expect(checkProduction(fetcher)).rejects.toThrow('x-content-type-options must be nosniff')
  })

  describe.each(criticalPaths)('sitemap without %s', (missingPath) => {
    it('rejects the missing critical URL', async () => {
      const fetcher = createFetcher({
        sitemapPaths: criticalPaths.filter((path) => path !== missingPath),
      })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `sitemap is missing ${origin}${missingPath}`,
      )
    })
  })
})
