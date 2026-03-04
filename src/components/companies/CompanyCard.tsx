import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Company } from '@/types'
import { Building2, Globe, ArrowUpRight } from 'lucide-react'

interface CompanyCardProps { company: Company }

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.slug}`} className="block group">
      <div className="h-full rounded-3xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-xl hover:shadow-black/[0.06] hover:-translate-y-1 dark:hover:shadow-black/30">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-12 h-12 rounded-2xl object-contain border border-border/60 bg-background p-1" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-muted to-border flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="font-semibold text-[15px] leading-snug">{company.name}</p>
              {company.industry && <p className="text-[13px] text-muted-foreground mt-0.5">{company.industry}</p>}
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
        </div>

        {company.description && (
          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mb-4">{company.description}</p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          {company.stage && (
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-semibold">
              {company.stage}
            </span>
          )}
          {company.founded_year && (
            <span className="text-[12px] text-muted-foreground">Est. {company.founded_year}</span>
          )}
          {company.website_url && (
            <span className="ml-auto flex items-center gap-1 text-[12px] text-muted-foreground">
              <Globe className="h-3 w-3" /> Website
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
