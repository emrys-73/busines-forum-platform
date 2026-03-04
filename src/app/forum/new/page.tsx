import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { NewPostForm } from '@/components/forum/NewPostForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Forum Post' }

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/forum/new')

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <Card className="rounded-3xl border border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Start a Discussion</CardTitle>
          <CardDescription>
            Ask a question, share an idea, or start a conversation with the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewPostForm />
        </CardContent>
      </Card>
    </div>
  )
}
