"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { X } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'

interface MobileWindowProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  showHeader?: boolean
  allowSwipeToClose?: boolean
  maxHeight?: string
  customGradient?: string
}

export function MobileWindow({ 
  isOpen, 
  onClose, 
  title = "Ventana", 
  children, 
  className = "",
  showHeader = true,
  allowSwipeToClose = true,
  maxHeight = "85vh",
  customGradient = "from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900"
}: MobileWindowProps) {
  const isMobile = useIsMobile()
  // Removed minimize functionality
  const constraintsRef = useRef(null)

  // Función para manejar el cierre por gesto
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!allowSwipeToClose) return
    
    // Swipe down to close (móvil)
    if (info.velocity.y > 500 || info.offset.y > 200) {
      onClose()
    }
    // Removed swipe to minimize functionality
  }

  // Feedback háptico
  const hapticFeedback = () => {
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(25) // Vibración suave
    }
  }

  // Manejar cierre
  const handleClose = () => {
    hapticFeedback()
    onClose()
  }

  // Removed minimize effect

  // Desktop fallback - usar el comportamiento anterior
  if (!isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={onClose}
            />

            {/* Desktop Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-4xl h-[80vh] max-h-[600px]"
            >
              <div className="w-full h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
                {showHeader && (
                  <div className="flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex-1 p-4 h-full overflow-auto">
                  {children}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }

  // Mobile optimized version
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            ref={constraintsRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            drag={allowSwipeToClose ? "y" : false}
            dragConstraints={{ top: 0, bottom: 300 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              duration: 0.3
            }}
            className={`
              absolute bottom-0 left-0 right-0 
              bg-gradient-to-br ${customGradient}
              backdrop-blur-xl 
              rounded-t-3xl 
              shadow-2xl 
              border-t border-white/30 dark:border-gray-700/30
              overflow-hidden
              ${className}
            `}
            style={{ 
              maxHeight: maxHeight,
              minHeight: '50vh'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Swipe handle indicator */}
            {allowSwipeToClose && (
              <div className="flex justify-center pt-3 pb-2">
                <motion.div 
                  className="w-12 h-1.5 bg-gray-400/60 dark:bg-gray-500/60 rounded-full cursor-grab"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              </div>
            )}

            {/* Header */}
            {showHeader && (
              <div className={`
                flex items-center justify-between px-6 py-3
                ${allowSwipeToClose ? 'pt-1' : 'pt-4'}
                bg-white/30 dark:bg-gray-800/30 
                border-b border-white/20 dark:border-gray-700/20
              `}>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate flex-1 mr-4">
                  {title}
                </h2>
                
                <div className="flex items-center space-x-2">
                  {/* Close button - más pequeño y sin X */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClose}
                    className="w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                  >
                  </motion.button>
                </div>
              </div>
            )}

            {/* Content */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto p-4 pb-6"
              style={{ 
                maxHeight: showHeader ? 'calc(100% - 80px)' : 'calc(100% - 20px)'
              }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
