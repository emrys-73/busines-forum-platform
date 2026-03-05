import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { CompanyMember } from '@/types'

interface CompanyMemberListProps {
  members: CompanyMember[]
}

export function CompanyMemberList({ members }: CompanyMemberListProps) {
  return (
    <div className="space-y-3">
      {members.map((cm) => (
        <Link key={cm.id} href={`/members/${cm.member_id}`}>
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
            <Avatar className="h-9 w-9">
              <AvatarImage src={cm.member?.avatar_url || undefined} />
              <AvatarFallback>
                {cm.member?.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-base font-medium">{cm.member?.name}</div>
              {cm.member?.job_title && (
                <div className="text-sm text-muted-foreground">{cm.member.job_title}</div>
              )}
            </div>
            <Badge variant="outline" className="text-sm">{cm.role}</Badge>
          </div>
        </Link>
      ))}
    </div>
  )
}
