'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Member } from '@/types'
import { Mail, Users } from 'lucide-react'
import type { Metadata } from 'next'

export default function IntroduceMePage() {
  const [members, setMembers] = useState<Member[]>([])
  const [targetId, setTargetId] = useState('')
  const [reason, setReason] = useState('')
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/graph-data')
      .then((r) => r.json())
      .then((d) => setMembers(d.members || []))
      .catch(() => {})
  }, [])

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!targetId || !reason.trim()) return
    setLoading(true)
    setEmailDraft(null)

    try {
      const res = await fetch('/api/introduce-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, targetName: members.find((m) => m.id === targetId)?.name, reason }),
      })
      const data = await res.json()
      setEmailDraft(data)
    } catch {
      setEmailDraft({ subject: 'Fehler', body: 'Generierung fehlgeschlagen. Bitte erneut versuchen.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Vorstellung
        </h1>
        <p className="text-xl text-muted-foreground font-normal max-w-2xl">
          Wähle ein Community-Mitglied und lass die KI eine Vorstellungs-E-Mail für dich schreiben.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <Label>Mit wem möchtest du dich vernetzen?</Label>
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder="Community-Mitglied auswählen..." />
            </SelectTrigger>
            <SelectContent>
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} {m.job_title ? `— ${m.job_title}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="reason">Warum möchtest du dich vernetzen?</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="z.B. Ich würde gerne eine mögliche Zusammenarbeit bei unseren B2B SaaS-Produkten besprechen..."
            rows={3}
          />
        </div>

        <Button type="submit" disabled={loading || !targetId || !reason.trim()} className="gap-2">
          <Mail className="h-4 w-4" />
          {loading ? 'Wird generiert...' : 'Vorstellungs-E-Mail generieren'}
        </Button>
      </form>

      {emailDraft && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Betreff</div>
              <div className="text-base font-medium">{emailDraft.subject}</div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">E-Mail-Text</div>
              <div className="text-base whitespace-pre-wrap bg-muted rounded-lg p-4 leading-relaxed">{emailDraft.body}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigator.clipboard.writeText(`Subject: ${emailDraft.subject}\n\n${emailDraft.body}`)}
            >
              <Mail className="h-4 w-4" />
              In Zwischenablage kopieren
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
