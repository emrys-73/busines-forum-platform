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
      setEmailDraft({ subject: 'Could not generate email', body: 'Please try again.' })
    } finally {
      setLoadingEmail(false)
    }
  }

  return (
    <>
      <Card className="hover:border-primary/30 transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{match.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{match.name}</span>
                <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                  <Star className="h-3 w-3 fill-current" />
                  {match.relevance_score}/10
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{match.reason}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex gap-2">
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link href={`/members/${match.id}`}>
              View Profile
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={generateEmail}>
            <Mail className="h-3 w-3" />
            Draft Intro Email
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showEmail} onOpenChange={setShowEmail}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Introduction Email Draft</DialogTitle>
          </DialogHeader>
          {loadingEmail ? (
            <div className="text-sm text-muted-foreground animate-pulse">Generating email draft...</div>
          ) : emailDraft ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Subject</div>
                <div className="text-sm font-medium">{emailDraft.subject}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Body</div>
                <div className="text-sm whitespace-pre-wrap bg-muted rounded-lg p-4">{emailDraft.body}</div>
              </div>
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  navigator.clipboard.writeText(`Subject: ${emailDraft.subject}\n\n${emailDraft.body}`)
                }}
              >
                Copy to Clipboard
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
