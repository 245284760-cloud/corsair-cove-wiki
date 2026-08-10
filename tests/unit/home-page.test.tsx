import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Page, { metadata } from '@/app/page'
import { PUBLIC_ROUTES } from '@/lib/routes'

describe('home page', () => {
  it('renders the complete homepage hierarchy with exactly one H1', () => {
    render(<Page />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Corsair Cove Wiki' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Build Your First Stronghold' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'What is Corsair Cove?' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Ready to Raise Your Pirate Stronghold?' })).toBeTruthy()
    expect(screen.getByText('Released Jul 31, 2026')).toBeTruthy()
    expect(screen.getByText('62 Steam Achievements')).toBeTruthy()
  })

  it('renders only approved internal destinations and all four Start Here cards', () => {
    const { container } = render(<Page />)
    const links = Array.from(container.querySelectorAll('a[href^="/"]'))

    expect(screen.getByRole('link', { name: 'Beginner Tips' }).getAttribute('href')).toBe('/tips/')
    expect(screen.getByRole('link', { name: 'Get More Drifters' }).getAttribute('href')).toBe('/how-to-get-more-drifters/')
    expect(screen.getByRole('link', { name: 'Build Your First Ship' }).getAttribute('href')).toBe('/how-to-build-ship/')
    expect(screen.getByRole('link', { name: 'Connect High Buildings' }).getAttribute('href')).toBe('/connect-high-buildings/')
    expect(links.every((link) => PUBLIC_ROUTES.includes(link.getAttribute('href') as (typeof PUBLIC_ROUTES)[number]))).toBe(true)
  })

  it('uses dedicated contrast-safe hero and CTA color roles', () => {
    render(<Page />)

    const hero = screen.getByRole('heading', { level: 1, name: 'Corsair Cove Wiki' }).closest('section')
    expect(hero?.className).toContain('bg-hero-background')
    expect(hero?.className).toContain('text-hero-foreground')
    expect(screen.getByText('Independent Fan-Made Strategy Guide').className).toContain('text-hero-accent')
    expect(screen.getByRole('link', { name: 'Start with Beginner Tips' }).className).toContain('text-cta-foreground')
  })

  it('uses the canonical metadata without unpublished coverage claims', () => {
    expect(metadata.title).toBe('Corsair Cove Wiki \u2013 Guides, Ships, Resources & Tips')
    expect(metadata.description).toBe(
      'Corsair Cove wiki with verified beginner guides for drifters, ships, Fetchers, logistics, and vertical building.',
    )
    expect(metadata.alternates?.canonical).toBe('https://corsaircovewiki.com/')
    expect(JSON.stringify(metadata)).not.toMatch(/price|platform|system requirement|troubleshooting/i)
  })
})
