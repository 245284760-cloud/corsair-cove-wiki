import { describe, expect, it, vi } from 'vitest'
import { checkProduction } from '../../scripts/production-smoke.mjs'

const origin = 'https://corsaircovewiki.com'
const criticalPaths = ['/', '/guides/', '/tips/', '/search/'] as const
const measurementId = 'G-YSGBPS7G81'
const htmlLimit = 1024 * 1024
const robotsLimit = 64 * 1024
const sitemapLimit = 2 * 1024 * 1024

type CriticalPath = (typeof criticalPaths)[number]
type PageOverride = {
  contentType?: string | null
  finalUrl?: string
  html?: string
  status?: number
}

function healthyHtml(path: CriticalPath) {
  return `<html><title>Corsair Cove</title><link href="${origin}${path}" rel="canonical"><script>gtag('config', '${measurementId}')</script>`
}

function renderSitemap(paths: readonly string[]) {
  const urls = paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
}

function responseAt(url: string, body: string, init?: ResponseInit) {
  const response = new Response(body, init)
  Object.defineProperty(response, 'url', { value: url })
  return response
}

function createFetcher({
  pageOverrides = {},
  robots = `User-Agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml`,
  sitemap = renderSitemap(criticalPaths),
  homepageHeader = 'NoSnIfF',
}: {
  pageOverrides?: Partial<Record<CriticalPath, PageOverride>>
  robots?: string
  sitemap?: string
  homepageHeader?: string | null
} = {}) {
  return vi.fn(async (url: RequestInfo | URL) => {
    const requestedUrl = String(url)
    const pathname = new URL(requestedUrl).pathname
    if (pathname === '/robots.txt') {
      return responseAt(requestedUrl, robots, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }
    if (pathname === '/sitemap.xml') {
      return responseAt(requestedUrl, sitemap, {
        headers: { 'Content-Type': 'application/xml' },
      })
    }

    const path = pathname as CriticalPath
    const override = pageOverrides[path]
    const headers: Record<string, string> = {}
    if (override?.contentType !== null) {
      headers['Content-Type'] = override?.contentType ?? 'text/html; charset=utf-8'
    }
    if (path === '/' && homepageHeader !== null) {
      headers['X-Content-Type-Options'] = homepageHeader
    }
    return responseAt(override?.finalUrl ?? requestedUrl, override?.html ?? healthyHtml(path), {
      status: override?.status ?? 200,
      headers,
    })
  })
}

describe('production smoke check', () => {
  it('accepts healthy pages, case-insensitive canonical attributes, and valid sitemap XML', async () => {
    const uppercaseCanonical = `<html><title>Corsair Cove</title><LINK HREF="${origin}/" REL="CANONICAL"><script>gtag('config', '${measurementId}')</script>`
    const fetcher = createFetcher({ pageOverrides: { '/': { html: uppercaseCanonical } } })

    await expect(checkProduction(fetcher)).resolves.toEqual({ checked: 6, sitemapUrls: 4 })
  })

  it('accepts a gtag configuration after an escaped script newline', async () => {
    const serializedConfig = `<html><title>Corsair Cove</title><link rel="canonical" href="${origin}/"><script>self.__next_f.push([1,"window.dataLayer = [];\\ngtag('config', '${measurementId}')"])</script>`
    const fetcher = createFetcher({ pageOverrides: { '/': { html: serializedConfig } } })

    await expect(checkProduction(fetcher)).resolves.toEqual({ checked: 6, sitemapUrls: 4 })
  })

  it('ignores a title that exists only inside an HTML comment', async () => {
    const html = `<html><!-- <title>Commented title</title> --><link rel="canonical" href="${origin}/"><script>gtag('config', '${measurementId}')</script>`
    const fetcher = createFetcher({ pageOverrides: { '/': { html } } })

    await expect(checkProduction(fetcher)).rejects.toThrow('/ is missing a non-empty title')
  })

  it('ignores a canonical link that exists only inside an HTML comment', async () => {
    const html = `<html><title>Corsair Cove</title><!-- <link rel="canonical" href="${origin}/"> --><script>gtag('config', '${measurementId}')</script>`
    const fetcher = createFetcher({ pageOverrides: { '/': { html } } })

    await expect(checkProduction(fetcher)).rejects.toThrow('/ is missing a canonical link')
  })

  describe.each(criticalPaths)('%s page', (path) => {
    it('rejects a non-success response', async () => {
      const fetcher = createFetcher({ pageOverrides: { [path]: { status: 503 } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(`${path} returned 503`)
    })

    it('rejects a response that resolved to a different route', async () => {
      const wrongUrl = path === '/' ? `${origin}/guides/` : `${origin}${path.slice(0, -1)}`
      const fetcher = createFetcher({ pageOverrides: { [path]: { finalUrl: wrongUrl } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `${path} resolved to ${wrongUrl}; expected ${origin}${path}`,
      )
    })

    it('rejects a non-HTML response', async () => {
      const fetcher = createFetcher({
        pageOverrides: { [path]: { contentType: 'application/json' } },
      })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `${path} returned non-HTML content-type application/json`,
      )
    })

    it('rejects HTML without a title', async () => {
      const html = `<html><link href="${origin}${path}" rel="canonical"><script>gtag('config', '${measurementId}')</script>`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(`${path} is missing a non-empty title`)
    })

    it('rejects HTML with an empty title', async () => {
      const html = `<html><title> \n </title><link href="${origin}${path}" rel="canonical"><script>gtag('config', '${measurementId}')</script>`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(`${path} is missing a non-empty title`)
    })

    it('rejects HTML without a canonical link', async () => {
      const html = `<html><title>Corsair Cove</title><script>gtag('config', '${measurementId}')</script>`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(`${path} is missing a canonical link`)
    })

    it('rejects a canonical link without an href', async () => {
      const html = `<html><title>Corsair Cove</title><link rel="canonical"><script>gtag('config', '${measurementId}')</script>`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `${path} canonical is missing; expected ${origin}${path}`,
      )
    })

    it('rejects a canonical link for a different route', async () => {
      const wrongCanonical = path === '/' ? `${origin}/guides/` : `${origin}/`
      const html = `<html><title>Corsair Cove</title><link rel="canonical" href="${wrongCanonical}"><script>gtag('config', '${measurementId}')</script>`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `${path} canonical is ${wrongCanonical}; expected ${origin}${path}`,
      )
    })

    it('rejects HTML without the production GA configuration', async () => {
      const html = `<html><title>Corsair Cove</title><link rel="canonical" href="${origin}${path}">`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `${path} is missing GA configuration for ${measurementId}`,
      )
    })

    it('rejects the GA measurement id when it appears only in body text', async () => {
      const html = `<html><title>Corsair Cove</title><link rel="canonical" href="${origin}${path}"><main>${measurementId}</main>`
      const fetcher = createFetcher({ pageOverrides: { [path]: { html } } })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `${path} is missing GA configuration for ${measurementId}`,
      )
    })
  })

  it('rejects a similarly named script function instead of a real gtag call', async () => {
    const html = `<html><title>Corsair Cove</title><link rel="canonical" href="${origin}/"><script>notgtag('config', '${measurementId}')</script>`
    const fetcher = createFetcher({ pageOverrides: { '/': { html } } })

    await expect(checkProduction(fetcher)).rejects.toThrow(
      `/ is missing GA configuration for ${measurementId}`,
    )
  })

  it('rejects a gtag configuration inside a script line comment', async () => {
    const html = `<html><title>Corsair Cove</title><link rel="canonical" href="${origin}/"><script>// gtag('config', '${measurementId}')</script>`
    const fetcher = createFetcher({ pageOverrides: { '/': { html } } })

    await expect(checkProduction(fetcher)).rejects.toThrow(
      `/ is missing GA configuration for ${measurementId}`,
    )
  })

  it('rejects a gtag configuration inside a script block comment', async () => {
    const html = `<html><title>Corsair Cove</title><link rel="canonical" href="${origin}/"><script>/* gtag('config', '${measurementId}') */</script>`
    const fetcher = createFetcher({ pageOverrides: { '/': { html } } })

    await expect(checkProduction(fetcher)).rejects.toThrow(
      `/ is missing GA configuration for ${measurementId}`,
    )
  })

  it('rejects an oversized HTML response body', async () => {
    const html = `${healthyHtml('/')}${'x'.repeat(htmlLimit)}`
    const fetcher = createFetcher({ pageOverrides: { '/': { html } } })

    await expect(checkProduction(fetcher)).rejects.toThrow(
      `/ exceeds the ${htmlLimit}-byte response limit`,
    )
  })

  it('rejects a homepage without the nosniff response header', async () => {
    const fetcher = createFetcher({ homepageHeader: null })

    await expect(checkProduction(fetcher)).rejects.toThrow('x-content-type-options must be nosniff')
  })

  it('rejects a homepage whose content type options header is not nosniff', async () => {
    const fetcher = createFetcher({ homepageHeader: 'sameorigin' })

    await expect(checkProduction(fetcher)).rejects.toThrow('x-content-type-options must be nosniff')
  })

  it('rejects a commented-out robots sitemap directive', async () => {
    const fetcher = createFetcher({ robots: `User-Agent: *\n# Sitemap: ${origin}/sitemap.xml` })

    await expect(checkProduction(fetcher)).rejects.toThrow(
      'robots.txt is missing the canonical sitemap directive',
    )
  })

  it('rejects an oversized robots response body', async () => {
    const robots = `Sitemap: ${origin}/sitemap.xml\n${'x'.repeat(robotsLimit)}`
    const fetcher = createFetcher({ robots })

    await expect(checkProduction(fetcher)).rejects.toThrow(
      `/robots.txt exceeds the ${robotsLimit}-byte response limit`,
    )
  })

  it('rejects malformed sitemap XML even when it contains every critical URL', async () => {
    const locations = criticalPaths.map((path) => `<loc>${origin}${path}</loc>`).join('')
    const fetcher = createFetcher({ sitemap: `<urlset>${locations}</urlset>` })

    await expect(checkProduction(fetcher)).rejects.toThrow('sitemap is malformed')
  })

  it('ignores a sitemap URL entry inside an XML comment', async () => {
    const visiblePaths = criticalPaths.filter((path) => path !== '/search/')
    const visibleUrls = visiblePaths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join('')
    const commentedUrl = `<!-- <url><loc>${origin}/search/</loc></url> -->`
    const sitemap = `<urlset>${visibleUrls}${commentedUrl}</urlset>`
    const fetcher = createFetcher({ sitemap })

    await expect(checkProduction(fetcher)).rejects.toThrow(
      `sitemap is missing ${origin}/search/`,
    )
  })

  it('rejects an oversized sitemap response body', async () => {
    const sitemap = renderSitemap(criticalPaths).replace(
      '</urlset>',
      `${' '.repeat(sitemapLimit)}</urlset>`,
    )
    const fetcher = createFetcher({ sitemap })

    await expect(checkProduction(fetcher)).rejects.toThrow(
      `/sitemap.xml exceeds the ${sitemapLimit}-byte response limit`,
    )
  })

  describe.each(criticalPaths)('sitemap without %s', (missingPath) => {
    it('rejects the missing critical URL', async () => {
      const sitemap = renderSitemap(criticalPaths.filter((path) => path !== missingPath))
      const fetcher = createFetcher({ sitemap })

      await expect(checkProduction(fetcher)).rejects.toThrow(
        `sitemap is missing ${origin}${missingPath}`,
      )
    })
  })
})
