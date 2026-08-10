'use client'

import { useId, useState } from 'react'
import strings from '@/i18n/en.json'
import type { PublicRoute } from '@/lib/routes'

type MobileNavProps = {
  links: ReadonlyArray<{ href: PublicRoute; label: string }>
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? strings.mobileMenu.close : strings.mobileMenu.open}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span aria-hidden="true">Menu</span>
        <span className="sr-only">{isOpen ? strings.mobileMenu.close : strings.mobileMenu.open}</span>
      </button>
      {isOpen ? (
        <nav id={menuId} aria-label="Mobile navigation" className="mt-2 rounded-md border border-border bg-surface p-2 shadow-lg">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a className="block rounded px-3 py-2 font-medium hover:bg-background" href={link.href} onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  )
}
