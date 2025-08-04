"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'

export function CentralWelcome() {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="text-center z-0 pointer-events-none"
    >
      <motion.h1
        className="text-4xl md:text-6xl lg:text-6xl xl:text-7xl font-pecita text-gray-800 dark:text-gray-200 mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        welcome to my
      </motion.h1>
      <motion.h1
        className="text-5xl md:text-7xl lg:text-7xl xl:text-8xl font-pecita text-gray-900 dark:text-gray-100 italic"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
      >
        portfolio.
      </motion.h1>
    </motion.div>
  )
}