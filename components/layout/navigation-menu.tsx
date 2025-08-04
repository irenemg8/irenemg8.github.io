"use client"

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Download, Mail } from 'lucide-react'

export function NavigationMenu() {
  const { t } = useLanguage()

  const handleContactClick = () => {
    window.location.href = 'mailto:irenemedgarcia@gmail.com'
  }

  const handleResumeClick = () => {
    window.open('/irene-medina-garcia-cv.pdf', '_blank')
  }

  return (
    <motion.div 
      className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleContactClick}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Mail className="h-4 w-4 mr-2" />
          {t('nav.contact')}
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleResumeClick}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Download className="h-4 w-4 mr-2" />
          {t('nav.resume')}
        </Button>
      </motion.div>
    </motion.div>
  )
}