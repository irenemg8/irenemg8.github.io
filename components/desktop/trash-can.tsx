"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface TrashCanProps {
  isActive?: boolean
  position?: { x: number, y: number }
}

export function TrashCan({ isActive = false, position }: TrashCanProps) {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 pointer-events-auto"
      animate={{
        scale: isActive ? 1.1 : 1,
        y: isActive ? -5 : 0
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="flex flex-col items-center space-y-1">
        <div 
          className={`
            rounded-xl flex items-center justify-center
            transition-all duration-200
            ${isActive 
              ? 'shadow-xl shadow-red-500/30' 
              : ''
            }
          `}
          style={{
            width: 72,
            height: 58,
            boxShadow: isActive 
              ? '0 8px 25px rgba(239, 68, 68, 0.4), 0 0 0 2px rgba(239, 68, 68, 0.3)' 
              : 'none'
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
          <Image
            src="/bin.png"
            alt="Papelera"
            width={50}
            height={50}
            className={`transition-all duration-200 ${isActive ? 'brightness-110' : 'brightness-90'}`}
          />
        </motion.div>
      </div>
      
      {/* Label */}
      <span 
        className="text-xs text-gray-800 dark:text-gray-200 macos-text text-center leading-tight break-words max-w-20"
        style={{
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}
      >
        Papelera
      </span>
      </div>
    </motion.div>
  )
}