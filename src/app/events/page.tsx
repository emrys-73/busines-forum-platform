import { createClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/events/EventCard'
import { NextEventHero } from '@/components/events/NextEventHero'
import { Event } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past GLC Munich Business Forum events.',
}

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })

  const all = (events as Event[]) || []
  const upcoming = all.filter((e) => e.is_upcoming)
  const past = all.filter((e) => !e.is_upcoming)

  const nextEvent = upcoming[0]

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Events</h1>
        <p className="text-muted-foreground">
          Join us for monthly business forums bringing together Munich&apos;s faith-driven entrepreneurs.
        </p>
      </div>

      {nextEvent && (
        <div className="mb-10">
          <NextEventHero
            eventSlug={nextEvent.slug}
            eventTitle={nextEvent.title}
            location={nextEvent.location || undefined}
          />
        </div>
      )}

      {upcoming.length > 1 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">More Upcoming Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.slice(1).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Past Events</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
