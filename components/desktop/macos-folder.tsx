"use client"

import { motion, PanInfo } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { FileIcon } from 'lucide-react'
import Image from 'next/image'

interface MacOSFolderProps {
  id: string
  name: string
  initialPosition: { x: number; y: number }
  onOpen?: () => void
  type?: 'folder' | 'file'
  fileType?: 'pdf' | 'image' | 'code' | 'music' | 'text'
  size?: 'sm' | 'md' | 'lg'
}

export function MacOSFolder({ 
  id, 
  name, 
  initialPosition,
  onOpen,
  type = 'folder',
  fileType,
  size = 'md'
}: MacOSFolderProps) {
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
    const dragDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2)
    if (dragDistance > 5) {
      setHasBeenMoved(true)
      setPosition(prev => ({
        x: Math.max(20, Math.min(window.innerWidth - 100, prev.x + info.offset.x)),
        y: Math.max(20, Math.min(window.innerHeight - 120, prev.y + info.offset.y))
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

  const sizeClasses = {
    sm: { width: 60, height: 48, fontSize: 'text-xs' },
    md: { width: 72, height: 58, fontSize: 'text-xs' },
    lg: { width: 84, height: 68, fontSize: 'text-sm' }
  }

  const folderSize = sizeClasses[size]

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={{
        left: 20,
        right: typeof window !== 'undefined' ? window.innerWidth - 100 : 1200,
        top: 20,
        bottom: typeof window !== 'undefined' ? window.innerHeight - 120 : 800,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{
        x: position.x,
        y: position.y,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 100 : isSelected ? 50 : hasBeenMoved ? 20 : 10
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
      <div className="flex flex-col items-center space-y-1">
        {/* Folder/File Icon */}
        {type === 'folder' ? (
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`relative ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-60' : ''}`}
            style={{ width: folderSize.width, height: folderSize.height }}
          >
            {/* Folder Image */}
            <img 
              src="/folder.png" 
              alt="Folder"
              className="w-full h-full object-contain drop-shadow-lg"
              style={{
                filter: isSelected ? 'brightness(0.8) sepia(1) saturate(2) hue-rotate(200deg)' : 'none'
              }}
            />

            {/* Selection highlight overlay */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                className="absolute inset-0 bg-blue-500 rounded-lg"
              />
            )}
          </motion.div>
        ) : (
          // File Icon for PDFs and other files
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`relative ${isSelected ? 'ring-2 ring-blue-500 ring-opacity-60' : ''}`}
            style={{ width: folderSize.width, height: folderSize.height }}
          >
            <div 
              className="absolute inset-0 rounded-lg flex items-center justify-center"
              style={{
                background: 'transparent',
                boxShadow: 'none'
              }}
            >
              {fileType === 'pdf' ? (
                <Image
                  src="/document.png"
                  alt="Documento"
                  width={45}
                  height={45}
                  className="drop-shadow-sm object-contain"
                />
              ) : (
                <FileIcon className="w-8 h-8 text-white drop-shadow-sm" />
              )}
            </div>
          </motion.div>
        )}

        {/* Label */}
        <motion.div
          className={`
            ${folderSize.fontSize} 
            ${isSelected ? 'bg-blue-500 text-white px-2 py-1 rounded-md' : 'text-gray-800 dark:text-gray-200'} 
            macos-text text-center leading-tight break-words max-w-20
            transition-all duration-200
          `}
          style={{
            textShadow: !isSelected ? '0 1px 2px rgba(0, 0, 0, 0.3)' : 'none',
            backgroundColor: isSelected ? '#3b82f6' : 'transparent'
          }}
        >
          {name}
        </motion.div>
      </div>
    </motion.div>
  )
}