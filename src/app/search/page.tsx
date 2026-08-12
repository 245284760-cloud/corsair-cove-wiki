import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/site/breadcrumbs'
import { GuideSearch } from '@/components/site/guide-search'
import { guideEntries } from '@/content/guides'
import { createPageMetadata } from '@/lib/metadata'
export const metadata: Metadata = createPageMetadata('/search/', 'Search Corsair Cove Wiki', 'Search verified Corsair Cove guides, game information, ships, resources, and support.')
export default function SearchPage() {
  return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Search' }]} /><header className="mt-8 max-w-3xl"><h1 className="text-4xl font-bold tracking-tight text-nav-theme">Search Corsair Cove Wiki</h1><p className="mt-4 text-lg leading-8 text-muted-foreground">Search the verified guide library by topic, category, or page title.</p></header><div className="mt-8"><GuideSearch entries={guideEntries.map(({ meta }) => ({ href: meta.href, title: meta.title, description: meta.description, category: meta.category }))} /></div></div>
}
