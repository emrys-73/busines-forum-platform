import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CompanyMemberList } from '@/components/companies/CompanyMemberList'
import { Company, CompanyMember } from '@/types'
import { Building2, Globe, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('companies').select('name, description').eq('slug', slug).single()
  if (!data) return { title: 'Company Not Found' }
  return { title: data.name, description: data.description || undefined }
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!company) notFound()

  const { data: companyMembers } = await supabase
    .from('company_members')
    .select('*, member:members(*)')
    .eq('company_id', company.id)
    .order('is_primary', { ascending: false })

  const c = company as Company
  const members = (companyMembers as CompanyMember[]) || []

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">
        {c.logo_url ? (
          <img src={c.logo_url} alt={c.name} className="w-16 h-16 rounded-xl object-contain border bg-background" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{c.name}</h1>
          {c.industry && <p className="text-muted-foreground">{c.industry}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            {c.stage && <Badge variant="secondary">{c.stage}</Badge>}
            {c.founded_year && (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Founded {c.founded_year}
              </span>
            )}
          </div>
          {c.website_url && (
            <Button asChild size="sm" variant="outline" className="gap-1.5 mt-3">
              <a href={c.website_url} target="_blank" rel="noopener noreferrer">
                <Globe className="h-3.5 w-3.5" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </div>

      {c.description && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">About</h2>
          <p className="text-sm leading-relaxed">{c.description}</p>
        </section>
      )}

      <Separator className="mb-8" />

      {members.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Team</h2>
          <CompanyMemberList members={members} />
        </section>
      )}
    </div>
  )
}
