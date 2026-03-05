'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { MatchResult, MatchResultData } from '@/components/tools/MatchResult'
import { Zap, Shuffle, Sparkles } from 'lucide-react'

const SAMPLE_PROMPTS = [
  'Ich suche einen technischen Mitgründer mit B2B SaaS-Erfahrung',
  'Wer kann mir bei der Finanzierung meines Startups helfen?',
  'Ich brauche einen Experten für digitales Marketing',
  'Suche einen Steuerberater für Gründer',
  'Wer hat Erfahrung mit Internationalisierung in der EU?',
  'Ich suche einen Mentor für mein erstes Unternehmen',
  'Brauche Hilfe bei der Entwicklung einer Mobile App',
  'Suche jemanden mit Erfahrung im E-Commerce',
  'Wer kennt sich mit KI und Machine Learning aus?',
  'Ich brauche einen Designer für mein Branding',
  'Suche einen Partner für gemeinsame Vertriebsaktionen',
  'Wer kann bei der Patentanmeldung unterstützen?',
  'Ich suche einen Logistik-Experten für meinen Online-Shop',
  'Brauche Beratung zum Thema Datenschutz und DSGVO',
  'Suche einen Investor für eine Pre-Seed-Runde',
  'Wer hat Kontakte in die Automobilbranche?',
  'Ich brauche einen Freelancer für Backend-Entwicklung',
  'Suche einen HR-Experten für den Aufbau meines Teams',
  'Wer kann mir bei der Buchhaltung helfen?',
  'Ich suche Unterstützung beim Businessplan schreiben',
  'Brauche einen Fotografen für Produktfotos',
  'Suche jemanden für Social Media Management',
  'Wer hat Erfahrung mit Crowdfunding-Kampagnen?',
  'Ich brauche Hilfe bei der Suchmaschinenoptimierung',
  'Suche einen Rechtsanwalt für Vertragsrecht',
  'Wer kann bei der Unternehmensnachfolge beraten?',
  'Ich suche einen Coach für Führungskräfteentwicklung',
  'Brauche einen Experten für Prozessoptimierung',
  'Suche Kontakte in die Immobilienbranche',
  'Wer kann mir bei der Expansion nach Österreich helfen?',
]

function getRandomPrompts(count: number) {
  const shuffled = [...SAMPLE_PROMPTS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export default function MatchmakerPage() {
  const [need, setNeed] = useState('')
  const [matches, setMatches] = useState<MatchResultData[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [samples, setSamples] = useState(() => getRandomPrompts(3))

  const shuffleSamples = useCallback(() => {
    setSamples(getRandomPrompts(3))
  }, [])

  function handleSampleClick(prompt: string) {
    setNeed(prompt)
    // Auto-submit
    setLoading(true)
    setSearched(true)
    setMatches([])
    fetch('/api/matchmaker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ need: prompt }),
    })
      .then((res) => res.json())
      .then((data) => setMatches(data.matches || []))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false))
  }

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
          Finde die richtige
          <br />
          Unterstützung in
          <br />
          unserer Community
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
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {samples.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSampleClick(prompt)}
              className="rounded-full bg-secondary/80 hover:bg-secondary px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
          <button
            type="button"
            onClick={shuffleSamples}
            className="rounded-full bg-secondary/50 hover:bg-secondary p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Neue Vorschläge"
          >
            <Shuffle className="h-4 w-4" />
          </button>
        </div>
        <Button type="submit" disabled={loading || !need.trim()} size="lg" className="gap-3 rounded-2xl text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-shadow">
          <Zap className="h-5 w-5" />
          {loading ? 'Matches werden gesucht...' : 'Matches finden'}
        </Button>
      </form>

      {loading && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative flex items-center justify-center h-10 w-10">
              <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              <span className="relative flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              </span>
            </div>
            <div>
              <p className="text-base font-medium">KI analysiert deine Anfrage...</p>
              <p className="text-sm text-muted-foreground">Die besten Matches werden gesucht</p>
            </div>
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-8 space-y-4 shadow-lg bg-card overflow-hidden relative animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${i * 200}ms`, animationFillMode: 'both', animationDuration: '500ms' }}
            >
              <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-foreground/3 to-transparent" style={{ animationDelay: `${i * 300}ms` }} />
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
