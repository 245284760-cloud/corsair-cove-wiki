import { pathToFileURL } from 'node:url'

const origin = 'https://corsaircovewiki.com'
const pagePaths = ['/', '/guides/', '/tips/', '/search/']
const measurementId = 'G-YSGBPS7G81'
const responseLimits = new Map([
  ['/robots.txt', 64 * 1024],
  ['/sitemap.xml', 2 * 1024 * 1024],
])
const htmlResponseLimit = 1024 * 1024

function readTag(source, start) {
  let cursor = start + 1
  while (/\s/.test(source[cursor] ?? '')) cursor += 1

  const closing = source[cursor] === '/'
  if (closing) {
    cursor += 1
    while (/\s/.test(source[cursor] ?? '')) cursor += 1
  }

  const nameStart = cursor
  while (/[A-Za-z0-9:-]/.test(source[cursor] ?? '')) cursor += 1
  if (cursor === nameStart) return null
  const name = source.slice(nameStart, cursor).toLowerCase()

  let quote = null
  for (; cursor < source.length; cursor += 1) {
    const character = source[cursor]
    if (quote) {
      if (character === quote) quote = null
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (character === '>') {
      let beforeEnd = cursor - 1
      while (/\s/.test(source[beforeEnd] ?? '')) beforeEnd -= 1
      return {
        closing,
        end: cursor,
        name,
        selfClosing: source[beforeEnd] === '/',
        start,
        source: source.slice(start, cursor + 1),
      }
    }
  }
  return null
}

function parseAttributes(tag) {
  const attributes = new Map()
  const source = tag.replace(/^<\/?[a-z][^\s>]*/i, '').replace(/\/?>\s*$/i, '')
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g
  for (const match of source.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4])
  }
  return attributes
}

function findClosingTag(source, lowerSource, name, from) {
  const needle = `</${name}`
  let cursor = from
  while (cursor < source.length) {
    const start = lowerSource.indexOf(needle, cursor)
    if (start === -1) return null
    const afterName = lowerSource[start + needle.length]
    if (!afterName || /[\s/>]/.test(afterName)) {
      const tag = readTag(source, start)
      if (tag?.closing && tag.name === name) return tag
    }
    cursor = start + needle.length
  }
  return null
}

function scanHtml(html) {
  const metadata = { canonicals: [], scripts: [], titles: [] }
  const lowerHtml = html.toLowerCase()
  let cursor = 0

  while (cursor < html.length) {
    const start = html.indexOf('<', cursor)
    if (start === -1) break

    if (html.startsWith('<!--', start)) {
      const commentEnd = html.indexOf('-->', start + 4)
      if (commentEnd === -1) break
      cursor = commentEnd + 3
      continue
    }

    const tag = readTag(html, start)
    if (!tag) {
      cursor = start + 1
      continue
    }
    cursor = tag.end + 1
    if (tag.closing) continue

    if (tag.name === 'link') {
      const attributes = parseAttributes(tag.source)
      const isCanonical = (attributes.get('rel') ?? '')
        .split(/\s+/)
        .some((value) => value.toLowerCase() === 'canonical')
      if (isCanonical) metadata.canonicals.push(attributes.get('href'))
      continue
    }

    if (tag.name !== 'script' && tag.name !== 'title') continue
    const closingTag = findClosingTag(html, lowerHtml, tag.name, cursor)
    if (!closingTag) break
    const content = html.slice(cursor, closingTag.start)
    if (tag.name === 'script') metadata.scripts.push(content)
    else metadata.titles.push(content)
    cursor = closingTag.end + 1
  }

  return metadata
}

function withoutJavaScriptComments(source) {
  const output = []
  let cursor = 0
  let quote = null

  while (cursor < source.length) {
    const character = source[cursor]
    const next = source[cursor + 1]
    if (quote) {
      output.push(character)
      if (character === '\\' && next) {
        output.push(next)
        cursor += 2
        continue
      }
      if (character === quote) quote = null
      cursor += 1
      continue
    }

    if (character === '"' || character === "'" || character === '`') {
      quote = character
      output.push(character)
      cursor += 1
      continue
    }
    if (character === '/' && next === '/') {
      cursor += 2
      while (cursor < source.length && source[cursor] !== '\n' && source[cursor] !== '\r') {
        cursor += 1
      }
      continue
    }
    if (character === '/' && next === '*') {
      const commentEnd = source.indexOf('*/', cursor + 2)
      if (commentEnd === -1) break
      cursor = commentEnd + 2
      continue
    }
    output.push(character)
    cursor += 1
  }

  return output.join('')
}

function hasGaConfiguration(scripts) {
  const escapedId = measurementId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const configPattern = new RegExp(
    `(?:^|[^A-Za-z0-9_$]|\\\\n)gtag\\s*\\(\\s*(['"])config\\1\\s*,\\s*(['"])${escapedId}\\2(?:\\s*[,\\)])`,
    'i',
  )

  // Next may serialize inline script source inside an RSC <script> element. This verifies that
  // deployed markup declares the GA config; it does not prove browser execution or data delivery.
  return scripts.some((script) => configPattern.test(withoutJavaScriptComments(script)))
}

