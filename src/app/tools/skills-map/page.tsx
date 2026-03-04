import { createClient } from '@/lib/supabase/server'
import { SkillsTagCloud } from '@/components/tools/SkillsTagCloud'
import { Member } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Skills Map' }

export default async function SkillsMapPage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('members')
    .select('id, skills, interests')
    .eq('is_visible', true)

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Skills Map</h1>
        <p className="text-muted-foreground">
          Visual overview of all skills and interests in our community. Larger = more members share it.
        </p>
      </div>
      <SkillsTagCloud members={(members as Member[]) || []} />
    </div>
  )
}
