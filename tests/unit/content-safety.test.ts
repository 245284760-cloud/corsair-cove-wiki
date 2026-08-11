import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

type RuntimeFile = { path: string; source: string }

const RUNTIME_SOURCE_DIRECTORY = 'src'
const EXCLUDED_RUNTIME_DIRECTORIES = new Set(['docs', 'research', 'test', 'tests'])
const RUNTIME_EXTENSIONS = new Set(['.json', '.mdx', '.ts', '.tsx'])

type SafetyRule = {
  label: string
  pattern: RegExp
  allowedPaths?: readonly RegExp[]
}

const safetyRules: readonly SafetyRule[] = [
  { label: 'unpublished route', pattern: /\/(?:privacy|terms|mods|golden-city-maze|tobacco|rope)\//i },
  { label: 'unapproved game reference', pattern: /\bOSRS\b|second pirate camp/i },
  { label: 'cheat or piracy term', pattern: /cheat engine|\bcrack\b|\btorrent\b/i },
  { label: 'fabricated Codes heading', pattern: /^#{1,6}\s+.*\bcodes?\b/im },
  { label: 'price claim', pattern: /(?:\$|€)\s*\d|\b(?:USD|EUR)\b/i, allowedPaths: [/^src\/content\/guides\/(?:price\.mdx|price-meta\.ts)$/i] },
  { label: 'discount claim', pattern: /\b(?:save|saving|discount)\s+\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?%\s*(?:off|discount|savings?)\b/i, allowedPaths: [/^src\/content\/guides\/(?:price\.mdx|price-meta\.ts)$/i] },
  { label: 'review-percentage claim', pattern: /\b\d+(?:\.\d+)?%\s*(?:positive|negative)\s+reviews?\b|\b\d+(?:\.\d+)?%\s+reviews?\s+(?:positive|negative)\b|\b\d+(?:\.\d+)?%\s+of\s+reviews?\s+(?:are|is)\s+(?:positive|negative)\b|\b(?:positive|negative)\s+review\s+(?:rate|score)\s*(?:of|is)?\s*\d+(?:\.\d+)?%/i },
] as const

function runtimeFiles(): RuntimeFile[] {
  const root = resolve(process.cwd())

  function collect(directory: string): RuntimeFile[] {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = join(directory, entry.name)

      if (entry.isDirectory()) return EXCLUDED_RUNTIME_DIRECTORIES.has(entry.name) ? [] : collect(fullPath)
      if (!entry.isFile() || !RUNTIME_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf('.')))) return []

      return [{ path: relative(root, fullPath).replaceAll('\\', '/'), source: readFileSync(fullPath, 'utf8') }]
    })
  }

  return collect(join(root, RUNTIME_SOURCE_DIRECTORY))
}

describe('production content safety', () => {
  it('scans every shipped source directory, including runtime i18n content', () => {
    expect(runtimeFiles().map(({ path }) => path)).toContain('src/i18n/en.json')
  })

  it('detects ordinary volatile claims without rejecting approved stable facts', () => {
    const matchedLabels = (source: string, path = 'src/content/guides/tips.mdx') => safetyRules
      .filter(({ pattern, allowedPaths }) => pattern.test(source) && !allowedPaths?.some((allowedPath) => allowedPath.test(path)))
      .map(({ label }) => label)

    expect(matchedLabels('Save 20% on Corsair Cove today.')).toContain('discount claim')
    expect(matchedLabels('Players receive 20% savings this week.')).toContain('discount claim')
    expect(matchedLabels('85% of reviews are positive.')).toContain('review-percentage claim')
    expect(matchedLabels('85% reviews positive.')).toContain('review-percentage claim')
    expect(matchedLabels('Corsair Cove includes 50+ goods, 4 Principle Paths, and 62 Steam achievements.')).toEqual([])
    expect(matchedLabels('Build reliable supply lines with workers, piers, and connected production.')).toEqual([])
  })

  it('allows dated price and discount claims only in the price guide', () => {
    const claim = 'France price: EUR 39.99 base, EUR 29.99, 25% off during the launch sale.'
    const matchedLabels = (source: string, path: string) => safetyRules
      .filter(({ pattern, allowedPaths }) => pattern.test(source) && !allowedPaths?.some((allowedPath) => allowedPath.test(path)))
      .map(({ label }) => label)

    expect(matchedLabels(claim, 'src/content/guides/price.mdx')).not.toContain('price claim')
    expect(matchedLabels(claim, 'src/app/page.tsx')).toContain('price claim')
    expect(matchedLabels(claim, 'src/app/page.tsx')).toContain('discount claim')
  })

  it('continues prohibiting review-percentage claims in every path', () => {
    const matchedLabels = (source: string, path: string) => safetyRules
      .filter(({ pattern, allowedPaths }) => pattern.test(source) && !allowedPaths?.some((allowedPath) => allowedPath.test(path)))
      .map(({ label }) => label)

    expect(matchedLabels('85% of reviews are positive.', 'src/content/guides/price.mdx')).toContain('review-percentage claim')
  })

  it('keeps prohibited routes, game references, cheat terms, and volatile claims out of runtime content', () => {
    const violations = runtimeFiles().flatMap(({ path, source }) => safetyRules.flatMap(({ label, pattern, allowedPaths }) => {
      if (allowedPaths?.some((allowedPath) => allowedPath.test(path))) return []
      const match = source.match(pattern)
      return match ? [`${path}: ${label}: ${match[0]}`] : []
    }))

    expect(violations, violations.join('\n')).toEqual([])
  })
})
