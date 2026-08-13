import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TrackedLink } from '@/components/site/tracked-link'

describe('TrackedLink', () => {
  afterEach(() => {
    delete (window as Window & { gtag?: unknown }).gtag
  })

  it('sends a GA4 event without blocking navigation', () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    render(<TrackedLink href="/tips/" eventName="guide_click" eventParams={{ link_url: '/tips/' }}>Tips</TrackedLink>)

    fireEvent.click(screen.getByRole('link', { name: 'Tips' }))

    expect(gtag).toHaveBeenCalledWith('event', 'guide_click', { link_url: '/tips/' })
    expect(screen.getByRole('link').getAttribute('href')).toBe('/tips/')
  })

  it('does nothing when analytics is unavailable', () => {
    render(<TrackedLink href="/tips/" eventName="guide_click">Tips</TrackedLink>)
    expect(() => fireEvent.click(screen.getByRole('link'))).not.toThrow()
  })
})
