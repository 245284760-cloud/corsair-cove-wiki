import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GuidesPage, { metadata } from '@/app/guides/page'
import { connectionsMeta, guideEntries, guideGroups, GUIDE_SLUGS } from '@/content/guides'

describe('guides page', () => {
  it('renders one guide hub heading and exactly four published guide destinations', () => {
    const { container } = render(<GuidesPage />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Corsair Cove Guides' })).toBeTruthy()
    expect(screen.getAllByRole('link').filter((link) => (
      GUIDE_SLUGS.some((slug) => link.getAttribute('href') === `/${slug}/`)
    ))).toHaveLength(4)
    expect(screen.queryByRole('link', { name: /mods/i })).toBeNull()

    const allowedInternalHrefs = new Set(['/', ...guideEntries.map(({ meta }) => meta.href)])
    const internalHrefs = Array.from(container.querySelectorAll<HTMLAnchorElement>('a[href^="/"]'))
      .map((link) => link.getAttribute('href'))

    expect(internalHrefs).toEqual(expect.arrayContaining(['/', ...guideEntries.map(({ meta }) => meta.href)]))
    expect(internalHrefs.every((href) => href !== null && allowedInternalHrefs.has(href))).toBe(true)
  })

  it('groups the registry by task and exposes scoped metadata', () => {
    render(<GuidesPage />)

    expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeTruthy()
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual(guideGroups)
    expect(metadata.title).toBe('Corsair Cove Guides – Tips, Drifters, Ships & Building')
    expect(metadata.description).toBe(
      'Verified Corsair Cove guides for beginner tips, Drifters, shipbuilding, and connecting high buildings.',
    )
  })

  it('publishes the high-building connection guide at its explicit destination', () => {
    render(<GuidesPage />)

    expect(screen.getByRole('link', { name: /^Connect High Buildings:/ }).getAttribute('href')).toBe(
      connectionsMeta.href,
    )
  })
})
