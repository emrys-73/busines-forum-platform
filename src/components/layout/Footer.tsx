'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/lib/i18n/useTranslation'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-background border-t border-border/50 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <p className="text-lg font-semibold mb-3">GLC Business Forum</p>
            <p className="text-base text-muted-foreground leading-relaxed max-w-[240px]">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">{t('footer.community')}</p>
            <ul className="space-y-2.5">
              {[
                { href: '/members', label: t('nav.members') },
                { href: '/companies', label: t('nav.companies') },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-base text-muted-foreground hover:text-foreground transition-colors hover-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">{t('nav.tools.label')}</p>
            <ul className="space-y-2.5">
              {[
                { href: '/tools/matchmaker', label: t('nav.tools.matchmaker') },
                { href: '/tools/chat', label: t('nav.tools.chat') },
                { href: '/tools/analytics', label: t('nav.tools.analytics') },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-base text-muted-foreground hover:text-foreground transition-colors hover-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">{t('footer.account')}</p>
            <ul className="space-y-2.5">
              {[
                { href: '/auth/login', label: t('nav.signIn') },
                { href: '/profile', label: t('nav.myProfile') },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-base text-muted-foreground hover:text-foreground transition-colors hover-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Separator className="opacity-50 mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[15px] text-muted-foreground">
            © {new Date().getFullYear()} GLC Business Forum Platform
          </p>
          <p className="text-[15px] text-muted-foreground">
            {t('footer.builtWith')}
          </p>
        </div>
      </div>
    </footer>
  )
}
