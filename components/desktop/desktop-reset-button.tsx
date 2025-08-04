"use client"

import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'

interface DesktopResetButtonProps {
  onReset: () => void
}

export function DesktopResetButton({ onReset }: DesktopResetButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      onClick={onReset}
      className="fixed top-4 right-4 z-30 macos-glass rounded-full p-3 shadow-lg border border-white/20 backdrop-blur-xl hover:scale-105 transition-transform group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RotateCcw className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:rotate-180 transition-transform duration-300" />
    </motion.button>
  )
}