import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/forum/PostCard'
import { Button } from '@/components/ui/button'
import { ForumPost } from '@/types'
import Link from 'next/link'
import { PenSquare } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forum',
  description: 'Community discussions, questions, and insights.',
}

export default async function ForumPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('forum_posts')
    .select('*, author:members(id, name, avatar_url), replies:forum_replies(id)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const all = (posts as ForumPost[]) || []
  const pinned = all.filter((p) => p.is_pinned)
  const regular = all.filter((p) => !p.is_pinned)

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <div className="flex items-start justify-between mb-12 reveal">
        <div>
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight mb-3" style={{ letterSpacing: '-0.03em' }}>
            Community Forum
          </h1>
          <p className="text-[17px] text-muted-foreground font-light max-w-2xl">Ask questions, share ideas, and connect with members.</p>
        </div>
        <Button asChild className="rounded-full px-5 h-9 text-[13px] bg-foreground text-background hover:opacity-80 transition-opacity">
          <Link href="/forum/new">
            <PenSquare className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {pinned.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Pinned</h2>
          <div className="space-y-3">
            {pinned.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </section>
      )}

      <div className="space-y-3">
        {regular.map((post) => <PostCard key={post.id} post={post} />)}
        {regular.length === 0 && pinned.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No posts yet. Be the first to start a discussion!
          </div>
        )}
      </div>
    </div>
  )
}
