export type AnalyticsEventName = 'guide_click' | 'source_click'
export type AnalyticsEventParams = Record<string, string | number | boolean>

type AnalyticsWindow = Window & {
  gtag?: (command: 'event', eventName: AnalyticsEventName, params?: AnalyticsEventParams) => void
}

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
  if (typeof window === 'undefined') return
  ;(window as AnalyticsWindow).gtag?.('event', eventName, params)
}
