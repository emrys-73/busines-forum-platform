import { createClient } from '@/lib/supabase/server'
import { MemberSearch } from '@/components/members/MemberSearch'
import { Member } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Members',
  description: 'Browse all GLC Munich Business Forum community members.',
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
          Community Members
        </h1>
        <p className="text-[17px] text-muted-foreground font-light max-w-2xl">
          Meet the founders, investors, advisors, and builders of GLC Munich Business Forum.
        </p>
      </div>
      <MemberSearch members={(members as Member[]) || []} />
    </div>
  )
}
