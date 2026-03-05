'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignUpForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password.length < 6) {
      toast.error('Passwort muss mindestens 6 Zeichen haben')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
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
            Wir haben einen Bestätigungslink an <strong>{email}</strong> gesendet. Klicke auf den Link, um dein Konto zu aktivieren.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm border border-border/60 rounded-3xl card-shadow">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>Registrieren</CardTitle>
        <CardDescription>Erstelle dein Konto, um der Community beizutreten.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Vollständiger Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Max Mustermann"
              required
            />
          </div>
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
          <div className="space-y-1.5">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              required
              minLength={6}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort wiederholen"
              required
              minLength={6}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Konto wird erstellt...' : 'Konto erstellen'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Bereits ein Konto?{' '}
          <Link href={`/auth/login${redirectTo !== '/' ? `?redirectTo=${redirectTo}` : ''}`} className="text-foreground underline underline-offset-2 hover:opacity-70">
            Anmelden
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-12">
      <Suspense fallback={<div className="w-full max-w-sm h-48 bg-muted animate-pulse rounded-3xl" />}>
        <SignUpForm />
      </Suspense>
    </div>
  )
}
