'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { OpportunityCard, OpportunityData } from '@/components/tools/OpportunityCard'
import { Lightbulb } from 'lucide-react'

export default function OpportunitySpotterPage() {
  const [context, setContext] = useState('')
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!context.trim()) return
    setLoading(true)
    setSearched(true)
    setOpportunities([])

    try {
      const res = await fetch('/api/opportunity-spotter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context }),
      })
      const data = await res.json()
      setOpportunities(data.opportunities || [])
    } catch {
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Chancen-Finder
        </h1>
        <p className="text-[17px] text-muted-foreground font-normal max-w-2xl">
          Beschreibe ein Thema, eine Herausforderung oder ein Interessengebiet und unsere KI findet verborgene Zusammenarbeitsmöglichkeiten in der Community.
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <Label htmlFor="context">Welchen Bereich sollen wir erkunden?</Label>
          <Textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="z.B. Mich interessiert, wie KI und Fintech in unserer Community kombiniert werden könnten..."
            rows={4}
          />
        </div>
        <Button type="submit" disabled={loading || !context.trim()} className="gap-2">
          <Lightbulb className="h-4 w-4" />
          {loading ? 'Chancen werden gesucht...' : 'Chancen finden'}
        </Button>
      </form>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-xl p-5 space-y-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      )}

      {searched && !loading && opportunities.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Keine Chancen gefunden. Versuche einen anderen Kontext.
        </div>
      )}

      {opportunities.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            {opportunities.length} Chance{opportunities.length !== 1 ? 'n' : ''} gefunden
          </h2>
          {opportunities.map((opp, i) => (
            <OpportunityCard key={i} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  )
}
