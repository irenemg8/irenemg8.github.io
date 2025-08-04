"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Check } from 'lucide-react'

export function DesktopAbout() {
  const { t } = useLanguage()

  const todoItems = t('about.todo.items')
  
  // Ensure todoItems is always an array
  const todoList = Array.isArray(todoItems) ? todoItems : []

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="px-6 md:px-12 py-12">
      <motion.div 
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* About Me Title */}
        <motion.h2 
          className="text-3xl md:text-4xl macos-text-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {t('about.title')}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left column - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <p className="macos-text text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('about.bio.1')}
            </p>
            
            <p className="macos-text text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('about.bio.2')}
            </p>

            <p className="macos-text text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('about.bio.3')}
            </p>
          </motion.div>

          {/* Right column - To Do List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-xl macos-text-semibold text-gray-900 dark:text-gray-100 mb-6">
              {t('about.todo')}
            </h3>

            <motion.ul 
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {todoList.map((todoItem, index) => (
                <motion.li
                  key={index}
                  variants={item}
                  className="flex items-start gap-3 macos-text text-gray-600 dark:text-gray-400"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="mt-1"
                  >
                    {/* Some items are "completed" for visual interest */}
                    {(index === 1 || index === 7) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 border border-gray-400 dark:border-gray-500 rounded-sm"></div>
                    )}
                  </motion.div>
                  <span className={`leading-relaxed ${(index === 1 || index === 7) ? 'line-through opacity-60' : ''}`}>
                    {todoItem}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}