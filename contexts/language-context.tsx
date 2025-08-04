"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'es' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => any
}

const translations = {
  es: {
    // Navigation
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contacto',
    'nav.resume': 'CV',
    
    // Date format
    'date.format': 'dddd, D MMM',
    
    // Desktop header
    'desktop.welcome': 'bienvenido a mi',
    'desktop.portfolio': 'portfolio.',
    'desktop.name': 'Portfolio de Irene MG',
    
    // Projects
    'projects.title': 'Proyectos',
    'projects.project': 'Proyecto',
    'projects.viewMore': 'Ver más proyectos',
    
    // About
    'about.title': 'Sobre Mí',
    'about.todo': 'Pendientes:',
    'about.todo.items': [
      'Conseguir mi trabajo de ensueño en UX',
      'Beber más agua',
      'Mudarme a Estados Unidos',
      'Terminar el máster sin perder la cordura',
      'Crear esa playlist épica de Spotify',
      'Dominación mundial',
      'Volverme realmente buena haciendo pasta',
      'Viajar a algún lugar nuevo cada año'
    ],
    'about.bio.1': 'Soy una diseñadora UX/UI y desarrolladora frontend apasionada por crear experiencias digitales que no solo funcionen perfectamente, sino que también emocionen e inspiren.',
    'about.bio.2': 'Especializada en React, Next.js, Figma y tecnologías emergentes como Three.js. Mi enfoque combina diseño centrado en el usuario con desarrollo técnico sólido.',
    'about.bio.3': 'Cuando no estoy programando o diseñando, probablemente me encuentres tomando café, tocando el piano o planificando mi próximo viaje.',
    
    // Footer
    'footer.madeWith': 'Hecho con',
    'footer.by': 'por Irene MG',
    
    // Contact
    'contact.title': 'Hablemos',
    'contact.subtitle': '¿Tienes un proyecto en mente?',
    
    // Resume
    'resume.download': 'Descargar CV',
    
    // Time
    'time.available': 'Disponible para proyectos',
    'time.madrid': 'Madrid, España'
  },
  en: {
    // Navigation
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact',
    'nav.resume': 'Resume',
    
    // Date format
    'date.format': 'dddd, MMM D',
    
    // Desktop header
    'desktop.welcome': 'welcome to my',
    'desktop.portfolio': 'portfolio.',
    'desktop.name': 'Irene MG\'s Portfolio',
    
    // Projects
    'projects.title': 'Projects',
    'projects.project': 'Project',
    'projects.viewMore': 'View more projects',
    
    // About
    'about.title': 'About Me',
    'about.todo': 'To do:',
    'about.todo.items': [
      'Land my dream UX job',
      'Drink more water',
      'Move to the US',
      'Finish grad school without losing my mind',
      'Build that banger spotify playlist',
      'World domination',
      'Get really good at making pasta',
      'Travel somewhere new every year'
    ],
    'about.bio.1': 'I\'m a UX/UI designer and frontend developer passionate about creating digital experiences that not only work perfectly, but also excite and inspire.',
    'about.bio.2': 'Specialized in React, Next.js, Figma and emerging technologies like Three.js. My approach combines user-centered design with solid technical development.',
    'about.bio.3': 'When I\'m not coding or designing, you\'ll probably find me drinking coffee, playing piano, or planning my next trip.',
    
    // Footer
    'footer.madeWith': 'Made with',
    'footer.by': 'by Irene MG',
    
    // Contact
    'contact.title': 'Let\'s Talk',
    'contact.subtitle': 'Have a project in mind?',
    
    // Resume
    'resume.download': 'Download Resume',
    
    // Time
    'time.available': 'Available for projects',
    'time.madrid': 'Madrid, Spain'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es')

  useEffect(() => {
    // Get language from localStorage or browser preference
    const savedLanguage = localStorage.getItem('portfolio-language') as Language
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage)
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('en')) {
        setLanguage('en')
      } else {
        setLanguage('es')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('portfolio-language', language)
    document.documentElement.lang = language
  }, [language])

  const t = (key: string): any => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    return value !== undefined ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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