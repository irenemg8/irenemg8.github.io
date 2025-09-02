"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { AboutMeWindow } from './about-me-window'

export function AboutFolder() {
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)
  const [isWindowOpen, setIsWindowOpen] = useState(false)

  const handleFolderClick = () => {
    setIsWindowOpen(true)
  }

  const handleWindowClose = () => {
    setIsWindowOpen(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute bottom-24 left-8 z-20"
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFolderClick}
        >
          <motion.div
            whileHover={{ scale: 1.1, y: -4 }}
            className="w-16 h-16 bg-blue-400 rounded-lg flex items-center justify-center text-3xl shadow-lg mb-2 transition-all duration-200"
          >
            📁
          </motion.div>
          <motion.span
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            className="text-xs macos-text text-gray-700 dark:text-gray-300 text-center"
          >
            About Me
          </motion.span>
        </motion.div>
      </motion.div>

      {/* About Me Window */}
      <AboutMeWindow 
        isOpen={isWindowOpen} 
        onClose={handleWindowClose}
      />
    </>
  )
}