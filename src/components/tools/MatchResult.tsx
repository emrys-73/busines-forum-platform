'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, ArrowRight, Linkedin, Globe, Lightbulb, HandHelping } from 'lucide-react'
import { Member } from '@/types'
import { createClient } from '@/lib/supabase/client'

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

const TAG_LABELS: Record<string, string> = {
  founder: 'Grunder',
  investor: 'Investor',
  advisor: 'Berater',
  technical: 'Technisch',
  creative: 'Kreativ',
  operator: 'Operator',
  marketer: 'Marketing',
}

const TAG_COLORS: Record<string, string> = {
  founder: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  investor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  advisor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  technical: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  creative: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  operator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  marketer: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
}

export function MatchResult({ match }: MatchResultProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [member, setMember] = useState<Member | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)

  async function openProfile() {
    setShowProfile(true)
    if (member) return // already loaded
    setLoadingProfile(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('members')
        .select('*')
        .eq('id', match.id)
        .eq('is_visible', true)
        .single()
      setMember(data as Member | null)
    } catch {
      setMember(null)
    } finally {
      setLoadingProfile(false)
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
          <Button variant="outline" className="gap-2 rounded-xl text-base px-5 py-5" onClick={openProfile}>
            Profil ansehen
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Profil von {match.name}</DialogTitle>
          </DialogHeader>
          {loadingProfile ? (
            <div className="space-y-4 py-4">
              <div className="flex gap-4 items-start">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : member ? (
            <div className="space-y-5 py-2">
              <div className="flex gap-4 items-start">
                <Avatar className="h-16 w-16 shrink-0">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback className="text-lg font-bold">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  {member.job_title && <p className="text-muted-foreground text-sm">{member.job_title}</p>}
                  {member.tagline && <p className="mt-1 text-sm italic">&ldquo;{member.tagline}&rdquo;</p>}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {member.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TAG_COLORS[tag] || 'bg-muted text-muted-foreground'}`}
                      >
                        {TAG_LABELS[tag] || tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {member.linkedin_url && (
                      <Button asChild size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-3.5 w-3.5" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {member.website_url && (
                      <Button asChild size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
                        <a href={member.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-3.5 w-3.5" />
                          Website
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {member.bio && (
                <>
                  <Separator />
                  <section>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Uber</h4>
                    <p className="text-sm leading-relaxed">{member.bio}</p>
                  </section>
                </>
              )}

              {member.skills.length > 0 && (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Fahigkeiten</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </section>
              )}

              {member.interests.length > 0 && (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Interessen</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {member.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="text-xs">{interest}</Badge>
                    ))}
                  </div>
                </section>
              )}

              {(member.looking_for || member.can_help_with) && (
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {member.looking_for && (
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-sm font-medium">Sucht nach</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{member.looking_for}</p>
                    </div>
                  )}
                  {member.can_help_with && (
                    <div className="rounded-lg border p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <HandHelping className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-sm font-medium">Kann helfen bei</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{member.can_help_with}</p>
                    </div>
                  )}
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Profil konnte nicht geladen werden.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
