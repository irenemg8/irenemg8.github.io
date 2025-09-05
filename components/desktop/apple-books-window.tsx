'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, Minus, Square, Search, Book, ExternalLink, Github, ChevronLeft, ChevronRight, Calendar, User, Code, Lightbulb, Target, Play, Award, Globe } from 'lucide-react'
import { ProjectData, projectsData } from '@/lib/projects-data'


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
