"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { LanguageToggle } from '@/components/shared/language-toggle'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { Minus, Square, X } from 'lucide-react'

interface DesktopWindowProps {
  children: React.ReactNode
}

export function DesktopWindow({ children }: DesktopWindowProps) {
  const { t } = useLanguage()
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      
      // Time format (24h format)
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Madrid'
      }
      setCurrentTime(now.toLocaleTimeString('es-ES', timeOptions))
      
      // Date format based on language
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }
      setCurrentDate(now.toLocaleDateString('es-ES', dateOptions))
    }
    
    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen desktop-bg p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden"
        style={{ minHeight: 'calc(100vh - 4rem)' }}
      >
        {/* Window Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Window Controls */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-2 h-2 text-red-700 opacity-0 hover:opacity-100 transition-opacity mx-auto mt-0.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            >
              <Minus className="w-2 h-2 text-yellow-700 opacity-0 hover:opacity-100 transition-opacity mx-auto mt-0.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            >
              <Square className="w-2 h-2 text-green-700 opacity-0 hover:opacity-100 transition-opacity mx-auto mt-0.5" />
            </motion.button>
          </div>

          {/* Title */}
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('desktop.name')}
          </div>

          {/* Date & Time + Controls */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
              <div className="text-right">
                <div className="font-medium">{currentDate}</div>
                <div className="text-xs opacity-75">{currentTime}</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Window Content */}
        <div className="desktop-content relative overflow-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}