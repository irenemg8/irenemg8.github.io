"use client"

import { motion, PanInfo } from 'framer-motion'
import { useState, useRef } from 'react'
import { FileIcon, FolderIcon } from 'lucide-react'

interface DraggableFolderProps {
  id: string
  name: string
  icon?: string
  color?: string
  initialPosition: { x: number; y: number }
  onOpen?: () => void
  type?: 'folder' | 'file'
  size?: 'sm' | 'md' | 'lg'
}

export function DraggableFolder({ 
  id, 
  name, 
  icon, 
  color = 'bg-blue-400', 
  initialPosition,
  onOpen,
  type = 'folder',
  size = 'md'
}: DraggableFolderProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (event: any, info: PanInfo) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }))
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    if (onOpen) {
      onOpen()
    }
  }

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-20 h-20 text-4xl'
  }

  const textSizeClasses = {
    sm: 'text-xs max-w-16',
    md: 'text-xs max-w-20',
    lg: 'text-sm max-w-24'
  }

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{
        x: position.x,
        y: position.y,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 100 : 1
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.3 }
      }}
      className={`absolute cursor-pointer select-none group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onClick={() => setIsSelected(!isSelected)}
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex flex-col items-center space-y-2">
        {/* Folder/File Icon */}
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`
            ${sizeClasses[size]} 
            ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-60' : ''} 
            ${color} 
            rounded-xl flex items-center justify-center shadow-lg 
            transition-all duration-200 relative overflow-hidden
            macos-glass border border-white/20
          `}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          
          {/* Icon */}
          <div className="relative z-10">
            {icon ? (
              <span className="drop-shadow-sm">{icon}</span>
            ) : type === 'folder' ? (
              <FolderIcon className="w-8 h-8 text-white drop-shadow-sm" />
            ) : (
              <FileIcon className="w-8 h-8 text-white drop-shadow-sm" />
            )}
          </div>

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: -100 }}
            animate={{ x: isDragging ? 100 : -100 }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>

        {/* Label */}
        <motion.div
          className={`
            ${textSizeClasses[size]} 
            ${isSelected ? 'bg-blue-500 text-white px-1 rounded' : 'text-gray-800 dark:text-gray-200'} 
            macos-text text-center leading-tight break-words
            transition-all duration-200
          `}
          animate={{ 
            backgroundColor: isSelected ? '#3b82f6' : 'transparent',
            color: isSelected ? '#ffffff' : undefined
          }}
        >
          {name}
        </motion.div>
      </div>
    </motion.div>
  )
}