'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useCurrentMember } from '@/hooks/useCurrentMember'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  body: z.string().min(20, 'Body must be at least 20 characters'),
})

type FormData = z.infer<typeof schema>

const SUGGESTED_TAGS = ['question', 'idea', 'resource', 'intro', 'job', 'feedback', 'announcement']

export function NewPostForm() {
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const { member } = useCurrentMember()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function addTag(tag: string) {
    const t = tag.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags((p) => [...p, t])
    setTagInput('')
  }

  async function onSubmit(data: FormData) {
    if (!member) { toast.error('Please sign in'); return }
    const supabase = createClient()
    const { data: post, error } = await supabase
      .from('forum_posts')
      .insert({ ...data, author_id: member.id, tags })
      .select()
      .single()

    if (error) { toast.error('Failed to create post'); return }
    toast.success('Post created!')
    router.push(`/forum/${post.id}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1.5">
        <Label htmlFor="title">Question or Topic *</Label>
        <Input id="title" {...register('title')} placeholder="What would you like to discuss?" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="body">Details *</Label>
        <Textarea
          id="body"
          {...register('body')}
          placeholder="Provide more context, background, and what kind of help or insights you're looking for..."
          rows={6}
        />
        {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SUGGESTED_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => tags.includes(tag)
                ? setTags((p) => p.filter((t) => t !== tag))
                : addTag(tag)
              }
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
            placeholder="Custom tag..."
          />
          <Button type="button" variant="secondary" size="sm" onClick={() => addTag(tagInput)}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tags.filter((t) => !SUGGESTED_TAGS.includes(t)).map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <button type="button" onClick={() => setTags((p) => p.filter((t2) => t2 !== tag))}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Posting...' : 'Post to Forum'}
      </Button>
    </form>
  )
}
