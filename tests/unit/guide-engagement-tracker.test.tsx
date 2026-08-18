import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GuideEngagementTracker } from '@/components/site/guide-engagement-tracker'

describe('GuideEngagementTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete (window as Window & { gtag?: unknown }).gtag
  })

  it('tracks time engagement once and ignores later scrolls', () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    render(<GuideEngagementTracker articleSlug="tips" />)

    act(() => vi.advanceTimersByTime(60_000))
    fireEventScroll()
    act(() => vi.advanceTimersByTime(60_000))

    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'guide_engaged', {
      article_slug: 'tips',
      engagement_trigger: 'time',
    })
  })

  it('tracks 75% scroll engagement once and cancels the timer', () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    setScrollMetrics({ documentHeight: 1_000, viewportHeight: 500, scrollTop: 250 })
    render(<GuideEngagementTracker articleSlug="tips" />)

    fireEventScroll()
    fireEventScroll()
    act(() => vi.advanceTimersByTime(60_000))

    expect(gtag).toHaveBeenCalledTimes(1)
    expect(gtag).toHaveBeenCalledWith('event', 'guide_engaged', {
      article_slug: 'tips',
      engagement_trigger: 'scroll',
    })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('handles a non-scrollable document without invalid depth math', () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    setScrollMetrics({ documentHeight: 500, viewportHeight: 700, scrollTop: 0 })
    render(<GuideEngagementTracker articleSlug="tips" />)

    fireEventScroll()

    expect(gtag).toHaveBeenCalledWith('event', 'guide_engaged', {
      article_slug: 'tips',
      engagement_trigger: 'scroll',
    })
  })

  it('cleans up its timer and scroll listener when unmounted', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<GuideEngagementTracker articleSlug="tips" />)
    const scrollListener = addEventListener.mock.calls.find(([eventName]) => eventName === 'scroll')?.[1]

    expect(scrollListener).toBeDefined()
    expect(vi.getTimerCount()).toBe(1)
    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('scroll', scrollListener)
    expect(vi.getTimerCount()).toBe(0)
  })
})

function fireEventScroll() {
  act(() => window.dispatchEvent(new Event('scroll')))
}

function setScrollMetrics({
  documentHeight,
  viewportHeight,
  scrollTop,
}: {
  documentHeight: number
  viewportHeight: number
  scrollTop: number
}) {
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: documentHeight })
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: viewportHeight })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: viewportHeight })
  Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollTop })
}
