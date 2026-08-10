import { describe, expect, it } from 'vitest'
import type { Page } from '@playwright/test'
import { collectBrowserDiagnostics } from '../../tests/e2e/helpers'

type EventName = 'console' | 'requestfailed' | 'response'
type Listener = (payload: never) => void

function createDiagnosticsPage() {
  const listeners = new Map<EventName, Listener>()
  const page = {
    on(event: EventName, listener: Listener) {
      listeners.set(event, listener)
      return this
    },
  } as unknown as Page

  return { listeners, page }
}

describe('browser request diagnostics', () => {
  it('reports failed same-origin HTTP responses with resource, file, URL, and status', async () => {
    const { listeners, page } = createDiagnosticsPage()
    const diagnostics = collectBrowserDiagnostics(page)

    listeners.get('response')?.({
      status: () => 503,
      url: () => 'http://127.0.0.1:3000/_next/static/chunk.js',
      request: () => ({ method: () => 'GET', resourceType: () => 'script' }),
    } as never)

    await expect(diagnostics.assertClean()).rejects.toThrow(
      'script GET /_next/static/chunk.js http://127.0.0.1:3000/_next/static/chunk.js (HTTP 503)',
    )
  })
})
