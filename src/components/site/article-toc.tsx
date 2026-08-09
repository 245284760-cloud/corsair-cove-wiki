import type { ReadonlyGuideMetadata } from '@/content/guides'

export function ArticleToc({ entries }: Readonly<{ entries: ReadonlyGuideMetadata['toc'] }>) {
  return (
    <nav aria-label="On this page" className="rounded-lg border border-border bg-surface p-5">
      <h2 className="text-lg font-bold text-nav-theme">On this page</h2>
      <ol className="mt-3 space-y-2">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a className="underline underline-offset-4 hover:text-highlight" href={`#${entry.id}`}>
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
