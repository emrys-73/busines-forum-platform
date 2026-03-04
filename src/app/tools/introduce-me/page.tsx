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
      setEmailDraft({ subject: 'Error', body: 'Failed to generate. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Introduce Me
        </h1>
        <p className="text-[17px] text-muted-foreground font-light max-w-2xl">
          Select a community member and let AI write a warm introduction email for you.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4 mb-8">
        <div className="space-y-1.5">
          <Label>Who would you like to connect with?</Label>
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a community member..." />
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
          <Label htmlFor="reason">Why do you want to connect?</Label>
          <Textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. I'd love to discuss a potential collaboration on our B2B SaaS products..."
            rows={3}
          />
        </div>

        <Button type="submit" disabled={loading || !targetId || !reason.trim()} className="gap-2">
          <Mail className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Introduction Email'}
        </Button>
      </form>

      {emailDraft && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Subject</div>
              <div className="text-sm font-medium">{emailDraft.subject}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Email Body</div>
              <div className="text-sm whitespace-pre-wrap bg-muted rounded-lg p-4 leading-relaxed">{emailDraft.body}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigator.clipboard.writeText(`Subject: ${emailDraft.subject}\n\n${emailDraft.body}`)}
            >
              <Mail className="h-3.5 w-3.5" />
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
