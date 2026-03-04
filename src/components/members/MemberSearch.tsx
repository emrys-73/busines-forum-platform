'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { MemberGrid } from './MemberGrid'
import { Member } from '@/types'
import { Search, X } from 'lucide-react'

const ALL_TAGS = ['founder', 'investor', 'advisor', 'technical', 'creative', 'operator', 'marketer']

const TAG_STYLES: Record<string, string> = {
  founder: 'data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500',
  investor: 'data-[active=true]:bg-emerald-500 data-[active=true]:text-white data-[active=true]:border-emerald-500',
  advisor: 'data-[active=true]:bg-purple-500 data-[active=true]:text-white data-[active=true]:border-purple-500',
  technical: 'data-[active=true]:bg-orange-500 data-[active=true]:text-white data-[active=true]:border-orange-500',
  creative: 'data-[active=true]:bg-pink-500 data-[active=true]:text-white data-[active=true]:border-pink-500',
  operator: 'data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500',
  marketer: 'data-[active=true]:bg-teal-500 data-[active=true]:text-white data-[active=true]:border-teal-500',
}

interface MemberSearchProps { members: Member[] }

export function MemberSearch({ members }: MemberSearchProps) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = query.toLowerCase()
      const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.bio?.toLowerCase().includes(q) || m.job_title?.toLowerCase().includes(q) || m.tagline?.toLowerCase().includes(q) || m.skills.some((s) => s.toLowerCase().includes(q)) || m.interests.some((i) => i.toLowerCase().includes(q))
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => m.tags.includes(tag))
      return matchesQuery && matchesTags
    })
  }, [members, query, selectedTags])

  function toggleTag(tag: string) {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6 max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members, skills, bio..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 h-12 rounded-2xl border-border/60 bg-muted/30 text-[15px] focus:bg-background transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            data-active={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
            className={`text-[13px] px-4 py-1.5 rounded-full border border-border/60 font-medium capitalize transition-all duration-200 hover:border-border ${TAG_STYLES[tag] || ''} data-[active=false]:text-muted-foreground data-[active=false]:hover:text-foreground`}
          >
            {tag}
          </button>
        ))}
        {(query || selectedTags.length > 0) && (
          <button
            onClick={() => { setQuery(''); setSelectedTags([]) }}
            className="text-[13px] px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      <p className="text-[13px] text-muted-foreground mb-6">
        {filtered.length} member{filtered.length !== 1 ? 's' : ''}
      </p>

      <MemberGrid members={filtered} />
    </div>
  )
}
