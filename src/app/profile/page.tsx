import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileEditForm } from '@/components/members/ProfileEditForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Member } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Mein Profil' }

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirectTo=/profile')

  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!member) {
    return (
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Profil nicht gefunden</CardTitle>
            <CardDescription>
              Dein Konto hat noch kein Mitgliederprofil. Kontaktiere einen Admin, um eines für dich zu erstellen.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const m = member as Member

  return (
    <div className="max-w-2xl mx-auto px-6 pt-28 pb-16">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-16 w-16">
          <AvatarImage src={m.avatar_url || undefined} />
          <AvatarFallback className="text-lg font-bold">
            {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{m.name}</h1>
          <p className="text-muted-foreground text-base">{user.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil bearbeiten</CardTitle>
          <CardDescription>
            Aktualisiere deine Informationen, damit die Community dich finden kann.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileEditForm member={m} />
        </CardContent>
      </Card>
    </div>
  )
}
