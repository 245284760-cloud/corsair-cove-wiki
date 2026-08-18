import { describe, expect, it, vi } from 'vitest'
import { checkProduction } from '../../scripts/production-smoke.mjs'

const criticalPaths = ['/', '/guides/', '/tips/', '/search/']
const criticalSitemap = criticalPaths
  .map((path) => `<loc>https://corsaircovewiki.com${path}</loc>`)
  .join('')
const healthyHtml = '<html><title>Corsair Cove</title><link rel="canonical"><script>G-YSGBPS7G81</script>'

describe('production smoke check', () => {
  it('checks every critical page and accepts a sitemap containing the critical URLs', async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const href = String(url)
      if (href.endsWith('/robots.txt')) return new Response('User-Agent: *\nSitemap: https://corsaircovewiki.com/sitemap.xml')
      if (href.endsWith('/sitemap.xml')) return new Response(criticalSitemap)
      return new Response(
        healthyHtml,
        href === 'https://corsaircovewiki.com/'
          ? { headers: { 'X-Content-Type-Options': 'NoSnIfF' } }
          : undefined,
      )
    })

    await expect(checkProduction(fetcher)).resolves.toEqual({ checked: 6, sitemapUrls: 4 })
    expect(fetcher.mock.calls.map(([url]) => String(url))).toEqual([
      'https://corsaircovewiki.com/',
      'https://corsaircovewiki.com/guides/',
      'https://corsaircovewiki.com/tips/',
      'https://corsaircovewiki.com/search/',
      'https://corsaircovewiki.com/robots.txt',
      'https://corsaircovewiki.com/sitemap.xml',
    ])
  })

  it('rejects a failed public route', async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const href = String(url)
      if (href.endsWith('/search/')) return new Response('unavailable', { status: 503 })
      return new Response(healthyHtml, { headers: { 'x-content-type-options': 'nosniff' } })
    })

    await expect(checkProduction(fetcher)).rejects.toThrow('/search/ returned 503')
  })

  it('rejects a public page without the production GA measurement id', async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const href = String(url)
      if (href.endsWith('/robots.txt')) return new Response('Sitemap: https://corsaircovewiki.com/sitemap.xml')
      if (href.endsWith('/sitemap.xml')) return new Response(criticalSitemap)
      if (href.endsWith('/search/')) {
        return new Response('<html><title>Corsair Cove</title><link rel="canonical">')
      }
      return new Response(healthyHtml, {
        headers: { 'x-content-type-options': 'nosniff' },
      })
    })

    await expect(checkProduction(fetcher)).rejects.toThrow('/search/ is missing GA measurement id G-YSGBPS7G81')
  })

  it('rejects a critical page without title or canonical metadata', async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const href = String(url)
      if (href.endsWith('/search/')) return new Response('<html><script>G-YSGBPS7G81</script>')
      return new Response(healthyHtml, { headers: { 'x-content-type-options': 'nosniff' } })
    })

    await expect(checkProduction(fetcher)).rejects.toThrow('/search/ is missing title or canonical metadata')
  })

  it('rejects a homepage without the nosniff response header', async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const href = String(url)
      if (href.endsWith('/robots.txt')) return new Response('Sitemap: https://corsaircovewiki.com/sitemap.xml')
      if (href.endsWith('/sitemap.xml')) return new Response(criticalSitemap)
      return new Response(healthyHtml)
    })

    await expect(checkProduction(fetcher)).rejects.toThrow('x-content-type-options must be nosniff')
  })

  it('rejects a sitemap missing a critical URL', async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const href = String(url)
      if (href.endsWith('/robots.txt')) return new Response('Sitemap: https://corsaircovewiki.com/sitemap.xml')
      if (href.endsWith('/sitemap.xml')) {
        return new Response(
          ['/', '/guides/', '/tips/']
            .map((path) => `<loc>https://corsaircovewiki.com${path}</loc>`)
            .join(''),
        )
      }
      return new Response(healthyHtml, { headers: { 'x-content-type-options': 'nosniff' } })
    })

    await expect(checkProduction(fetcher)).rejects.toThrow('sitemap is missing https://corsaircovewiki.com/search/')
  })
})
