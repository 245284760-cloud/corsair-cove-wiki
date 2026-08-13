import type { ReactNode } from 'react'
import { ArticleToc } from '@/components/site/article-toc'
import { AdsterraNativeBanner } from '@/components/site/adsterra-native-banner'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { Callout } from '@/components/site/callout'
import { GuideCard } from '@/components/site/guide-card'
import { StructuredData } from '@/components/site/structured-data'
import { TrackedLink } from '@/components/site/tracked-link'
import { guideEntries, type ReadonlyGuideMetadata } from '@/content/guides'
import { createArticleJsonLd, createBreadcrumbJsonLd } from '@/lib/structured-data'

export function ArticleLayout({ meta, children, directAnswer }: Readonly<{
  meta: ReadonlyGuideMetadata
  children?: ReactNode
  directAnswer?: string
}>) {
  const relatedGuides = meta.related.map((href) => {
    const guide = guideEntries.find(({ meta: relatedMeta }) => relatedMeta.href === href)

    if (!guide) {
      throw new Error(`Related guide is not published: ${href}`)
    }

    return guide.meta
  })

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <StructuredData value={createArticleJsonLd(meta)} />
      <StructuredData value={createBreadcrumbJsonLd(meta)} />
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/guides/', label: 'Guides' }, { label: meta.title }]} />
      <header className="mt-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-nav-theme">{meta.title}</h1>
        <div className="mt-5"><Callout><p className="leading-7">{directAnswer ?? meta.directAnswer}</p></Callout></div>
        <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div><dt className="sr-only">Verification date</dt><dd>Verified: {meta.verifiedOn}</dd></div>
          <div><dt className="sr-only">Applicable version</dt><dd>Applies to: {meta.applicableVersion}</dd></div>
        </dl>
      </header>
      <div className="mt-10 max-w-3xl"><ArticleToc entries={meta.toc} /></div>
      <div className="article-content mt-10 space-y-6 leading-7">{children}</div>
      <AdsterraNativeBanner />
      <section className="mt-14" aria-labelledby="related-guides-heading">
        <h2 className="text-2xl font-bold tracking-tight text-nav-theme" id="related-guides-heading">Related guides</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {relatedGuides.map((guide) => <GuideCard card={guide} key={guide.href} />)}
        </div>
      </section>
      <section className="mt-14 max-w-3xl" aria-labelledby="sources-heading">
        <h2 className="text-2xl font-bold tracking-tight text-nav-theme" id="sources-heading">Sources</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          {meta.sources.map((source) => (
            <li key={source.url}>
              <TrackedLink
                className="underline underline-offset-4 hover:text-highlight"
                eventName="source_click"
                eventParams={{ article_slug: meta.slug, link_url: source.url }}
                href={source.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {source.label}
              </TrackedLink>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-muted-foreground">Sources are linked so you can verify the guidance. Game behavior can change with updates.</p>
      </section>
    </article>
  )
}
