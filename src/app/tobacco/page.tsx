import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/site/article-layout'
import TobaccoContent, { guideMeta } from '@/content/guides/tobacco.mdx'
import { createPageMetadata } from '@/lib/metadata'
export const metadata: Metadata = createPageMetadata('/tobacco/', guideMeta.title, guideMeta.description)
export default function TobaccoPage() { return <ArticleLayout meta={guideMeta}><TobaccoContent /></ArticleLayout> }
