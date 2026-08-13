import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = process.cwd()
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const packageLock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'))
const supportedNodeRange = '^20.19.0 || ^22.13.0 || >=24.0.0'

describe('toolchain contract', () => {
  it('matches the project and documented Node range to the installed jsdom contract', () => {
    const documents = [
      'README.md',
      'docs/superpowers/plans/2026-08-10-corsair-cove-mvp.md',
      'docs/superpowers/specs/2026-08-10-corsair-cove-mvp-design.md',
    ]

    expect(packageLock.packages['node_modules/jsdom'].engines.node).toBe(supportedNodeRange)
    expect(packageJson.engines.node).toBe(supportedNodeRange)
    expect(packageLock.packages[''].engines.node).toBe(supportedNodeRange)
    for (const document of documents) {
      expect(readFileSync(join(root, document), 'utf8'), document).toContain(
        `Node.js \`${supportedNodeRange}\``,
      )
    }
  })

  it('pins the remediated direct PostCSS release in the manifest and lockfile', () => {
    expect(packageJson.devDependencies.postcss).toBe('8.5.26')
    expect(packageLock.packages[''].devDependencies.postcss).toBe('8.5.26')
    expect(packageLock.packages['node_modules/postcss'].version).toBe('8.5.26')
  })

  it('uses warning-free PostCSS and native Vite tsconfig path resolution', () => {
    const postcssConfig = readFileSync(join(root, 'postcss.config.mjs'), 'utf8')
    const vitestConfig = readFileSync(join(root, 'vitest.config.mts'), 'utf8')

    expect(postcssConfig).toContain('const config =')
    expect(postcssConfig).toContain('export default config')
    expect(vitestConfig).toContain('tsconfigPaths: true')
    expect(vitestConfig).not.toContain("from 'vite-tsconfig-paths'")
    expect(packageJson.devDependencies).not.toHaveProperty('vite-tsconfig-paths')
  })
})
