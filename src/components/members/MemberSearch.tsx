'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { MemberGrid } from './MemberGrid'
import { Member } from '@/types'
import { Search, X, ArrowUpDown } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/useTranslation'

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

type SortOption = 'joined_asc' | 'joined_desc' | 'name_asc' | 'name_desc'

const SORT_LABELS: Record<SortOption, string> = {
  joined_asc: 'Beitrittsdatum (älteste)',
  joined_desc: 'Beitrittsdatum (neueste)',
  name_asc: 'Name (A–Z)',
  name_desc: 'Name (Z–A)',
}

function isMemberActive(m: Member): boolean {
  return !!(m.bio || m.tagline || m.tags.length > 0 || m.skills.length > 0 || m.job_title)
}

interface MemberSearchProps { members: Member[] }

export function MemberSearch({ members }: MemberSearchProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [activeOnly, setActiveOnly] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('joined_asc')

  const filtered = useMemo(() => {
    const result = members.filter((m) => {
      const q = query.toLowerCase()
      const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.bio?.toLowerCase().includes(q) || m.job_title?.toLowerCase().includes(q) || m.tagline?.toLowerCase().includes(q) || m.skills.some((s) => s.toLowerCase().includes(q)) || m.interests.some((i) => i.toLowerCase().includes(q))
      const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => m.tags.includes(tag))
      const matchesActive = !activeOnly || isMemberActive(m)
      return matchesQuery && matchesTags && matchesActive
    })

    result.sort((a, b) => {
      switch (sortBy) {
        case 'joined_asc':
          return new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime()
        case 'joined_desc':
          return new Date(b.joined_at).getTime() - new Date(a.joined_at).getTime()
        case 'name_asc':
          return a.name.localeCompare(b.name, 'de')
        case 'name_desc':
          return b.name.localeCompare(a.name, 'de')
      }
    })

    return result
  }, [members, query, selectedTags, activeOnly, sortBy])

  function toggleTag(tag: string) {
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-6 max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Mitglieder, Fähigkeiten, Bio suchen..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-11 h-12 rounded-2xl border-border/60 bg-muted/30 text-lg focus:bg-background transition-colors"
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
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            data-active={selectedTags.includes(tag)}
            onClick={() => toggleTag(tag)}
            className={`text-base px-4 py-1.5 rounded-full border border-border/60 font-medium capitalize transition-all duration-200 hover:border-border ${TAG_STYLES[tag] || ''} data-[active=false]:text-muted-foreground data-[active=false]:hover:text-foreground`}
          >
            {t(`tag.${tag}`)}
          </button>
        ))}
        {(query || selectedTags.length > 0 || !activeOnly) && (
          <button
            onClick={() => { setQuery(''); setSelectedTags([]); setActiveOnly(true); setSortBy('joined_asc') }}
            className="text-base px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            <X className="h-4 w-4" /> Zurücksetzen
          </button>
        )}
      </div>

      {/* Active filter + Sort */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={() => setActiveOnly(!activeOnly)}
          className={`text-base px-4 py-1.5 rounded-full border font-medium transition-all duration-200 ${
            activeOnly
              ? 'bg-foreground text-background border-foreground'
              : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
          }`}
        >
          Nur aktive Mitglieder
        </button>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-base bg-transparent border border-border/60 rounded-xl px-3 py-1.5 text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-base text-muted-foreground mb-6">
        {filtered.length} Mitglied{filtered.length !== 1 ? 'er' : ''}
      </p>

      <MemberGrid members={filtered} />
    </div>
  )
}
