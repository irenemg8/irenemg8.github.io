"use client"

import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
        className="relative overflow-hidden macos-button macos-glass macos-text-semibold"
      >
        <Globe className="h-4 w-4 mr-2" />
        <span>
          {language.toUpperCase()}
        </span>
      </Button>
    </motion.div>
  )
}