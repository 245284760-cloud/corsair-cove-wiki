import Script from 'next/script'

export const googleAnalyticsMeasurementId = 'G-YSGBPS7G81'
export const googleAnalyticsSrc = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsMeasurementId}`
export const googleAnalyticsInlineScript = `window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsMeasurementId}', { page_path: window.location.pathname });`

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        async
        src={googleAnalyticsSrc}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {googleAnalyticsInlineScript}
      </Script>
    </>
  )
}
