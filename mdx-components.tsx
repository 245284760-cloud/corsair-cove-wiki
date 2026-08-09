import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'
import { PUBLIC_ROUTES, type PublicRoute } from '@/lib/routes'

function isPublishedInternalRoute(href: string): href is PublicRoute {
  return href.startsWith('/')
    && !href.startsWith('//')
    && !href.includes('\\')
    && PUBLIC_ROUTES.includes(href as PublicRoute)
}

function MdxLink({ href, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href && isPublishedInternalRoute(href)) {
    return <Link href={href} {...props} />
  }

  if (href?.startsWith('https://')) {
    return <a {...props} href={href} target="_blank" rel="noopener noreferrer" />
  }

  throw new Error(`Unsupported MDX link: ${href ?? '(missing href)'}`)
}

function MdxTable({ children, ...props }: ComponentPropsWithoutRef<'table'>) {
  return <div className="my-6 max-w-full overflow-x-auto"><table {...props}>{children}</table></div>
}

export function useMDXComponents(): MDXComponents {
  return { a: MdxLink, table: MdxTable }
}
