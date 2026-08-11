import { describe, expect, it } from 'vitest'
import { GUIDE_ROUTES, PUBLIC_ROUTES } from '@/lib/routes'

describe('published routes', () => {
  it('publishes the five core information routes alongside the existing pages', () => {
    expect(PUBLIC_ROUTES).toEqual([
      '/',
      '/guides/',
      '/tips/',
      '/how-to-get-more-drifters/',
      '/how-to-build-ship/',
      '/connect-high-buildings/',
      '/discovery-events/',
      '/platforms/',
      '/release-date/',
      '/price/',
      '/system-requirements/',
      '/troubleshooting/',
    ])

    expect(PUBLIC_ROUTES).not.toContain('/mods/')
  })

  it('includes the five core information pages in the guide routes', () => {
    expect(GUIDE_ROUTES).toEqual([
      '/tips/',
      '/how-to-get-more-drifters/',
      '/how-to-build-ship/',
      '/connect-high-buildings/',
      '/discovery-events/',
      '/platforms/',
      '/release-date/',
      '/price/',
      '/system-requirements/',
      '/troubleshooting/',
    ])
  })
})
