'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'

type LoginMode = 'password' | 'magic-link'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [mode, setMode] = useState<LoginMode>('password')
  const searchParams = useSearchParams()
  const router = useRouter()
  const redirectTo = searchParams.get('redirectTo') || '/'

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    router.push(redirectTo)
    router.refresh()
  }

  async function handleMagicLink(e: React.FormEvent) {
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
      <Card className="w-full max-w-sm border border-border/60 rounded-3xl card-shadow">
        <CardContent className="pt-6 text-center space-y-3">
          <div className="text-3xl">✉️</div>
          <h2 className="font-semibold">E-Mail prüfen</h2>
          <p className="text-base text-muted-foreground">
            Wir haben einen Magic Link an <strong>{email}</strong> gesendet. Klicke auf den Link, um dich anzumelden.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm border border-border/60 rounded-3xl card-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>Anmelden</CardTitle>
        <CardDescription>
          {mode === 'password' ? 'Melde dich mit E-Mail und Passwort an.' : 'Gib deine E-Mail-Adresse ein, um einen Magic Link zu erhalten.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="du@beispiel.com"
              required
            />
          </div>
          {mode === 'password' && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Dein Passwort"
                required
              />
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? (mode === 'password' ? 'Anmeldung...' : 'Wird gesendet...')
              : (mode === 'password' ? 'Anmelden' : 'Magic Link senden')
            }
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'password' ? 'magic-link' : 'password')}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            {mode === 'password' ? 'Stattdessen Magic Link verwenden' : 'Stattdessen Passwort verwenden'}
          </button>
        </div>

        <p className="mt-3 text-center text-sm text-muted-foreground">
          Noch kein Konto?{' '}
          <Link href={`/auth/signup${redirectTo !== '/' ? `?redirectTo=${redirectTo}` : ''}`} className="text-foreground underline underline-offset-2 hover:opacity-70">
            Registrieren
          </Link>
        </p>
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
