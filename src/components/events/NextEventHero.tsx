'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

const NEXT_EVENT_DATE = new Date('2026-03-05T18:00:00+01:00')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function useCountdown(target: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      }
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

export function NextEventHero({ eventSlug = 'march-2026', eventTitle = 'GLC Munich Business Forum — March 2026', location = 'Munich, Germany' }: NextEventHeroProps) {
  const { days, hours, minutes, seconds } = useCountdown(NEXT_EVENT_DATE)
  const isPast = NEXT_EVENT_DATE.getTime() < Date.now()

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge variant="default" className="mb-3">
              {isPast ? 'Last Event' : 'Next Event'}
            </Badge>
            <h2 className="text-xl md:text-2xl font-bold mb-2">{eventTitle}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                March 5, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                6:00 PM CET
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {location}
              </span>
            </div>
          </div>

          {!isPast && (
            <div className="flex gap-3">
              {[
                { value: days, label: 'Days' },
                { value: hours, label: 'Hours' },
                { value: minutes, label: 'Min' },
                { value: seconds, label: 'Sec' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold tabular-nums w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button asChild>
            <Link href={`/events/${eventSlug}`}>View Event Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
