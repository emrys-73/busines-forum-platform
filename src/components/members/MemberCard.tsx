import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Member } from '@/types'

const TAG_COLORS: Record<string, string> = {
  founder: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  investor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  advisor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  technical: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  creative: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  operator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  marketer: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
}

interface MemberCardProps {
  member: Member
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/members/${member.id}`}>
      <Card className="hover:border-primary/50 hover:shadow-sm transition-all h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
              <AvatarFallback className="text-sm font-semibold">
                {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{member.name}</div>
              {member.job_title && (
                <div className="text-xs text-muted-foreground mt-0.5">{member.job_title}</div>
              )}
              {member.tagline && (
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">&ldquo;{member.tagline}&rdquo;</div>
              )}
            </div>
          </div>

          {member.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {member.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[tag] || 'bg-muted text-muted-foreground'}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {member.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {member.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs py-0">
                  {skill}
                </Badge>
              ))}
              {member.skills.length > 3 && (
                <Badge variant="outline" className="text-xs py-0">
                  +{member.skills.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
