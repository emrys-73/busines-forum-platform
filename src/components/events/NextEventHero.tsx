'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/useTranslation'

const NEXT_EVENT_DATE = new Date('2026-03-05T19:00:00+01:00')

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number }

function useCountdown(target: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    function calc() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return { days: Math.floor(diff / 86400000), hours: Math.floor((diff % 86400000) / 3600000), minutes: Math.floor((diff % 3600000) / 60000), seconds: Math.floor((diff % 60000) / 1000) }
    }
    setTimeLeft(calc())
    const id = setInterval(() => setTimeLeft(calc()), 1000)
    return () => clearInterval(id)
  }, [target])
  return timeLeft
}

interface NextEventHeroProps {
  eventSlug?: string
  eventTitle?: string
  location?: string
}

export function NextEventHero({ eventSlug = 'glc-business-forum-march-2026', eventTitle = 'GLC Business Forum', location = 'Am Kiesgrund 2-4, Feldkirchen' }: NextEventHeroProps) {
  const { days, hours, minutes, seconds } = useCountdown(NEXT_EVENT_DATE)
  const isPast = NEXT_EVENT_DATE.getTime() < Date.now()
  const { t } = useTranslation()

  return (
    <div className="relative rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-card via-card to-muted/30 p-8 md:p-12 card-shadow">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      {/* Animated accent blob */}
      <div className="absolute z-0 -top-1/3 -right-1/4 w-1/2 h-full glow-purple opacity-40 blur-3xl animate-blob-2" />
      <div className="absolute z-0 -bottom-1/3 -left-1/4 w-1/2 h-full glow-teal opacity-30 blur-3xl animate-blob-3" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <p className="text-sm uppercase tracking-widest font-semibold text-muted-foreground mb-3">
            {isPast ? t('event.lastEvent') : t('event.nextEvent')}
          </p>
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-tight leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            {eventTitle}
          </h2>
          <div className="flex flex-wrap gap-4 text-base text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> 5. März 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> 19:00 Uhr MEZ</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {location}</span>
          </div>
          <div className="mt-6">
            <Button asChild className="rounded-full px-6 h-11 text-base font-medium bg-foreground text-background hover:opacity-80 transition-opacity">
              <Link href={`/events/${eventSlug}`}>{t('event.viewDetails')}</Link>
            </Button>
          </div>
        </div>

        {!isPast && (
          <div className="flex gap-3 flex-shrink-0">
            {[
              { value: days, label: t('event.days') },
              { value: hours, label: t('event.hours') },
              { value: minutes, label: t('event.min') },
              { value: seconds, label: t('event.sec') },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="w-18 h-18 rounded-2xl bg-background border border-border/60 flex items-center justify-center text-3xl font-bold tabular-nums tracking-tight shadow-sm" style={{ letterSpacing: '-0.03em' }}>
                  {String(value).padStart(2, '0')}
                </div>
                <p className="text-[13px] uppercase tracking-widest text-muted-foreground mt-1.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
