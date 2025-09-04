'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Minus, Square, Search, Book, ExternalLink, Github, ChevronLeft, ChevronRight, Calendar, User, Code, Lightbulb, Target, Play, Award, Globe } from 'lucide-react'

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

interface Page {
  id: number
  type: 'cover' | 'overview' | 'tech' | 'challenges' | 'links'
  title: string
  content: React.ReactNode
}



interface AppleBooksWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function AppleBooksWindow({ isOpen, onClose }: AppleBooksWindowProps) {
  const [selectedBook, setSelectedBook] = useState<ProjectData | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [size, setSize] = useState({ width: 1050, height: 630 })
  const [position, setPosition] = useState({ x: 50, y: 40 })
  const [isMaximized, setIsMaximized] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  // Función para crear las páginas de un proyecto
  const createProjectPages = (project: ProjectData): Page[] => [
    {
      id: 0,
      type: 'cover',
      title: 'Portada',
      content: (
        <div className="relative w-full h-full bg-white dark:bg-gray-900 flex">
          {/* Página izquierda - Portada del libro */}
          <div className="w-1/2 h-full bg-gradient-to-br from-purple-500 via-lilac-500 to-lavender-600 relative overflow-y-auto rounded-l-lg shadow-2xl scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
            <div className="absolute inset-0 bg-black/10"></div>
            
            {/* Decoración de fondo */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-12 left-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            
            {/* Contenido de la portada */}
            <div className="relative z-10 p-12 h-full flex flex-col justify-between text-white">
              {/* Header */}
              <div className="text-right">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center ml-auto mb-4">
                  <span className="text-xl">{project.priority ? '⭐' : '📓'}</span>
                </div>
                <span className="text-sm opacity-75">{project.date}</span>
              </div>
              
              {/* Título principal */}
              <div className="flex-1 flex items-center">
                <div>
                  <h1 className="text-4xl font-bold mb-4 leading-tight">
                    {project.title}
                  </h1>
                  <div className="w-16 h-1 bg-white/60 rounded-full mb-6"></div>
                  <p className="text-lg opacity-90 leading-relaxed">
                    {project.description.split('.')[0]}.
                  </p>
                </div>
              </div>
              
              {/* Footer con tags */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs opacity-60">
                  {project.role.split('|')[0].trim()}
                </div>
              </div>
            </div>
            
            {/* Efecto de lomo del libro */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/20"></div>
          </div>

          {/* Página derecha - Vista previa del contenido */}
          <div className="w-1/2 h-full bg-gray-50 dark:bg-gray-800 relative rounded-r-lg shadow-inner overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="p-8 pb-16 h-full flex flex-col">
              {/* Mini preview de la imagen */}
              <div className="aspect-video bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.parentNode as HTMLElement
                    if (fallback) {
                      fallback.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-lilac-500">
                          <div class="text-center text-white">
                            <div class="text-3xl mb-2">🚀</div>
                            <p class="font-semibold">Proyecto</p>
                          </div>
                        </div>
                      `
                    }
                  }}
                />
              </div>

              {/* Stack tecnológico en grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {project.techStack.slice(0, 4).map((tech) => (
                  <div key={tech} className="bg-white dark:bg-gray-900 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Code className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enlaces rápidos */}
              <div className="space-y-3 mt-auto">
                {project.githubUrl !== '/under-construction' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Github className="w-4 h-4" />
                    <span>Código disponible</span>
                  </div>
                )}
                {project.liveUrl !== '/under-construction' && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="w-4 h-4" />
                    <span>Demo en vivo</span>
                  </div>
                )}
                
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-4">
                  → Desliza para explorar este proyecto
                </div>
              </div>
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
        <div className="relative w-full h-full bg-white dark:bg-gray-900 flex">
          {/* Página izquierda */}
          <div className="w-1/2 h-full bg-gray-50 dark:bg-gray-800 p-6 pb-16 border-r border-gray-200 dark:border-gray-700 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-purple-600" />
                  El Proyecto
                </h2>
                <div className="w-12 h-1 bg-purple-500 rounded-full"></div>
              </div>

              {/* Imagen principal */}
              <div className="aspect-video bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg mb-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const fallback = target.parentNode as HTMLElement
                    if (fallback) {
                      fallback.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-lilac-500">
                          <div class="text-center text-white">
                            <div class="text-4xl mb-2">🚀</div>
                            <p class="font-semibold">Vista previa</p>
                          </div>
                        </div>
                      `
                    }
                  }}
                />
              </div>

              {/* Información clave */}
              <div className="space-y-4 mt-auto">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Período</span>
                  </div>
                  <p className="text-purple-700 dark:text-purple-300 font-medium">{project.date}</p>
                </div>

                <div className="bg-lilac-50 dark:bg-lilac-900/20 p-4 rounded-lg border border-lilac-200 dark:border-lilac-800">
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 mr-2 text-lilac-600" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100">Mi Rol</span>
                  </div>
                  <p className="text-lilac-700 dark:text-lilac-300 text-sm leading-relaxed">
                    {project.role.split('|')[0].trim()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Página derecha */}
          <div className="w-1/2 h-full bg-white dark:bg-gray-900 p-6 pb-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Descripción
                </h3>
              </div>

              {/* Descripción concisa */}
              <div className="flex-1 space-y-4">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Descripción</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {project.fullDescription.substring(0, 280)}...
                  </p>
                </div>

                {/* Stack principal */}
                <div className="bg-gradient-to-r from-purple-50 to-lilac-50 dark:from-purple-900/20 dark:to-lilac-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                    Stack Principal
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <div key={tech} className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg text-center">
                        <span className="text-xs font-medium text-purple-700 dark:text-purple-200">{tech}</span>
                      </div>
                    ))}
                  </div>
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
        <div className="relative w-full h-full bg-white dark:bg-gray-900 flex">
          {/* Página izquierda - Tecnologías principales */}
          <div className="w-1/2 h-full bg-gradient-to-br from-purple-50 to-lilac-50 dark:from-purple-900/10 dark:to-lilac-900/10 p-8 border-r border-purple-200 dark:border-purple-800 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Code className="w-6 h-6 mr-2 text-purple-600" />
                  Tecnologías
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-lilac-500 rounded-full"></div>
              </div>

              {/* Grid de tecnologías principales - Sin scroll */}
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {project.techStack.slice(0, 4).map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-lilac-100 dark:from-purple-900/30 dark:to-lilac-900/30 rounded-lg flex items-center justify-center">
                          <Code className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                            {tech}
                          </h3>
                          <div className="w-full bg-purple-100 dark:bg-purple-900/30 rounded-full h-1 mt-1">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-lilac-500 h-1 rounded-full" 
                              style={{ width: `${85 + (index * 3)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Categorías compactas */}
                <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 text-sm flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Categorías
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Página derecha - Aspectos técnicos y detalles */}
          <div className="w-1/2 h-full bg-white dark:bg-gray-900 p-6 pb-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2 text-lilac-600" />
                  Detalles Técnicos
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-lilac-500 to-purple-500 rounded-full"></div>
              </div>

              {/* Stack tecnológico compacto */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {project.techStack.slice(0, 6).map((tech, index) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-purple-200 dark:border-purple-800 text-center"
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-lilac-100 dark:from-purple-900/30 dark:to-lilac-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Code className="w-3 h-3 text-purple-600" />
                      </div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                        {tech}
                      </h3>
                    </motion.div>
                  ))}
                </div>

                {/* Características técnicas */}
                <div className="bg-gradient-to-r from-purple-50 to-lilac-50 dark:from-purple-900/20 dark:to-lilac-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 text-sm flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Características
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Responsiva', 'Optimizada', 'Accesible', 'Moderna'].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded text-xs">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-purple-800 dark:text-purple-200 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
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
        <div className="relative w-full h-full bg-white dark:bg-gray-900 flex">
          {/* Página izquierda - Desafíos */}
          <div className="w-1/2 h-full bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 pb-16 border-r border-orange-200 dark:border-orange-700 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 dark:scrollbar-thumb-orange-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2 text-orange-600" />
                  Desafíos
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
              </div>

              {/* Desafío principal */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-orange-200 dark:border-orange-700 shadow-sm mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🧩</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-3">
                      Principal Desafío
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                      {project.challenges.length > 150 ? project.challenges.substring(0, 150) + '...' : project.challenges}
                    </p>
                  </div>
                </div>
              </div>

              {/* Obstáculos principales */}
              <div className="flex-1 space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-3">
                  Obstáculos Principales
                </h4>
                
                {['Complejidad Técnica', 'Limitaciones de Tiempo', 'Integración', 'Optimización'].map((challenge, index) => (
                  <div key={challenge} className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg border border-orange-200 dark:border-orange-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center text-xs font-bold text-orange-700 dark:text-orange-300">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {challenge}
                        </h5>
                        <div className="w-full bg-orange-100 dark:bg-orange-900/30 rounded-full h-1 mt-1">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-1 rounded-full" 
                            style={{ width: `${[85, 70, 90, 75][index]}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Desafío principal resumido */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-orange-200 dark:border-orange-700 mt-4">
                  <h5 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 text-sm">
                    Desafío Principal
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                    {project.challenges.substring(0, 120)}...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Página derecha - Soluciones */}
          <div className="w-1/2 h-full bg-gradient-to-br from-purple-50 to-lilac-50 dark:from-purple-900/10 dark:to-lilac-900/10 p-6 pb-16 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-purple-600" />
                  Soluciones
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-lilac-500 rounded-full"></div>
              </div>

              {/* Metodología */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm mb-6">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center">
                  <span className="w-6 h-6 mr-2">🎯</span>
                  Metodología Aplicada
                </h4>
                <div className="space-y-3">
                  {['Desarrollo iterativo', 'Testing continuo', 'Optimización de rendimiento'].map((method) => (
                    <div key={method} className="flex items-center space-x-3 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-purple-800 dark:text-purple-200 text-sm">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resultados compactos */}
              <div className="flex-1 space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 text-sm flex items-center">
                    <span className="w-5 h-5 mr-2">🎉</span>
                    Resultados
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {['Funcional', 'Optimizado', 'Calidad', 'Entregado'].map((result) => (
                      <div key={result} className="flex items-center space-x-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded text-xs">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-green-800 dark:text-green-200 font-medium">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lecciones compactas */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm flex items-center">
                    <span className="w-4 h-4 mr-2">💡</span>
                    Lecciones Clave
                  </h5>
                  <p className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                    Planificación iterativa y testing continuo para superar desafíos técnicos.
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
      type: 'overview',
      title: 'Descripción Completa',
      content: (
        <div className="relative w-full h-full bg-white dark:bg-gray-900 flex">
          {/* Página izquierda - Descripción detallada */}
          <div className="w-1/2 h-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 p-6 pb-16 border-r border-indigo-200 dark:border-indigo-700 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-indigo-600" />
                  Descripción Completa
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
              </div>

              {/* Descripción completa */}
              <div className="flex-1 space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-3 text-sm">
                    Descripción Detallada
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {project.fullDescription}
                  </p>
                </div>

                {/* Mi rol específico */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2 text-sm flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Mi Contribución
                  </h4>
                  <p className="text-indigo-700 dark:text-indigo-200 text-sm">
                    {project.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Página derecha - Contexto y objetivos */}
          <div className="w-1/2 h-full bg-white dark:bg-gray-900 p-6 pb-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-blue-600" />
                  Contexto
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              </div>

              {/* Información contextual */}
              <div className="flex-1 space-y-4">
                {/* Período del proyecto */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Período de Desarrollo</span>
                  </div>
                  <p className="text-blue-700 dark:text-blue-200 font-medium">{project.date}</p>
                </div>

                {/* Objetivos principales */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    Objetivos Alcanzados
                  </h4>
                  <div className="space-y-2">
                    {['Funcionalidad Completa', 'Diseño Responsive', 'Optimización', 'Testing'].map((obj) => (
                      <div key={obj} className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      type: 'links',
      title: 'Enlaces y Demo',
      content: (
        <div className="relative w-full h-full bg-white dark:bg-gray-900 flex">
          {/* Página izquierda - Enlaces principales */}
          <div className="w-1/2 h-full bg-gradient-to-br from-purple-50 to-lilac-50 dark:from-purple-900/10 dark:to-lilac-900/10 p-6 pb-16 border-r border-purple-200 dark:border-purple-700 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <ExternalLink className="w-6 h-6 mr-2 text-purple-600" />
                  Enlaces
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-lilac-500 rounded-full"></div>
              </div>

              {/* Enlaces disponibles */}
              <div className="flex-1 space-y-3">
                {project.githubUrl !== '/under-construction' && (
                  <motion.a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center">
                        <Github className="w-6 h-6 text-white dark:text-black" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          Código Fuente
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Repositorio en GitHub
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs text-green-600 dark:text-green-400">Disponible</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-400" />
                    </div>
                  </motion.a>
                )}

                {project.liveUrl !== '/under-construction' && (
                  <motion.a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="block p-6 bg-gradient-to-r from-purple-500 to-lilac-500 text-white rounded-lg shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          Demo en Vivo
                        </h3>
                        <p className="text-white/80 text-sm">
                          Aplicación funcionando
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                          <span className="text-xs text-white/80">Online</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/80" />
                    </div>
                  </motion.a>
                )}

                {project.demoUrl !== '/under-construction' && project.demoUrl !== project.liveUrl && (
                  <motion.a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="block p-6 bg-gradient-to-r from-lilac-500 to-purple-500 text-white rounded-lg shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          Demo Interactivo
                        </h3>
                        <p className="text-white/80 text-sm">
                          Versión completa
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                          <span className="text-xs text-white/80">Activo</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/80" />
                    </div>
                  </motion.a>
                )}

                {/* Mensaje si no hay enlaces */}
                {project.githubUrl === '/under-construction' && project.liveUrl === '/under-construction' && project.demoUrl === '/under-construction' && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🚧</span>
                    </div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      En Desarrollo
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Enlaces disponibles pronto
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Página derecha - Vista previa y información adicional */}
          <div className="w-1/2 h-full bg-white dark:bg-gray-900 p-6 pb-16 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Award className="w-6 h-6 mr-2 text-lilac-600" />
                  Vista Previa
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-lilac-500 to-purple-500 rounded-full"></div>
              </div>

              {/* Preview del proyecto */}
              <div className="flex-1 space-y-4">
                {/* Vista previa del proyecto */}
                <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.parentNode as HTMLElement
                      if (fallback) {
                        fallback.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-lilac-500">
                            <div class="text-center text-white">
                              <div class="text-3xl mb-2">🚀</div>
                              <p class="font-semibold text-sm">Vista previa</p>
                            </div>
                          </div>
                        `
                      }
                    }}
                  />
                </div>

                {/* Información compacta */}
                <div className="bg-gradient-to-r from-lilac-50 to-purple-50 dark:from-lilac-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-lilac-200 dark:border-lilac-800">
                  <h4 className="font-semibold text-lilac-900 dark:text-lilac-100 mb-3 text-sm">
                    Información del Proyecto
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-lilac-600" />
                      <span className="text-gray-700 dark:text-gray-300">{project.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Code className="w-3 h-3 text-purple-600" />
                      <span className="text-gray-700 dark:text-gray-300">{project.techStack.length} techs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  // Datos de proyectos ordenados de más reciente a más antiguo
  const projectsData: ProjectData[] = [
    {
      id: 17,
      title: "PromptGen",
      description: "A lightweight prompt management tool that streamlines the creation, organization, and reuse of AI prompts for productivity and creative workflows.",
      image: "/aidguide/promptgen.png?height=600&width=800",
      date: "Jun 2025",
      tags: ["AI", "Prompt Engineering", "Productivity", "Next.js"],
      githubUrl: "https://github.com/irenemg8/promptgen",
      liveUrl: "https://irenemg8.github.io/promptgen/",
      fullDescription: "PromptGen is a web-based utility designed for developers, designers, and AI power users who work frequently with generative tools such as ChatGPT, Midjourney, and DALL·E. The app allows users to create, tag, organize, and retrieve custom AI prompts in a fast and structured way. Built with scalability and UX in mind, PromptGen includes features like dynamic prompt templates, tag-based filtering, and clipboard export for seamless integration into creative workflows. It also supports user authentication and persistent cloud storage, making it a go-to solution for managing personal or team-based prompt libraries.",
      techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Firebase"],
      challenges: "The biggest challenge was designing a user-friendly system for dynamically managing and categorizing prompts while ensuring real-time performance and responsiveness. Balancing simplicity with power-user features required careful UX strategy and performance optimization.",
      role: "Full-Stack Developer & UI/UX Designer",
      demoUrl: "https://irenemg8.github.io/promptgen/"
    },
    {
      id: 16,
      title: "PyCatan",
      description: "A fully playable digital adaptation of 'The Settlers of Catan' board game, built in Python with a modular architecture and turn-based mechanics.",
      image: "/aidguide/catan.jpg?height=600&width=800",
      date: "May 2025",
      tags: ["Python", "Game Development", "Turn-Based", "OOP", "CLI"],
      githubUrl: "https://github.com/vjrivmon/PyCatan",
      liveUrl: "/under-construction",
      fullDescription: "PyCatan is a terminal-based implementation of the iconic strategy board game 'The Settlers of Catan', built from scratch using Python. The project captures the core mechanics of the original game—resource collection, settlement building, trading, and strategic expansion—through a text-based interface. Developed as part of a collaborative software engineering exercise, the game employs a clean object-oriented architecture, with separate modules handling game state, player interactions, dice rolls, and map generation. While minimalist in visuals, the gameplay remains rich and faithful to the board game experience. The project served as a foundation to explore concepts such as state machines, input validation, and event-driven logic in a constrained environment.",
      techStack: ["Python", "OOP", "Terminal UI"],
      challenges: "The greatest challenge was designing a scalable and maintainable game logic system that could handle the complexity of Catan's ruleset without a graphical interface. Managing player state, turn sequences, and resource transactions via console inputs required careful planning and rigorous testing.",
      role: "Developer & Game Logic Architect",
      demoUrl: "/under-construction"
    },
    {
      id: 15,
      title: "Aura",
      description: "An all-in-one assistant app for visually impaired users, integrating multiple accessibility tools into a single, seamless experience.",
      image: "/aidguide/aura.png?height=600&width=800",
      date: "Jun 2025",
      tags: ["Accessibility", "Voice Control", "Computer Vision", "Assistive Tech", "Mobile App"],
      githubUrl: "https://github.com/agonfer/auraFlutter",
      liveUrl: "/under-construction",
      fullDescription: "Aura is an intelligent assistant app designed specifically for blind and visually impaired users. Unlike fragmented accessibility solutions that require switching between multiple applications, Aura unifies all essential assistive functionalities into one intuitive platform. The app uses the smartphone camera to interpret the surrounding environment in real time, enabling obstacle detection, product price recognition in supermarkets, and money denomination identification. Users can interact with Aura via voice commands without needing to touch any buttons, allowing for hands-free operation. Navigation guidance, object detection, and voice-based querying are just a few of the core features. Aura redefines independence by transforming complex everyday tasks into accessible interactions, powered by cutting-edge technologies such as AI, computer vision, and voice recognition.",
      techStack: ["TensorFlow Lite", "React Native", "Google Cloud Vision", "Speech-to-Text API", "Figma"],
      challenges: "The main challenge was consolidating diverse assistive technologies into a single, coherent user experience optimized for accessibility. Balancing real-time camera processing, voice interaction, and system responsiveness required precise engineering and user-centric design thinking.",
      role: "Lead Designer & Frontend Developer",
      demoUrl: "/under-construction"
    },
    {
      id: 8,
      title: "NeuroSpot",
      description: "An interactive assessment platform using cognitive games and AWS cloud services to screen for early ADHD indicators in children.",
      image: "/aidguide/neurospot.svg?height=600&width=800",
      date: "May 2025",
      tags: ["AWS", "React", "Node.js", "Cognitive Games", "UX/UI", "Serverless", "AI", "Education Tech"],
      githubUrl: "https://github.com/vjrivmon/NeuroSpot",
      liveUrl: "/under-construction",
      fullDescription: "NeuroSpot is an innovative platform designed to support early detection of potential ADHD indicators in children through interactive cognitive games. The system integrates a suite of short, engaging tasks that assess attention, memory, and impulse control. Leveraging AWS services such as S3, CloudFront, Lambda, Rekognition, Transcribe, and Comprehend, NeuroSpot provides real-time analytics, automated feedback, and secure storage of sensitive data. As part of the development team, I contributed to the architecture, UI/UX design, and the implementation of cloud-based functionalities to ensure a seamless and secure user experience for both children and educators.",
      techStack: ["React", "Node.js", "AWS", "Figma", "Jest"],
      challenges: "The main challenge was integrating multiple AWS services to provide real-time analysis and maintaining strict compliance with data privacy standards for children. We addressed this through modular serverless architectures and rigorous user testing to ensure accessibility and reliability.",
      role: "Full Stack Developer & UX Designer",
      demoUrl: "/under-construction"
    },
    {
      id: 9,
      title: "Othello",
      description: "A competitive AI agent for Othello, leveraging Minimax with alpha-beta pruning and custom heuristics.",
      image: "/aidguide/othello.png?height=600&width=800",
      date: "May 2025",
      tags: ["Unity", "C#", "AI", "Minimax", "Alpha-Beta Pruning", "Heuristic Design"],
      githubUrl: "https://github.com/irenemg8/othello_game",
      liveUrl: "https://irenemg8.github.io/othello_game/",
      fullDescription: "Othello Battle AI is a competitive artificial intelligence agent developed for the game Othello, designed to participate in academic tournaments. Implemented in C# within the Unity engine, the agent utilizes the Minimax algorithm with alpha-beta pruning to optimize its decision-making. A custom evaluation heuristic was engineered to balance positional strength, mobility, and game phase dynamics, aiming for both defensive and offensive strategies. This project showcases advanced AI logic, algorithmic efficiency, and a robust user interface for real-time gameplay.",
      techStack: ["Unity", "C#", "Minimax", "Alpha-Beta Pruning", "Custom Heuristics"],
      challenges: "The primary challenge was balancing AI performance and computational efficiency under strict tournament constraints. Fine-tuning the evaluation function to achieve strong gameplay across all phases of Othello required iterative testing, data-driven refinements, and a deep understanding of both algorithmic theory and game mechanics.",
      role: "AI Developer & Game Designer",
      demoUrl: "https://irenemg8.github.io/othello_game/"
    },
    {
      id: 13,
      title: "Talpa Tunneling UPV",
      description: "A multidisciplinary engineering project developing a custom tunnel boring machine (TBM) for the Not-A-Boring Competition.",
      image: "/aidguide/talpa.svg",
      priority: true,
      date: "Apr 2025 - Apr 2026",
      tags: ["Mechanical Engineering", "Robotics", "Automation", "CAD", "IoT"],
      githubUrl: "https://github.com/Talpa-Tunneling-UPV",
      liveUrl: "/under-construction",
      fullDescription: "Talpa Tunneling UPV is a student-led initiative at Universitat Politècnica de València aimed at designing and building a fully functional tunnel boring machine (TBM) to compete in The Boring Company's Not-A-Boring Competition. The project integrates mechanical design, robotics, real-time monitoring, and automation systems, following an agile methodology to drive rapid prototyping and interdisciplinary collaboration. My contributions centered on software architecture for sensor data acquisition, real-time dashboard visualization, and supporting the control system for autonomous tunneling operations. The project exemplifies innovation, teamwork, and the application of cutting-edge technology to real-world infrastructure challenges.",
      techStack: ["Figma", "Python", "ROS2", "Node.js", "React"],
      challenges: "The key challenges included achieving reliable mechanical performance in harsh conditions, integrating hardware and software components, and ensuring robust real-time communication between subsystems. Iterative testing and cross-functional collaboration were crucial to optimizing both tunneling speed and system stability.",
      role: "Software Systems Engineer & Dashboard Developer",
      demoUrl: "/under-construction"
    },
    {
      id: 14,
      title: "3D Portfolio Demo",
      description: "Personal portfolio that blends advanced 3D graphics with UX/UI best practices, redefining how creative professionals showcase work online.",
      image: "/aidguide/portfolio.png?height=600&width=800",
      date: "Mar 2025",
      tags: ["3D", "UX/UI", "Portfolio", "Web Design", "Animation"],
      githubUrl: "https://github.com/irenemg8/Portfolio",
      liveUrl: "https://irene.divdev.es/",
      fullDescription: "The 3D Portfolio Demo is a prototype personal website designed to set a new benchmark in digital self-presentation for creative professionals. Combining real-time 3D elements, interactive navigation, and smooth animations, the site offers an immersive user experience while adhering to best practices in accessibility and responsive design. Custom assets—including floating clouds, stylized flowers, and Greek columns—were modeled in Blender and integrated using Three.js and React. The project prioritizes both aesthetics and usability, delivering a visually striking and highly functional portfolio platform. My contributions spanned 3D modeling, front-end development, animation, and overall UX strategy, ensuring the project aligns with contemporary digital storytelling trends.",
      techStack: ["Blender", "Three.js", "React", "Figma", "Tailwind CSS"],
      challenges: "The primary challenge was achieving optimal performance and compatibility across devices while delivering rich 3D interactions. Careful optimization of assets, efficient use of JavaScript libraries, and a mobile-first approach were crucial for a seamless user experience.",
      role: "Designer & Developer",
      demoUrl: "https://irene.divdev.es/"
    },
    {
      id: 7,
      title: "AidGuide",
      description: "An autonomous navigation system for visually impaired users, combining AI, robotics and real-time urban perception",
      image: "/aidguide/logo.svg?height=600&width=800",
      date: "Feb 2025 - Jun 2025",
      tags: ["ROS2", "Python", "AI", "Computer Vision", "TurtleBot3", "Assistive Tech"],
      githubUrl: "https://github.com/vjrivmon/aidguide_04",
      liveUrl: "/under-construction",
      fullDescription: "AidGuide is a robotic guide dog developed to support visually impaired users in navigating urban environments safely and independently. Built on a TurtleBot3 platform using ROS2 and programmed in Python, the robot detects obstacles, pedestrians, traffic lights, and road conditions in real time. It intelligently calculates optimal routes, avoiding traffic jams and unsafe zones. The system is enhanced with a secure web-based control interface and biometric authentication (facial and fingerprint recognition) to personalize the experience and protect user privacy. I contributed to both the UX of the interface and the integration of hardware and vision systems.",
      techStack: ["ROS2", "Python", "OpenCV", "YOLO", "WebSockets", "React", "TensorFlow", "Three.js", "Ollama"],
      challenges: "The most complex challenge was achieving reliable real-time object detection in dynamic environments while ensuring smooth autonomous navigation. We solved this by fine-tuning lightweight AI models and designing fallback behaviors for uncertain scenarios.",
      role: "Software designer & dev",
      demoUrl: "/under-construction"
    },
    {
      id: 6,
      title: "Geospatial Repository",
      description: "A digital platform for exploring and analyzing thematic cartographic studies",
      image: "/aidguide/repo_carto.png?height=600&width=800",
      date: "Jan 2025 - Feb 2025",
      tags: ["QGIS", "Python", "GeoJSON", "Web Mapping", "Data Visualization"],
      githubUrl: "https://github.com/irenemg8/Repo-Cartografia",
      liveUrl: "https://cartografia.divdev.es/",
      fullDescription: "An interactive web repository designed to centralize and visualize a diverse range of cartographic studies. Utilizing QGIS for geospatial data processing and Python for backend development, the platform allows users to navigate through various thematic maps, each accompanied by detailed metadata and analytical insights. The responsive design ensures accessibility across devices, facilitating educational and research applications in geospatial analysis.",
      techStack: ["QGIS", "Python", "GeoJSON", "Leaflet.js", "Django", "Figma"],
      challenges: "Integrating multiple geospatial datasets with varying formats and ensuring seamless interaction within the web interface posed significant challenges. These were addressed by standardizing data inputs and optimizing the rendering process for efficient user experience.",
      role: "Full Stack Developer & UX/UI Designer",
      demoUrl: "/under-construction"
    },
    {
      id: 5,
      title: "VIMYP",
      description: "A web-app platform for real-time multimodal route optimization and urban mobility analysis",
      image: "/aidguide/logo_vimyp.svg?height=600&width=800",
      date: "Sept 2024 - Feb 2025",
      tags: ["HTML", "CSS", "JS", "Docker", "UX/UI", "Smart Cities", "Data Visualization"],
      githubUrl: "https://github.com/vjrivmon/Codigos_Generales_PBIO_Sprint0",
      liveUrl: "https://vimyp.divdev.es/",
      fullDescription: "VIMYP is a smart city platform designed to enhance urban mobility by providing users with real-time, multimodal route planning and comprehensive traffic analytics. The platform integrates data from various transportation sources to offer optimized routing solutions, aiming to reduce congestion and promote sustainable travel options. As the UX/UI lead, I focused on creating an intuitive interface that presents complex data in an accessible manner, facilitating informed decision-making for both commuters and city planners.",
      techStack: ["CHart.js", "Leaflet", "Figma", "Adobe Dreamweaver"],
      challenges: "One of the main challenges was ensuring seamless integration of diverse data sources while maintaining a responsive and user-friendly interface. We addressed this by implementing efficient data handling techniques and conducting iterative user testing to refine the user experience.",
      role: "Lead UX/UI Designer & Frontend Developer | Scrum Master",
      demoUrl: "/under-construction"
    },
    {
      id: 4,
      title: "Yummy Fish",
      description: "A fun and fast-paced underwater game where you eat or get eaten to survive and evolve",
      image: "/aidguide/logo_yummy.svg?height=600&width=800",
      date: "Feb 2024 - Jun 2024",
      tags: ["Figma", "Unity", "C#", "3ds Max", "Game Design", "Audio Production"],
      githubUrl: "/under-construction",
      liveUrl: "/under-construction",
      fullDescription: "Yummy Fish is a 3D survival game where you play as a small fish trying to grow by eating smaller fish while avoiding being eaten by larger predators. The gameplay combines action, strategy, and progression mechanics in a colorful underwater world. All models and animations were created in Autodesk 3ds Max, and the original sound effects and background music were recorded and processed in the UPV professional sound booths. The game was developed in Unity and designed to deliver an engaging, intuitive experience with escalating difficulty and immersive feedback.",
      techStack: ["Unity", "C#", "3ds Max", "Audacity", "Blender", "Figma" ],
      challenges: "Balancing the difficulty curve and optimizing collision detection in a dynamic 3D environment was complex. We iteratively refined the mechanics using playtesting and data from in-game telemetry.",
      role: "Game Designer & Dev | 3D Artist | Scrum Master",
      demoUrl: "/under-construction"
    },
    {
      id: 10,
      title: "Cops and Robbers",
      description: "A strategic multiplayer board game simulation featuring AI-driven agents and real-time pursuit logic.",
      image: "/aidguide/cops.webp?height=600&width=800",
      date: "May 2024",
      tags: ["Unity", "C#", "AI"],
      githubUrl: "https://github.com/vjrivmon/cops-and-robbers",
      liveUrl: "/under-construction",
      fullDescription: "Cops and Robbers is a simulation-based multiplayer board game developed as an academic team project. The game models the classic pursuit-evasion dynamic, where players take on the roles of cops or robbers. Advanced AI agents utilize graph-based pathfinding algorithms to optimize their movements and strategies. The simulation incorporates real-time decision-making, obstacle avoidance, and player-versus-player logic, delivering a competitive and educational experience. My contributions focused on AI behavior design, game mechanics development, and optimizing the simulation for seamless multiplayer interaction.",
      techStack: ["C#", "Graph Algorithms"],
      challenges: "The main challenge involved designing efficient AI for both pursuit and evasion in complex, variable game environments. Achieving balanced gameplay and real-time responsiveness required iterative tuning of pathfinding algorithms and robust game logic architecture.",
      role: "AI & Gameplay Developer",
      demoUrl: "/under-construction"
    },
    {
      id: 11,
      title: "Blackjack",
      description: "A digital adaptation of the classic Blackjack card game featuring intuitive UI, robust game logic, and AI opponents.",
      image: "/aidguide/blackjack.webp?height=600&width=800",
      date: "May 2024",
      tags: ["Unity", "C#", "AI"],
      githubUrl: "https://github.com/vjrivmon/blackjack",
      liveUrl: "/under-construction",
      fullDescription: "Blackjack is a digital recreation of the iconic casino card game, developed as a collaborative academic project. The game offers a polished, user-friendly interface and faithfully implements the official rules and betting mechanics of Blackjack. The application features AI-driven opponents with varying levels of difficulty, enhancing replay value and strategic challenge. My contributions included designing the UI for a smooth player experience, programming core game logic, and developing the AI behavior to simulate real-life dealer and player actions.",
      techStack: ["C#", "Graph Algorithms"],
      challenges: "The key challenge was ensuring accurate rule enforcement and dynamic game flow while maintaining a responsive, intuitive user interface. Developing AI strategies for opponents required balancing realism and fun across different skill levels.",
      role: "UI/UX Designer & Game Developer",
      demoUrl: "/under-construction"
    },
    {
      id: 12,
      title: "Torres de Hanoi",
      description: "An interactive visualization and solver for the classic Towers of Hanoi puzzle with step-by-step guidance.",
      image: "/aidguide/torres.jpeg?height=600&width=800",
      date: "Mar 2024",
      tags: ["Unity", "C#", "AI"],
      githubUrl: "https://github.com/vjrivmon/torres-de-hanoi",
      liveUrl: "/under-construction",
      fullDescription: "Towers of Hanoi is an educational application that visualizes and solves the legendary recursive puzzle. The tool offers an intuitive UI allowing users to manually solve the puzzle or watch an automated step-by-step solution, effectively demonstrating recursion principles in computer science. The project emphasizes didactic clarity and visual engagement, making complex algorithms accessible for students and enthusiasts. My role involved UI/UX design, algorithm implementation, and enhancing user interactivity for a smooth learning experience.",
      techStack: ["C#", "Graph Algorithms"],
      challenges: "The main challenge was translating recursive algorithm logic into clear, real-time visual feedback for users. Ensuring both educational value and usability required close attention to interface design and performance optimization.",
      role: "UI/UX Designer & Algorithm Developer",
      demoUrl: "/under-construction"
    },
    {
      id: 3,
      title: "EcoCity",
      description: "A connected streetlight network with air quality sensors and surveillance for safer, healthier cities",
      image: "/aidguide/logo_ecocity.png?height=600&width=800",
      date: "Sept 2023 - Feb 2024",
      tags: ["Android", "Java", "MQTT", "Raspberry Pi", "IoT"],
      githubUrl: "https://github.com/vjrivmon/IoT_Farola_",
      liveUrl: "/under-construction",
      fullDescription: "EcoCity is a smart city initiative focused on transforming traditional streetlights into intelligent nodes for environmental monitoring and urban security. Each streetlight is equipped with air quality sensors and a surveillance camera, all interconnected via MQTT and controlled through a Raspberry Pi. We developed an Android app that enables real-time visualization of pollution levels, alerts for unsafe air conditions, and access to live camera feeds. The solution enhances both environmental awareness and public safety, creating a more responsive and livable urban space.",
      techStack: ["Android Studio", "Java", "MQTT", "Raspberry Pi", "Firebase"],
      challenges: "Ensuring stable MQTT communication between multiple streetlights and the mobile app was technically demanding. We resolved it through efficient message routing and robust error handling within our IoT architecture.",
      role: "Mobile Developer & System Integration Designer | Scrum Master",
      demoUrl: "/under-construction"
    },
    {
      id: 2,
      title: "GTI Hidropónico - web",
      description: "A clean and responsive website to promote and sell smart hydroponic kits",
      image: "/aidguide/gti.svg?height=600&width=800",
      date: "Feb 2023 - Jun 2023",
      tags: ["HTML", "CSS", "JS", "PHP", "UX/UI", "Axure"],
      githubUrl: "/under-construction",
      liveUrl: "/under-construction",
      fullDescription: "This e-commerce platform was created to support the commercialization of GTI Hidropónico sensor kits. The website highlights the benefits of vertical hydroponic gardening and allows users to explore, customize, and purchase their smart garden kits online. Designed with a focus on simplicity and user trust, it features responsive layouts, engaging visuals, and clear product information to guide buyers through the decision-making process.",
      techStack: ["HTML", "CSS", "JS", "PHP", "UX/UI", "Axure"],
      challenges: "Crafting a brand identity that reflects innovation and sustainability was key. We focused on a minimal aesthetic with bold typography and used real-time user testing to optimize the purchase flow.",
      role: "UX/UI Designer & Frontend developer | Scrum Master",
      demoUrl: "/under-construction"
    },
    {
      id: 1,
      title: "GTI Hidropónico - sensor",
      description: "A smart sensor kit for monitoring vertical hydroponic gardens in real time",
      image: "/aidguide/gti.svg?height=600&width=800",
      date: "Sept 2022 - Feb 2023",
      tags: ["Arduino"],
      githubUrl: "/under-construction",
      liveUrl: "/under-construction",
      fullDescription: "GTI Hidropónico is a vertical hydroponic system enhanced with an Arduino-based sensor kit to monitor key environmental parameters. The system detects humidity, temperature, and signs of plant stress, alerting users instantly when their garden requires attention. Designed with urban sustainability in mind, it empowers users to grow healthy plants in small indoor spaces, while leveraging technology for precision farming.",
      techStack: ["Arduino", "ESP-IDF", "C++", "Chart.js"],
      challenges: "The main challenge was integrating reliable sensor data with user-friendly alerts. We solved it by calibrating the sensors under real conditions and designing a simple yet effective interface for timely feedback.",
      role: "Programmer | Scrum Master",
      demoUrl: "/under-construction"
    }
  ]

  const filteredProjects = projectsData.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Navegar entre páginas (ahora 6 páginas en total)
  const nextPage = () => {
    if (selectedBook && currentPage < 5 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  const prevPage = () => {
    if (selectedBook && currentPage > 0 && !isFlipping) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
      }, 300)
    }
  }

  // Manejar drag para cambiar páginas
  const handleDragEnd = (event: any, info: any) => {
    if (Math.abs(info.offset.x) > 100 && selectedBook && !isFlipping) {
      if (info.offset.x > 0 && currentPage > 0) {
        prevPage()
      } else if (info.offset.x < 0 && currentPage < 5) {
        nextPage()
      }
    }
  }

  const selectBook = (project: ProjectData) => {
    setSelectedBook(project)
    setCurrentPage(0)
  }

  const handleMinimize = () => {
    // Implementar minimizar
  }

  const handleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 1050, height: 630 })
      setPosition({ x: 50, y: 40 })
    } else {
      if (typeof window !== 'undefined') {
        setSize({ width: window.innerWidth - 80, height: window.innerHeight - 80 })
        setPosition({ x: 40, y: 40 })
      }
    }
    setIsMaximized(!isMaximized)
  }

  if (!isOpen) return null

  const currentPages = selectedBook ? createProjectPages(selectedBook) : []

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
          className="fixed bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-300 dark:border-gray-700 z-50"
          style={{ 
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height
          }}
        >
          {/* Window Header - estilo macOS */}
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

                          {/* Window Title */}
              <div className="flex items-center space-x-2 flex-1 justify-center">
                <Book className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedBook ? `${selectedBook.title} - ${currentPages[currentPage]?.title}` : 'Mi Biblioteca de Proyectos'}
                </span>
              </div>

            {/* Page Counter or Search */}
            {selectedBook ? (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {currentPage + 1} / {currentPages.length}
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Lista de Libros */}
            <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
             
              {/* Lista scrollable de proyectos - Con altura fija */}
              <div 
                className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 dark:scrollbar-thumb-purple-600 scrollbar-track-transparent"
                style={{ 
                  maxHeight: '580px', // Altura fija para evitar cortes
                  height: 'auto'
                }}
              >
                <div className="p-4 space-y-3">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ x: 5 }}
                      className={`cursor-pointer p-3 rounded-lg border transition-all ${
                        selectedBook?.id === project.id
                          ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600'
                          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:shadow-md'
                      }`}
                      onClick={() => selectBook(project)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-16 bg-gradient-to-br from-purple-500 to-lilac-600 rounded flex-shrink-0 overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1 mb-1">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                              {project.title}
                            </h4>
                            {project.priority && <span className="text-yellow-500 text-sm">⭐</span>}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {filteredProjects.length === 0 && (
                    <div className="text-center py-8">
                      <Book className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No se encontraron proyectos
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Area - Libro o Vista de inicio */}
            <div className="flex-1 flex flex-col min-h-0">
              {selectedBook ? (
                <>
                  {/* Área del libro - Altura fija */}
                  <div 
                    className="flex-1 relative overflow-hidden"
                    style={{ 
                      height: '580px', // Altura fija para evitar cortes
                      minHeight: '580px' // Altura fija garantizada
                    }}
                  >
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
                        className="h-full w-full cursor-grab active:cursor-grabbing"
                        style={{ 
                          perspective: "1000px",
                          transformStyle: "preserve-3d"
                        }}
                        drag="x"
                        dragConstraints={{ left: -200, right: 200 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="h-full w-full">
                          {currentPages[currentPage]?.content}
                        </div>
                      </motion.div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
                      <motion.button
                        onClick={prevPage}
                        disabled={currentPage === 0 || isFlipping}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 border border-purple-200 dark:border-purple-600 flex items-center justify-center transition-all ${
                          currentPage === 0 || isFlipping 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-purple-200 dark:hover:bg-purple-700'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </motion.button>

                      <div className="flex space-x-1">
                        {currentPages.map((_, index) => (
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
                                ? 'bg-purple-600 dark:bg-purple-400' 
                                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                            }`}
                          />
                        ))}
                      </div>

                      <motion.button
                        onClick={nextPage}
                        disabled={currentPage === currentPages.length - 1 || isFlipping}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-800 border border-purple-200 dark:border-purple-600 flex items-center justify-center transition-all ${
                          currentPage === currentPages.length - 1 || isFlipping
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-purple-200 dark:hover:bg-purple-700'
                        }`}
                      >
                        <ChevronRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </motion.button>
                    </div>

                    {/* Close book button 
                    <button
                      onClick={() => setSelectedBook(null)}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 transition-all z-10"
                    >
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>*/}

                    {/* Drag hint 
                    <div className="absolute top-4 left-4 bg-purple-100/90 dark:bg-purple-900/90 backdrop-blur-sm px-3 py-2 rounded-full border border-purple-200 dark:border-purple-700 z-10">
                      <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center">
                        <span className="mr-1">🖱️</span>
                        Arrastra horizontalmente para cambiar páginas
                      </p>
                    </div>*/}

                    {/* Scroll hint para contenido largo 
                    <div className="absolute top-4 right-16 bg-lilac-100/90 dark:bg-lilac-900/90 backdrop-blur-sm px-3 py-2 rounded-full border border-lilac-200 dark:border-lilac-700 z-10">
                      <p className="text-xs text-lilac-700 dark:text-lilac-300 flex items-center">
                        <span className="mr-1">↕️</span>
                        Scroll para ver todo el contenido
                      </p>
                    </div>*/}
                  </div>
                </>
              ) : (
                // Vista de inicio cuando no hay libro seleccionado
                <div 
                  className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8"
                  style={{ 
                    height: '580px', 
                    minHeight: '580px'
                  }}
                >
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-lilac-600 rounded-full flex items-center justify-center shadow-lg">
                      <Book className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      Mi Biblioteca de Proyectos
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                      Selecciona un proyecto de la lista para explorar su contenido en formato libro interactivo. 
                      Cada libro contiene páginas visuales con información completa del desarrollo.
                    </p>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-800 dark:text-purple-200 flex items-center justify-center">
                        <span className="mr-2">📓</span>
                        {filteredProjects.length} libros de proyectos disponibles
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
