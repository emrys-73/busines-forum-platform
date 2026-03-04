'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
      },
    })

    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <Card className="w-full max-w-sm border border-border/60 rounded-3xl shadow-xl shadow-black/[0.06]">
        <CardContent className="pt-6 text-center space-y-3">
          <div className="text-3xl">✉️</div>
          <h2 className="font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm border border-border/60 rounded-3xl shadow-xl shadow-black/[0.06]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>Sign In</CardTitle>
        <CardDescription>Enter your email to receive a magic link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-12">
      <Suspense fallback={<div className="w-full max-w-sm h-48 bg-muted animate-pulse rounded-3xl" />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
