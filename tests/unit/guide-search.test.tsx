import type { ComponentProps } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GuideSearch } from '@/components/site/guide-search'

vi.mock('@/components/site/tracked-link', async () => {
  const actual = await vi.importActual<typeof import('@/components/site/tracked-link')>('@/components/site/tracked-link')

  return {
    TrackedLink: (props: ComponentProps<typeof actual.TrackedLink>) => (
      <actual.TrackedLink data-shared-tracked-link="true" {...props} />
    ),
  }
})

const entries = [
  { href: '/resources/', title: 'Corsair Cove Resources', description: 'Resource categories and stockpiles', category: 'Resources' },
  { href: '/ships/', title: 'Corsair Cove Ships', description: 'Tiers and crew', category: 'Ships' },
]

describe('guide search', () => {
  afterEach(() => {
    delete (window as Window & { gtag?: unknown }).gtag
  })

  it('filters the verified guide index by title and reports result count', async () => {
    const { container } = render(<GuideSearch entries={entries} />)
    expect(screen.getByText('2 results')).toBeTruthy()
    const input = screen.getByRole('textbox', { name: 'Search guides' })
    fireEvent.change(input, { target: { value: 'ships' } })
    expect(screen.getByText('1 result')).toBeTruthy()
    expect(container.textContent).toContain('Corsair Cove Ships')
    expect(container.textContent).not.toContain('Corsair Cove Resources')
  })

  it('tracks the normalized search term, visible result count, and selected URL', () => {
    const gtag = vi.fn()
    ;(window as Window & { gtag?: typeof gtag }).gtag = gtag
    render(<GuideSearch entries={entries} />)

    fireEvent.change(screen.getByRole('textbox', { name: 'Search guides' }), { target: { value: '  ShIpS  ' } })
    const resultLink = screen.getByRole('link', { name: 'Corsair Cove Ships' })
    expect(resultLink.getAttribute('data-shared-tracked-link')).toBe('true')
    expect(clickWithoutNavigation(resultLink)).toBe(false)

    expect(gtag).toHaveBeenCalledWith('event', 'internal_search', {
      search_term: 'ships',
      result_count: 1,
      link_url: '/ships/',
    })
  })

  it('keeps a progressively enhanced link when analytics is unavailable or throws', () => {
    const { rerender } = render(<GuideSearch entries={entries} />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Search guides' }), { target: { value: 'ships' } })
    let link = screen.getByRole('link', { name: 'Corsair Cove Ships' })

    expect(() => clickWithoutNavigation(link)).not.toThrow()
    expect(link.getAttribute('href')).toBe('/ships/')

    ;(window as Window & { gtag?: () => never }).gtag = () => {
      throw new Error('analytics unavailable')
    }
    rerender(<GuideSearch entries={entries} />)
    link = screen.getByRole('link', { name: 'Corsair Cove Ships' })

    expect(() => clickWithoutNavigation(link)).not.toThrow()
    expect(link.getAttribute('href')).toBe('/ships/')
  })
})

function clickWithoutNavigation(link: HTMLElement) {
  let defaultPreventedByComponent = true
  const stopNavigation = (event: MouseEvent) => {
    defaultPreventedByComponent = event.defaultPrevented
    event.preventDefault()
  }

  document.addEventListener('click', stopNavigation, { once: true })
  fireEvent.click(link)

  return defaultPreventedByComponent
}
