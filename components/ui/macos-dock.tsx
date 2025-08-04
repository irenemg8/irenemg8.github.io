"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Grid3X3, Search, Mail, FileDown } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function MacOSDock() {
  const { t } = useLanguage()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const dockItems = [
    {
      id: 'portfolio',
      icon: '💼',
      label: t('nav.portfolio'),
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    {
      id: 'projects',
      icon: Grid3X3,
      label: t('projects.title'),
      action: () => {
        const projectsSection = document.getElementById('projects')
        projectsSection?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    {
      id: 'search',
      icon: Search,
      label: 'Spotlight',
      action: () => console.log('Search')
    },
    {
      id: 'contact',
      icon: Mail,
      label: t('nav.contact'),
      action: () => window.location.href = 'mailto:irenemedgarcia@gmail.com'
    },
    {
      id: 'resume',
      icon: FileDown,
      label: t('nav.resume'),
      action: () => window.open('/irene-medina-garcia-cv.pdf', '_blank')
    }
  ]

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30"
    >
      <motion.div className="macos-glass rounded-2xl px-4 py-3 macos-shadow border border-white/30 dark:border-gray-700/30">
        <div className="flex items-end space-x-2">
          {dockItems.map((item, index) => (
            <motion.button
              key={item.id}
              className="macos-dock-item relative flex flex-col items-center group"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={item.action}
              whileHover={{ 
                scale: 1.4, 
                y: -16,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
              whileTap={{ scale: 1.2 }}
            >
              {/* Icon container */}
              <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-white/50 dark:border-gray-600/50 relative overflow-hidden">
                {/* Icon */}
                {typeof item.icon === 'string' ? (
                  <span className="text-2xl">{item.icon}</span>
                ) : (
                  <item.icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                )}
                
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                  initial={{ x: -100, opacity: 0 }}
                  animate={hoveredItem === item.id ? { x: 100, opacity: 1 } : { x: -100, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </div>

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={hoveredItem === item.id ? 
                  { opacity: 1, y: -50, scale: 1 } : 
                  { opacity: 0, y: 10, scale: 0.8 }
                }
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute macos-glass rounded-lg px-3 py-1 text-xs macos-text-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap pointer-events-none"
              >
                {item.label}
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rotate-45 border-r border-b border-white/30 dark:border-gray-700/30"></div>
              </motion.div>

              {/* Active indicator */}
              {index === 0 && (
                <motion.div
                  className="absolute -bottom-1 w-1 h-1 bg-gray-600 dark:bg-gray-400 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}