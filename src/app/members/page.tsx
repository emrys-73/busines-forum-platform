import { createClient } from '@/lib/supabase/server'
import { MemberSearch } from '@/components/members/MemberSearch'
import { Member } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mitglieder',
  description: 'Durchsuche alle Mitglieder des GLC Business Forums.',
}

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('is_visible', true)
    .order('joined_at', { ascending: true })

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
      <div className="mb-12 reveal">
        <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
          Community-Mitglieder
        </h1>
        <p className="text-[17px] text-muted-foreground font-normal max-w-2xl">
          Triff die Gründer, Investoren, Berater und Macher des GLC Business Forums.
        </p>
      </div>
      <MemberSearch members={(members as Member[]) || []} />
    </div>
  )
}
