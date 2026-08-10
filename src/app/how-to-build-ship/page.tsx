import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import ShipContent, { guideMeta } from '@/content/guides/how-to-build-ship.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata('/how-to-build-ship/', guideMeta.title, guideMeta.description)

export default function ShipPage() {
  return <ArticleLayout meta={guideMeta}><ShipContent /></ArticleLayout>
}
