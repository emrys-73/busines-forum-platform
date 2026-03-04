'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MemberGrid } from './MemberGrid'
import { Member } from '@/types'
import { Search, X } from 'lucide-react'

const ALL_TAGS = ['founder', 'investor', 'advisor', 'technical', 'creative', 'operator', 'marketer']

interface MemberSearchProps {
  members: Member[]
}

export function MemberSearch({ members }: MemberSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.bio?.toLowerCase().includes(q) ||
        m.job_title?.toLowerCase().includes(q) ||
        m.tagline?.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q)) ||
        m.interests.some((i) => i.toLowerCase().includes(q))

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => m.tags.includes(tag))

      return matchesQuery && matchesTags
    })
  }, [members, query, selectedTags])

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skills, bio..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {(query || selectedTags.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setQuery(''); setSelectedTags([]) }}
            className="gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_TAGS.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            className="cursor-pointer capitalize select-none"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        {filtered.length} member{filtered.length !== 1 ? 's' : ''} found
      </div>

      <MemberGrid members={filtered} />
    </div>
  )
}
