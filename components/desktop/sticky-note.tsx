"use client"

import { motion, PanInfo } from 'framer-motion'
import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface StickyNoteProps {
  onDelete?: () => void
  onDragToTrash?: (position: { x: number; y: number }) => void
}

export function StickyNote({ onDelete, onDragToTrash }: StickyNoteProps) {
  const { t } = useLanguage()
  const [position, setPosition] = useState({ x: 60, y: 40 })
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const dragRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (event: any, info: PanInfo) => {
    const newPosition = {
      x: Math.max(20, Math.min(window.innerWidth - 250, position.x + info.offset.x)),
      y: Math.max(20, Math.min(window.innerHeight - 200, position.y + info.offset.y))
    }
    
    setPosition(newPosition)
    setIsDragging(false)

    // Check if dragged to trash area (dock area at bottom center)
    const dockCenterX = window.innerWidth / 2
    const dockY = window.innerHeight - 80 // Área del dock
    
    // Área más amplia alrededor del dock para facilitar el drop
    const isNearTrash = Math.abs(newPosition.x - dockCenterX) < 150 && 
                       newPosition.y > window.innerHeight - 150
    
    if (isNearTrash && onDragToTrash) {
      onDragToTrash(newPosition)
      setIsVisible(false)
    }
  }

  const todoItems = t('about.todo.items')
  const displayItems = Array.isArray(todoItems) ? todoItems : [
    'Land my dream UX job',
    'Drink water',
    'Graduate in 2026',
    'Get really good at making pasta',
    'Travel somewhere new every year'
  ]

  if (!isVisible) return null

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 20,
        right: typeof window !== 'undefined' ? window.innerWidth - 250 : 1000,
        top: 20,
        bottom: typeof window !== 'undefined' ? window.innerHeight - 200 : 600,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{ 
        x: position.x, 
        y: position.y,
        rotate: isDragging ? 2 : -1,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 100 : 30
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -1 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
      className={`absolute select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {/* Sticky Note */}
      <div 
        className="w-60 min-h-fit relative"
        style={{
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          boxShadow: `
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8)
          `,
          transform: 'rotate(-1deg)'
        }}
      >
        {/* Sticky Note Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-300/30">
          <h3 className="text-sm font-semibold text-gray-800 macos-text-semibold">
            {t('about.todo')}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsVisible(false)
              if (onDelete) onDelete()
            }}
            className="w-5 h-5 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center transition-colors group"
          >
            <X className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>

        {/* Sticky Note Content */}
        <div className="p-4 pb-6 space-y-2 text-xs text-gray-700">
          {displayItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`flex items-start space-x-2 ${
                [2, 6].includes(index) ? 'line-through text-gray-400' : ''
              }`}
            >
              <span className="text-yellow-600 mt-0.5">•</span>
              <span className="macos-text leading-relaxed">{item}</span>
            </motion.div>
          ))}
        </div>

        {/* Sticky Note Fold */}
        <div 
          className="absolute top-0 right-0 w-8 h-8"
          style={{
            background: 'linear-gradient(135deg, transparent 0%, transparent 45%, #F59E0B 50%, #D97706 100%)',
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
          }}
        />

        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                rgba(0,0,0,0.1) 21px
              )
            `
          }}
        />
      </div>
    </motion.div>
  )
}