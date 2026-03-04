import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ReplyForm } from '@/components/forum/ReplyForm'
import { AIAnswerSuggestion } from '@/components/forum/AIAnswerSuggestion'
import { ForumPost, ForumReply } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('forum_posts').select('title').eq('id', id).single()
  return { title: data?.title || 'Forum Post' }
}

export default async function ForumPostPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('forum_posts')
    .select('*, author:members(id, name, avatar_url, job_title)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  // Increment view count
  await supabase
    .from('forum_posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', id)

  const { data: replies } = await supabase
    .from('forum_replies')
    .select('*, author:members(id, name, avatar_url, job_title)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  const p = post as ForumPost
  const replyList = (replies as ForumReply[]) || []

  return (
    <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <article className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {p.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <h1 className="text-2xl font-bold mb-4">{p.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <Avatar className="h-8 w-8">
            <AvatarImage src={(p.author as { avatar_url?: string })?.avatar_url || undefined} />
            <AvatarFallback>{(p.author as { name: string })?.name?.slice(0, 2).toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{(p.author as { name: string })?.name || 'Unknown'}</div>
            <div className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{p.body}</ReactMarkdown>
        </div>
      </article>

      <Separator className="mb-8" />

      <div className="mb-8">
        <AIAnswerSuggestion postId={id} />
      </div>

      <section className="mb-8">
        <h2 className="font-semibold mb-4">
          {replyList.length} {replyList.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        <div className="space-y-6">
          {replyList.map((reply) => (
            <div key={reply.id} className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={(reply.author as { avatar_url?: string })?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {(reply.author as { name: string })?.name?.slice(0, 2).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{(reply.author as { name: string })?.name || 'Unknown'}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                  </span>
                  {reply.is_ai_suggested && (
                    <Badge variant="outline" className="text-xs">AI Suggested</Badge>
                  )}
                </div>
                <div className="text-sm leading-relaxed">{reply.body}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <h3 className="font-semibold mb-3">Leave a Reply</h3>
        <ReplyForm postId={id} />
      </div>
    </div>
  )
}
