'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from '@/lib/i18n/useTranslation'
import { useCurrentMember } from '@/hooks/useCurrentMember'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const { member } = useCurrentMember()
  const router = useRouter()

  const navLinks = [
    { href: '/members', label: t('nav.members') },
    { href: '/companies', label: t('nav.companies') },
    { href: '/tools/matchmaker', label: t('nav.tools.label') },
  ]

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <div className="flex flex-col gap-1 mt-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-base font-medium hover:bg-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t mt-4 pt-4">
            {member ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                    <AvatarFallback className="text-sm">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.job_title}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium hover:bg-accent transition-colors block"
                >
                  {t('nav.myProfile')}
                </Link>
                <Link
                  href={`/members/${member.id}`}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium hover:bg-accent transition-colors block"
                >
                  {t('nav.publicProfile')}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-accent transition-colors"
                >
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium hover:bg-accent transition-colors block"
                >
                  {t('nav.signIn')}
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium hover:bg-accent transition-colors block"
                >
                  {t('nav.signUp')}
                </Link>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
