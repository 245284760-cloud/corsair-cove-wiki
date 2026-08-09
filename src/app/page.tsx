import type { Metadata } from 'next'
import { GuideCard } from '@/components/site/guide-card'
import { Hero } from '@/components/site/hero'
import { StatsStrip } from '@/components/site/stats-strip'
import { homeContent } from '@/lib/home-content'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata(
  '/',
  homeContent.home.meta.title,
  homeContent.home.meta.description,
)

export default function Page() {
  const { home } = homeContent

  return (
    <>
      <Hero content={home.hero} />
      <StatsStrip stats={home.hero.stats} />
      <section aria-labelledby="start-here-heading" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-nav-theme">{home.start.eyebrow}</p>
        <h2 id="start-here-heading" className="mt-3 text-3xl font-bold tracking-tight">{home.start.title}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {home.start.cards.map((card) => <GuideCard key={card.href} card={card} />)}
        </div>
      </section>
      <section aria-labelledby="about-game-heading" className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 id="about-game-heading" className="text-3xl font-bold tracking-tight">{home.aboutGame.title}</h2>
          <div className="mt-6 max-w-3xl space-y-4 leading-8 text-muted-foreground">
            {home.aboutGame.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {home.aboutGame.stats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border p-4">
                <dt className="text-sm font-semibold text-nav-theme">{stat.label}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <a className="mt-8 inline-flex rounded-md bg-nav-theme px-5 py-3 font-semibold text-white hover:brightness-110" href={home.aboutGame.ctaHref}>
            {home.aboutGame.cta}
          </a>
        </div>
      </section>
      <section aria-labelledby="final-cta-heading" className="bg-callout text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 id="final-cta-heading" className="text-3xl font-bold tracking-tight">{home.finalCta.title}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/90">{home.finalCta.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a className="rounded-md bg-cta px-5 py-3 font-semibold text-foreground hover:brightness-110" href={home.finalCta.primaryHref}>
              {home.finalCta.primary}
            </a>
            <a className="rounded-md border border-white/70 px-5 py-3 font-semibold hover:bg-white/10" href={home.finalCta.secondaryHref}>
              {home.finalCta.secondary}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
