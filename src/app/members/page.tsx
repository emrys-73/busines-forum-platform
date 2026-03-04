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
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Members</h1>
        <p className="text-muted-foreground">
          Meet the founders, investors, advisors, and builders of GLC Munich Business Forum.
        </p>
      </div>
      <MemberSearch members={(members as Member[]) || []} />
    </div>
  )
}
