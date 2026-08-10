import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

type Hsl = readonly [number, number, number]

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8')

function themeTokens(selector: ':root' | '.dark') {
  const escapedSelector = selector === ':root' ? ':root' : '\\.dark'
  const block = css.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))?.[1] ?? ''

  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim()]),
  )
}

function parseHsl(value: string | undefined): Hsl {
  expect(value).toBeDefined()
  const channels = value?.match(/[\d.]+/g)?.map(Number)
  expect(channels).toHaveLength(3)
  return channels as unknown as Hsl
}

function relativeLuminance(value: string | undefined) {
  const [h, saturationPercent, lightnessPercent] = parseHsl(value)
  const saturation = saturationPercent / 100
  const lightness = lightnessPercent / 100
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const offset = lightness - chroma / 2
  const sector = Math.floor(h / 60) % 6
  const rgbSectors: readonly Hsl[] = [
    [chroma, x, 0], [x, chroma, 0], [0, chroma, x],
    [0, x, chroma], [x, 0, chroma], [chroma, 0, x],
  ]
  const rgbPrime = rgbSectors[sector]
  const [red, green, blue] = rgbPrime.map((channel) => channel + offset).map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrastRatio(foreground: string | undefined, background: string | undefined) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background))
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background))
  return (lighter + 0.05) / (darker + 0.05)
}

describe.each([
  ['light', themeTokens(':root')],
  ['dark', themeTokens('.dark')],
])('%s theme contrast', (_name, tokens) => {
  it('keeps hero copy and gold CTA text at WCAG AA contrast', () => {
    expect(contrastRatio(tokens['hero-foreground'], tokens['hero-background'])).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(tokens['hero-muted'], tokens['hero-background'])).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(tokens['hero-accent'], tokens['hero-background'])).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(tokens['cta-foreground'], tokens.cta)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps teal navigation and red callout copy at WCAG AA contrast', () => {
    expect(contrastRatio(tokens['nav-theme'], tokens.surface)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(tokens['callout-foreground'], tokens.callout)).toBeGreaterThanOrEqual(4.5)
  })

  it('uses a two-color focus indicator that separates from hero, surface, and gold', () => {
    expect(contrastRatio(tokens['focus-ring'], tokens['hero-background'])).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(tokens['focus-contrast'], tokens.cta)).toBeGreaterThanOrEqual(3)
    expect(
      Math.max(
        contrastRatio(tokens['focus-ring'], tokens.surface),
        contrastRatio(tokens['focus-contrast'], tokens.surface),
      ),
    ).toBeGreaterThanOrEqual(3)
  })
})
