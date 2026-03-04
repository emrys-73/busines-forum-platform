'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface AISuggestion {
  id: string
  name: string
  reason: string
}

interface AIAnswerSuggestionProps {
  postId: string
}

export function AIAnswerSuggestion({ postId }: AIAnswerSuggestionProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/forum-suggest?postId=${postId}`)
      .then((r) => r.json())
      .then((data) => {
        setSuggestions(data.suggestions || [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [postId])

  if (loading) {
    return (
      <div className="space-y-2 p-4 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (error || suggestions.length === 0) return null

  return (
    <Alert className="border-primary/20 bg-primary/5">
      <Sparkles className="h-4 w-4 text-primary" />
      <AlertTitle className="text-sm font-semibold">AI Suggestion — Who Can Help</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          {suggestions.map((s) => (
            <Link key={s.id} href={`/members/${s.id}`} className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors group">
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarFallback className="text-xs">{s.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xs font-medium group-hover:underline">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.reason}</div>
              </div>
            </Link>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  )
}
