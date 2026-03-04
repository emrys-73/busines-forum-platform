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
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Opportunity Spotter</h1>
        </div>
        <p className="text-muted-foreground">
          Describe a theme, challenge, or area of interest and our AI will surface hidden collaboration opportunities within the community.
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <Label htmlFor="context">What area should we explore?</Label>
          <Textarea
            id="context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. I'm interested in how AI and fintech could combine in our community to create new opportunities..."
            rows={4}
          />
        </div>
        <Button type="submit" disabled={loading || !context.trim()} className="gap-2">
          <Lightbulb className="h-4 w-4" />
          {loading ? 'Spotting opportunities...' : 'Spot Opportunities'}
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
          No opportunities found. Try a different context.
        </div>
      )}

      {opportunities.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            {opportunities.length} Opportunit{opportunities.length !== 1 ? 'ies' : 'y'} Found
          </h2>
          {opportunities.map((opp, i) => (
            <OpportunityCard key={i} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  )
}
