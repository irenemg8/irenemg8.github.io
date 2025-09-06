"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, options?: any) => string
  mounted: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [language, setLanguageState] = useState<Language>('es')

  useEffect(() => {
    setMounted(true)
    
    // Wait for i18n to be initialized
    if (i18n.isInitialized) {
      // Get initial language from i18n (which handles localStorage and browser detection)
      const currentLang = i18n.language as Language
      if (currentLang === 'es' || currentLang === 'en') {
        setLanguageState(currentLang)
      }
    } else {
      // Wait for i18n to initialize
      i18n.on('initialized', () => {
        const currentLang = i18n.language as Language
        if (currentLang === 'es' || currentLang === 'en') {
          setLanguageState(currentLang)
        }
      })
    }

    // Listen for language changes
    const handleLanguageChanged = (lng: string) => {
      if (lng === 'es' || lng === 'en') {
        setLanguageState(lng)
      }
    }

    i18n.on('languageChanged', handleLanguageChanged)
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
      i18n.off('initialized')
    }
  }, [i18n])

  const setLanguage = (lang: Language) => {
    if (i18n.isInitialized) {
      i18n.changeLanguage(lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, mounted }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}