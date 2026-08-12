'use client'
import { useMemo, useState } from 'react'
type Entry = { href: string; title: string; description: string; category: string }
export function GuideSearch({ entries }: { entries: readonly Entry[] }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => { const q = query.trim().toLowerCase(); return q ? entries.filter((e) => `${e.title} ${e.description} ${e.category}`.toLowerCase().includes(q)) : entries }, [entries, query])
  return <section aria-label="Guide search"><label className="sr-only" htmlFor="guide-search">Search guides</label><input id="guide-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guides" className="w-full rounded-md border border-border bg-surface px-4 py-3" /><p className="mt-3 text-sm text-muted-foreground" aria-live="polite">{results.length} result{results.length === 1 ? '' : 's'}</p><div className="mt-5 grid gap-5 sm:grid-cols-2">{results.map((entry) => <article className="rounded-lg border border-border bg-surface p-5" key={entry.href}><p className="text-sm font-semibold text-nav-theme">{entry.category}</p><h2 className="mt-2 text-xl font-bold"><a className="underline underline-offset-4" href={entry.href}>{entry.title}</a></h2><p className="mt-2 text-muted-foreground">{entry.description}</p></article>)}</div></section>
}
