"use client"

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { LanguageToggle } from '@/components/shared/language-toggle'
import { ModeToggle } from '@/components/shared/mode-toggle'
import { MacOSParticles } from '@/components/effects/macos-particles'
import { Wifi, Battery, RotateCcw } from 'lucide-react'

interface MacOSWindowProps {
  children: React.ReactNode
  onReset?: () => void
}

export function MacOSWindow({ children, onReset }: MacOSWindowProps) {
  const { t } = useLanguage()
  const [currentTime, setCurrentTime] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      
      // macOS time format
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Madrid'
      }
      setCurrentTime(now.toLocaleTimeString('es-ES', timeOptions))
      
      // macOS date format
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden">
      {/* macOS Particles */}
      <MacOSParticles />
      
      {/* macOS Wallpaper Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-pink-500/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/5 to-transparent"></div>
      </div>

      {/* Improved macOS Menu Bar */}
      <div className="relative z-10 h-7 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-300/30 dark:border-gray-600/30 flex items-center justify-between px-4 text-sm macos-menubar">
        {/* Left side - Apple logo and app name */}
        <div className="flex items-center space-x-4">
          <div className="text-base">🍎</div>
          <span className="text-gray-800 dark:text-gray-200 font-medium macos-text-semibold">{t('desktop.name')}</span>
        </div>

        {/* Center - Window title */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-gray-700 dark:text-gray-300 text-xs macos-text">
            {t('desktop.name')}
          </span>
        </div>

        {/* Right side - Status indicators and time */}
        <div className="flex items-center space-x-4 text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <Battery className="h-3.5 w-3.5" />
            <Wifi className="h-3.5 w-3.5" />
          </div>
          <div className="text-xs macos-text font-medium">
            <span className="hidden sm:inline">{currentDate} </span>
            {currentTime}
          </div>
        </div>
      </div>

      {/* Desktop content */}
      <div className="relative z-10 p-8 h-[calc(100vh-28px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-6xl mx-auto h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* macOS Window Title Bar */}
          <div className="flex items-center h-12 px-4 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
            {/* Traffic Light Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center group hover:bg-red-600 transition-colors"
              >
                <div className="w-1 h-1 bg-red-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center group hover:bg-yellow-600 transition-colors"
              >
                <div className="w-1 h-1 bg-yellow-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center group hover:bg-green-600 transition-colors"
              >
                <div className="w-1 h-1 bg-green-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.button>
            </div>

            {/* Window Title */}
            <div className="flex-1 flex justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('desktop.name')}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
              {onReset && (
                <motion.button
                  onClick={onReset}
                  className="macos-glass rounded-full p-2 shadow-sm border border-white/20 backdrop-blur-xl hover:scale-105 transition-transform group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Reset folders"
                >
                  <RotateCcw className="w-4 h-4 text-gray-700 dark:text-gray-300 group-hover:rotate-180 transition-transform duration-300" />
                </motion.button>
              )}
              <LanguageToggle />
              <ModeToggle />
            </div>
          </div>

          {/* Window Content */}
          <div className="relative overflow-auto h-[calc(100%-3rem)] macos-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>


    </div>
  )
}