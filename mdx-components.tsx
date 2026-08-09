import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

function MdxLink({ href, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/') && !href.startsWith('//')) {
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
