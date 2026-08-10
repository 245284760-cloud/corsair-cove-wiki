import Script from 'next/script'

export const adsterraNativeBannerSrc =
  'https://pl30782761.effectivecpmnetwork.com/b108f424e9a3270260db6df33a9a36bb/invoke.js'
export const adsterraNativeBannerContainerId =
  'container-b108f424e9a3270260db6df33a9a36bb'

export function AdsterraNativeBanner() {
  return (
    <section aria-label="Sponsored content" className="my-12 min-h-[90px] overflow-hidden">
      <Script
        async
        data-cfasync="false"
        src={adsterraNativeBannerSrc}
        strategy="afterInteractive"
      />
      <div id={adsterraNativeBannerContainerId} />
    </section>
  )
}
