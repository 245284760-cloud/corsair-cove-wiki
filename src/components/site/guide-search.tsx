'use client'
import { useMemo, useState } from 'react'
import { trackEvent } from '@/lib/analytics'

type Entry = { href: string; title: string; description: string; category: string }

export function GuideSearch({ entries }: { entries: readonly Entry[] }) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const results = useMemo(() => normalizedQuery ? entries.filter((entry) => `${entry.title} ${entry.description} ${entry.category}`.toLowerCase().includes(normalizedQuery)) : entries, [entries, normalizedQuery])

  return <section aria-label="Guide search"><label className="sr-only" htmlFor="guide-search">Search guides</label><input id="guide-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides" className="w-full rounded-md border border-border bg-surface px-4 py-3" /><p className="mt-3 text-sm text-muted-foreground" aria-live="polite">{results.length} result{results.length === 1 ? '' : 's'}</p><div className="mt-5 grid gap-5 sm:grid-cols-2">{results.map((entry) => <article className="rounded-lg border border-border bg-surface p-5" key={entry.href}><p className="text-sm font-semibold text-nav-theme">{entry.category}</p><h2 className="mt-2 text-xl font-bold"><a className="underline underline-offset-4" href={entry.href} onClick={() => trackEvent('internal_search', { search_term: normalizedQuery, result_count: results.length, link_url: entry.href })}>{entry.title}</a></h2><p className="mt-2 text-muted-foreground">{entry.description}</p></article>)}</div></section>
}
