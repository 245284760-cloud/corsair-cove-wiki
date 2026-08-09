import type { PublicRoute } from '@/lib/routes'

type BreadcrumbItem = {
  href?: PublicRoute
  label: string
}

export function Breadcrumbs({ items }: Readonly<{ items: readonly BreadcrumbItem[] }>) {
  return (
    <nav aria-label="Breadcrumbs">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li className="flex items-center gap-2" key={item.label}>
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? <a className="underline underline-offset-4 hover:text-highlight" href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
