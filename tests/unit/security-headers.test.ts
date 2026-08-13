import { describe, expect, it } from 'vitest'
// @ts-expect-error Next config is an executable JavaScript module without a declaration file.
import nextConfig from '../../next.config.mjs'

type HeaderRule = { source: string; headers?: Array<{ key: string; value: string }> }

describe('production security headers', () => {
  it('applies browser hardening to every route', async () => {
    const rules = await nextConfig.headers?.()
    const allRoutes = (rules as HeaderRule[] | undefined)?.find((rule) => rule.source === '/(.*)')
    const headers = new Map((allRoutes?.headers ?? []).map(({ key, value }) => [key, value]))

    expect(headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin')
    expect(headers.get('X-Frame-Options')).toBe('DENY')
    expect(headers.get('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=(), browsing-topics=()')
  })
})
