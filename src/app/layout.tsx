import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import { ScrollRevealProvider } from '@/components/ScrollRevealProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'GLC Munich Business Forum',
    template: '%s | GLC Munich Forum',
  },
  description: 'AI-powered community platform for Gospel Life Center Munich\'s business forum — connect founders, investors, and startup-minded people.',
  openGraph: {
    title: 'GLC Munich Business Forum',
    description: 'Connect with founders, investors, and startup-minded people in Munich.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="flex-1">
            <ScrollRevealProvider>{children}</ScrollRevealProvider>
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
