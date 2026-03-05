'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Link from 'next/link'
import { Star, Mail, ArrowRight } from 'lucide-react'

export interface MatchResultData {
  id: string
  name: string
  reason: string
  relevance_score: number
}

interface MatchResultProps {
  match: MatchResultData
  need: string
}

export function MatchResult({ match, need }: MatchResultProps) {
  const [showEmail, setShowEmail] = useState(false)
  const [emailDraft, setEmailDraft] = useState<{ subject: string; body: string } | null>(null)
  const [loadingEmail, setLoadingEmail] = useState(false)

  async function generateEmail() {
    setLoadingEmail(true)
    setShowEmail(true)
    try {
      const res = await fetch('/api/introduce-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: match.id, targetName: match.name, reason: need }),
      })
      const data = await res.json()
      setEmailDraft(data)
    } catch {
      setEmailDraft({ subject: 'E-Mail konnte nicht generiert werden', body: 'Bitte erneut versuchen.' })
    } finally {
      setLoadingEmail(false)
    }
  }

  return (
    <>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all rounded-2xl">
        <CardHeader className="pb-4 p-8">
          <div className="flex items-start gap-5">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg font-semibold">{match.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-xl">{match.name}</span>
                <span className="flex items-center gap-1 text-base text-amber-500 font-medium">
                  <Star className="h-5 w-5 fill-current" />
                  {match.relevance_score}/10
                </span>
              </div>
              <p className="text-base text-muted-foreground mt-2 leading-relaxed">{match.reason}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-8 pb-8 flex gap-3">
          <Button asChild variant="outline" className="gap-2 rounded-xl text-base px-5 py-5">
            <Link href={`/members/${match.id}`}>
              Profil ansehen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="gap-2 rounded-xl text-base px-5 py-5" onClick={generateEmail}>
            <Mail className="h-5 w-5" />
            Vorstellungs-E-Mail
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showEmail} onOpenChange={setShowEmail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Entwurf Vorstellungs-E-Mail</DialogTitle>
          </DialogHeader>
          {loadingEmail ? (
            <div className="text-base text-muted-foreground animate-pulse">E-Mail-Entwurf wird generiert...</div>
          ) : emailDraft ? (
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Betreff</div>
                <div className="text-base font-medium">{emailDraft.subject}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Text</div>
                <div className="text-base whitespace-pre-wrap bg-muted rounded-lg p-4">{emailDraft.body}</div>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(`Subject: ${emailDraft.subject}\n\n${emailDraft.body}`)
                }}
              >
                In Zwischenablage kopieren
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
