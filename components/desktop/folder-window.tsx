"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X, Minus, Square, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface FolderWindowProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  initialPosition?: { x: number; y: number }
}

export function FolderWindow({ 
  isOpen, 
  onClose, 
  title, 
  children,
  initialPosition = { x: 100, y: 100 }
}: FolderWindowProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isMinimized, setIsMinimized] = useState(false)

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

          {/* Window */}
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.9, 
              x: position.x, 
              y: position.y 
            }}
            animate={{ 
              opacity: 1, 
              scale: isMinimized ? 0.1 : 1, 
              x: position.x, 
              y: position.y 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              transition: { duration: 0.2 } 
            }}
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setPosition(prev => ({
                x: prev.x + info.offset.x,
                y: prev.y + info.offset.y
              }))
            }}
            className="fixed z-50 w-96 max-w-[90vw] h-80 max-h-[80vh]"
            style={{ x: position.x, y: position.y }}
          >
            {/* Window Container */}
            <div className="w-full h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Title Bar */}
              <div className="h-12 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-4 cursor-move">
                {/* Traffic Lights */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center group hover:bg-red-600 transition-colors"
                  >
                    <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center group hover:bg-yellow-600 transition-colors"
                  >
                    <Minus className="w-2 h-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center group hover:bg-green-600 transition-colors"
                  >
                    <Square className="w-2 h-2 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </div>

                {/* Window Title */}
                <div className="flex-1 flex justify-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 macos-text">
                    {title}
                  </span>
                </div>

                {/* Window Controls */}
                <div className="flex items-center space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Window Content */}
              <div className="h-[calc(100%-3rem)] overflow-auto macos-scrollbar p-4">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}