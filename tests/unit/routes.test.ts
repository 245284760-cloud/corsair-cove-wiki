import { describe, expect, it } from 'vitest'
import { PUBLIC_ROUTES } from '@/lib/routes'

describe('published routes', () => {
  it('publishes exactly the seven approved trailing-slash routes', () => {
    expect(PUBLIC_ROUTES).toEqual([
      '/',
      '/guides/',
      '/tips/',
      '/how-to-get-more-drifters/',
      '/how-to-build-ship/',
      '/connect-high-buildings/',
      '/discovery-events/',
    ])

    expect(PUBLIC_ROUTES).not.toContain('/mods/')
  })
})
