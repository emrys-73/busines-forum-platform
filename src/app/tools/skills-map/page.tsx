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
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Skills-Karte
        </h1>
        <p className="text-[17px] text-muted-foreground font-normal max-w-2xl">
          Visuelle Übersicht aller Fähigkeiten und Interessen in unserer Community. Größer = mehr Mitglieder teilen diese.
        </p>
      </div>
      <SkillsTagCloud members={(members as Member[]) || []} />
    </div>
  )
}
