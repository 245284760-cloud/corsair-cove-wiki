import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import DriftersContent, { guideMeta } from '@/content/guides/how-to-get-more-drifters.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata('/how-to-get-more-drifters/', guideMeta.title, guideMeta.description)

export default function DriftersPage() {
  return <ArticleLayout meta={guideMeta}><DriftersContent /></ArticleLayout>
}
