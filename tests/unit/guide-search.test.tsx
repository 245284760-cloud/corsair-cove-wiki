import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GuideSearch } from '@/components/site/guide-search'

const entries = [
  { href: '/resources/', title: 'Corsair Cove Resources', description: 'Resource categories and stockpiles', category: 'Resources' },
  { href: '/ships/', title: 'Corsair Cove Ships', description: 'Tiers and crew', category: 'Ships' },
]

describe('guide search', () => {
  it('filters the verified guide index by title and reports result count', async () => {
    const { container } = render(<GuideSearch entries={entries} />)
    expect(screen.getByText('2 results')).toBeTruthy()
    const input = screen.getByRole('textbox', { name: 'Search guides' })
    fireEvent.change(input, { target: { value: 'ships' } })
    expect(screen.getByText('1 result')).toBeTruthy()
    expect(container.textContent).toContain('Corsair Cove Ships')
    expect(container.textContent).not.toContain('Corsair Cove Resources')
  })
})
