import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import TipsContent, { guideMeta } from '@/content/guides/tips.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata('/tips/', guideMeta.title, guideMeta.description)

export default function TipsPage() {
  return <ArticleLayout meta={guideMeta}><TipsContent /></ArticleLayout>
}
