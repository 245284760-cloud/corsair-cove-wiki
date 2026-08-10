import type { HomeContent } from '@/lib/content-schema'

type HeroContent = HomeContent['home']['hero']

export function Hero({ content }: Readonly<{ content: HeroContent }>) {
  return (
    <section className="bg-hero-background text-hero-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-hero-accent">{content.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{content.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-hero-muted">{content.description}</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a className="rounded-md bg-cta px-5 py-3 font-semibold text-cta-foreground hover:brightness-110" href={content.primaryCtaHref}>
            {content.primaryCta}
          </a>
          <a className="rounded-md border border-hero-muted px-5 py-3 font-semibold hover:bg-white/10" href={content.secondaryCtaHref}>
            {content.secondaryCta}
          </a>
        </div>
        <p className="mt-6 text-sm text-hero-muted">{content.videoLabel}</p>
      </div>
    </section>
  )
}
