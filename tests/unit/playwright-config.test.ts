import { describe, expect, it } from 'vitest'
import playwrightConfig from '../../playwright.config'

describe('Playwright production server configuration', () => {
  it('always starts a fresh built production server for browser acceptance', () => {
    expect(playwrightConfig.webServer).toMatchObject({
      command: 'npm run build && npm run start',
      reuseExistingServer: false,
      url: 'http://127.0.0.1:3000',
    })
  })
})
