import { pathToFileURL } from 'node:url'

const origin = 'https://corsaircovewiki.com'
const pagePaths = ['/', '/guides/', '/tips/', '/search/']
const measurementId = 'G-YSGBPS7G81'

function parseAttributes(tag) {
  const attributes = new Map()
  const source = tag.replace(/^<\/?[a-z][^\s>]*/i, '').replace(/\/?>\s*$/i, '')
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g
  for (const match of source.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4])
  }
  return attributes
}

function canonicalHref(html) {
  const canonicalLinks = (html.match(/<link\b[^>]*>/gi) ?? [])
    .map((tag) => parseAttributes(tag))
    .filter((attributes) =>
      (attributes.get('rel') ?? '')
        .split(/\s+/)
        .some((value) => value.toLowerCase() === 'canonical'),
    )

  if (canonicalLinks.length === 0) return { error: 'missing' }
  if (canonicalLinks.length > 1) return { error: 'multiple' }
  return { href: canonicalLinks[0].get('href') }
}

function hasGaConfiguration(html) {
  const escapedId = measurementId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const configPattern = new RegExp(
    `(?:^|[^A-Za-z0-9_$]|\\\\n)gtag\\s*\\(\\s*(['"])config\\1\\s*,\\s*(['"])${escapedId}\\2(?:\\s*[,\\)])`,
    'i',
  )
  return (html.match(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi) ?? []).some((script) =>
    configPattern.test(script),
  )
}

function sitemapLocations(xml) {
  const document = xml
    .trim()
    .match(/^(?:<\?xml\b[^?]*\?>\s*)?<urlset\b[^>]*>([\s\S]*)<\/urlset>\s*$/i)
  if (!document) return null

  const urlPattern = /<url\b[^>]*>([\s\S]*?)<\/url\s*>/gi
  const urlEntries = [...document[1].matchAll(urlPattern)]
  if (urlEntries.length === 0 || document[1].replace(urlPattern, '').trim() !== '') return null

  const locations = []
  for (const entry of urlEntries) {
    const locationMatches = [...entry[1].matchAll(/<loc\b[^>]*>\s*([^<]+?)\s*<\/loc\s*>/gi)]
    if (locationMatches.length !== 1 || (entry[1].match(/<loc\b/gi) ?? []).length !== 1) {
      return null
    }
    locations.push(locationMatches[0][1])
  }
  return locations
}

async function get(fetcher, path) {
  const requestedUrl = `${origin}${path}`
  const response = await fetcher(requestedUrl, {
    headers: { 'user-agent': 'corsair-cove-production-monitor/1.0' },
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`${path} returned ${response.status}`)
  const finalUrl = response.url ? new URL(response.url).href : response.url
  if (finalUrl !== requestedUrl) {
    throw new Error(`${path} resolved to ${finalUrl || 'an unknown URL'}; expected ${requestedUrl}`)
  }
  return { response, text: await response.text() }
}

export async function checkProduction(fetcher = fetch) {
  for (const path of pagePaths) {
    const { response, text: html } = await get(fetcher, path)
    const contentType = response.headers.get('content-type')?.trim() ?? 'missing'
    if (!/^text\/html(?:\s*;|$)/i.test(contentType)) {
      throw new Error(`${path} returned non-HTML content-type ${contentType}`)
    }

    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1]
    if (!title?.trim()) throw new Error(`${path} is missing a non-empty title`)

    const canonical = canonicalHref(html)
    if (canonical.error === 'missing') throw new Error(`${path} is missing a canonical link`)
    if (canonical.error === 'multiple') throw new Error(`${path} has multiple canonical links`)
    const expectedCanonical = `${origin}${path}`
    if (canonical.href !== expectedCanonical) {
      throw new Error(`${path} canonical is ${canonical.href || 'missing'}; expected ${expectedCanonical}`)
    }

    if (!hasGaConfiguration(html)) {
      throw new Error(`${path} is missing GA configuration for ${measurementId}`)
    }
    if (path === '/' && response.headers.get('x-content-type-options')?.trim().toLowerCase() !== 'nosniff') {
      throw new Error('/ x-content-type-options must be nosniff')
    }
  }

  const { text: robots } = await get(fetcher, '/robots.txt')
  const hasSitemapDirective = robots.split(/\r?\n/).some((line) => {
    const directive = line.trim().match(/^sitemap\s*:\s*(\S+)\s*$/i)
    return directive?.[1] === `${origin}/sitemap.xml`
  })
  if (!hasSitemapDirective) throw new Error('robots.txt is missing the canonical sitemap directive')

  const { text: sitemap } = await get(fetcher, '/sitemap.xml')
  const locations = sitemapLocations(sitemap)
  if (!locations) throw new Error('sitemap is malformed')
  const sitemapUrls = locations.length
  for (const path of pagePaths) {
    const criticalUrl = `${origin}${path}`
    if (!locations.includes(criticalUrl)) throw new Error(`sitemap is missing ${criticalUrl}`)
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
