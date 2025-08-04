"use client"

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface TrashCanProps {
  isActive?: boolean
  position?: { x: number, y: number }
}

export function TrashCan({ isActive = false, position }: TrashCanProps) {
  const [currentPosition, setCurrentPosition] = useState(position || { x: 520, y: 240 }) // Fixed initial position to avoid hydration mismatch

  // Update position after hydration to avoid SSR mismatch
  useEffect(() => {
    if (!position && typeof window !== 'undefined') {
      setCurrentPosition({ 
        x: window.innerWidth - 100, 
        y: window.innerHeight - 120 
      })
    } else if (position) {
      setCurrentPosition(position)
    }
  }, [position])
  
  const finalPosition = currentPosition

  return (
    <motion.div
      className="absolute z-30"
      style={{
        left: finalPosition.x,
        top: finalPosition.y
      }}
      animate={{
        scale: isActive ? 1.2 : 1,
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
            : ''
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
            width={500}
            height={500}
            className={`transition-all duration-200 ${isActive ? 'brightness-110' : 'brightness-90'}`}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}