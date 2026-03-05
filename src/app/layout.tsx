import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import { ScrollRevealProvider } from '@/components/ScrollRevealProvider'
import { LanguageProvider } from '@/lib/i18n/LanguageProvider'
import { BottomWaves } from '@/components/layout/BottomWaves'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'GLC Business Forum Platform',
    template: '%s | GLC Business Forum',
  },
  description: 'KI-gestützte Community-Plattform für das GLC Business Forum — vernetze Gründer, Investoren und Unternehmer.',
  openGraph: {
    title: 'GLC Business Forum Platform',
    description: 'Vernetze dich mit Gründern, Investoren und Unternehmern in München.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning className={playfair.variable}>
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <BottomWaves />
            <Navbar />
            <main className="relative z-1 flex-1">
              <ScrollRevealProvider>{children}</ScrollRevealProvider>
            </main>
            <Footer />
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
