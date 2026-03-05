'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
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
    <div className="max-w-4xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-16 reveal">
        <h1 className="text-[clamp(3.5rem,8vw,6rem)] font-bold tracking-tight mb-6" style={{ letterSpacing: '-0.04em', lineHeight: '1' }}>
          Finde den richtigen
          <br />
          Geschäftspartner
        </h1>
        <p className="text-[22px] text-muted-foreground font-normal max-w-2xl leading-relaxed">
          Beschreibe was du brauchst und unsere KI findet die besten Matches in unserer Community.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-16">
        <div className="mb-6">
          <label htmlFor="need" className="block text-lg font-medium mb-3">
            Wobei brauchst du Hilfe?
          </label>
          <Textarea
            id="need"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="z.B. Ich suche einen technischen Mitgründer mit B2B SaaS-Erfahrung, der beim MVP helfen kann..."
            rows={6}
            className="rounded-2xl text-lg p-6 shadow-lg border-0 ring-1 ring-border/50 focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50 resize-none"
          />
        </div>
        <Button type="submit" disabled={loading || !need.trim()} size="lg" className="gap-3 rounded-2xl text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-shadow">
          <Zap className="h-5 w-5" />
          {loading ? 'Matches werden gesucht...' : 'Matches finden'}
        </Button>
      </form>

      {loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-8 space-y-4 shadow-lg bg-card">
              <div className="flex gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searched && !loading && matches.length === 0 && (
        <div className="text-center py-20 text-muted-foreground text-xl font-normal">
          Keine Matches gefunden. Versuche dein Anliegen anders zu beschreiben.
        </div>
      )}

      {matches.length > 0 && (
        <div className="space-y-5">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            {matches.length} Match{matches.length !== 1 ? 'es' : ''} gefunden
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
