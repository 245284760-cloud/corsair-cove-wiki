'use client'

import { useTheme } from 'next-themes'
import strings from '@/i18n/en.json'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <button
      type="button"
      className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
      aria-label={`Toggle ${strings.theme.light.toLowerCase()} and ${strings.theme.dark.toLowerCase()} theme`}
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      Theme
    </button>
  )
}
