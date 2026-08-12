import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import ExplorationContent, { guideMeta } from '@/content/guides/exploration.mdx'
import { createPageMetadata } from '@/lib/metadata'
export const metadata: Metadata = createPageMetadata('/exploration/', guideMeta.title, guideMeta.description)
export default function ExplorationPage() { return <ArticleLayout meta={guideMeta}><ExplorationContent /></ArticleLayout> }
