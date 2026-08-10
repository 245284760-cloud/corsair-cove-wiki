import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TipsContent, { guideMeta } from '@/content/guides/tips.mdx'
import { ArticleLayout } from '@/components/site/article-layout'
import { getGuideMeta } from '@/content/guides'

const approvedSources = [
  'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Buildings',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Pirates',
  'https://steamcommunity.com/sharedfiles/filedetails/?id=3774343866',
]

describe('the compiled beginner tips guide', () => {
  it('re-exports the registry metadata and renders the verified troubleshooting answer', () => {
    expect(guideMeta).toBe(getGuideMeta('tips'))

    const { container } = render(createElement(ArticleLayout, { meta: guideMeta }, createElement(TipsContent)))

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const directAnswer = screen.getByLabelText('Direct answer').textContent ?? ''
    expect(directAnswer).toMatch(/paused state/i)
    expect(directAnswer).toMatch(/network connection/i)
    expect(directAnswer).toMatch(/free Drifters/i)
    expect(directAnswer).toMatch(/input and output storage/i)
    expect(Array.from(container.querySelectorAll('.article-content h2')).map((heading) => heading.textContent)).toEqual([
      'Check Why a Building Stopped',
      'Assign Fetchers to a Specific Source',
      'Protect Labor and Cohesion',
      'Expand Pirate Camps Deliberately',
      'Plan Around Piers and Consumers',
    ])
    for (const entry of guideMeta.toc) {
      expect(document.getElementById(entry.id)?.tagName).toBe('H2')
    }
  })

  it('keeps rendered content within the approved source and safety boundaries', () => {
    const { container } = render(createElement(ArticleLayout, { meta: guideMeta }, createElement(TipsContent)))
    const renderedText = container.textContent ?? ''
    const sourceUrls = guideMeta.sources.map(({ url }) => url)

    expect(sourceUrls).toEqual(approvedSources)
    expect(sourceUrls.every((url) => url.startsWith('https://'))).toBe(true)
    expect(sourceUrls).toHaveLength(4)
    expect(renderedText).not.toMatch(/OSRS|codes|trainer|crack|torrent/i)
  })
})
