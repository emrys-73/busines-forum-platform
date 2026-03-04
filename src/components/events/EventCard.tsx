import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin } from 'lucide-react'
import { Event } from '@/types'
import { format } from 'date-fns'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="hover:border-primary/50 hover:shadow-sm transition-all h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <Badge variant={event.is_upcoming ? 'default' : 'secondary'}>
              {event.is_upcoming ? 'Upcoming' : 'Past'}
            </Badge>
          </div>
          <CardTitle className="text-base leading-snug">{event.title}</CardTitle>
          {event.description && (
            <CardDescription className="line-clamp-2">{event.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(event.event_date), 'MMMM d, yyyy')}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
