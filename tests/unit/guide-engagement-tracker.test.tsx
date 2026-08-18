import { StrictMode } from 'react'
import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GuideEngagementTracker } from '@/components/site/guide-engagement-tracker'

let animationFrames: Map<number, FrameRequestCallback>
let nextAnimationFrameId: number
let visibilityState: DocumentVisibilityState

describe('GuideEngagementTracker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    animationFrames = new Map()
    nextAnimationFrameId = 1
    visibilityState = 'visible'
    vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => visibilityState)
    vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
      const id = nextAnimationFrameId++
      animationFrames.set(id, callback)
      return id
    }))
    vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => {
      animationFrames.delete(id)
    }))
    setScrollMetrics({ documentHeight: 10_000, viewportHeight: 1_000, scrollTop: 0 })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    delete (window as Window & { gtag?: unknown }).gtag
  })

  it('tracks immediately when the document is already 75% viewed on mount', () => {
    const gtag = installGtag()
    setScrollMetrics({ documentHeight: 1_000, viewportHeight: 500, scrollTop: 250 })

    render(<GuideEngagementTracker articleSlug="tips" />)

    expectGuideEngaged(gtag, 'tips', 'scroll')
    expect(vi.getTimerCount()).toBe(0)
  })

  it.each([
    { caseName: '75% viewed', documentHeight: 1_000, viewportHeight: 500, scrollTop: 250 },
    { caseName: 'non-scrollable', documentHeight: 500, viewportHeight: 700, scrollTop: 0 },
  ])('defers $caseName scroll engagement while initially hidden until visible', ({
    documentHeight,
    viewportHeight,
    scrollTop,
  }) => {
    const gtag = installGtag()
    visibilityState = 'hidden'
    setScrollMetrics({ documentHeight, viewportHeight, scrollTop })

    render(<GuideEngagementTracker articleSlug="tips" />)

    expect(gtag).not.toHaveBeenCalled()
    expect(requestAnimationFrame).not.toHaveBeenCalled()

    setVisibility('visible')
    expect(gtag).not.toHaveBeenCalled()
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
    flushAnimationFrames()

    expectGuideEngaged(gtag, 'tips', 'scroll')

    setVisibility('visible')
    act(() => window.dispatchEvent(new Event('scroll')))
    flushAnimationFrames()
    expectGuideEngaged(gtag, 'tips', 'scroll')
  })

  it.each(['resize', 'pageshow'] as const)('checks scroll depth after %s in a coalesced animation frame', (eventName) => {
    const gtag = installGtag()
    render(<GuideEngagementTracker articleSlug="tips" />)
    setScrollMetrics({ documentHeight: 1_000, viewportHeight: 500, scrollTop: 250 })

    act(() => window.dispatchEvent(new Event(eventName)))

    expect(gtag).not.toHaveBeenCalled()
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
    flushAnimationFrames()
    expectGuideEngaged(gtag, 'tips', 'scroll')
  })

  it('counts only visible time toward the 60 second threshold', () => {
    const gtag = installGtag()
    render(<GuideEngagementTracker articleSlug="tips" />)

    advanceTime(30_000)
    setVisibility('hidden')
    advanceTime(60_000)

    expect(gtag).not.toHaveBeenCalled()

    setVisibility('visible')
    advanceTime(29_999)
    expect(gtag).not.toHaveBeenCalled()
    advanceTime(1)

    expectGuideEngaged(gtag, 'tips', 'time')
  })

  it('tracks time engagement once and ignores later depth checks', () => {
    const gtag = installGtag()
    render(<GuideEngagementTracker articleSlug="tips" />)

    act(() => window.dispatchEvent(new Event('scroll')))
    const pendingFrameId = [...animationFrames.keys()][0]
    advanceTime(60_000)
    expect(cancelAnimationFrame).toHaveBeenCalledWith(pendingFrameId)
    expect(animationFrames.size).toBe(0)
    setScrollMetrics({ documentHeight: 1_000, viewportHeight: 500, scrollTop: 250 })
    act(() => window.dispatchEvent(new Event('scroll')))
    flushAnimationFrames()

    expectGuideEngaged(gtag, 'tips', 'time')
  })

  it('tracks 75% scroll engagement once and cancels the timer', () => {
    const gtag = installGtag()
    render(<GuideEngagementTracker articleSlug="tips" />)
    setScrollMetrics({ documentHeight: 1_000, viewportHeight: 500, scrollTop: 250 })

    act(() => {
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('scroll'))
    })
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
    flushAnimationFrames()
    advanceTime(60_000)

    expectGuideEngaged(gtag, 'tips', 'scroll')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('handles a non-scrollable document without invalid depth math', () => {
    const gtag = installGtag()
    setScrollMetrics({ documentHeight: 500, viewportHeight: 700, scrollTop: 0 })

    render(<GuideEngagementTracker articleSlug="tips" />)

    expectGuideEngaged(gtag, 'tips', 'scroll')
  })

  it('discards StrictMode and previous-slug timers when the article changes', () => {
    const gtag = installGtag()
    const { rerender } = render(
      <StrictMode><GuideEngagementTracker articleSlug="tips" /></StrictMode>,
    )
    advanceTime(30_000)

    rerender(<StrictMode><GuideEngagementTracker articleSlug="ships" /></StrictMode>)
    advanceTime(30_000)
    expect(gtag).not.toHaveBeenCalled()
    advanceTime(30_000)

    expectGuideEngaged(gtag, 'ships', 'time')
  })

  it('does not duplicate an immediate depth event under StrictMode effect replay', () => {
    const gtag = installGtag()
    setScrollMetrics({ documentHeight: 1_000, viewportHeight: 500, scrollTop: 250 })

    render(<StrictMode><GuideEngagementTracker articleSlug="tips" /></StrictMode>)

    expectGuideEngaged(gtag, 'tips', 'scroll')
  })

  it('coalesces depth checks and cancels pending work and listeners on cleanup', () => {
    const windowAdd = vi.spyOn(window, 'addEventListener')
    const windowRemove = vi.spyOn(window, 'removeEventListener')
    const documentAdd = vi.spyOn(document, 'addEventListener')
    const documentRemove = vi.spyOn(document, 'removeEventListener')
    const cancelFrame = vi.mocked(cancelAnimationFrame)
    const { unmount } = render(<GuideEngagementTracker articleSlug="tips" />)

    act(() => {
      window.dispatchEvent(new Event('scroll'))
      window.dispatchEvent(new Event('resize'))
      window.dispatchEvent(new Event('pageshow'))
    })

    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
    const pendingFrameId = [...animationFrames.keys()][0]
    unmount()

    for (const eventName of ['scroll', 'resize', 'pageshow']) {
      const listener = windowAdd.mock.calls.find(([registeredName]) => registeredName === eventName)?.[1]
      expect(windowRemove).toHaveBeenCalledWith(eventName, listener)
    }
    const visibilityListener = documentAdd.mock.calls.find(([eventName]) => eventName === 'visibilitychange')?.[1]
    expect(documentRemove).toHaveBeenCalledWith('visibilitychange', visibilityListener)
    expect(cancelFrame).toHaveBeenCalledWith(pendingFrameId)
    expect(animationFrames.size).toBe(0)
    expect(vi.getTimerCount()).toBe(0)
  })
})

function installGtag() {
  const gtag = vi.fn()
  ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
  return gtag
}

function expectGuideEngaged(gtag: ReturnType<typeof vi.fn>, articleSlug: string, trigger: 'time' | 'scroll') {
  expect(gtag).toHaveBeenCalledTimes(1)
  expect(gtag).toHaveBeenCalledWith('event', 'guide_engaged', {
    article_slug: articleSlug,
    engagement_trigger: trigger,
  })
}

function advanceTime(milliseconds: number) {
  act(() => vi.advanceTimersByTime(milliseconds))
}

function setVisibility(nextVisibilityState: DocumentVisibilityState) {
  visibilityState = nextVisibilityState
  act(() => document.dispatchEvent(new Event('visibilitychange')))
}

function flushAnimationFrames() {
  const pendingFrames = [...animationFrames.entries()]
  animationFrames.clear()
  act(() => pendingFrames.forEach(([, callback]) => callback(performance.now())))
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
