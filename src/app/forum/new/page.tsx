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
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Card>
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
