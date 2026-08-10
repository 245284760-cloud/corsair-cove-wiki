import type { ComponentPropsWithoutRef, ComponentType } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useMDXComponents } from '../../mdx-components'

function MdxLinkHarness({ children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const MdxLink = useMDXComponents().a as ComponentType<ComponentPropsWithoutRef<'a'>>

  return <MdxLink {...props}>{children}</MdxLink>
}

describe('MDX link mapping', () => {
  it('enforces hardened attributes for HTTPS links even when authored props conflict', () => {
    render(<MdxLinkHarness href="https://example.com/reference" rel="author-controlled" target="_self">Reference</MdxLinkHarness>)

    const link = screen.getByRole('link', { name: 'Reference' })
    expect(link.getAttribute('href')).toBe('https://example.com/reference')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('uses a client navigation link for an internal route', () => {
    render(<MdxLinkHarness href="/tips/">Tips</MdxLinkHarness>)

    expect(screen.getByRole('link', { name: 'Tips' }).getAttribute('href')).toBe('/tips')
  })

  it.each(['/\\evil.example', '/unpublished/', '//host/path', 'http://example.com', 'javascript:alert(1)', '#fragment'])(
    'rejects unsupported MDX href %s',
    (href) => {
      expect(() => render(<MdxLinkHarness href={href}>Unsafe</MdxLinkHarness>)).toThrow('Unsupported MDX link')
    },
  )
})
