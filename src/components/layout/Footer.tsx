import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-semibold mb-3">GLC Munich</p>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[200px]">
              Where faith meets entrepreneurship. Community platform for GLC Munich's business forum.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Community</p>
            <ul className="space-y-2.5">
              {[
                { href: '/members', label: 'Members' },
                { href: '/companies', label: 'Companies' },
                { href: '/events', label: 'Events' },
                { href: '/forum', label: 'Forum' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hover-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Tools</p>
            <ul className="space-y-2.5">
              {[
                { href: '/tools/matchmaker', label: 'Matchmaker' },
                { href: '/tools/chat', label: 'Community Chat' },
                { href: '/tools/ecosystem-graph', label: 'Ecosystem Graph' },
                { href: '/tools/analytics', label: 'Analytics' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hover-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">Account</p>
            <ul className="space-y-2.5">
              {[
                { href: '/auth/login', label: 'Sign In' },
                { href: '/profile', label: 'My Profile' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors hover-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className="opacity-50 mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} Gospel Life Center Munich · Business Forum
          </p>
          <p className="text-[12px] text-muted-foreground">
            Built with love for the community
          </p>
        </div>
      </div>
    </footer>
  )
}
