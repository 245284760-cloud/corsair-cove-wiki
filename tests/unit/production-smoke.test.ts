import { describe, expect, it, vi } from 'vitest'
import { checkProduction } from '../../scripts/production-smoke.mjs'

describe('production smoke check', () => {
  it('accepts healthy pages, robots, and a complete sitemap', async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const href = String(url)
      if (href.endsWith('/robots.txt')) return new Response('User-Agent: *\nSitemap: https://corsaircovewiki.com/sitemap.xml')
      if (href.endsWith('/sitemap.xml')) {
        return new Response(Array.from({ length: 20 }, (_, index) => `<loc>https://corsaircovewiki.com/${index}</loc>`).join(''))
      }
      return new Response('<html><title>Corsair Cove</title><link rel="canonical">')
    })

    await expect(checkProduction(fetcher)).resolves.toEqual({ checked: 5, sitemapUrls: 20 })
  })

  it('rejects a failed public route', async () => {
    const fetcher = vi.fn(async () => new Response('unavailable', { status: 503 }))
    await expect(checkProduction(fetcher)).rejects.toThrow('returned 503')
  })
})
