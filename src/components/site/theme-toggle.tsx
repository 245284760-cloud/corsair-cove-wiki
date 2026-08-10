'use client'

import { useTheme } from 'next-themes'
import strings from '@/i18n/en.json'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
      aria-label={`Use ${(isDark ? strings.theme.light : strings.theme.dark).toLowerCase()} theme`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      Theme
    </button>
  )
}
