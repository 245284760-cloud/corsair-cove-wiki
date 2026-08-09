import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

function MdxLink({ href, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (href?.startsWith('/')) {
    return <Link href={href} {...props} />
  }

  if (href?.startsWith('https://')) {
    return <a href={href} rel="noopener noreferrer" target="_blank" {...props} />
  }

  return <a href={href} {...props} />
}

function MdxTable({ children, ...props }: ComponentPropsWithoutRef<'table'>) {
  return <div className="my-6 max-w-full overflow-x-auto"><table {...props}>{children}</table></div>
}

export function useMDXComponents(): MDXComponents {
  return { a: MdxLink, table: MdxTable }
}
