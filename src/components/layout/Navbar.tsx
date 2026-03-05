'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { MobileMenu } from './MobileMenu'
import { useCurrentMember } from '@/hooks/useCurrentMember'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/i18n/useTranslation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const { member } = useCurrentMember()
  const router = useRouter()
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { href: '/members', label: t('nav.members') },
    { href: '/companies', label: t('nav.companies') },
  ]

  const toolLinks = [
    { href: '/tools/matchmaker', label: t('nav.tools.matchmaker') },
    { href: '/tools/chat', label: t('nav.tools.chat') },
    { href: '/tools/opportunity-spotter', label: t('nav.tools.opportunities') },
    { href: '/tools/introduce-me', label: t('nav.tools.introduce') },
    { href: '/tools/skills-map', label: t('nav.tools.skillsMap') },
    { href: '/tools/ecosystem-graph', label: t('nav.tools.ecosystem') },
    { href: '/tools/analytics', label: t('nav.tools.analytics') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-b border-black/[0.06] dark:border-white/[0.06]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex h-14 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground hover:opacity-70 transition-opacity"
        >
          GLC Business Forum
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-full text-base transition-all duration-200',
                pathname.startsWith(link.href)
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex items-center gap-0.5 px-3 py-1.5 rounded-full text-base transition-all duration-200',
                  pathname.startsWith('/tools')
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t('nav.tools.label')}
                <ChevronDown className="h-3.5 w-3.5 mt-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 rounded-2xl p-1.5">
              {toolLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="rounded-xl text-base cursor-pointer">{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          {member ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-2 ring-transparent hover:ring-border transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                    <AvatarFallback className="text-sm">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">{member.name}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="rounded-xl text-base cursor-pointer">{t('nav.myProfile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/members/${member.id}`} className="rounded-xl text-base cursor-pointer">{t('nav.publicProfile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl text-base text-destructive cursor-pointer">
                  {t('nav.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                href="/auth/signup"
                className="text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('nav.signUp')}
              </Link>
            </div>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
