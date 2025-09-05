"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

interface MobileAppProps {
  name: string
  icon?: string // emoji as fallback
  image?: string // path to image
  gradient: string
  onTap: () => void
  delay?: number
}

export function MobileApp({ name, icon, image, gradient, onTap, delay = 0 }: MobileAppProps) {
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
          relative w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 
          rounded-2xl sm:rounded-2xl md:rounded-3xl shadow-lg overflow-hidden
          bg-gradient-to-br ${gradient}
          border border-white/20
          transition-all duration-200 ease-out
          ${isPressed ? 'brightness-90' : 'brightness-100'}
        `}
        style={{
          boxShadow: isPressed 
            ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
            : '0 4px 12px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Icon Container */}
        <div className="absolute inset-0 flex items-center justify-center p-2">
          {image ? (
            <Image
              src={image}
              alt={name}
              width={48}
              height={48}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain filter drop-shadow-sm"
            />
          ) : (
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl filter drop-shadow-sm">
              {icon}
            </span>
          )}
        </div>

        {/* Gloss Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-2xl sm:rounded-2xl md:rounded-3xl" />
        
        {/* Shine Effect */}
        <div className="absolute -top-full -left-full w-full h-full bg-gradient-to-br from-white/0 via-white/20 to-white/0 transform rotate-45" />
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
