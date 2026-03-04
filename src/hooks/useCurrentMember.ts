'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Member } from '@/types'

export function useCurrentMember() {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchMember() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMember(null)
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .single()

      setMember(data || null)
      setLoading(false)
    }

    fetchMember()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchMember()
    })

    return () => subscription.unsubscribe()
  }, [])

  return { member, loading }
}
