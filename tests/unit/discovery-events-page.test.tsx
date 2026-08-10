import { createElement } from 'react'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DiscoveryEventsPage, { metadata } from '@/app/discovery-events/page'
import DiscoveryEventsContent, { guideMeta } from '@/content/guides/discovery-events.mdx'
import { getGuideMeta } from '@/content/guides'

const orderedHeadings = [
  'What Discovery Points, Quest Lines, and Events Mean',
  'Reach a Discovery Point Through the Fog',
  'Prepare a Ship for the Event',
  'Monitor Health, Crew, and Objectives',
  'Evidence Limit: Do Not Guess Event Choices',
]

const approvedSources = new Set([
  'https://wiki.hoodedhorse.com/Corsair_Cove/Seven_Seas',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Events',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Quests',
  'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251',
])

const approvedRelatedRoutes = new Set([
  '/tips/',
  '/how-to-get-more-drifters/',
  '/how-to-build-ship/',
  '/connect-high-buildings/',
])

describe('the discovery events guide page', () => {
  it('renders the MDX body independently with the exact ordered guide headings', () => {
    const { container } = render(createElement(DiscoveryEventsContent))

    expect(container.querySelectorAll('h1')).toHaveLength(0)
    expect(Array.from(container.querySelectorAll('h2')).map((heading) => heading.textContent)).toEqual(
      orderedHeadings,
    )
  })

  it('uses the shared article shell with one H1 and evidence-bounded navigation', () => {
    const { container } = render(createElement(DiscoveryEventsPage))

    expect(guideMeta).toBe(getGuideMeta('discovery-events'))
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: guideMeta.title })).not.toBeNull()
    expect(screen.getByRole('link', { name: 'Guides' }).getAttribute('href')).toBe('/guides/')
    expect(screen.getByLabelText('Direct answer')).not.toBeNull()
    expect(Array.from(container.querySelectorAll('.article-content h2')).map((heading) => heading.textContent)).toEqual(
      orderedHeadings,
    )

    const sources = container.querySelector('[aria-labelledby="sources-heading"]')
    expect(sources).not.toBeNull()
    const sourceLinks = within(sources as HTMLElement).getAllByRole('link')
    expect(sourceLinks.length).toBeGreaterThanOrEqual(2)
    expect(sourceLinks.every((link) => approvedSources.has(link.getAttribute('href') ?? ''))).toBe(true)

    const relatedGuides = container.querySelector('[aria-labelledby="related-guides-heading"]')
    expect(relatedGuides).not.toBeNull()
    const relatedLinks = within(relatedGuides as HTMLElement).getAllByRole('link')
    expect(relatedLinks).toHaveLength(guideMeta.related.length)
    expect(relatedLinks.every((link) => approvedRelatedRoutes.has(link.getAttribute('href') ?? ''))).toBe(true)
  })

  it('publishes canonical article metadata for the explicit route', () => {
    expect(metadata.alternates?.canonical).toBe('https://corsaircovewiki.com/discovery-events/')
    expect(metadata.openGraph).toMatchObject({
      url: 'https://corsaircovewiki.com/discovery-events/',
      type: 'article',
    })
  })
})
