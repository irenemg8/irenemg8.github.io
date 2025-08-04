"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

interface TrashCanProps {
  isActive?: boolean
  position?: { x: number, y: number }
}

export function TrashCan({ isActive = false, position }: TrashCanProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Default position if not provided
  const defaultPosition = { x: window?.innerWidth ? window.innerWidth - 100 : 1180, y: window?.innerHeight ? window.innerHeight - 120 : 580 }
  const finalPosition = position || defaultPosition

  return (
    <motion.div
      className="absolute z-30"
      style={{
        left: finalPosition.x,
        top: finalPosition.y
      }}
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
            ? 'shadow-xl shadow-red-500/30' 
            : 'hover:bg-black/10'
          }
        `}
        style={{
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
            width={32}
            height={32}
            className={`transition-all duration-200 ${isActive ? 'brightness-110' : 'brightness-90'}`}
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