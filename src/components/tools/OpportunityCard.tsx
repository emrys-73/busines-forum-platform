import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Users } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  Partnership: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Investment: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Mentorship: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Collaboration: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Service: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
}

export interface OpportunityData {
  title: string
  description: string
  member_ids: string[]
  member_names: string[]
  category: string
}

interface OpportunityCardProps {
  opportunity: OpportunityData
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[opportunity.category] || 'bg-muted text-muted-foreground'}`}>
            {opportunity.category}
          </span>
        </div>
        <CardTitle className="text-base">{opportunity.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4">{opportunity.description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          {opportunity.member_names.map((name, i) => (
            <Link
              key={opportunity.member_ids[i]}
              href={`/members/${opportunity.member_ids[i]}`}
              className="text-xs font-medium hover:underline text-primary"
            >
              {name}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
