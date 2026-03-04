'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useCurrentMember } from '@/hooks/useCurrentMember'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ReplyFormProps {
  postId: string
}

export function ReplyForm({ postId }: ReplyFormProps) {
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { member } = useCurrentMember()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!member) { toast.error('Please sign in to reply'); return }
    if (!body.trim()) return

    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.from('forum_replies').insert({
      post_id: postId,
      author_id: member.id,
      body: body.trim(),
    })

    setSubmitting(false)
    if (error) {
      toast.error('Failed to post reply')
      return
    }
    setBody('')
    toast.success('Reply posted!')
    router.refresh()
  }

  if (!member) {
    return (
      <div className="text-sm text-muted-foreground border rounded-lg p-4 text-center">
        <a href="/auth/login" className="text-primary underline">Sign in</a> to join the conversation
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your reply..."
        rows={3}
      />
      <Button type="submit" disabled={submitting || !body.trim()} size="sm">
        {submitting ? 'Posting...' : 'Post Reply'}
      </Button>
    </form>
  )
}
