import strings from '@/i18n/en.json'
import type { PublicRoute } from '@/lib/routes'
import { MobileNav } from './mobile-nav'
import { ThemeToggle } from './theme-toggle'

const navigation: ReadonlyArray<{ href: PublicRoute; label: string }> = [
  { href: '/', label: strings.nav.home },
  { href: '/guides/', label: strings.nav.guides },
]

export default function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- preserves the published trailing-slash route contract. */}
        <a href="/" className="text-lg font-bold tracking-tight text-nav-theme">
          {strings.siteName}
        </a>
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navigation.map((link) => (
              <li key={link.href}>
                <a className="rounded-md px-3 py-2 text-sm font-medium hover:bg-background" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <MobileNav links={navigation} />
        </div>
      </div>
    </header>
  )
}
