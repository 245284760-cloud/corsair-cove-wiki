import { readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CANONICAL_ORIGIN } from '@/lib/metadata'
import { PUBLIC_ROUTES, type PublicRoute } from '@/lib/routes'

type RuntimeFile = { path: string; source: string }

const RUNTIME_DIRECTORIES = ['src/app', 'src/components', 'src/content']
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

      if (entry.isDirectory()) return collect(fullPath)
      if (!entry.isFile() || !RUNTIME_EXTENSIONS.has(entry.name.slice(entry.name.lastIndexOf('.')))) return []

      return [{ path: relative(root, fullPath).replaceAll('\\', '/'), source: readFileSync(fullPath, 'utf8') }]
    })
  }

  return RUNTIME_DIRECTORIES.flatMap((directory) => collect(join(root, directory)))
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

function discoveredLinks(): Array<{ path: string; link: string }> {
  const quotedPath = /(['"`])(\/?[^'"`\s)]+)\1/g

  return runtimeFiles().flatMap(({ path, source }) => Array.from(source.matchAll(quotedPath)).flatMap((match) => {
    const link = match[2]
    if (!link.startsWith('/') && !link.startsWith('https://') && !link.startsWith('#')) return []

    return [{ path, link }]
  }))
}

describe('published internal links', () => {
  it('normalizes every discovered runtime link to the six-route public allowlist', () => {
    const violations: string[] = []
    const discoveredInternalLinks = discoveredLinks().flatMap(({ path, link }) => {
      try {
        const normalized = normalizeInternalPath(link)
        return normalized ? [normalized] : []
      } catch (error) {
        violations.push(`${path}: ${link}: ${(error as Error).message}`)
        return []
      }
    })

    expect(violations, violations.join('\n')).toEqual([])
    expect(discoveredInternalLinks.sort()).toEqual(
      discoveredInternalLinks.filter((link) => PUBLIC_ROUTES.includes(link as PublicRoute)).sort(),
    )
  })
})
