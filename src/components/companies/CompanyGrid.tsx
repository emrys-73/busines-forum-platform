import { CompanyCard } from './CompanyCard'
import { Company } from '@/types'

interface CompanyGridProps {
  companies: Company[]
}

export function CompanyGrid({ companies }: CompanyGridProps) {
  if (companies.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No companies found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  )
}
