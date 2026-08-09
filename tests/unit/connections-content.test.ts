import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ConnectionsContent, { guideMeta } from '@/content/guides/connect-high-buildings.mdx'
import { ArticleLayout } from '@/components/site/article-layout'
import { getGuideMeta } from '@/content/guides'
import ConnectionsPage, { metadata } from '@/app/connect-high-buildings/page'

const approvedSources = [
  'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings',
  'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251',
]

describe('the compiled high-building connections guide', () => {
  it('re-exports the registry metadata and scopes connection requirements to eligible hubs', () => {
    expect(guideMeta).toBe(getGuideMeta('connect-high-buildings'))

    render(createElement(ArticleLayout, { meta: guideMeta }, createElement(ConnectionsContent)))

    const directAnswer = screen.getByLabelText('Direct answer').textContent ?? ''
    expect(directAnswer).toMatch(/not a tower-only mechanic/i)
    expect(directAnswer).toMatch(/only certain key connection hubs.*green connection arrows/i)
    expect(directAnswer).toMatch(/some buildings do not require a connection/i)
    expect(directAnswer).toMatch(/Roads.*Rope Bridges.*Cliff Paths.*Ladders/i)
  })

  it('explains the connection network, construction wait, route colors, and screenshot evidence limit', () => {
    const { container } = render(createElement(ArticleLayout, { meta: guideMeta }, createElement(ConnectionsContent)))
    const renderedText = container.textContent ?? ''

    expect(renderedText).toMatch(/only certain key connection hubs.*green connection arrows/i)
    expect(renderedText).toMatch(/some buildings do not require a connection/i)
    expect(renderedText).toMatch(/automatic connection can fail on steep terrain/i)
    expect(renderedText).toMatch(/eligible connection hub cannot begin construction or operation/i)
    expect(renderedText).toMatch(/green.*yellow.*red.*transport efficiency/i)
    expect(renderedText).toMatch(/no approved gameplay screenshot exists yet/i)
    expect(renderedText).toMatch(/full-release UI evidence overrides future textual mismatch/i)
    expect(screen.getByRole('heading', { level: 2, name: 'Find the Building Connection Node' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Choose the Correct Connection Piece' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Wait for Construction to Finish' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Diagnose a Slow Route' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'Evidence Limit' })).toBeTruthy()
  })

  it('uses only the approved beginner and Buildings sources', () => {
    expect(guideMeta.sources.map(({ url }) => url)).toEqual(approvedSources)
  })

  it('uses the explicit article route with canonical metadata', () => {
    render(createElement(ConnectionsPage))

    expect(screen.getByRole('heading', { level: 1, name: guideMeta.title })).not.toBeNull()
    expect(metadata.alternates?.canonical).toBe('https://corsaircovewiki.com/connect-high-buildings/')
    expect(metadata.openGraph?.url).toBe('https://corsaircovewiki.com/connect-high-buildings/')
  })
})
