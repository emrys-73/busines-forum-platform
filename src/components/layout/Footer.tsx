import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-3">GLC Munich Forum</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI-powered community platform for Gospel Life Center Munich&apos;s business community.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-3 text-muted-foreground">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/members" className="text-sm hover:underline">Members</Link></li>
              <li><Link href="/companies" className="text-sm hover:underline">Companies</Link></li>
              <li><Link href="/events" className="text-sm hover:underline">Events</Link></li>
              <li><Link href="/forum" className="text-sm hover:underline">Forum</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-3 text-muted-foreground">Tools</h3>
            <ul className="space-y-2">
              <li><Link href="/tools/matchmaker" className="text-sm hover:underline">Matchmaker</Link></li>
              <li><Link href="/tools/chat" className="text-sm hover:underline">Community Chat</Link></li>
              <li><Link href="/tools/ecosystem-graph" className="text-sm hover:underline">Ecosystem Graph</Link></li>
              <li><Link href="/tools/analytics" className="text-sm hover:underline">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider mb-3 text-muted-foreground">Account</h3>
            <ul className="space-y-2">
              <li><Link href="/auth/login" className="text-sm hover:underline">Sign In</Link></li>
              <li><Link href="/profile" className="text-sm hover:underline">My Profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} GLC Munich Business Forum · Built with love for the community
        </div>
      </div>
    </footer>
  )
}
