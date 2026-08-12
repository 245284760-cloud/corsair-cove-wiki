import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GuidesPage, { metadata } from '@/app/guides/page'
import {
  connectionsMeta,
  discoveryEventsMeta,
  guideEntries,
  guideGroups,
  GUIDE_SLUGS,
} from '@/content/guides'

describe('guides page', () => {
  it('renders one guide hub heading and every registered published guide destination', () => {
    const { container } = render(<GuidesPage />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Corsair Cove Guides' })).toBeTruthy()
    expect(screen.getAllByRole('link').filter((link) => (
      GUIDE_SLUGS.some((slug) => link.getAttribute('href') === `/${slug}/`)
    ))).toHaveLength(guideEntries.length)
    expect(screen.getByRole('link', { name: /^Discovery Events:/ }).getAttribute('href')).toBe(
      discoveryEventsMeta.href,
    )
    expect(screen.getByRole('link', { name: /^Platforms:/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /^Resources:/ })).toBeTruthy()
    expect(screen.getByRole('link', { name: /^Production Chains:/ })).toBeTruthy()

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
    expect(metadata.title).toMatch(/Game Information/i)
    expect(metadata.description).toMatch(/game information|troubleshooting/i)
  })

  it('publishes the high-building connection guide at its explicit destination', () => {
    render(<GuidesPage />)

    expect(screen.getByRole('link', { name: /^Connect High Buildings:/ }).getAttribute('href')).toBe(
      connectionsMeta.href,
    )
  })
})
