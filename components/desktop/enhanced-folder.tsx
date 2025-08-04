"use client"

import { motion, PanInfo } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FileIcon, FolderIcon, FileText, Image, Code, Music } from 'lucide-react'

interface EnhancedFolderProps {
  id: string
  name: string
  icon?: string
  color?: string
  initialPosition: { x: number; y: number }
  onOpen?: () => void
  type?: 'folder' | 'file'
  fileType?: 'pdf' | 'image' | 'code' | 'music' | 'text'
  size?: 'sm' | 'md' | 'lg'
}

export function EnhancedFolder({ 
  id, 
  name, 
  icon, 
  color = 'bg-blue-400', 
  initialPosition,
  onOpen,
  type = 'folder',
  fileType,
  size = 'md'
}: EnhancedFolderProps) {
  const [position, setPosition] = useState(initialPosition)
  const [hasBeenMoved, setHasBeenMoved] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const dragRef = useRef<HTMLDivElement>(null)
  const clickTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (clickTimer.current) {
        clearTimeout(clickTimer.current)
      }
    }
  }, [])

  const handleDragEnd = (event: any, info: PanInfo) => {
    // Only update position if user actually dragged (movement > 5px)
    const dragDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2)
    if (dragDistance > 5) {
      setHasBeenMoved(true)
      setPosition(prev => ({
        x: Math.max(0, Math.min(window.innerWidth - 100, prev.x + info.offset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, prev.y + info.offset.y))
      }))
    }
    setIsDragging(false)
  }

  const handleClick = () => {
    setClickCount(prev => prev + 1)
    setIsSelected(true)
    
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
    }

    clickTimer.current = setTimeout(() => {
      if (clickCount + 1 === 2 && onOpen) {
        onOpen()
      }
      setClickCount(0)
    }, 300)
  }

  const getFileIcon = () => {
    if (icon) return icon
    
    if (type === 'folder') {
      return <FolderIcon className="w-8 h-8 text-white drop-shadow-sm" />
    }
    
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-white drop-shadow-sm" />
      case 'image':
        return <Image className="w-8 h-8 text-white drop-shadow-sm" />
      case 'code':
        return <Code className="w-8 h-8 text-white drop-shadow-sm" />
      case 'music':
        return <Music className="w-8 h-8 text-white drop-shadow-sm" />
      default:
        return <FileIcon className="w-8 h-8 text-white drop-shadow-sm" />
    }
  }

  const getColorByType = () => {
    if (color !== 'bg-blue-400') return color
    
    switch (fileType) {
      case 'pdf':
        return 'bg-red-400'
      case 'image':
        return 'bg-green-400'
      case 'code':
        return 'bg-purple-400'
      case 'music':
        return 'bg-orange-400'
      default:
        return color
    }
  }

  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
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
      dragConstraints={{
        left: 0,
        right: typeof window !== 'undefined' ? window.innerWidth - 100 : 1000,
        top: 0,
        bottom: typeof window !== 'undefined' ? window.innerHeight - 100 : 1000,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{
        x: position.x,
        y: position.y,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 100 : isSelected ? 50 : hasBeenMoved ? 10 : 1
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        opacity: { duration: 0.3 }
      }}
      className={`absolute select-none group ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      onClick={handleClick}
      onBlur={() => setIsSelected(false)}
    >
      <div className="flex flex-col items-center space-y-2">
        {/* Folder/File Icon */}
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`
            ${sizeClasses[size]} 
            ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-60 shadow-lg' : ''} 
            ${getColorByType()} 
            rounded-xl flex items-center justify-center shadow-md 
            transition-all duration-200 relative overflow-hidden
            border border-white/30 backdrop-blur-sm
          `}
          style={{
            background: `linear-gradient(135deg, ${getColorByType().replace('bg-', '')} 0%, ${getColorByType().replace('bg-', '').replace('-400', '-500')} 100%)`
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10"></div>
          
          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center">
            {typeof icon === 'string' ? (
              <span className="drop-shadow-sm">{icon}</span>
            ) : (
              getFileIcon()
            )}
          </div>

          {/* Hover shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
            initial={{ x: -100, rotate: 45 }}
            animate={{ 
              x: isDragging ? 100 : -100,
              rotate: 45
            }}
            transition={{ duration: 0.6 }}
          />

          {/* Selection highlight */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="absolute inset-0 bg-blue-500 rounded-xl"
            />
          )}
        </motion.div>

        {/* Label */}
        <motion.div
          className={`
            ${textSizeClasses[size]} 
            ${isSelected ? 'bg-blue-500 text-white px-2 py-1 rounded-md' : 'text-gray-800 dark:text-gray-200'} 
            macos-text text-center leading-tight break-words
            transition-all duration-200 shadow-sm
          `}
          animate={{ 
            backgroundColor: isSelected ? '#3b82f6' : 'transparent',
            color: isSelected ? '#ffffff' : undefined
          }}
          style={{
            textShadow: !isSelected ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none'
          }}
        >
          {name}
        </motion.div>
      </div>
    </motion.div>
  )
}