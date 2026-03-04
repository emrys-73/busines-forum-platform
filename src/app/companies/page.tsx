import { createClient } from '@/lib/supabase/server'
import { CompanyGrid } from '@/components/companies/CompanyGrid'
import { Company } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Companies',
  description: 'Discover startups and companies founded by GLC Munich Business Forum members.',
}

export default async function CompaniesPage() {
  const supabase = await createClient()
  const { data: companies } = await supabase
    .from('companies')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Company Showcase
        </h1>
        <p className="text-[17px] text-muted-foreground font-light max-w-2xl">
          Startups, SMEs, and ventures founded and led by our community members.
        </p>
      </div>
      <CompanyGrid companies={(companies as Company[]) || []} />
    </div>
  )
}
