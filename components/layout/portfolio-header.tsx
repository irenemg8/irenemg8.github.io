"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

export function PortfolioHeader() {
  const { t } = useLanguage()

  return (
    <div className="text-center py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-4"
      >
        {/* Welcome text */}
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl macos-text text-gray-900 dark:text-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {t('desktop.welcome')}
        </motion.h1>
        
        {/* Portfolio text with emphasis */}
        <motion.h2 
          className="text-4xl md:text-6xl lg:text-7xl macos-text-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {t('desktop.portfolio')}
        </motion.h2>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-lg md:text-xl macos-text text-gray-600 dark:text-gray-400 mt-8 max-w-2xl mx-auto"
      >
        {t('desktop.name')}
      </motion.p>
    </div>
  )
}