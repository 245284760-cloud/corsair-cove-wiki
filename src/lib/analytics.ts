export type AnalyticsEventName =
  | 'guide_click'
  | 'source_click'
  | 'internal_search'
  | 'guide_engaged'
  | 'related_guide_click'
export type AnalyticsEventParams = Record<string, string | number | boolean>

type AnalyticsWindow = Window & {
  gtag?: (command: 'event', eventName: AnalyticsEventName, params?: AnalyticsEventParams) => void
}

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
  if (typeof window === 'undefined') return

  try {
    ;(window as AnalyticsWindow).gtag?.('event', eventName, params)
  } catch {
    // Analytics must never interfere with the user's action.
  }
}