function removeMarkupComments(source) {
  const output = []
  let cursor = 0
  while (cursor < source.length) {
    const commentStart = source.indexOf('<!--', cursor)
    if (commentStart === -1) {
      output.push(source.slice(cursor))
      break
    }
    output.push(source.slice(cursor, commentStart), ' ')
    const commentEnd = source.indexOf('-->', commentStart + 4)
    if (commentEnd === -1) return null
    cursor = commentEnd + 3
  }
  return output.join('')
}

function skipWhitespace(source, from) {
  let cursor = from
  while (/\s/.test(source[cursor] ?? '')) cursor += 1
  return cursor
}

function sitemapLocations(xml) {
  const source = removeMarkupComments(xml)
  if (source === null) return null

  let cursor = skipWhitespace(source, 0)
  if (source.slice(cursor, cursor + 5).toLowerCase() === '<?xml') {
    const declarationEnd = source.indexOf('?>', cursor + 5)
    if (declarationEnd === -1) return null
    cursor = skipWhitespace(source, declarationEnd + 2)
  }

  const root = source[cursor] === '<' ? readTag(source, cursor) : null
  if (!root || root.closing || root.selfClosing || root.name !== 'urlset') return null

  const stack = ['urlset']
  const locations = []
  let currentUrl = null
  let locationText = ''
  cursor = root.end + 1

  while (stack.length > 0) {
    const tagStart = source.indexOf('<', cursor)
    if (tagStart === -1) return null
    const text = source.slice(cursor, tagStart)
    const parent = stack.at(-1)
    if ((parent === 'urlset' || parent === 'url') && text.trim()) return null
    if (parent === 'loc') locationText += text

    const tag = readTag(source, tagStart)
    if (!tag) return null

    if (tag.closing) {
      if (stack.at(-1) !== tag.name) return null
      if (tag.name === 'loc') {
        if (!currentUrl || !locationText.trim()) return null
        currentUrl.push(locationText.trim())
        locationText = ''
      }
      stack.pop()
      if (tag.name === 'url') {
        if (!currentUrl || currentUrl.length !== 1) return null
        locations.push(currentUrl[0])
        currentUrl = null
      }
      cursor = tag.end + 1
      continue
    }

    if (parent === 'loc' || tag.name === 'urlset') return null
    if (tag.name === 'url') {
      if (parent !== 'urlset' || currentUrl) return null
      currentUrl = []
    } else if (tag.name === 'loc') {
      if (parent !== 'url' || !currentUrl) return null
      locationText = ''
    } else if (parent === 'urlset') {
      return null
    }

    if (tag.selfClosing) {
      if (tag.name === 'url' || tag.name === 'loc') return null
    } else {
      stack.push(tag.name)
    }
    cursor = tag.end + 1
  }

  if (currentUrl || source.slice(cursor).trim() || locations.length === 0) return null
  return locations
}

async function readTextWithinLimit(response, path, limit) {
  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > limit) {
    throw new Error(`${path} exceeds the ${limit}-byte response limit`)
  }
  if (!response.body) return ''

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  const chunks = []
  let received = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.byteLength
      if (received > limit) {
        await reader.cancel()
        throw new Error(`${path} exceeds the ${limit}-byte response limit`)
      }
      chunks.push(decoder.decode(value, { stream: true }))
    }
    chunks.push(decoder.decode())
    return chunks.join('')
  } finally {
    reader.releaseLock()
  }
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

  const limit = responseLimits.get(path) ?? htmlResponseLimit
  return { response, text: await readTextWithinLimit(response, path, limit) }
}

export async function checkProduction(fetcher = fetch) {
  for (const path of pagePaths) {
    const { response, text: html } = await get(fetcher, path)
    const contentType = response.headers.get('content-type')?.trim() ?? 'missing'
    if (!/^text\/html(?:\s*;|$)/i.test(contentType)) {
      throw new Error(`${path} returned non-HTML content-type ${contentType}`)
    }

    const metadata = scanHtml(html)
    if (metadata.titles.length !== 1 || !metadata.titles[0].trim()) {
      throw new Error(`${path} is missing a non-empty title`)
    }
    if (metadata.canonicals.length === 0) throw new Error(`${path} is missing a canonical link`)
    if (metadata.canonicals.length > 1) throw new Error(`${path} has multiple canonical links`)
    const expectedCanonical = `${origin}${path}`
    if (metadata.canonicals[0] !== expectedCanonical) {
      throw new Error(
        `${path} canonical is ${metadata.canonicals[0] || 'missing'}; expected ${expectedCanonical}`,
      )
    }
    if (!hasGaConfiguration(metadata.scripts)) {
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
