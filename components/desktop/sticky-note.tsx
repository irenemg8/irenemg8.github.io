"use client"

import { motion, PanInfo } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'

interface StickyNoteProps {
  onDelete?: () => void
  onDragToTrash?: (position: { x: number; y: number }) => void
  initialPosition?: { x: number; y: number }
  customContent?: React.ReactNode
}

export function StickyNote({ onDelete, onDragToTrash, initialPosition = { x: 60, y: 40 }, customContent }: StickyNoteProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)

  // Ensure component is mounted before showing
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update position when initialPosition changes (e.g., on resize)
  useEffect(() => {
    if (isMounted) {
      setPosition(initialPosition)
    }
  }, [initialPosition, isMounted])

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (typeof window === 'undefined' || !isMounted) return
    
    // Ancho de sticky note más amplio en móvil: 320px en móvil vs 240px en desktop
    const stickyWidth = isMobile ? 320 : 250
    const newPosition = {
      x: Math.max(20, Math.min(window.innerWidth - stickyWidth, position.x + info.offset.x)),
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

  if (!isVisible || !isMounted) return null

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={isMounted ? {
        left: 20,
        right: window.innerWidth - (isMobile ? 320 : 250),
        top: 20,
        bottom: window.innerHeight - 200,
      } : {
        left: 20,
        right: 1000,
        top: 20,
        bottom: 600,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{ 
        x: position.x, 
        y: position.y,
        rotate: isDragging ? 2 : -1,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 50000 : 40000
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
        className={`${isMobile ? 'w-80' : 'w-60'} min-h-fit relative`}
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
        <div className="flex items-center justify-between p-4 border-b border-yellow-300/30 cursor-grab" 
             onPointerDown={(e) => {
               // Solo permitir drag si no es en el botón de cerrar
               if (e.target instanceof HTMLElement && !e.target.closest('button')) {
                 // El drag se maneja por el motion.div padre
               }
             }}>
          <h3 className="text-sm font-semibold text-gray-800 macos-text-semibold">
            {t('about.todo')}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onPointerDown={(e) => {
              e.stopPropagation() // Evitar que active el drag
            }}
            onClick={(e) => {
              e.stopPropagation() // Evitar que active el drag
              setIsVisible(false)
              if (onDelete) onDelete()
            }}
            className="w-4 h-4 rounded-full bg-red-400 hover:bg-red-500 flex items-center justify-center transition-colors group cursor-pointer z-10 relative"
          >
          </motion.button>
        </div>

        {/* Sticky Note Content */}
        <div className="p-4 pb-6 space-y-2 text-xs text-gray-700">
          {customContent ? (
            customContent
          ) : (
            displayItems.map((item, index) => (
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
            ))
          )}
        </div>



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