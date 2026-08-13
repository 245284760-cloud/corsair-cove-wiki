import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { PageShell } from '@/components/site/page-shell'
import { ThemeProvider } from '@/components/site/theme-provider'
import GoogleAnalytics from '@/components/site/google-analytics'
import { CANONICAL_ORIGIN } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Corsair Cove Wiki',
  metadataBase: new URL(CANONICAL_ORIGIN),
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GoogleAnalytics />
        <ThemeProvider>
          <PageShell>{children}</PageShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
