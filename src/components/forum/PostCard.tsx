import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ForumPost } from '@/types'
import { MessageSquare, Pin, Eye, ArrowUpRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps { post: ForumPost }

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/forum/${post.id}`} className="block group">
      <div className="rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/[0.04] hover:-translate-y-0.5">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0 rounded-xl">
            <AvatarImage src={(post.author as { avatar_url?: string })?.avatar_url || undefined} />
            <AvatarFallback className="rounded-xl text-xs font-bold">
              {(post.author as { name: string })?.name?.slice(0, 2).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-[15px] leading-snug pr-4">{post.title}</h3>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
            </div>
            <p className="text-[13px] text-muted-foreground mt-1 line-clamp-1">{post.body}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5">
                {post.is_pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
                <span className="text-[12px] text-muted-foreground">
                  {(post.author as { name: string })?.name || 'Unknown'} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <MessageSquare className="h-3 w-3" />{post.replies?.length || 0}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <Eye className="h-3 w-3" />{post.view_count}
              </span>
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
