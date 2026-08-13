import { TrackedLink } from '@/components/site/tracked-link'

type GuideCardContent = {
  description: string
  href: string
  title: string
}

export function GuideCard({ card, label = card.title }: Readonly<{ card: GuideCardContent; label?: string }>) {
  return (
    <article className="rounded-lg border border-border bg-surface p-6 shadow-sm">
      <h3 className="text-xl font-bold text-nav-theme">
        <TrackedLink
          className="underline decoration-border underline-offset-4 hover:text-highlight"
          eventName="guide_click"
          eventParams={{ link_url: card.href, link_title: card.title }}
          href={card.href}
        >
          {label}
          {label === card.title ? null : <span className="sr-only">: {card.title}</span>}
        </TrackedLink>
      </h3>
      <p className="mt-3 leading-7 text-muted-foreground">{card.description}</p>
    </article>
  )
}
