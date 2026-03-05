import { createClient } from '@/lib/supabase/server'
import { EventCard } from '@/components/events/EventCard'
import { NextEventHero } from '@/components/events/NextEventHero'
import { Event } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veranstaltungen',
  description: 'Kommende und vergangene Veranstaltungen des GLC Business Forums.',
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
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Veranstaltungen
        </h1>
        <p className="text-[17px] text-muted-foreground font-normal max-w-2xl">
          Nimm teil an unseren monatlichen Business-Foren für Münchens glaubensgetriebene Unternehmer.
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
          <h2 className="text-lg font-semibold mb-4">Weitere kommende Veranstaltungen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.slice(1).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Vergangene Veranstaltungen</h2>
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
