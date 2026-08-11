import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import PlatformsContent, { guideMeta } from '@/content/guides/platforms.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata(
  '/platforms/',
  guideMeta.title,
  guideMeta.description,
)

export default function PlatformsPage() {
  return <ArticleLayout meta={guideMeta}><PlatformsContent /></ArticleLayout>
}
