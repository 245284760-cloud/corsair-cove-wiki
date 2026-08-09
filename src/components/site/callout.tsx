import type { ReactNode } from 'react'

export function Callout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <aside className="rounded-lg border-l-4 border-callout bg-surface p-5" aria-label="Direct answer">
      {children}
    </aside>
  )
}
