"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Heart } from 'lucide-react'

export function DesktopFooter() {
  const { t } = useLanguage()

  return (
    <motion.footer 
      className="px-6 md:px-12 py-8 border-t border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex items-center justify-center gap-2"
        >
          {t('footer.madeWith')}
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          </motion.span>
          {t('footer.by')}
        </motion.p>
      </div>
    </motion.footer>
  )
}