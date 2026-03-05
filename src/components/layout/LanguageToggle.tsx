'use client'

import { useTranslation } from '@/lib/i18n/useTranslation'
import { Button } from '@/components/ui/button'

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === 'de' ? 'en' : 'de')}
      className="text-sm font-medium text-muted-foreground hover:text-foreground px-2"
      title={locale === 'de' ? 'Switch to English' : 'Auf Deutsch wechseln'}
    >
      {locale === 'de' ? 'EN' : 'DE'}
    </Button>
  )
}
