import { expect, test } from '@playwright/test'
import { PUBLIC_ROUTES } from '../../src/lib/routes'
import { collectBrowserDiagnostics, expectPageContract, prepareVisualCapture } from './helpers'

const guideCards = ['Beginner Tips', 'Get More Drifters', 'Build Your First Ship', 'Connect High Buildings']
const screenshotRoutes = [
  { path: '/', name: 'home' },
  { path: '/guides/', name: 'guide-hub' },
  { path: '/tips/', name: 'tips' },
] as const

test.describe('published Corsair Cove pages', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} returns the published page contract`, async ({ page }) => {
      const diagnostics = collectBrowserDiagnostics(page)
      const response = await page.goto(route, { waitUntil: 'networkidle' })

      expect(response?.status()).toBe(200)
      await expectPageContract(page)
      await diagnostics.assertClean()
    })
  }
})

test('home leads to Beginner Tips', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Beginner Tips' }).first().click()
  await expect(page).toHaveURL(/\/tips\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tips')
})

test('Guide Hub exposes all four published guide cards', async ({ page }) => {
  await page.goto('/guides/')
  for (const name of guideCards) {
    await expect(page.getByRole('link', { name })).toBeVisible()
  }
})

test('theme can be changed with the keyboard', async ({ page }) => {
  await page.goto('/')
  const themeToggle = page.getByRole('button', { name: /Use (dark|light) theme/ })
  await themeToggle.focus()
  const before = await page.locator('html').getAttribute('class')
  await page.keyboard.press('Enter')
  await expect.poll(() => page.locator('html').getAttribute('class')).not.toBe(before)
})

test('hero keyboard focus uses a visible two-color indicator in both themes', async ({ page }) => {
  await page.goto('/')
  const heroLink = page.getByRole('link', { name: 'Explore Ships & Resources' })

  for (const theme of ['light', 'dark']) {
    await page.locator('html').evaluate((element, value) => {
      element.classList.remove('light', 'dark')
      element.classList.add(value)
    }, theme)
    await heroLink.focus()

    const indicator = await heroLink.evaluate((element) => {
      const style = getComputedStyle(element)
      const heroBackground = getComputedStyle(element.closest('section') as HTMLElement).backgroundColor
      return {
        boxShadow: style.boxShadow,
        heroBackground,
        outlineColor: style.outlineColor,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      }
    })

    expect(indicator.outlineStyle).toBe('solid')
    expect(indicator.outlineWidth).toBe('3px')
    expect(indicator.outlineColor).not.toBe(indicator.heroBackground)
    expect(indicator.boxShadow).not.toBe('none')
  }
})

test('mobile menu exposes navigation at 390 by 844', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile navigation is only visible in the mobile project.')
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Guides' }).click()
  await expect(page).toHaveURL(/\/guides\/$/)
})

test('guide tables stay within the mobile viewport', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Table containment is tested in the mobile project.')
  await page.goto('/tips/')
  const tables = page.locator('.article-content table')
  const tableCount = await tables.count()
  expect(tableCount, 'The responsive guide table should be present.').toBeGreaterThan(0)
  for (let index = 0; index < tableCount; index += 1) {
    await expect(
      await tables.nth(index).evaluate((table) => {
        const { left, right } = table.getBoundingClientRect()
        const tolerance = 1

        return left >= -tolerance && right <= window.innerWidth + tolerance
      }),
    ).toBe(true)
  }
})

test('unknown routes use the custom 404 page', async ({ page }) => {
  const response = await page.goto('/not-a-published-page/')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Back to home' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Browse guides' })).toBeVisible()
  await expect(page.getByRole('main')).toHaveCount(1)
})

for (const { path, name } of screenshotRoutes) {
  test(`${name} screenshot is reproducible`, async ({ page }, testInfo) => {
    await page.goto(path, { waitUntil: 'networkidle' })
    await prepareVisualCapture(page)
    await page.screenshot({
      fullPage: true,
      path: `artifacts/screenshots/${name}-${testInfo.project.name}.png`,
    })
  })
}
