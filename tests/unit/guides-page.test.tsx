import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import GuidesPage, { metadata } from '@/app/guides/page'
import { GUIDE_SLUGS } from '@/content/guides'

describe('guides page', () => {
  it('renders one guide hub heading and exactly four published guide destinations', () => {
    render(<GuidesPage />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Corsair Cove Guides' })).toBeTruthy()
    expect(screen.getAllByRole('link').filter((link) => (
      GUIDE_SLUGS.some((slug) => link.getAttribute('href') === `/${slug}/`)
    ))).toHaveLength(4)
    expect(screen.queryByRole('link', { name: /mods/i })).toBeNull()
  })

  it('groups the registry by task and exposes scoped metadata', () => {
    render(<GuidesPage />)

    expect(screen.getByRole('navigation', { name: 'Breadcrumbs' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Start Here' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Population' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Ships' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Construction' })).toBeTruthy()
    expect(metadata.title).toBe('Corsair Cove Guides – Tips, Drifters, Ships & Building')
    expect(metadata.description).toBe(
      'Verified Corsair Cove guides for beginner tips, Drifters, shipbuilding, and connecting high buildings.',
    )
  })
})
