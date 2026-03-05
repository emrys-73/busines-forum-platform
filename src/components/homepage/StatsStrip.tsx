'use client'

import { useTranslation } from '@/lib/i18n/useTranslation'

interface StatsStripProps {
  memberCount: number
  companyCount: number
}

export function StatsStrip({ memberCount, companyCount }: StatsStripProps) {
  const { t } = useTranslation()

  const stats = [
    { label: t('stats.members'), value: memberCount, suffix: '+' },
    { label: t('stats.companies'), value: companyCount, suffix: '' },
  ]

  return (
    <section className="relative py-20 border-y border-border/50 overflow-hidden">
      {/* Subtle animated gradient backdrop */}
      <div className="absolute -z-10 top-[-50%] left-[10%] w-[40%] h-[200%] glow-blue opacity-30 blur-3xl animate-blob-2" />
      <div className="absolute -z-10 top-[-50%] right-[10%] w-[40%] h-[200%] glow-teal opacity-20 blur-3xl animate-blob-3" />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 gap-8 md:gap-0 md:divide-x divide-border/50">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center px-8 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div
                className="text-[clamp(3rem,7vw,5rem)] font-bold tabular-nums leading-none mb-2"
                style={{ fontFamily: 'var(--font-display), Georgia, serif', letterSpacing: '-0.02em' }}
              >
                {stat.value}{stat.suffix}
              </div>
              <div className="text-base text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
