'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Minus, Square, ExternalLink, Github, Calendar, User, Code, Lightbulb, Target } from 'lucide-react'

interface ProjectData {
  id: number
  title: string
  description: string
  image: string
  date: string
  tags: string[]
  githubUrl: string
  liveUrl: string
  fullDescription: string
  techStack: string[]
  challenges: string
  role: string
  demoUrl: string
  priority?: boolean
}

interface ProjectFlipbookProps {
  project: ProjectData
  isOpen: boolean
  onClose: () => void
}

interface Page {
  id: number
  type: 'cover' | 'overview' | 'tech' | 'challenges' | 'gallery' | 'links'
  title: string
  content: React.ReactNode
}

export function ProjectFlipbook({ project, isOpen, onClose }: ProjectFlipbookProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [size, setSize] = useState({ width: 900, height: 650 })
  const [position, setPosition] = useState({ x: 120, y: 60 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  // Crear las páginas del libro
  const pages: Page[] = [
    {
      id: 0,
      type: 'cover',
      title: 'Portada',
      content: (
        <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-cover bg-center" 
                 style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
          </div>
          
          <div className="text-center z-10 p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">{project.priority ? '⭐' : '📘'}</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {project.title}
            </h1>
            
            <p className="text-xl mb-6 opacity-90 max-w-md mx-auto">
              {project.description}
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm opacity-75">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{project.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{project.role.split('|')[0].trim()}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 1,
      type: 'overview',
      title: 'Descripción General',
      content: (
        <div className="h-full p-8 bg-white dark:bg-gray-900">
          <div className="max-w-2xl mx-auto h-full flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              Descripción del Proyecto
            </h2>
            
            <div className="flex-1 overflow-y-auto">
              <div className="mb-6">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = document.createElement('div')
                      fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600'
                      fallback.innerHTML = '<div class="text-center text-white"><div class="text-4xl mb-2">📘</div><p class="font-semibold">Vista previa</p></div>'
                      target.parentNode?.appendChild(fallback)
                    }}
                  />
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                  {project.fullDescription}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Período</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{project.date}</p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Mi Rol</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{project.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      type: 'tech',
      title: 'Stack Tecnológico',
      content: (
        <div className="h-full p-8 bg-white dark:bg-gray-900">
          <div className="max-w-2xl mx-auto h-full flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <Code className="w-6 h-6 mr-2 text-purple-600" />
              Tecnologías Utilizadas
            </h2>
            
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {project.techStack.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-xl">💻</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {tech}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                  Aspectos Técnicos Destacados
                </h3>
                <div className="space-y-3">
                  {project.tags.map((tag, index) => (
                    <div key={tag} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      type: 'challenges',
      title: 'Desafíos y Soluciones',
      content: (
        <div className="h-full p-8 bg-white dark:bg-gray-900">
          <div className="max-w-2xl mx-auto h-full flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-orange-600" />
              Desafíos y Soluciones
            </h2>
            
            <div className="flex-1 overflow-y-auto">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg border border-orange-100 dark:border-orange-800">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🧩</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      Principales Desafíos Enfrentados
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {project.challenges}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                    <span className="w-6 h-6 mr-2">🎯</span>
                    Metodología de Desarrollo
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-blue-800 dark:text-blue-200">Desarrollo iterativo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-blue-800 dark:text-blue-200">Testing continuo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-blue-800 dark:text-blue-200">Optimización de rendimiento</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-100 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center">
                    <span className="w-6 h-6 mr-2">✅</span>
                    Resultados Obtenidos
                  </h4>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Proyecto completado satisfactoriamente cumpliendo todos los objetivos técnicos y funcionales planteados inicialmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      type: 'links',
      title: 'Enlaces y Demo',
      content: (
        <div className="h-full p-8 bg-white dark:bg-gray-900">
          <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center flex items-center justify-center">
              <ExternalLink className="w-6 h-6 mr-2 text-blue-600" />
              Enlaces y Demo
            </h2>
            
            <div className="space-y-6">
              {/* GitHub Link */}
              {project.githubUrl !== '/under-construction' && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center">
                      <Github className="w-6 h-6 text-white dark:text-black" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Ver Código en GitHub
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Explora el repositorio y la documentación técnica
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </motion.a>
              )}

              {/* Live Demo Link */}
              {project.liveUrl !== '/under-construction' && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full p-6 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Ver Demo en Vivo
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Prueba la aplicación funcionando en tiempo real
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </motion.a>
              )}

              {/* Demo URL if different from live */}
              {project.demoUrl !== '/under-construction' && project.demoUrl !== project.liveUrl && (
                <motion.a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full p-6 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg border border-green-200 dark:border-green-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Demo Interactivo
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Versión interactiva con funcionalidades completas
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                  </div>
                </motion.a>
              )}

              {/* Under construction message */}
              {project.githubUrl === '/under-construction' && project.liveUrl === '/under-construction' && project.demoUrl === '/under-construction' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🚧</span>
                  </div>
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Proyecto en Desarrollo
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Los enlaces estarán disponibles próximamente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }
  ]

  const nextPage = () => {
    if (currentPage < pages.length - 1 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  const handleMinimize = () => {
    // Implementar minimizar
  }

  const handleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 900, height: 650 })
      setPosition({ x: 120, y: 60 })
    } else {
      if (typeof window !== 'undefined') {
        setSize({ width: window.innerWidth - 40, height: window.innerHeight - 40 })
        setPosition({ x: 20, y: 20 })
      }
    }
    setIsMaximized(!isMaximized)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={windowRef}
          drag={!isMaximized}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height
          }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-300 dark:border-gray-700 z-[60]"
          style={{ 
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height
          }}
        >
          {/* Window Header */}
          <div 
            className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600 cursor-move"
            onPointerDown={(e) => {
              if (!isMaximized) {
                dragControls.start(e)
              }
            }}
          >
            {/* Traffic Light Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                aria-label="Close"
              />
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                aria-label="Minimize"
              />
              <button
                onClick={handleMaximize}
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                aria-label="Maximize"
              />
            </div>

            {/* Book Title */}
            <div className="flex-1 text-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {project.title} - {pages[currentPage]?.title}
              </span>
            </div>

            {/* Page Counter */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {currentPage + 1} / {pages.length}
            </div>
          </div>

          {/* Book Content */}
          <div className="flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
              <motion.div
                key={currentPage}
                initial={{ rotateY: isFlipping ? -90 : 0, opacity: isFlipping ? 0 : 1 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ 
                  duration: 0.6,
                  ease: "easeInOut",
                  transformOrigin: "center center"
                }}
                className="h-full w-full"
                style={{ 
                  perspective: "1000px",
                  transformStyle: "preserve-3d"
                }}
              >
                {pages[currentPage]?.content}
              </motion.div>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <motion.button
                onClick={prevPage}
                disabled={currentPage === 0 || isFlipping}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all ${
                  currentPage === 0 || isFlipping 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-xl'
                }`}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>

              <div className="flex space-x-1">
                {pages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!isFlipping && index !== currentPage) {
                        setIsFlipping(true)
                        setTimeout(() => {
                          setCurrentPage(index)
                          setIsFlipping(false)
                        }, 300)
                      }
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentPage 
                        ? 'bg-blue-600 dark:bg-blue-400' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextPage}
                disabled={currentPage === pages.length - 1 || isFlipping}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all ${
                  currentPage === pages.length - 1 || isFlipping
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-xl'
                }`}
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
