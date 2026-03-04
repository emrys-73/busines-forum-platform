import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ForumPost } from '@/types'
import { MessageSquare, Pin, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PostCardProps {
  post: ForumPost
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/forum/${post.id}`}>
      <Card className="hover:border-primary/50 hover:shadow-sm transition-all">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={post.author?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {post.author?.name.slice(0, 2).toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                {post.is_pinned && (
                  <Pin className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                )}
                <h3 className="font-semibold text-sm leading-snug flex-1">{post.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.body}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="text-xs text-muted-foreground">
                  {post.author?.name || 'Unknown'} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  {post.replies?.length || 0}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {post.view_count}
                </span>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs py-0">{tag}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
