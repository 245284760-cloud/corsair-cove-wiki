import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import ReleaseDateContent, { guideMeta } from '@/content/guides/release-date.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata(
  '/release-date/',
  guideMeta.title,
  guideMeta.description,
)

export default function ReleaseDatePage() {
  return <ArticleLayout meta={guideMeta}><ReleaseDateContent /></ArticleLayout>
}
