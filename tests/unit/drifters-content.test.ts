import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DriftersContent, { guideMeta } from '@/content/guides/how-to-get-more-drifters.mdx'
import { ArticleLayout } from '@/components/site/article-layout'
import { getGuideMeta } from '@/content/guides'
import DriftersPage, { metadata } from '@/app/how-to-get-more-drifters/page'

const approvedSources = [
  'https://steamcommunity.com/app/1368140/discussions/0/659359849665365626/',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Pirates',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings',
  'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251',
]

describe('the compiled Drifter population guide', () => {
  it('re-exports the registry metadata and renders the verified answer', () => {
    expect(guideMeta).toBe(getGuideMeta('how-to-get-more-drifters'))
    expect(guideMeta.primaryKeyword).toBe('corsair cove how to get more drifters')
    expect(guideMeta.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    render(createElement(ArticleLayout, { meta: guideMeta }, createElement(DriftersContent)))

    const directAnswer = screen.getByLabelText('Direct answer').textContent ?? ''
    expect(directAnswer).toMatch(/does not simply grow naturally/i)
    expect(directAnswer).toMatch(/immigration/i)
    expect(directAnswer).toMatch(/Drifter or Prisoner Ships/i)
    expect(directAnswer).toMatch(/Pause buildings/i)
  })

  it('explains that population does not grow naturally and distinguishes Drifters from Swabbies', () => {
    const { container } = render(createElement(ArticleLayout, { meta: guideMeta }, createElement(DriftersContent)))
    const renderedText = container.textContent ?? ''

    expect(renderedText).toMatch(/does not simply grow naturally/i)
    expect(renderedText).toMatch(/Drifters.*open jobs automatically/i)
    expect(renderedText).toMatch(/Swabbies.*baseline ship crew/i)
    expect(renderedText).toMatch(/Stew.*Booze/i)
  })

  it('keeps the source list limited to the four approved sources', () => {
    expect(guideMeta.sources.map(({ url }) => url)).toEqual(approvedSources)
  })

  it('uses the explicit article route with canonical metadata', () => {
    render(createElement(DriftersPage))

    expect(screen.getByRole('heading', { level: 1, name: guideMeta.title })).not.toBeNull()
    expect(metadata.alternates?.canonical).toBe('https://corsaircovewiki.com/how-to-get-more-drifters/')
    expect(metadata.openGraph?.url).toBe('https://corsaircovewiki.com/how-to-get-more-drifters/')
  })
})
