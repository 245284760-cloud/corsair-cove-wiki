import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import TroubleshootingContent, { guideMeta } from '@/content/guides/troubleshooting.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata(
  '/troubleshooting/',
  guideMeta.title,
  guideMeta.description,
)

export default function TroubleshootingPage() {
  return <ArticleLayout meta={guideMeta}><TroubleshootingContent /></ArticleLayout>
}
