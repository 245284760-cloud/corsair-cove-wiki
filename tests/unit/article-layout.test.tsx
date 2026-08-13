import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleLayout } from '@/components/site/article-layout'
import TipsContent, { guideMeta } from '@/content/guides/tips.mdx'

describe('ArticleLayout', () => {
  it('renders the guide contract with one H1, a dated answer, table of contents, related guides, sources, and disclaimer', () => {
    const { container } = render(<ArticleLayout meta={guideMeta}><TipsContent /></ArticleLayout>)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: guideMeta.title })).toBeTruthy()
    expect(screen.getByText(guideMeta.directAnswer)).toBeTruthy()
    expect(screen.getByText('Verified: 2026-08-08')).toBeTruthy()
    expect(screen.getByText(`Applies to: ${guideMeta.applicableVersion}`)).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeTruthy()

    for (const entry of guideMeta.toc) {
      const link = screen.getByRole('link', { name: entry.label })

      expect(link.getAttribute('href')).toBe(`#${entry.id}`)
      expect(container.querySelector(`#${entry.id}`)?.tagName).toBe('H2')
    }

    expect(screen.getByRole('heading', { name: 'Related guides' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Sources' })).toBeTruthy()
    expect(screen.getByText(/Sources are linked so you can verify the guidance/i)).toBeTruthy()

    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts).toHaveLength(2)
    expect(JSON.parse(scripts[0].textContent ?? '{}')).toMatchObject({
      '@type': 'Article',
      headline: guideMeta.title,
    })
    expect(JSON.parse(scripts[1].textContent ?? '{}')).toMatchObject({
      '@type': 'BreadcrumbList',
    })

    const sourceLinks = guideMeta.sources.map(({ url }) => document.querySelector(`a[href="${url}"]`))
    expect(sourceLinks).toHaveLength(guideMeta.sources.length)
    expect(sourceLinks.every((link) => link?.getAttribute('rel') === 'noopener noreferrer')).toBe(true)
  })
})
