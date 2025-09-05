"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

interface MobileAppProps {
  name: string
  icon?: string // emoji as fallback
  image?: string // path to image
  onTap: () => void
  delay?: number
}

export function MobileApp({ name, icon, image, onTap, delay = 0 }: MobileAppProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }}
      className="flex flex-col items-center space-y-2"
    >
      {/* App Icon */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onTapStart={() => setIsPressed(true)}
        onTap={() => {
          setIsPressed(false)
          onTap()
        }}
        onTapCancel={() => setIsPressed(false)}
        className={`
          relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 
          rounded-2xl sm:rounded-2xl md:rounded-3xl overflow-hidden
          transition-all duration-200 ease-out
          ${isPressed ? 'brightness-90' : 'brightness-100'}
        `}
        style={{
          boxShadow: isPressed 
            ? 'none' 
            : 'none'
        }}
      >
        {/* Icon Container - Maximum size */}
        <div className="absolute inset-0 flex items-center justify-center p-1">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={64}
              height={64}
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          ) : (
            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl filter drop-shadow-sm">
              {icon}
            </span>
          )}
        </div>
      </motion.button>

      {/* App Name */}
      <motion.span 
        className="text-xs sm:text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 text-center leading-tight max-w-16 sm:max-w-20 md:max-w-24 truncate"
        style={{
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
      >
        {name}
      </motion.span>
    </motion.div>
  )
}
