'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

type Language = 'it' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, string>> = {
  it: {},
  en: {},
}

let loadedLanguages: Set<string> = new Set()

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('it')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('language') as Language | null
    if (stored && ['it', 'en'].includes(stored)) {
      setLanguageState(stored)
    }
    loadLanguage(stored || 'it')
  }, [])

  const loadLanguage = async (lang: Language) => {
    if (loadedLanguages.has(lang)) {
      setReady(true)
      return
    }
    try {
      const module = await import(`@/lib/i18n/${lang}.json`)
      translations[lang] = module.default || module
      loadedLanguages.add(lang)
    } catch (err) {
      console.error(`Failed to load language ${lang}:`, err)
    }
    setReady(true)
  }

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
    if (!loadedLanguages.has(lang)) {
      await loadLanguage(lang)
    }
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

  if (!ready) {
    return null
  }

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
