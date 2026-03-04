'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { useCurrentMember } from '@/hooks/useCurrentMember'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
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

const navLinks = [
  { href: '/members', label: 'Members' },
  { href: '/companies', label: 'Companies' },
  { href: '/events', label: 'Events' },
  { href: '/forum', label: 'Forum' },
]

const toolLinks = [
  { href: '/tools/matchmaker', label: 'Who Can Help?' },
  { href: '/tools/chat', label: 'Community Chat' },
  { href: '/tools/opportunity-spotter', label: 'Opportunities' },
  { href: '/tools/introduce-me', label: 'Introduce Me' },
  { href: '/tools/skills-map', label: 'Skills Map' },
  { href: '/tools/ecosystem-graph', label: 'Ecosystem Graph' },
  { href: '/tools/analytics', label: 'Analytics' },
]

export function Navbar() {
  const pathname = usePathname()
  const { member } = useCurrentMember()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)

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
      <div className="max-w-6xl mx-auto px-6 flex h-12 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-[13px] font-semibold tracking-tight text-foreground hover:opacity-70 transition-opacity"
        >
          GLC Munich
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-1.5 rounded-full text-[13px] transition-all duration-200',
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
                  'flex items-center gap-0.5 px-3 py-1.5 rounded-full text-[13px] transition-all duration-200',
                  pathname.startsWith('/tools')
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Tools
                <ChevronDown className="h-3 w-3 mt-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-52 rounded-2xl p-1.5">
              {toolLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href} className="rounded-xl text-[13px] cursor-pointer">{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {member ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-2 ring-transparent hover:ring-border transition-all">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                    <AvatarFallback className="text-xs">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{member.name}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="rounded-xl text-[13px] cursor-pointer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/members/${member.id}`} className="rounded-xl text-[13px] cursor-pointer">Public Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl text-[13px] text-destructive cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:flex text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
