'use client'

import { createContext, useCallback, useState } from 'react'
import { type Locale, translations } from './translations'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextValue>({
  locale: 'de',
  setLocale: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale] = useState<Locale>('de')

  const setLocale = useCallback((_newLocale: Locale) => {
    // German only — no language switching
  }, [])

  const t = useCallback(
    (key: string) => translations[locale][key] ?? key,
    [locale]
  )

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
