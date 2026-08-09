import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SiteFooter from '@/components/site/site-footer'
import SiteHeader from '@/components/site/site-header'

describe('site frame', () => {
  it('renders only the approved internal header navigation and a collapsed menu', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Corsair Cove Wiki' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Guides' }).getAttribute('href')).toBe('/guides/')
    expect(screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('link', { name: /Tips|How to/i })).toBeNull()
  })

  it('renders the approved official links without unavailable legal links', () => {
    render(<SiteFooter />)

    expect(screen.getByRole('link', { name: 'Play on Steam' }).getAttribute('href')).toBe(
      'https://store.steampowered.com/app/1368140/Corsair_Cove/',
    )
    expect(screen.getByRole('link', { name: 'View on Microsoft Store' }).getAttribute('href')).toBe(
      'https://www.xbox.com/en-US/games/store/corsair-cove/9PHS0189K408',
    )
    expect(screen.getByRole('link', { name: 'Official Wiki' }).getAttribute('href')).toBe(
      'https://wiki.hoodedhorse.com/Corsair_Cove/Corsair_Cove_Official_Wiki',
    )
    expect(screen.getByRole('link', { name: 'Official Discord' }).getAttribute('href')).toBe(
      'https://discord.com/invite/tz5jxS4yt9',
    )
    expect(
      screen.getByRole('link', { name: 'Limbic Entertainment on YouTube' }).getAttribute('href'),
    ).toBe('https://www.youtube.com/@LimbicEntertainment')
    expect(screen.getByRole('link', { name: 'Developer Website' }).getAttribute('href')).toBe(
      'https://www.limbic-entertainment.de',
    )
    expect(screen.getByText(/independent fan site/i)).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Privacy Policy' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Terms of Service' })).toBeNull()
  })
})
