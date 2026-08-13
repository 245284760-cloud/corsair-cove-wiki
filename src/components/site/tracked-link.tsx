'use client'

import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { trackEvent, type AnalyticsEventName, type AnalyticsEventParams } from '@/lib/analytics'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  eventName: AnalyticsEventName
  eventParams?: AnalyticsEventParams
  href: string
}

export function TrackedLink({ children, eventName, eventParams, onClick, ...props }: Props) {
  return (
    <a
      {...props}
      onClick={(event) => {
        trackEvent(eventName, eventParams)
        onClick?.(event)
      }}
    >
      {children}
    </a>
  )
}
