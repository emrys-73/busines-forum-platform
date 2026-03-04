'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

const NEXT_EVENT_DATE = new Date('2026-03-05T18:00:00+01:00')

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

export function NextEventHero({ eventSlug = 'glc-munich-business-forum-march-2026', eventTitle = 'GLC Munich Business Forum', location = 'Munich, Germany' }: NextEventHeroProps) {
  const { days, hours, minutes, seconds } = useCountdown(NEXT_EVENT_DATE)
  const isPast = NEXT_EVENT_DATE.getTime() < Date.now()

  return (
    <div className="relative rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-card via-card to-muted/30 p-8 md:p-12">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-3">
            {isPast ? 'Last Event' : 'Next Event'}
          </p>
          <h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold tracking-tight leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
            {eventTitle}
          </h2>
          <div className="flex flex-wrap gap-4 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> March 5, 2026</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 6:00 PM CET</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {location}</span>
          </div>
          <div className="mt-6">
            <Button asChild className="rounded-full px-6 h-10 text-[13px] font-medium bg-foreground text-background hover:opacity-80 transition-opacity">
              <Link href={`/events/${eventSlug}`}>View Details</Link>
            </Button>
          </div>
        </div>

        {!isPast && (
          <div className="flex gap-3 flex-shrink-0">
            {[
              { value: days, label: 'Days' },
              { value: hours, label: 'Hours' },
              { value: minutes, label: 'Min' },
              { value: seconds, label: 'Sec' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-background border border-border/60 flex items-center justify-center text-2xl font-bold tabular-nums tracking-tight shadow-sm" style={{ letterSpacing: '-0.03em' }}>
                  {String(value).padStart(2, '0')}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
