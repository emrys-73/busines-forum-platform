import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Member } from '@/types'

const TAG_LABELS: Record<string, string> = {
  founder: 'Gründer', investor: 'Investor', advisor: 'Berater',
  technical: 'Technisch', creative: 'Kreativ', operator: 'Operator', marketer: 'Marketing',
}

const TAG_COLORS: Record<string, string> = {
  founder: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  investor: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  advisor: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
  technical: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400',
  creative: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400',
  operator: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  marketer: 'bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400',
}

interface MemberCardProps { member: Member }

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/members/${member.id}`} className="block group">
      <div className="h-full rounded-3xl border border-border/60 bg-card p-6 card-shadow transition-all duration-300 hover:border-border hover:-translate-y-1">
        <div className="flex items-start gap-4 mb-5">
          <Avatar className="h-14 w-14 flex-shrink-0 rounded-2xl">
            <AvatarImage src={member.avatar_url || undefined} alt={member.name} className="object-cover" />
            <AvatarFallback className="rounded-2xl text-base font-bold bg-gradient-to-br from-muted to-border">
              {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-lg leading-snug truncate">{member.name}</p>
            {member.job_title && (
              <p className="text-base text-muted-foreground mt-0.5 truncate">{member.job_title}</p>
            )}
          </div>
        </div>

        {member.tagline && (
          <p className="text-base text-muted-foreground italic leading-relaxed mb-4 line-clamp-2">
            &ldquo;{member.tagline}&rdquo;
          </p>
        )}

        {member.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {member.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`text-sm px-2.5 py-1 rounded-full font-semibold ${TAG_COLORS[tag] || 'bg-muted text-muted-foreground'}`}
              >
                {TAG_LABELS[tag] || tag}
              </span>
            ))}
          </div>
        )}

        {member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {member.skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-sm px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                {skill}
              </span>
            ))}
            {member.skills.length > 3 && (
              <span className="text-sm px-2 py-0.5 rounded-full bg-muted text-muted-foreground/60 font-medium">
                +{member.skills.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
