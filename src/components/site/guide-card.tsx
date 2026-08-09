import type { HomeContent } from '@/lib/content-schema'

type GuideCardContent = HomeContent['home']['start']['cards'][number]

export function GuideCard({ card }: Readonly<{ card: GuideCardContent }>) {
  return (
    <article className="rounded-lg border border-border bg-surface p-6 shadow-sm">
      <h3 className="text-xl font-bold text-nav-theme">
        <a className="underline decoration-border underline-offset-4 hover:text-highlight" href={card.href}>{card.title}</a>
      </h3>
      <p className="mt-3 leading-7 text-muted-foreground">{card.description}</p>
    </article>
  )
}
