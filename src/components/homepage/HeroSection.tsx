'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-12 pb-24 overflow-hidden">
      {/* Animated floating gradient blobs */}
      <div className="absolute -z-10 top-[-20%] left-[-10%] w-[60%] h-[70%] glow-teal opacity-60 blur-3xl animate-blob-1" />
      <div className="absolute -z-10 top-[-10%] right-[-5%] w-[50%] h-[60%] glow-purple opacity-50 blur-3xl animate-blob-2" />
      <div className="absolute -z-10 bottom-[10%] left-[30%] w-[40%] h-[50%] glow-blue opacity-40 blur-3xl animate-blob-3" />

      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="animate-fade-in opacity-0-init mb-6">
          <span className="inline-flex items-center gap-2 text-base font-medium text-muted-foreground tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            GLC Business Forum Platform
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="animate-fade-in-up opacity-0-init delay-100 text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[1.05] mb-6"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', letterSpacing: '-0.01em' }}
        >
          {t('hero.title1')}
          <br />
          <span className="text-gradient">{t('hero.title2')}</span>
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up opacity-0-init delay-200 text-[clamp(1.25rem,3vw,1.75rem)] text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {t('hero.subtitle')}
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up opacity-0-init delay-300 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            size="lg"
            className="rounded-full px-8 h-13 text-lg font-medium bg-foreground text-background hover:opacity-80 transition-opacity"
          >
            <Link href="/members">
              {t('hero.cta1')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 h-13 text-lg font-medium border-border/60 hover:bg-accent transition-colors"
          >
            <Link href="/tools/matchmaker">
              {t('hero.cta2')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="animate-fade-in opacity-0-init delay-700 absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">{t('hero.scroll')}</span>
        <div className="w-px h-8 bg-gradient-to-b from-border to-transparent" />
      </div>
    </section>
  )
}
