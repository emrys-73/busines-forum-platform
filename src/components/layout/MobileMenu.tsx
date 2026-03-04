'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const navLinks = [
  { href: '/members', label: 'Members' },
  { href: '/companies', label: 'Companies' },
  { href: '/events', label: 'Events' },
  { href: '/forum', label: 'Forum' },
  { href: '/tools/matchmaker', label: 'Tools' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <div className="flex flex-col gap-1 mt-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t mt-4 pt-4">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors block"
            >
              Sign In
            </Link>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-accent transition-colors block"
            >
              My Profile
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
