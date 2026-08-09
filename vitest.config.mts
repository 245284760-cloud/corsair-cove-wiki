import mdx from '@mdx-js/rollup'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^@\/content\/guides$/,
        replacement: fileURLToPath(new URL('./src/content/guides.ts', import.meta.url)),
      },
    ],
  },
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] }) },
    tsconfigPaths(),
    react({ include: /\.(js|jsx|ts|tsx|md|mdx)$/ }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
