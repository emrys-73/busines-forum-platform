import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Company } from '@/types'
import { Building2, Globe } from 'lucide-react'

interface CompanyCardProps {
  company: Company
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.slug}`}>
      <Card className="h-full hover:border-primary/50 hover:shadow-sm transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-10 h-10 rounded-lg object-contain border bg-background" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              <CardTitle className="text-base">{company.name}</CardTitle>
              {company.industry && (
                <CardDescription className="text-xs">{company.industry}</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {company.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{company.description}</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {company.stage && <Badge variant="secondary">{company.stage}</Badge>}
            {company.founded_year && (
              <span className="text-xs text-muted-foreground">Est. {company.founded_year}</span>
            )}
            {company.website_url && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Globe className="h-3 w-3" />
                Website
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
