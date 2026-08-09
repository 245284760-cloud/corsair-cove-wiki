import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { PageShell } from '@/components/site/page-shell'
import { ThemeProvider } from '@/components/site/theme-provider'

export const metadata: Metadata = {
  title: 'Corsair Cove Wiki',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <PageShell>{children}</PageShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
