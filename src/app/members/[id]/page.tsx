import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Member, CompanyMember } from '@/types'
import Link from 'next/link'
import { Linkedin, Globe, Building2, Lightbulb, HandHelping } from 'lucide-react'
import type { Metadata } from 'next'

const TAG_COLORS: Record<string, string> = {
  founder: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  investor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  advisor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  technical: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  creative: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  operator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  marketer: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('members').select('name, tagline').eq('id', id).single()
  if (!data) return { title: 'Mitglied nicht gefunden' }
  return { title: data.name, description: data.tagline || undefined }
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('id', id)
    .eq('is_visible', true)
    .single()

  if (!member) notFound()

  const { data: companyMemberships } = await supabase
    .from('company_members')
    .select('*, company:companies(*)')
    .eq('member_id', id)

  const m = member as Member
  const memberships = (companyMemberships as CompanyMember[]) || []

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar className="h-20 w-20 flex-shrink-0">
          <AvatarImage src={m.avatar_url || undefined} />
          <AvatarFallback className="text-xl font-bold">
            {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h1 className="text-2xl font-bold">{m.name}</h1>
          {m.job_title && <p className="text-muted-foreground mt-0.5">{m.job_title}</p>}
          {m.tagline && <p className="mt-2 text-base italic">&ldquo;{m.tagline}&rdquo;</p>}

          <div className="flex flex-wrap gap-2 mt-3">
            {m.tags.map((tag) => (
              <span
                key={tag}
                className={`text-sm px-2.5 py-0.5 rounded-full font-medium capitalize ${TAG_COLORS[tag] || 'bg-muted text-muted-foreground'}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {m.linkedin_url && (
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            )}
            {m.website_url && (
              <Button asChild size="sm" variant="outline" className="gap-1.5">
                <a href={m.website_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {m.bio && (
        <section className="mb-8">
          <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground mb-3">Über</h2>
          <p className="text-base leading-relaxed">{m.bio}</p>
        </section>
      )}

      {m.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground mb-3">Fähigkeiten</h2>
          <div className="flex flex-wrap gap-2">
            {m.skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </section>
      )}

      {m.interests.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground mb-3">Interessen</h2>
          <div className="flex flex-wrap gap-2">
            {m.interests.map((interest) => (
              <Badge key={interest} variant="outline">{interest}</Badge>
            ))}
          </div>
        </section>
      )}

      {(m.looking_for || m.can_help_with) && (
        <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {m.looking_for && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                <span className="text-base font-medium">Sucht nach</span>
              </div>
              <p className="text-base text-muted-foreground">{m.looking_for}</p>
            </div>
          )}
          {m.can_help_with && (
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-2">
                <HandHelping className="h-4 w-4 text-green-500" />
                <span className="text-base font-medium">Kann helfen bei</span>
              </div>
              <p className="text-base text-muted-foreground">{m.can_help_with}</p>
            </div>
          )}
        </section>
      )}

      {memberships.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground mb-3">Unternehmen</h2>
          <div className="space-y-2">
            {memberships.map((cm) => (
              <Link key={cm.id} href={`/companies/${cm.company?.slug}`}>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-base font-medium">{cm.company?.name}</div>
                    <div className="text-sm text-muted-foreground">{cm.role}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
