import {
  googleAnalyticsInlineScript,
  googleAnalyticsMeasurementId,
  googleAnalyticsSrc,
} from '@/components/site/google-analytics'
import { describe, expect, it } from 'vitest'

describe('Google Analytics', () => {
  it('defines the configured gtag payload used by the root layout', () => {
    expect(googleAnalyticsMeasurementId).toBe('G-YSGBPS7G81')
    expect(googleAnalyticsSrc).toBe(
      'https://www.googletagmanager.com/gtag/js?id=G-YSGBPS7G81',
    )
    expect(googleAnalyticsInlineScript).toContain("gtag('config', 'G-YSGBPS7G81')")
    expect(googleAnalyticsInlineScript).toContain('window.dataLayer = window.dataLayer || []')
  })
})
