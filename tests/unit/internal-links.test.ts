import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CANONICAL_ORIGIN } from '@/lib/metadata'
import { PUBLIC_ROUTES, type PublicRoute } from '@/lib/routes'

type RuntimeFile = { path: string; source: string }

const RUNTIME_SOURCE_DIRECTORY = 'src'
const EXCLUDED_RUNTIME_DIRECTORIES = new Set(['docs', 'research', 'test', 'tests'])
const RUNTIME_EXTENSIONS = new Set(['.json', '.mdx', '.ts', '.tsx'])
const APPROVED_EXTERNAL_HOSTS = new Set([
  'store.steampowered.com',
  'www.xbox.com',
  'wiki.hoodedhorse.com',
  'steamcommunity.com',
  'discord.com',
  'www.youtube.com',
  'www.limbic-entertainment.de',
])

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

function normalizeInternalPath(link: string): string | null {
  if (link.startsWith('#')) return null

  const url = new URL(link, CANONICAL_ORIGIN)
  if (url.origin !== CANONICAL_ORIGIN) {
    if (url.protocol !== 'https:' || !APPROVED_EXTERNAL_HOSTS.has(url.hostname)) {
      throw new Error(`Unapproved external URL: ${link}`)
    }

    return null
  }

  const path = url.pathname.replace(/\/+$/, '') || '/'
  return path === '/' ? path : `${path}/`
}

function discoveredLinks(files: RuntimeFile[] = runtimeFiles()): Array<{ path: string; link: string }> {
  const quotedPath = /(['"`])(\/?[^'"`\s)]+)\1/g

  return files.flatMap(({ path, source }) => Array.from(source.matchAll(quotedPath)).flatMap((match) => {
    const link = match[2]
    if (!link.startsWith('/') && !/^[a-z][a-z\d+.-]*:\/\/[^/\s]+/i.test(link) && !link.startsWith('#')) return []

    return [{ path, link }]
  }))
}

function inspectLink(candidate: { path: string; link: string }): { normalized: string | null; violation?: string } {
  try {
    const normalized = normalizeInternalPath(candidate.link)

    if (normalized && !PUBLIC_ROUTES.includes(normalized as PublicRoute)) {
      return {
        normalized: null,
        violation: `${candidate.path}: ${candidate.link}: internal route is not in the public allowlist`,
      }
    }

    return { normalized }
  } catch (error) {
    return { normalized: null, violation: `${candidate.path}: ${candidate.link}: ${(error as Error).message}` }
  }
}

describe('published internal links', () => {
  it('discovers non-HTTPS absolute URLs instead of silently dropping them', () => {
    expect(discoveredLinks([{ path: 'src/i18n/en.json', source: 'const link = "http://example.com/offer"' }])).toEqual([
      { path: 'src/i18n/en.json', link: 'http://example.com/offer' },
    ])
  })

  it('does not mistake CSS values or URL prefixes for absolute URLs', () => {
    expect(discoveredLinks([{ path: 'src/components/example.tsx', source: '"md:hidden" "https://" "https://example.com/guide"' }])).toEqual([
      { path: 'src/components/example.tsx', link: 'https://example.com/guide' },
    ])
  })

  it('reports invalid internal routes with their original file and matched value', () => {
    const candidate = { path: 'src/i18n/en.json', link: '/privacy' }

    expect(inspectLink(candidate)).toEqual({
      normalized: null,
      violation: 'src/i18n/en.json: /privacy: internal route is not in the public allowlist',
    })
  })

  it('normalizes every discovered runtime link to the six-route public allowlist', () => {
    const inspectedLinks = discoveredLinks().map(inspectLink)
    const violations = inspectedLinks.flatMap(({ violation }) => violation ? [violation] : [])
    const discoveredInternalLinks = inspectedLinks.flatMap(({ normalized }) => normalized ? [normalized] : [])

    expect(violations, violations.join('\n')).toEqual([])
    expect(discoveredInternalLinks.sort()).toEqual(
      discoveredInternalLinks.filter((link) => PUBLIC_ROUTES.includes(link as PublicRoute)).sort(),
    )
  })
})
