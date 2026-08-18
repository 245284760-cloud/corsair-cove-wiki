'use client'

import { useEffect, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

const ENGAGEMENT_TIME_MS = 60_000
const ENGAGEMENT_SCROLL_DEPTH = 0.75

export function GuideEngagementTracker({ articleSlug }: Readonly<{ articleSlug: string }>) {
  const viewState = useRef<{ articleSlug: string | null; hasTracked: boolean }>({ articleSlug: null, hasTracked: false })

  useEffect(() => {
    if (viewState.current.articleSlug !== articleSlug) {
      viewState.current = { articleSlug, hasTracked: false }
    }
    if (viewState.current.hasTracked) return

    let remainingVisibleTime = ENGAGEMENT_TIME_MS
    let visibleSince: number | null = null
    let timerId: number | null = null
    let animationFrameId: number | null = null

    const clearTimer = () => {
      if (timerId === null) return
      window.clearTimeout(timerId)
      timerId = null
    }
    const cancelDepthCheck = () => {
      if (animationFrameId === null) return
      window.cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    const removeListeners = () => {
      window.removeEventListener('scroll', scheduleDepthCheck)
      window.removeEventListener('resize', scheduleDepthCheck)
      window.removeEventListener('pageshow', scheduleDepthCheck)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
    const trackEngagement = (trigger: 'time' | 'scroll') => {
      if (viewState.current.hasTracked) return

      viewState.current.hasTracked = true
      clearTimer()
      cancelDepthCheck()
      removeListeners()
      trackEvent('guide_engaged', {
        article_slug: articleSlug,
        engagement_trigger: trigger,
      })
    }
    const hasReachedScrollDepth = () => {
      const documentHeight = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0)
      const viewportHeight = Math.max(window.innerHeight, document.documentElement.clientHeight)

      if (documentHeight <= 0) return false
      if (documentHeight <= viewportHeight) return true

      const scrollTop = Math.max(window.scrollY, document.documentElement.scrollTop, document.body?.scrollTop ?? 0)
      const scrollDepth = (scrollTop + viewportHeight) / documentHeight

      return Number.isFinite(scrollDepth) && scrollDepth >= ENGAGEMENT_SCROLL_DEPTH
    }
    const checkScrollDepth = () => {
      animationFrameId = null
      if (document.visibilityState !== 'visible') return
      if (hasReachedScrollDepth()) trackEngagement('scroll')
    }
    function scheduleDepthCheck() {
      if (viewState.current.hasTracked || animationFrameId !== null) return
      animationFrameId = window.requestAnimationFrame(checkScrollDepth)
    }
    const pauseVisibleTimer = () => {
      if (visibleSince === null) return

      remainingVisibleTime = Math.max(0, remainingVisibleTime - Math.max(0, performance.now() - visibleSince))
      visibleSince = null
      clearTimer()

      if (remainingVisibleTime === 0) trackEngagement('time')
    }
    const startVisibleTimer = () => {
      if (viewState.current.hasTracked || document.visibilityState !== 'visible' || timerId !== null) return

      visibleSince = performance.now()
      timerId = window.setTimeout(() => {
        timerId = null
        if (visibleSince !== null) {
          remainingVisibleTime = Math.max(0, remainingVisibleTime - Math.max(0, performance.now() - visibleSince))
          visibleSince = null
        }

        if (remainingVisibleTime === 0) trackEngagement('time')
        else startVisibleTimer()
      }, remainingVisibleTime)
    }
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        startVisibleTimer()
        scheduleDepthCheck()
      } else {
        pauseVisibleTimer()
      }
    }

    window.addEventListener('scroll', scheduleDepthCheck, { passive: true })
    window.addEventListener('resize', scheduleDepthCheck)
    window.addEventListener('pageshow', scheduleDepthCheck)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    checkScrollDepth()
    startVisibleTimer()

    return () => {
      clearTimer()
      cancelDepthCheck()
      removeListeners()
    }
  }, [articleSlug])

  return null
}
