'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Member } from '@/types'

export function useCurrentMember() {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchingRef = useRef(false)
  const createdRef = useRef(false)

  const fetchMember = useCallback(async () => {
    // Prevent concurrent calls
    if (fetchingRef.current) return
    fetchingRef.current = true

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setMember(null)
        setLoading(false)
        return
      }

      // Try to fetch the existing member
      const { data } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (data) {
        setMember(data)
        setLoading(false)
        return
      }

      // Only attempt auto-create once per session
      if (createdRef.current) {
        setMember(null)
        setLoading(false)
        return
      }
      createdRef.current = true

      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (res.ok) {
        const { member: newMember } = await res.json()
        setMember(newMember)
      } else if (res.status === 409) {
        // Member was created by a concurrent request — re-fetch
        const { data: refetched } = await supabase
          .from('members')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()
        setMember(refetched)
      } else {
        setMember(null)
      }
      setLoading(false)
    } finally {
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    fetchMember()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event) => {
      // Reset the created flag on sign-in/sign-out so it can re-attempt
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
        createdRef.current = false
        fetchMember()
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchMember])

  return { member, loading }
}
