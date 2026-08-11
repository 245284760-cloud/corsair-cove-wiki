import { createElement } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SystemRequirementsContent, { guideMeta } from '@/content/guides/system-requirements.mdx'
import { ArticleLayout } from '@/components/site/article-layout'

describe('system requirements guide', () => {
  it('exposes the canonical metadata and required sections', () => {
    const { container } = render(createElement(ArticleLayout, { meta: guideMeta }, createElement(SystemRequirementsContent)))

    expect(guideMeta.href).toBe('/system-requirements/')
    expect(Array.from(container.querySelectorAll('.article-content h2')).map((heading) => heading.textContent)).toEqual([
      'Supported operating system',
      'Minimum requirements',
      'Recommended requirements',
      'Storage and hardware notes',
      'Check your PC before buying',
      'Fix startup or performance problems',
    ])
    expect(screenText(container)).toContain('Windows 10 64-bit')
    expect(screenText(container)).toContain('GTX 1660 Super 6 GB')
    expect(screenText(container)).toContain('RTX 2070 8 GB')
  })
})

function screenText(container: HTMLElement) {
  return container.textContent ?? ''
}
