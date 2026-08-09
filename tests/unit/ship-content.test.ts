import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ShipContent, { guideMeta } from '@/content/guides/how-to-build-ship.mdx'
import { ArticleLayout } from '@/components/site/article-layout'
import { getGuideMeta } from '@/content/guides'
import ShipPage, { metadata } from '@/app/how-to-build-ship/page'

const approvedSources = [
  'https://wiki.hoodedhorse.com/Corsair_Cove/Ships',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Compass',
  'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251',
]

describe('the compiled shipbuilding guide', () => {
  it('re-exports the registry metadata and renders the required diagnostic order', () => {
    expect(guideMeta).toBe(getGuideMeta('how-to-build-ship'))

    const { container } = render(createElement(ArticleLayout, { meta: guideMeta }, createElement(ShipContent)))
    const diagnosticHeading = screen.getByRole('heading', { level: 2, name: 'Diagnose a Disabled Build Button' })
    const diagnosticList = diagnosticHeading.parentElement?.querySelector('ol')

    expect(Array.from(diagnosticList?.querySelectorAll('li') ?? []).map((item) => item.textContent)).toEqual([
      'Unlock the ship class in the Compass.',
      'Build the matching Pier.',
      'Connect the Pier to the network.',
      'Supply the exact listed resources.',
      'Provide the required Crew.',
    ])
    expect(container.textContent).toMatch(/values can change with game versions/i)
  })

  it('puts every supported numeric claim beside its verification date context', () => {
    const { container } = render(createElement(ArticleLayout, { meta: guideMeta }, createElement(ShipContent)))
    const renderedText = container.textContent ?? ''

    expect(renderedText).toMatch(new RegExp(`Landlubber.*15 Planks.*Verified on ${guideMeta.verifiedOn}`, 'i'))
    expect(renderedText).toMatch(new RegExp(`Shallow Pier.*30 Planks.*Verified on ${guideMeta.verifiedOn}`, 'i'))
    expect(renderedText).not.toMatch(/29 ships|Tier 2/i)
  })

  it('keeps the source list within the approved official references', () => {
    expect(guideMeta.sources.map(({ url }) => url)).toEqual(approvedSources)
  })

  it('uses the explicit article route with canonical metadata', () => {
    render(createElement(ShipPage))

    expect(screen.getByRole('heading', { level: 1, name: guideMeta.title })).not.toBeNull()
    expect(metadata.alternates?.canonical).toBe('https://corsaircovewiki.com/how-to-build-ship/')
    expect(metadata.openGraph?.url).toBe('https://corsaircovewiki.com/how-to-build-ship/')
  })
})
