import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import PriceContent, { guideMeta } from '@/content/guides/price.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata(
  '/price/',
  guideMeta.title,
  guideMeta.description,
)

export default function PricePage() {
  return <ArticleLayout meta={guideMeta}><PriceContent /></ArticleLayout>
}
