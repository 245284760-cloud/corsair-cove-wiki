import { createElement } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DiscoveryEventsContent from '@/content/guides/discovery-events.mdx'
import { discoveryEventsMeta, GUIDE_SLUGS, guideEntries } from '@/content/guides'

const approvedSources = [
  'https://wiki.hoodedhorse.com/Corsair_Cove/Seven_Seas',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Events',
  'https://wiki.hoodedhorse.com/Corsair_Cove/Quests',
  'https://steamcommunity.com/sharedfiles/filedetails/?id=3725819251',
]

describe('discovery events guide content contract', () => {
  it('publishes discovery events metadata from the registry', () => {
    expect(GUIDE_SLUGS).toContain('discovery-events')
    expect(discoveryEventsMeta.slug).toBe('discovery-events')
    expect(discoveryEventsMeta.href).toBe('/discovery-events/')
    expect(discoveryEventsMeta.primaryKeyword).toBe('corsair cove what is a discovery event')
    expect(discoveryEventsMeta.sources.map((source) => source.url)).toEqual(approvedSources)
    expect(guideEntries.some(({ meta }) => meta.slug === 'discovery-events')).toBe(true)
  })

  it('keeps discovery-event claims evidence-bounded', () => {
    expect(discoveryEventsMeta.directAnswer).toMatch(
      /Discovery Point, quest line, and Event are related but not interchangeable/i,
    )
    expect(discoveryEventsMeta.directAnswer).toMatch(
      /does not provide fixed answers for individual event choices/i,
    )
    expect(discoveryEventsMeta.directAnswer).not.toMatch(/guaranteed reward|every choice/i)
  })

  it('keeps the rendered guide body evidence-bounded', () => {
    const { container } = render(createElement(DiscoveryEventsContent))
    const renderedText = container.textContent ?? ''

    expect(renderedText).toMatch(
      /Discovery Point, quest line, and Event are related but not interchangeable/i,
    )
    expect(renderedText).toMatch(
      /does not provide fixed answers for individual event choices/i,
    )
    expect(renderedText).not.toMatch(/fixed reward|guaranteed reward|every choice/i)
  })
})
