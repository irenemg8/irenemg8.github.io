"use client"

import { useState, useRef } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { X, MapPin, Calendar, Briefcase } from 'lucide-react'

interface WorkExperience {
  id: string
  company: string
  position: string
  type: string
  date: string
  location: string
  description: string
  responsibilities: string[]
  skills: string[]
  icon?: string
}

interface WorkNoteProps {
  work: WorkExperience
  onClose: () => void
  initialPosition?: { x: number; y: number }
}

export function WorkNote({ work, onClose, initialPosition = { x: 200, y: 200 } }: WorkNoteProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [size, setSize] = useState({ width: 450, height: 550 })
  const [isResizing, setIsResizing] = useState(false)
  const noteRef = useRef<HTMLDivElement>(null)

  const handleDragEnd = (event: any, info: PanInfo) => {
    setPosition(prev => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y
    }))
    setIsDragging(false)
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
        width: Math.max(300, Math.min(newWidth, window.innerWidth - 50)),
        height: Math.max(200, Math.min(newHeight, window.innerHeight - 50))
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
      ref={noteRef}
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
        x: position.x, 
        y: position.y,
        opacity: 0,
        scale: 0.8
      }}
      animate={{ 
        x: position.x, 
        y: position.y,
        opacity: 1,
        scale: 1
      }}
      exit={{ 
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.2 }
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30
      }}
      className={`fixed z-[100] ${isDragging ? 'cursor-grabbing' : ''} select-none`}
      style={{ 
        width: isMinimized ? '300px' : `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        cursor: isResizing ? 'nwse-resize' : isDragging ? 'grabbing' : 'auto'
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
          
          {/* Título de la ventana */}
          <div className="flex items-center space-x-2 flex-1 justify-center">
            <span className="text-xs">📝</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bloc de notas - {work.company}
            </span>
          </div>
          <div className="w-14"></div>
        </div>

        {/* Contenido de la nota - estilo bloc de notas */}
        {!isMinimized && (
          <div className="flex-1 overflow-auto" 
               style={{ 
                 background: 'linear-gradient(#fef3c7 0%, #fef3c7 95%, transparent 95%), repeating-linear-gradient(to bottom, transparent 0px, transparent 27px, #d4d4d8 28px)',
                 backgroundSize: '100% 100%, 100% 28px'
               }}>
            <div className="p-6 font-mono text-sm space-y-4" style={{ lineHeight: '28px' }}>
              {/* Título y posición */}
              <div className="text-blue-700 dark:text-blue-400">
                <div className="font-bold text-base underline">{work.position}</div>
                <div className="text-xs italic">{work.type}</div>
              </div>

              {/* Metadatos con estilo de nota escrita */}
              <div className="space-y-0 text-gray-700 dark:text-gray-300">
                <div>📅 {work.date}</div>
                <div>📍 {work.location}</div>
              </div>

              {/* Línea separadora estilo lápiz */}
              <div className="border-b-2 border-gray-400 dark:border-gray-600 my-2"></div>

              {/* Descripción con estilo manuscrito */}
              <div className="text-gray-800 dark:text-gray-200">
                <p className="italic">{work.description}</p>
              </div>

              {/* Responsabilidades con viñetas de bloc */}
              {work.responsibilities.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 underline mb-1">
                    Tareas principales:
                  </div>
                  <div className="pl-4 space-y-0">
                    {work.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-gray-600 dark:text-gray-400">-</span>
                        <span className="text-gray-700 dark:text-gray-300">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Habilidades como tags pegados */}
              {work.skills.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200 underline mb-1">
                    Skills:
                  </div>
                  <div className="flex flex-wrap gap-2 pl-4">
                    {work.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="relative px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-600 dark:border-yellow-700"
                        style={{
                          transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                          boxShadow: '1px 1px 2px rgba(0,0,0,0.1)'
                        }}
                      >
                        <span className="text-gray-800 dark:text-gray-200">{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
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