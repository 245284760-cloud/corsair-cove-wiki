import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import SystemRequirementsContent, { guideMeta } from '@/content/guides/system-requirements.mdx'
import { createPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = createPageMetadata(
  '/system-requirements/',
  guideMeta.title,
  guideMeta.description,
)

export default function SystemRequirementsPage() {
  return <ArticleLayout meta={guideMeta}><SystemRequirementsContent /></ArticleLayout>
}
