import { describe, expect, it } from 'vitest'
import { homeContent } from '@/lib/home-content'
import { PUBLIC_ROUTES } from '@/lib/routes'

function allInternalLinks(value: unknown): string[] {
  const links = collectInternalLinks(value)
  return [...new Set(links)]
}

function collectInternalLinks(value: unknown): string[] {
  if (typeof value === 'string') {
    return value.startsWith('/') ? [value] : []
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectInternalLinks)
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectInternalLinks)
  }

  return []
}

describe('validated home content', () => {
  it('keeps the four approved stable hero statistics', () => {
    expect(homeContent.home.hero.stats).toEqual([
      'Released Jul 31, 2026',
      '50+ Goods',
      '4 Principle Paths',
      '62 Steam Achievements',
    ])
  })

  it('contains only published internal links', () => {
    expect(allInternalLinks(homeContent).sort()).toEqual([
      '/connect-high-buildings/',
      '/guides/',
      '/how-to-build-ship/',
      '/how-to-get-more-drifters/',
      '/platforms/',
      '/price/',
      '/release-date/',
      '/system-requirements/',
      '/tips/',
      '/troubleshooting/',
    ])
    expect(allInternalLinks(homeContent).every((href) => PUBLIC_ROUTES.includes(href as (typeof PUBLIC_ROUTES)[number]))).toBe(true)
  })

  it('omits unpublished features and claims from the runtime copy', () => {
    const serialized = JSON.stringify(homeContent)

    expect(serialized).not.toMatch(/\/privacy\/|\/terms\//)
    expect(homeContent.home.meta.description).toMatch(/game information|troubleshooting/i)
    expect(homeContent.metadata.description).toMatch(/game information|troubleshooting/i)
    expect(homeContent.footer.about).not.toMatch(/platforms|common fixes/i)
    expect(homeContent).not.toHaveProperty('sidebarCodes')
  })
})
