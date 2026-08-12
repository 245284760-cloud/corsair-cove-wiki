import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import ProductionChainsContent, { guideMeta } from '@/content/guides/production-chains.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata('/production-chains/', guideMeta.title, guideMeta.description)

export default function ProductionChainsPage() {
  return <ArticleLayout meta={guideMeta}><ProductionChainsContent /></ArticleLayout>
}
