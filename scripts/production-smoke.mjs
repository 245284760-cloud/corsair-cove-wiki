import { pathToFileURL } from 'node:url'

const origin = 'https://corsaircovewiki.com'
const pagePaths = ['/', '/guides/', '/tips/']

async function get(fetcher, path) {
  const response = await fetcher(`${origin}${path}`, {
    headers: { 'user-agent': 'corsair-cove-production-monitor/1.0' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`${path} returned ${response.status}`)
  return response.text()
}

export async function checkProduction(fetcher = fetch) {
  for (const path of pagePaths) {
    const html = await get(fetcher, path)
    if (!html.includes('<title>') || !html.includes('canonical')) {
      throw new Error(`${path} is missing title or canonical metadata`)
    }
  }

  const robots = await get(fetcher, '/robots.txt')
  if (!robots.includes(`${origin}/sitemap.xml`)) throw new Error('robots.txt is missing the canonical sitemap')

  const sitemap = await get(fetcher, '/sitemap.xml')
  const sitemapUrls = (sitemap.match(/<loc>/g) ?? []).length
  if (sitemapUrls !== 20) throw new Error(`sitemap contains ${sitemapUrls} URLs; expected 20`)

  return { checked: 5, sitemapUrls }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  checkProduction()
    .then((result) => console.log(JSON.stringify(result)))
    .catch((error) => {
      console.error(error instanceof Error ? error.message : error)
      process.exitCode = 1
    })
}
