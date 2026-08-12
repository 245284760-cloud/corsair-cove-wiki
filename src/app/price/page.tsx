import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import PriceContent, { guideMeta } from '@/content/guides/price.mdx'
import { createPageMetadata } from '@/lib/metadata'
import { getPriceSnapshotStatus } from '@/content/guides/price-meta'

export const metadata: Metadata = createPageMetadata(
  '/price/',
  guideMeta.title,
  guideMeta.description,
)

export default function PricePage() {
  const directAnswer = getPriceSnapshotStatus() === 'sale-active'
    ? guideMeta.directAnswer
    : 'The dated France Steam launch promotion has ended. Treat the saved regional snapshot as historical and check the official listing for the current local price.'

  return <ArticleLayout meta={guideMeta} directAnswer={directAnswer}><PriceContent /></ArticleLayout>
}
