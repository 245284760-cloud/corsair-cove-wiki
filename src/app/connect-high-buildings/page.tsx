import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import ConnectionsContent, { guideMeta } from '@/content/guides/connect-high-buildings.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata('/connect-high-buildings/', guideMeta.title, guideMeta.description)

export default function ConnectionsPage() {
  return <ArticleLayout meta={guideMeta}><ConnectionsContent /></ArticleLayout>
}
