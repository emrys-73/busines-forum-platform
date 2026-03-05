import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: string
}

export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1 tabular-nums">{value}</p>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            {trend && <p className="text-sm text-green-600 dark:text-green-400 mt-1">{trend}</p>}
          </div>
          {Icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
