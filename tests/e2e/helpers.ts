import { expect, type Page } from '@playwright/test'

type BrowserDiagnostics = {
  assertClean: () => Promise<void>
}

export async function prepareVisualCapture(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
    `,
  })
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  })
}

export function collectBrowserDiagnostics(page: Page): BrowserDiagnostics {
  const failedSameOriginRequests: string[] = []
  const consoleErrors: string[] = []
  const baseOrigin = 'http://127.0.0.1:3000'

  page.on('requestfailed', (request) => {
    if (new URL(request.url()).origin === baseOrigin) {
      failedSameOriginRequests.push(`${request.method()} ${request.url()} (${request.failure()?.errorText ?? 'unknown error'})`)
    }
  })
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })

  return {
    async assertClean() {
      await expect(failedSameOriginRequests, `failed same-origin requests: ${failedSameOriginRequests.join('\n')}`).toEqual([])
      await expect(consoleErrors, `console errors: ${consoleErrors.join('\n')}`).toEqual([])
    },
  }
}

export async function expectPageContract(page: Page) {
  await expect(page.locator('h1')).toHaveCount(1)
  await expect.poll(() => page.title()).not.toBe('')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\S/)

  const brokenImages = await page.locator('img').evaluateAll((images: HTMLImageElement[]) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute('src') ?? '(missing src)'),
  )
  expect(brokenImages, `broken images: ${brokenImages.join(', ')}`).toEqual([])

  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
}
