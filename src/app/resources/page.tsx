import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import ResourcesContent, { guideMeta } from '@/content/guides/resources.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata('/resources/', guideMeta.title, guideMeta.description)

export default function ResourcesPage() {
  return <ArticleLayout meta={guideMeta}><ResourcesContent /></ArticleLayout>
}
