import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Event } from '@/types'
import { Calendar, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('events').select('title, description').eq('slug', slug).single()
  if (!data) return { title: 'Event Not Found' }
  return { title: data.title, description: data.description || undefined }
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!event) notFound()

  const e = event as Event

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="mb-6">
        <Badge variant={e.is_upcoming ? 'default' : 'secondary'} className="mb-3">
          {e.is_upcoming ? 'Upcoming' : 'Past Event'}
        </Badge>
        <h1 className="text-3xl font-bold mb-3">{e.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {format(new Date(e.event_date), 'EEEE, MMMM d, yyyy · h:mm a')}
          </span>
          {e.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {e.location}
            </span>
          )}
        </div>
      </div>

      {e.description && (
        <p className="text-muted-foreground leading-relaxed mb-8">{e.description}</p>
      )}

      {e.recap_body && (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2 className="text-lg font-semibold mb-4">Event Recap</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{e.recap_body}</ReactMarkdown>
        </div>
      )}

      {e.recap_images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-3">
          {e.recap_images.map((url, i) => (
            <img key={i} src={url} alt={`Event photo ${i + 1}`} className="rounded-xl w-full object-cover aspect-video" />
          ))}
        </div>
      )}
    </div>
  )
}
