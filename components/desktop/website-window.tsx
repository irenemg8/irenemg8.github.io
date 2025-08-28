"use client"

import { useState, useRef } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { X, Globe, RefreshCw, ExternalLink } from 'lucide-react'

interface WebsiteWindowProps {
  url: string
  title: string
  onClose: () => void
  initialPosition?: { x: number; y: number }
}

export function WebsiteWindow({ url, title, onClose, initialPosition = { x: 50, y: 50 } }: WebsiteWindowProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [size, setSize] = useState({ width: 800, height: 500 })
  const [isResizing, setIsResizing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (!isMaximized) {
      setPosition(prev => ({
        x: prev.x + info.offset.x,
        y: prev.y + info.offset.y
      }))
    }
    setIsDragging(false)
  }

  const handleMaximize = () => {
    if (isMaximized) {
      // Restaurar tamaño y posición anterior
      setIsMaximized(false)
      setSize({ width: 800, height: 500 })
      setPosition(initialPosition)
    } else {
      // Maximizar
      setIsMaximized(true)
      setSize({ 
        width: window.innerWidth - 100, 
        height: window.innerHeight - 100 
      })
      setPosition({ x: 50, y: 50 })
    }
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true)
      setHasError(false)
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleOpenExternal = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    if (isMaximized) return
    
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

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
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
        zIndex: 10000
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
              onClick={handleMaximize}
              className="w-3 h-3 bg-gradient-to-b from-green-400 to-green-500 rounded-full flex items-center justify-center group hover:from-green-500 hover:to-green-600 transition-colors shadow-sm"
            >
              <div className="w-1 h-1 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.button>
          </div>
          
          {/* Título y controles del navegador */}
          <div className="flex items-center space-x-2 flex-1 justify-center">
            <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {title}
            </span>
          </div>
          
          {/* Botones de navegación */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-1.5 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded transition-colors"
              title="Refrescar"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenExternal}
              className="p-1.5 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded transition-colors"
              title="Abrir en nueva pestaña"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Barra de URL */}
        {!isMinimized && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center bg-white dark:bg-gray-900 rounded-md px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
              <Globe className="w-3 h-3 mr-2 text-gray-400" />
              <span className="truncate">{url}</span>
            </div>
          </div>
        )}

        {/* Contenido del iframe */}
        {!isMinimized && (
          <div className="flex-1 relative bg-white dark:bg-gray-900">
            {isLoading && !hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10">
                <div className="flex flex-col items-center space-y-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="w-8 h-8 text-gray-400" />
                  </motion.div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Cargando sitio web...</span>
                </div>
              </div>
            )}
            {hasError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="flex flex-col items-center space-y-4 p-8 text-center">
                  <Globe className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                  <div>
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No se puede mostrar el sitio web embebido
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Algunos sitios web no permiten ser mostrados en iframes por políticas de seguridad.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpenExternal}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir en nueva pestaña
                    </motion.button>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={url}
                onLoad={() => {
                  setIsLoading(false)
                  // No verificar el contenido del iframe ya que puede causar errores de CORS
                }}
                onError={() => {
                  setIsLoading(false)
                  setHasError(true)
                }}
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads allow-storage-access-by-user-activation"
                title={title}
              />
            )}
          </div>
        )}

        {/* Resize handles cuando no está minimizado ni maximizado */}
        {!isMinimized && !isMaximized && (
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
