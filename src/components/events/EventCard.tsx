import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/types'
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'

interface EventCardProps { event: Event }

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.slug}`} className="block group">
      <div className="h-full rounded-3xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-black/[0.06] hover:-translate-y-1">
        <div className="flex items-start justify-between gap-2 mb-4">
          <span className={`text-sm px-2.5 py-1 rounded-full font-semibold ${event.is_upcoming ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' : 'bg-muted text-muted-foreground'}`}>
            {event.is_upcoming ? 'Kommend' : 'Vergangen'}
          </span>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <h3 className="font-semibold text-lg leading-snug mb-2">{event.title}</h3>
        {event.description && (
          <p className="text-base text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{event.description}</p>
        )}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {format(new Date(event.event_date), 'MMMM d, yyyy')}
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
