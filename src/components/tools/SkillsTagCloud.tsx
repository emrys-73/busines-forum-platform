'use client'

import { useMemo } from 'react'
import { Member } from '@/types'

interface SkillsTagCloudProps {
  members: Member[]
}

interface TagEntry {
  tag: string
  count: number
  type: 'skill' | 'interest'
}

export function SkillsTagCloud({ members }: SkillsTagCloudProps) {
  const { skills, interests } = useMemo(() => {
    const skillMap = new Map<string, number>()
    const interestMap = new Map<string, number>()

    members.forEach((m) => {
      m.skills.forEach((s) => skillMap.set(s, (skillMap.get(s) || 0) + 1))
      m.interests.forEach((i) => interestMap.set(i, (interestMap.get(i) || 0) + 1))
    })

    const skills: TagEntry[] = [...skillMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([tag, count]) => ({ tag, count, type: 'skill' as const }))

    const interests: TagEntry[] = [...interestMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([tag, count]) => ({ tag, count, type: 'interest' as const }))

    return { skills, interests }
  }, [members])

  const maxSkill = Math.max(...skills.map((s) => s.count), 1)
  const maxInterest = Math.max(...interests.map((i) => i.count), 1)

  function fontSize(count: number, max: number) {
    const min = 0.7
    const maxSize = 2.0
    return min + ((count - 1) / (max - 1 || 1)) * (maxSize - min)
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 items-baseline">
          {skills.map(({ tag, count }) => (
            <span
              key={tag}
              className="text-primary font-medium hover:opacity-70 transition-opacity cursor-default"
              style={{ fontSize: `${fontSize(count, maxSkill)}rem` }}
              title={`${count} member${count !== 1 ? 's' : ''}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Interests</h3>
        <div className="flex flex-wrap gap-2 items-baseline">
          {interests.map(({ tag, count }) => (
            <span
              key={tag}
              className="text-muted-foreground font-medium hover:text-foreground transition-colors cursor-default"
              style={{ fontSize: `${fontSize(count, maxInterest)}rem` }}
              title={`${count} member${count !== 1 ? 's' : ''}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
