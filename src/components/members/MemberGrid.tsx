import { MemberCard } from './MemberCard'
import { Member } from '@/types'

interface MemberGridProps {
  members: Member[]
}

export function MemberGrid({ members }: MemberGridProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        No members found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
    </div>
  )
}
