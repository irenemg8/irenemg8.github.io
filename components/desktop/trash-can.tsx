"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface TrashCanProps {
  isActive?: boolean
}

export function TrashCan({ isActive = false }: TrashCanProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isActive ? 1.2 : isHovered ? 1.1 : 1,
        y: isActive ? -10 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div 
        className={`
          w-16 h-16 rounded-xl flex items-center justify-center
          transition-all duration-200
          ${isActive 
            ? 'bg-red-500 shadow-xl shadow-red-500/30' 
            : 'bg-gray-600 hover:bg-gray-500'
          }
        `}
        style={{
          boxShadow: isActive 
            ? '0 8px 25px rgba(239, 68, 68, 0.4), 0 0 0 2px rgba(239, 68, 68, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <motion.div
          animate={{ 
            rotate: isActive ? [0, -10, 10, -5, 5, 0] : 0,
            scale: isActive ? 1.1 : 1
          }}
          transition={{ 
            duration: isActive ? 0.5 : 0.2,
            ease: 'easeInOut'
          }}
        >
          <Trash2 
            className={`w-8 h-8 ${isActive ? 'text-white' : 'text-gray-300'} transition-colors`} 
          />
        </motion.div>
      </div>

      {/* Trash can label */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: -60, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          className="absolute left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
        >
          Papelera
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/80 rotate-45"></div>
        </motion.div>
      )}
    </motion.div>
  )
}