import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import ShipsContent, { guideMeta } from '@/content/guides/ships.mdx'
import { createPageMetadata } from '@/lib/metadata'
export const metadata: Metadata = createPageMetadata('/ships/', guideMeta.title, guideMeta.description)
export default function ShipsPage() { return <ArticleLayout meta={guideMeta}><ShipsContent /></ArticleLayout> }
