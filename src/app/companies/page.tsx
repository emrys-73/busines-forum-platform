import { createClient } from '@/lib/supabase/server'
import { CompanyGrid } from '@/components/companies/CompanyGrid'
import { Company } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unternehmen',
  description: 'Entdecke Startups und Unternehmen von Mitgliedern des GLC Business Forums.',
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
          Firmen-Schaufenster
        </h1>
        <p className="text-[17px] text-muted-foreground font-normal max-w-2xl">
          Startups, KMUs und Unternehmen, gegründet und geführt von unseren Community-Mitgliedern.
        </p>
      </div>
      <CompanyGrid companies={(companies as Company[]) || []} />
    </div>
  )
}
