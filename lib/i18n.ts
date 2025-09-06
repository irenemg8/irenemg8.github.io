import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files
import en from '../locales/en.json'
import es from '../locales/es.json'

// Only initialize on client side
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      debug: false,
      fallbackLng: 'es',
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      resources: {
        en: {
          translation: en,
        },
        es: {
          translation: es,
        },
      },
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        lookupLocalStorage: 'portfolio-language',
        caches: ['localStorage'],
      },
    })
} else {
  // Server side initialization
  i18n
    .use(initReactI18next)
    .init({
      lng: 'es', // Default language for SSR
      fallbackLng: 'es',
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          translation: en,
        },
        es: {
          translation: es,
        },
      },
    })
}

export default i18n
