'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { MatchResult, MatchResultData } from '@/components/tools/MatchResult'
import { Zap } from 'lucide-react'

export default function MatchmakerPage() {
  const [need, setNeed] = useState('')
  const [matches, setMatches] = useState<MatchResultData[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!need.trim()) return
    setLoading(true)
    setSearched(true)
    setMatches([])

    try {
      const res = await fetch('/api/matchmaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ need }),
      })
      const data = await res.json()
      setMatches(data.matches || [])
    } catch {
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Who Can Help Me?</h1>
        </div>
        <p className="text-muted-foreground">
          Describe what you need and our AI will find the best matches in our community.
        </p>
      </div>

      <form onSubmit={handleSearch} className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <Label htmlFor="need">What do you need help with?</Label>
          <Textarea
            id="need"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="e.g. I'm looking for a technical co-founder with B2B SaaS experience to help build our MVP..."
            rows={4}
          />
        </div>
        <Button type="submit" disabled={loading || !need.trim()} className="gap-2">
          <Zap className="h-4 w-4" />
          {loading ? 'Finding matches...' : 'Find Matches'}
        </Button>
      </form>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-xl p-5 space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && !loading && matches.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No matches found. Try describing your need differently.
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            {matches.length} Match{matches.length !== 1 ? 'es' : ''} Found
          </h2>
          {matches
            .sort((a, b) => b.relevance_score - a.relevance_score)
            .map((match) => (
              <MatchResult key={match.id} match={match} need={need} />
            ))}
        </div>
      )}
    </div>
  )
}
