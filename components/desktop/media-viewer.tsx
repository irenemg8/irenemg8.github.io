"use client"

import { useState, useRef } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { X, Image, Video, Download, ExternalLink } from 'lucide-react'

interface MediaItem {
  id: string
  type: 'image' | 'video'
  src: string
  alt: string
  title?: string
  description?: string
}

interface MediaViewerProps {
  media: MediaItem[]
  title: string
  onClose: () => void
  initialPosition?: { x: number; y: number }
}

export function MediaViewer({ media, title, onClose, initialPosition = { x: 100, y: 100 } }: MediaViewerProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [size, setSize] = useState({ width: 600, height: 450 })
  const [isResizing, setIsResizing] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (event: any, info: PanInfo) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }))
    setIsDragging(false)
  }

  const handlePrevious = () => {
    setCurrentMediaIndex(prev => (prev > 0 ? prev - 1 : media.length - 1))
  }

  const handleNext = () => {
    setCurrentMediaIndex(prev => (prev < media.length - 1 ? prev + 1 : 0))
  }

  const handleDownload = (mediaItem: MediaItem) => {
    const link = document.createElement('a')
    link.href = mediaItem.src
    link.download = mediaItem.alt || 'media-file'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    
    const startX = e.pageX
    const startY = e.pageY
    const startWidth = size.width
    const startHeight = size.height

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = startWidth
      let newHeight = startHeight

      if (direction.includes('e')) {
        newWidth = startWidth + e.pageX - startX
      }
      if (direction.includes('w')) {
        newWidth = startWidth - e.pageX + startX
      }
      if (direction.includes('s')) {
        newHeight = startHeight + e.pageY - startY
      }
      if (direction.includes('n')) {
        newHeight = startHeight - e.pageY + startY
      }

      setSize({
        width: Math.max(400, Math.min(newWidth, window.innerWidth - 50)),
        height: Math.max(300, Math.min(newHeight, window.innerHeight - 50))
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  if (media.length === 0) return null

  const currentMedia = media[currentMediaIndex]

  return (
    <motion.div
      ref={viewerRef}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      dragConstraints={{
        left: -position.x,
        right: window.innerWidth - position.x - size.width,
        top: -position.y,
        bottom: window.innerHeight - position.y - size.height
      }}
      initial={{ 
        opacity: 0,
        scale: 0.9
      }}
      animate={{ 
        opacity: 1,
        scale: 1
      }}
      exit={{ 
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.2 }
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30
      }}
      className={`fixed ${isDragging ? 'cursor-grabbing' : ''} select-none`}
      style={{ 
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '300px' : `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        cursor: isResizing ? 'nwse-resize' : isDragging ? 'grabbing' : 'auto',
        zIndex: 10001
      }}
    >
      {/* Ventana estilo macOS */}
      <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Header de la ventana */}
        <div className="flex items-center justify-between px-4 h-11 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b border-gray-300 dark:border-gray-700 cursor-move">
          <div className="flex items-center space-x-2">
            {/* Traffic lights */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="w-3 h-3 bg-gradient-to-b from-red-400 to-red-500 rounded-full flex items-center justify-center group hover:from-red-500 hover:to-red-600 transition-colors shadow-sm"
            >
              <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-3 h-3 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center group hover:from-yellow-500 hover:to-yellow-600 transition-colors shadow-sm"
            >
              <div className="w-1.5 h-0.5 bg-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-3 h-3 bg-gradient-to-b from-green-400 to-green-500 rounded-full flex items-center justify-center group hover:from-green-500 hover:to-green-600 transition-colors shadow-sm"
            >
              <div className="w-1 h-1 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
          </div>
          
          {/* Título y contador */}
          <div className="flex items-center space-x-2 flex-1 justify-center">
            {currentMedia.type === 'image' ? (
              <Image className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <Video className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title} - {currentMediaIndex + 1}/{media.length}
            </span>
          </div>
          
          {/* Botón de descarga */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDownload(currentMedia)}
              className="p-1.5 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded transition-colors"
              title="Descargar"
            >
              <Download className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Contenido del media */}
        {!isMinimized && (
          <div className="flex-1 relative bg-black flex items-center justify-center">
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.src}
                alt={currentMedia.alt}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={currentMedia.src}
                controls
                className="max-w-full max-h-full object-contain"
                autoPlay={false}
              />
            )}

            {/* Controles de navegación si hay múltiples elementos */}
            {media.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Información del media */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="text-white">
                <h3 className="font-medium text-sm">{currentMedia.title || currentMedia.alt}</h3>
                {currentMedia.description && (
                  <p className="text-xs text-gray-300 mt-1">{currentMedia.description}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Thumbnails si hay múltiples elementos y no está minimizado */}
        {!isMinimized && media.length > 1 && (
          <div className="border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3">
            <div className="flex space-x-2 overflow-x-auto">
              {media.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-colors ${
                    index === currentMediaIndex 
                      ? 'border-blue-500' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                  }`}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resize handles cuando no está minimizado */}
        {!isMinimized && (
          <>
            <div 
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
              onMouseDown={(e) => handleMouseDown(e, 'se')}
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize"
              onMouseDown={(e) => handleMouseDown(e, 's')}
            />
            <div 
              className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize"
              onMouseDown={(e) => handleMouseDown(e, 'e')}
            />
            <div 
              className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize"
              onMouseDown={(e) => handleMouseDown(e, 'w')}
            />
            <div 
              className="absolute top-44 left-0 right-0 h-1 cursor-ns-resize"
              onMouseDown={(e) => handleMouseDown(e, 'n')}
            />
            <div 
              className="absolute top-44 left-0 w-4 h-4 cursor-nwse-resize"
              onMouseDown={(e) => handleMouseDown(e, 'nw')}
            />
            <div 
              className="absolute top-44 right-0 w-4 h-4 cursor-nesw-resize"
              onMouseDown={(e) => handleMouseDown(e, 'ne')}
            />
            <div 
              className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
              onMouseDown={(e) => handleMouseDown(e, 'sw')}
            />
          </>
        )}
      </div>
    </motion.div>
  )
}
