import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { GuideCard } from '@/components/site/guide-card'
import { guideEntries, guideGroups } from '@/content/guides'
import { createPageMetadata } from '@/lib/metadata'

const guideCardLabels = {
  '/tips/': 'Beginner Tips',
  '/how-to-get-more-drifters/': 'Get More Drifters',
  '/how-to-build-ship/': 'Build Your First Ship',
  '/connect-high-buildings/': 'Connect High Buildings',
} as const

export const metadata: Metadata = createPageMetadata(
  '/guides/',
  'Corsair Cove Guides – Tips, Drifters, Ships & Building',
  'Verified Corsair Cove guides for beginner tips, Drifters, shipbuilding, and connecting high buildings.',
)

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Guides' }]} />
      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-nav-theme">Corsair Cove Guides</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Start with practical, verified help for your settlement, population, ships, and building connections.
        </p>
      </header>
      <div className="mt-12 space-y-12">
        {guideGroups.map((group) => {
          const entries = guideEntries.filter(({ meta }) => meta.category === group)

          return (
            <section aria-labelledby={`${group.toLowerCase().replaceAll(' ', '-')}-heading`} key={group}>
              <h2 className="text-2xl font-bold tracking-tight text-nav-theme" id={`${group.toLowerCase().replaceAll(' ', '-')}-heading`}>
                {group}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {entries.map(({ meta }) => <GuideCard card={meta} key={meta.href} label={guideCardLabels[meta.href]} />)}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
