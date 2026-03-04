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
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Company Showcase</h1>
        <p className="text-muted-foreground">
          Startups, SMEs, and ventures founded and led by our community members.
        </p>
      </div>
      <CompanyGrid companies={(companies as Company[]) || []} />
    </div>
  )
}
