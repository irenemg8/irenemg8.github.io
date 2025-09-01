"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion'
import { X, Minus, Square, FileImage, FileText, Video, Music, ExternalLink, Download, Maximize2, Minimize2 } from 'lucide-react'
import Image from 'next/image'

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'pdf' | 'presentation' | 'document' | 'web'
  url: string
  thumbnail?: string
}

interface ProjectData {
  id: string
  title: string
  subtitle?: string
  mediaFiles?: MediaFile[]
}

interface DraggableMediaItem {
  id: string
  file: MediaFile
  position: { x: number, y: number }
  size: { width: number, height: number }
  zIndex: number
}

interface MediaViewerProps {
  project: ProjectData
  onClose: () => void
}

export function MediaViewer({ project, onClose }: MediaViewerProps) {
  const [mediaItems, setMediaItems] = useState<DraggableMediaItem[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [maxZIndex, setMaxZIndex] = useState(1000)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize media items when project changes
    if (project.mediaFiles) {
      const initialItems = project.mediaFiles.map((file, index) => ({
        id: file.id,
        file,
        position: { 
          x: 100 + (index * 50), 
          y: 100 + (index * 50) 
        },
        size: getInitialSize(file.type),
        zIndex: 1000 + index
      }))
      setMediaItems(initialItems)
      setMaxZIndex(1000 + project.mediaFiles.length)
    }
  }, [project])

  const getInitialSize = (type: string) => {
    switch (type) {
      case 'image':
        return { width: 300, height: 200 }
      case 'video':
        return { width: 400, height: 225 }
      case 'audio':
        return { width: 350, height: 120 }
      case 'pdf':
      case 'document':
      case 'presentation':
        return { width: 350, height: 300 }
      case 'web':
        return { width: 450, height: 350 }
      default:
        return { width: 300, height: 200 }
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FileImage className="w-6 h-6" />
      case 'video':
        return <Video className="w-6 h-6" />
      case 'audio':
        return <Music className="w-6 h-6" />
      case 'pdf':
      case 'document':
        return <FileText className="w-6 h-6" />
      case 'web':
        return <ExternalLink className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  const handleDragEnd = (itemId: string, event: any, info: PanInfo) => {
    setMediaItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            position: { 
              x: Math.max(0, Math.min(window.innerWidth - item.size.width - 50, item.position.x + info.offset.x)),
              y: Math.max(0, Math.min(window.innerHeight - item.size.height - 50, item.position.y + info.offset.y))
            } 
          }
        : item
    ))
    setDraggedItem(null)
  }

  const handleItemClick = (itemId: string) => {
    const newZIndex = maxZIndex + 1
    setMaxZIndex(newZIndex)
    setMediaItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, zIndex: newZIndex } : item
    ))
  }

  const handleResize = (itemId: string, delta: { width: number, height: number }) => {
    setMediaItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            size: { 
              width: Math.max(200, Math.min(800, item.size.width + delta.width)),
              height: Math.max(150, Math.min(600, item.size.height + delta.height))
            } 
          }
        : item
    ))
  }

  const handleCloseItem = (itemId: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== itemId))
  }

  const renderMediaContent = (item: DraggableMediaItem) => {
    const { file } = item
    
    switch (file.type) {
      case 'image':
        return (
          <div className="w-full h-full relative overflow-hidden rounded-b-lg">
            <Image
              src={file.url}
              alt={file.name}
              fill
              className="object-contain bg-gray-100 dark:bg-gray-800"
              sizes="(max-width: 800px) 100vw, 800px"
            />
          </div>
        )
      
      case 'video':
        return (
          <div className="w-full h-full">
            <video 
              controls 
              className="w-full h-full object-contain bg-black rounded-b-lg"
              src={file.url}
            >
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        )
      
      case 'audio':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-b-lg p-4">
            <div className="flex items-center justify-center w-16 h-16 bg-white/80 dark:bg-gray-800/80 rounded-full mb-4 shadow-lg">
              <Music className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">
              {file.name}
            </h3>
            <audio 
              controls 
              className="w-full max-w-xs"
              src={file.url}
            >
              Tu navegador no soporta el elemento de audio.
            </audio>
          </div>
        )
      
      case 'pdf':
      case 'document':
      case 'presentation':
        return (
          <div className="w-full h-full">
            <iframe
              src={file.url}
              className="w-full h-full rounded-b-lg"
              title={file.name}
            />
          </div>
        )
      
      case 'web':
        return (
          <div className="w-full h-full">
            <iframe
              src={file.url}
              className="w-full h-full rounded-b-lg"
              title={file.name}
            />
          </div>
        )
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-b-lg">
            <p className="text-gray-500">Tipo de archivo no soportado</p>
          </div>
        )
    }
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/20 z-50000"
      style={{ zIndex: 50000 }}
    >
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-transparent cursor-pointer"
        onClick={onClose}
      />
      
      {/* Floating close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50001 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header info */}
      <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 rounded-lg px-4 py-2 z-50001">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {project.subtitle}
          </p>
        )}
      </div>

      {/* Draggable media items */}
      <AnimatePresence>
        {mediaItems.map((item) => (
          <MediaItem
            key={item.id}
            item={item}
            onDragEnd={(event, info) => handleDragEnd(item.id, event, info)}
            onClose={() => handleCloseItem(item.id)}
            onResize={(delta) => handleResize(item.id, delta)}
            onClick={() => handleItemClick(item.id)}
            isDragged={draggedItem === item.id}
            onDragStart={() => setDraggedItem(item.id)}
          >
            {renderMediaContent(item)}
          </MediaItem>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface MediaItemProps {
  item: DraggableMediaItem
  children: React.ReactNode
  onDragEnd: (event: any, info: PanInfo) => void
  onClose: () => void
  onResize: (delta: { width: number, height: number }) => void
  onClick: () => void
  isDragged: boolean
  onDragStart: () => void
}

function MediaItem({
  item,
  children,
  onDragEnd,
  onClose,
  onResize,
  onClick,
  isDragged,
  onDragStart
}: MediaItemProps) {
  const [isResizing, setIsResizing] = useState(false)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const dragControls = useDragControls()

  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: item.size.width,
      height: item.size.height
    })
    
    const handleResizeMove = (e: PointerEvent) => {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      onResize({ width: deltaX, height: deltaY })
    }

    const handleResizeEnd = () => {
      setIsResizing(false)
      document.removeEventListener('pointermove', handleResizeMove)
      document.removeEventListener('pointerup', handleResizeEnd)
    }

    document.addEventListener('pointermove', handleResizeMove)
    document.addEventListener('pointerup', handleResizeEnd)
  }

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: item.position.x,
        y: item.position.y
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={`absolute bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden ${
        isDragged ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        width: item.size.width,
        height: item.size.height,
        zIndex: item.zIndex,
        touchAction: 'none'
      }}
      onClick={onClick}
    >
      {/* Window Header */}
      <div 
        className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b border-gray-300 dark:border-gray-700 px-3 py-2 flex items-center justify-between select-none cursor-move"
        onPointerDown={(e) => {
          if (!isResizing) {
            dragControls.start(e)
          }
        }}
      >
          <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center group hover:bg-red-600 transition-colors"
          >
            <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          
        <div className="flex-1 text-center">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
            {getFileIcon(item.file.type)}
            {item.file.name}
            </span>
          </div>
        </div>

      {/* Content */}
      <div className="h-[calc(100%-40px)] relative">
        {children}
        
        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(-45deg, transparent 30%, #666 30%, #666 70%, transparent 70%)'
          }}
          onPointerDown={handleResizeStart}
        />
      </div>
    </motion.div>
  )
}

// Helper function that might be used in MediaItem
function getFileIcon(type: string) {
  switch (type) {
    case 'image':
      return <FileImage className="w-3 h-3" />
    case 'video':
      return <Video className="w-3 h-3" />
    case 'audio':
      return <Music className="w-3 h-3" />
    case 'pdf':
    case 'document':
      return <FileText className="w-3 h-3" />
    case 'web':
      return <ExternalLink className="w-3 h-3" />
    default:
      return <FileText className="w-3 h-3" />
  }
}