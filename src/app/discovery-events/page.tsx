import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import DiscoveryEventsContent, { guideMeta } from '@/content/guides/discovery-events.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata(
  '/discovery-events/',
  guideMeta.title,
  guideMeta.description,
)

export default function DiscoveryEventsPage() {
  return <ArticleLayout meta={guideMeta}><DiscoveryEventsContent /></ArticleLayout>
}
