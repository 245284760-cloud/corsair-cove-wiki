import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArticleLayout } from '@/components/site/article-layout'
import { tipsMeta } from '@/content/guides'

describe('ArticleLayout', () => {
  it('renders the guide contract with one H1, a dated answer, table of contents, related guides, sources, and disclaimer', () => {
    render(
      <ArticleLayout meta={tipsMeta}>
        <h2 id="first-checks">First checks for a stalled settlement</h2>
        <p>Check the building before changing the layout.</p>
        <h2 id="fetchers-and-routes">Assign Fetchers and improve routes</h2>
        <p>Each input relationship needs its own Fetcher.</p>
      </ArticleLayout>,
    )

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: tipsMeta.title })).toBeTruthy()
    expect(screen.getByText(tipsMeta.directAnswer)).toBeTruthy()
    expect(screen.getByText('Verified: 2026-08-08')).toBeTruthy()
    expect(screen.getByText(`Applies to: ${tipsMeta.applicableVersion}`)).toBeTruthy()
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeTruthy()

    for (const entry of tipsMeta.toc) {
      expect(screen.getByRole('link', { name: entry.label }).getAttribute('href')).toBe(`#${entry.id}`)
    }

    expect(screen.getByRole('heading', { name: 'Related guides' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Sources' })).toBeTruthy()
    expect(screen.getByText(/Sources are linked so you can verify the guidance/i)).toBeTruthy()

    const sourceLinks = tipsMeta.sources.map(({ url }) => document.querySelector(`a[href="${url}"]`))
    expect(sourceLinks).toHaveLength(tipsMeta.sources.length)
    expect(sourceLinks.every((link) => link?.getAttribute('rel') === 'noopener noreferrer')).toBe(true)
  })
})
