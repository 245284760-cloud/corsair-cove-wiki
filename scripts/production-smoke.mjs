import { pathToFileURL } from 'node:url'

const origin = 'https://corsaircovewiki.com'
const pagePaths = ['/', '/guides/', '/tips/', '/search/']
const measurementId = 'G-YSGBPS7G81'

async function get(fetcher, path) {
  const response = await fetcher(`${origin}${path}`, {
    headers: { 'user-agent': 'corsair-cove-production-monitor/1.0' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`${path} returned ${response.status}`)
  return { response, text: await response.text() }
}

export async function checkProduction(fetcher = fetch) {
  for (const path of pagePaths) {
    const { response, text: html } = await get(fetcher, path)
    if (!html.includes('<title>') || !html.includes('canonical')) {
      throw new Error(`${path} is missing title or canonical metadata`)
    }
    if (!html.includes(measurementId)) {
      throw new Error(`${path} is missing GA measurement id ${measurementId}`)
    }
    if (path === '/' && response.headers.get('x-content-type-options')?.trim().toLowerCase() !== 'nosniff') {
      throw new Error('/ x-content-type-options must be nosniff')
    }
  }

  const { text: robots } = await get(fetcher, '/robots.txt')
  if (!robots.includes(`${origin}/sitemap.xml`)) throw new Error('robots.txt is missing the canonical sitemap')

  const { text: sitemap } = await get(fetcher, '/sitemap.xml')
  const sitemapLocations = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((match) => match[1])
  const sitemapUrls = sitemapLocations.length
  for (const path of pagePaths) {
    const criticalUrl = `${origin}${path}`
    if (!sitemapLocations.includes(criticalUrl)) throw new Error(`sitemap is missing ${criticalUrl}`)
  }

  return { checked: pagePaths.length + 2, sitemapUrls }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  checkProduction()
    .then((result) => console.log(JSON.stringify(result)))
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error)
      process.exitCode = 1
    })
}
