'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { MobileMenu } from './MobileMenu'
import { Button } from '@/components/ui/button'
import { useCurrentMember } from '@/hooks/useCurrentMember'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

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

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-sm tracking-tight">
            GLC Munich Forum
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-accent',
                  pathname.startsWith(link.href)
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-accent',
                    pathname.startsWith('/tools')
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground'
                  )}
                >
                  Tools
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {toolLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {member ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-2 ring-transparent hover:ring-border transition-all">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar_url || undefined} alt={member.name} />
                    <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{member.name}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/members/${member.id}`}>Public Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="outline" className="hidden md:flex">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
