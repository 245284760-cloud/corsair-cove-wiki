import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import RopeContent, { guideMeta } from '@/content/guides/rope.mdx'
import { createPageMetadata } from '@/lib/metadata'
export const metadata: Metadata = createPageMetadata('/rope/', guideMeta.title, guideMeta.description)
export default function RopePage() { return <ArticleLayout meta={guideMeta}><RopeContent /></ArticleLayout> }
