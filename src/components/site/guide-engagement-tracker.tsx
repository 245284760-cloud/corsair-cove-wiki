'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

const ENGAGEMENT_TIME_MS = 60_000
const ENGAGEMENT_SCROLL_DEPTH = 0.75

export function GuideEngagementTracker({ articleSlug }: Readonly<{ articleSlug: string }>) {
  useEffect(() => {
    let hasTracked = false

    const removeScrollListener = () => window.removeEventListener('scroll', handleScroll)
    const trackEngagement = (trigger: 'time' | 'scroll') => {
      if (hasTracked) return

      hasTracked = true
      window.clearTimeout(timerId)
      removeScrollListener()
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
    function handleScroll() {
      if (hasReachedScrollDepth()) trackEngagement('scroll')
    }

    const timerId = window.setTimeout(() => trackEngagement('time'), ENGAGEMENT_TIME_MS)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.clearTimeout(timerId)
      removeScrollListener()
    }
  }, [articleSlug])

  return null
}
