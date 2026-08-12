import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import UpdatesContent, { guideMeta } from '@/content/guides/updates.mdx'
import { createPageMetadata } from '@/lib/metadata'
export const metadata: Metadata = createPageMetadata('/updates/', guideMeta.title, guideMeta.description)
export default function UpdatesPage() { return <ArticleLayout meta={guideMeta}><UpdatesContent /></ArticleLayout> }
