"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion'
import { X, Minus, Square, FileImage, FileText, Video, Music, ExternalLink, Download, Maximize2, Minimize2, Play, Pause } from 'lucide-react'
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
      const initialItems = project.mediaFiles.map((file, index) => {
        let position;
        
        if (file.type === 'audio') {
          // Posiciones más aleatorias para archivos de audio
          position = {
            x: Math.random() * 400 + 50, // Entre 50 y 450
            y: Math.random() * 300 + 80  // Entre 80 y 380
          }
        } else {
          // Posiciones secuenciales para otros tipos de archivos
          position = {
            x: 100 + (index * 50), 
            y: 100 + (index * 50) 
          }
        }
        
        return {
          id: file.id,
          file,
          position,
          size: getInitialSize(file.type),
          zIndex: 1000 + index
        }
      })
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
        return <SmartVideo file={file} />
      
      case 'audio':
        return <AudioPlayerComponent file={file} />
      
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

// Componente de video inteligente con fallbacks
function SmartVideo({ file }: { file: MediaFile }) {
  const [currentSrc, setCurrentSrc] = useState(file.url)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Lista de posibles URLs para el video
  const getVideoSources = (originalUrl: string) => {
    const sources = [originalUrl]
    
    // Si es un enlace de Google Drive, agregar fallbacks locales
    if (originalUrl.includes('drive.google.com')) {
      // Agregar fallbacks locales si Google Drive falla
      if (originalUrl.includes('1a1TOGqzutd1WTEzZEGuJ22j4M8m8hg9S')) {
        // Este es el video de Aura, agregar fallbacks locales
        sources.push('/hackathon/aura/Aura-Demo-compressed.mp4')
        sources.push('/hackathon/aura/Aura-Demo.mp4')
      }
    } else if (originalUrl.includes('Aura-Demo')) {
      // Lógica original para archivos locales
      if (originalUrl.includes('compressed')) {
        sources.push(originalUrl.replace('-compressed', ''))
      } else {
        sources.unshift(originalUrl.replace('.mp4', '-compressed.mp4'))
      }
    }
    
    return sources
  }
  
  const videoSources = getVideoSources(file.url)
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  
  const handleVideoError = () => {
    console.error('Error cargando video:', currentSrc)
    
    // Intentar con la siguiente fuente
    const nextIndex = currentSourceIndex + 1
    if (nextIndex < videoSources.length) {
      console.log(`Intentando fuente alternativa: ${videoSources[nextIndex]}`)
      setCurrentSourceIndex(nextIndex)
      setCurrentSrc(videoSources[nextIndex])
      setIsLoading(true)
    } else {
      // No hay más fuentes, mostrar error
      setHasError(true)
      setIsLoading(false)
    }
  }
  
  const handleVideoLoad = () => {
    console.log('✅ Video cargado exitosamente:', currentSrc)
    setIsLoading(false)
    setHasError(false)
  }
  
  if (hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-800 rounded-b-lg p-4">
        <div className="text-center">
          <p className="text-lg mb-2">⚠️ Error al cargar el video</p>
          <p className="text-sm text-gray-300 mb-4">
            No se pudo cargar ninguna versión del video
          </p>
          <div className="space-y-2">
            {videoSources.map((src, index) => (
              <a 
                key={index}
                href={src} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-blue-400 hover:text-blue-300 underline text-sm"
              >
                Intentar versión {index + 1}
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-b-lg">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">
              {currentSrc.includes('drive.google.com') 
                ? 'Cargando desde Google Drive...' 
                : 'Cargando video...'}
            </p>
            {currentSrc.includes('drive.google.com') && (
              <p className="text-xs text-gray-400 mt-1">
                Esto puede tardar un momento
              </p>
            )}
          </div>
        </div>
      )}
      <video 
        key={currentSrc} // Fuerza re-render cuando cambia la fuente
        controls 
        className="w-full h-full object-contain bg-black rounded-b-lg"
        src={currentSrc}
        preload="metadata"
        onError={handleVideoError}
        onLoadedData={handleVideoLoad}
        onCanPlay={handleVideoLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        Tu navegador no soporta el elemento de video.
      </video>
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

// AudioPlayer Component with Spotify-like styling
function AudioPlayerComponent({ file }: { file: MediaFile }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlayPause = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    const newTime = (parseFloat(e.target.value) / 100) * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return
    const newVolume = parseFloat(e.target.value) / 100
    audioRef.current.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="w-full h-full bg-black/95 backdrop-blur-sm border border-gray-800 rounded-b-lg overflow-hidden" style={{
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.1)'
    }}>
      <audio ref={audioRef} src={file.url} />
      
      <div className="relative flex items-center h-full p-3 space-x-3">
        {/* Album/Audio cover */}
        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-400 rounded flex items-center justify-center flex-shrink-0 shadow-lg">
          <Music className="w-6 h-6 text-white" />
        </div>
        
        {/* Track info and controls */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm truncate">{file.name}</p>
              <p className="text-gray-400 text-xs truncate">Centromat</p>
            </div>
            
            {/* Play/Pause button */}
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center ml-3 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-black" />
              ) : (
                <Play className="w-4 h-4 text-black ml-0.5" />
              )}
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gray-400 w-8">{formatTime(currentTime)}</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-600 rounded appearance-none cursor-pointer progress-slider"
                style={{
                  background: `linear-gradient(to right, #1db954 0%, #1db954 ${progress}%, #404040 ${progress}%, #404040 100%)`
                }}
              />
            </div>
            <span className="text-gray-400 w-8">{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      <style>{`
        .progress-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1db954;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .progress-slider::-webkit-slider-thumb:hover {
          background: #1ed760;
          transform: scale(1.1);
        }
        
        .progress-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1db954;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
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