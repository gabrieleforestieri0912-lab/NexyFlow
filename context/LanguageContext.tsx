'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import itTranslations from '@/lib/i18n/it.json'
import enTranslations from '@/lib/i18n/en.json'

type Language = 'it' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, any>> = {
  it: itTranslations,
  en: enTranslations,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('it')

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null
    if (stored && ['it', 'en'].includes(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }, [])

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    if (typeof value !== 'string') {
      const fallback: any = translations['it']
      let fallbackValue: any = fallback
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k]
      }
      value = typeof fallbackValue === 'string' ? fallbackValue : key
    }

    if (params) {
      value = value.replace(/\{(\w+)\}/g, (_: string, param: string) => {
        return params[param]?.toString() || `{${param}}`
      })
    }

    return value
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
