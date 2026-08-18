import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TrackedLink } from '@/components/site/tracked-link'
import { trackEvent, type AnalyticsEventName } from '@/lib/analytics'

type ExpectedAnalyticsEventName =
  | 'guide_click'
  | 'source_click'
  | 'internal_search'
  | 'guide_engaged'
  | 'related_guide_click'

type IsExact<Actual, Expected> =
  [Actual] extends [Expected]
    ? [Expected] extends [Actual]
      ? true
      : false
    : false

const analyticsEventVocabularyIsExact: IsExact<AnalyticsEventName, ExpectedAnalyticsEventName> = true

describe('TrackedLink', () => {
  afterEach(() => {
    delete (window as Window & { gtag?: unknown }).gtag
  })

  it('sends a GA4 event without blocking navigation', () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    render(<TrackedLink href="/tips/" eventName="guide_click" eventParams={{ link_url: '/tips/' }}>Tips</TrackedLink>)

    expect(clickWithoutNavigation(screen.getByRole('link', { name: 'Tips' }))).toBe(false)

    expect(gtag).toHaveBeenCalledWith('event', 'guide_click', { link_url: '/tips/' })
    expect(screen.getByRole('link').getAttribute('href')).toBe('/tips/')
  })

  it('does nothing when analytics is unavailable', () => {
    render(<TrackedLink href="/tips/" eventName="guide_click">Tips</TrackedLink>)
    expect(() => clickWithoutNavigation(screen.getByRole('link'))).not.toThrow()
  })

  it('supports the complete analytics vocabulary at runtime', () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    const events: ExpectedAnalyticsEventName[] = [
      'guide_click',
      'source_click',
      'internal_search',
      'guide_engaged',
      'related_guide_click',
    ]

    for (const eventName of events) {
      trackEvent(eventName)
    }

    expect(analyticsEventVocabularyIsExact).toBe(true)
    expect(gtag.mock.calls.map(([, eventName]) => eventName)).toEqual(events)
  })

  it('does not break link behavior when analytics throws', () => {
    ;(window as Window & { gtag?: () => never }).gtag = () => {
      throw new Error('analytics unavailable')
    }
    render(<TrackedLink href="/tips/" eventName="guide_click">Tips</TrackedLink>)
    const link = screen.getByRole('link', { name: 'Tips' })

    expect(() => clickWithoutNavigation(link)).not.toThrow()
    expect(link.getAttribute('href')).toBe('/tips/')
  })
})

function clickWithoutNavigation(link: HTMLElement) {
  let defaultPreventedByComponent = true
  const stopNavigation = (event: MouseEvent) => {
    defaultPreventedByComponent = event.defaultPrevented
    event.preventDefault()
  }

  document.addEventListener('click', stopNavigation, { once: true })
  fireEvent.click(link)

  return defaultPreventedByComponent
}
