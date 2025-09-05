"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Calendar, Code, ExternalLink, Github, Star, Target, Lightbulb, Award } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'
import { StickyNote } from '../desktop/sticky-note'

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

interface MobileProjectsWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileProjectsWindow({ isOpen, onClose }: MobileProjectsWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [showStickyNote, setShowStickyNote] = useState(false)

  // Datos de proyectos simplificados para móvil
  const projectsData: ProjectData[] = [
    {
      id: 17,
      title: "PromptGen",
      description: "A lightweight prompt management tool that streamlines the creation, organization, and reuse of AI prompts for productivity and creative workflows.",
      image: "/aidguide/promptgen.png",
      date: "Jun 2025",
      tags: ["AI", "Prompt Engineering", "Productivity", "Next.js"],
      githubUrl: "https://github.com/irenemg8/promptgen",
      liveUrl: "https://irenemg8.github.io/promptgen/",
      fullDescription: "PromptGen is a web-based utility designed for developers, designers, and AI power users who work frequently with generative tools such as ChatGPT, Midjourney, and DALL·E. The app allows users to create, tag, organize, and retrieve custom AI prompts in a fast and structured way.",
      techStack: ["Next.js", "Tailwind CSS", "TypeScript", "Firebase"],
      challenges: "The biggest challenge was designing a user-friendly system for dynamically managing and categorizing prompts while ensuring real-time performance and responsiveness.",
      role: "Full-Stack Developer & UI/UX Designer",
      demoUrl: "https://irenemg8.github.io/promptgen/",
      priority: true
    },
    {
      id: 16,
      title: "PyCatan",
      description: "A fully playable digital adaptation of 'The Settlers of Catan' board game, built in Python with a modular architecture and turn-based mechanics.",
      image: "/aidguide/catan.jpg",
      date: "May 2025",
      tags: ["Python", "Game Development", "Turn-Based", "OOP", "CLI"],
      githubUrl: "https://github.com/vjrivmon/PyCatan",
      liveUrl: "/under-construction",
      fullDescription: "PyCatan is a terminal-based implementation of the iconic strategy board game 'The Settlers of Catan', built from scratch using Python. The project captures the core mechanics of the original game—resource collection, settlement building, trading, and strategic expansion.",
      techStack: ["Python", "OOP", "Terminal UI"],
      challenges: "The greatest challenge was designing a scalable and maintainable game logic system that could handle the complexity of Catan's ruleset without a graphical interface.",
      role: "Developer & Game Logic Architect",
      demoUrl: "/under-construction"
    },
    {
      id: 15,
      title: "Aura",
      description: "An all-in-one assistant app for visually impaired users, integrating multiple accessibility tools into a single, seamless experience.",
      image: "/aidguide/aura.png",
      date: "Jun 2025",
      tags: ["Accessibility", "Voice Control", "Computer Vision", "Assistive Tech", "Mobile App"],
      githubUrl: "https://github.com/agonfer/auraFlutter",
      liveUrl: "/under-construction",
      fullDescription: "Aura is a comprehensive mobile app designed to empower visually impaired users by consolidating multiple accessibility tools into one intuitive platform. The app combines object recognition, voice control, text-to-speech capabilities, and real-time navigation assistance.",
      techStack: ["Flutter", "Dart", "TensorFlow Lite", "Speech Recognition"],
      challenges: "Developing accurate object recognition algorithms that work in real-time while maintaining battery efficiency was our primary challenge.",
      role: "Mobile Developer & Accessibility Specialist",
      demoUrl: "/under-construction",
      priority: true
    }
  ]

  const handleProjectClick = (project: ProjectData) => {
    setSelectedProject(project)
    setShowStickyNote(true)
  }

  const handleExternalLinkClick = (url: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (url !== "/under-construction") {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCloseSticky = () => {
    setShowStickyNote(false)
    setSelectedProject(null)
  }

  // Mobile optimized content
  const mobileContent = (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <FolderOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Mis Proyectos
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Descubre los proyectos en los que he trabajado
        </p>
      </div>

      {/* Projects grid - Mobile optimized */}
      <div className="grid grid-cols-1 gap-4">
        {projectsData.map((project) => (
          <motion.div
            key={project.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/20 cursor-pointer shadow-sm"
            onClick={() => handleProjectClick(project)}
          >
            {/* Project image */}
            <div className="relative h-32 overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Priority star */}
              {project.priority && (
                <div className="absolute top-2 right-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-800 fill-yellow-800" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-base">
                    {project.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {project.date}
                    </p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <motion.button
                      onClick={(e) => handleExternalLinkClick(project.githubUrl, e)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <Github className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  )}
                  
                  {project.liveUrl && project.liveUrl !== "/under-construction" && (
                    <motion.button
                      onClick={(e) => handleExternalLinkClick(project.liveUrl, e)}
                      className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </motion.button>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                {project.description}
              </p>
              
              {/* Role */}
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-3 h-3 text-purple-600" />
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {project.role}
                </span>
              </div>
              
              {/* Tech stack preview */}
              <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 3).map((tech, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-md text-xs flex items-center gap-1"
                  >
                    <Code className="w-3 h-3" />
                    {tech}
                  </span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {projectsData.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Proyectos</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {projectsData.filter(p => p.priority).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Destacados</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {new Set(projectsData.flatMap(p => p.techStack)).size}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Tecnologías</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <MobileWindow
        isOpen={isOpen}
        onClose={onClose}
        title="Mis Proyectos"
        maxHeight="90vh"
        customGradient="from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-green-900/20 dark:to-blue-900/20"
      >
        {mobileContent}
      </MobileWindow>

      {/* Sticky Note para información detallada del proyecto */}
      <AnimatePresence>
        {showStickyNote && selectedProject && (
          <div style={{ 
            position: 'fixed', 
            left: 0, 
            top: 0, 
            width: '100%', 
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50000 
          }}>
            <div style={{ pointerEvents: 'auto' }}>
              <StickyNote
                onDelete={handleCloseSticky}
                onDragToTrash={handleCloseSticky}
                initialPosition={{ 
                  x: isMobile ? 20 : 400,
                  y: isMobile ? 120 : 100
                }}
                customContent={
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          {selectedProject.title}
                          {selectedProject.priority && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedProject.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        {selectedProject.fullDescription}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        Rol:
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">{selectedProject.role}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                        <Code className="w-4 h-4 text-blue-600" />
                        Tecnologías:
                      </h4>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {selectedProject.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-yellow-200/50 text-xs rounded-full text-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedProject.challenges && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-orange-600" />
                          Desafíos:
                        </h4>
                        <p className="text-xs text-gray-600 mb-3">
                          {selectedProject.challenges}
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-300 flex flex-wrap gap-2">
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                        >
                          <Github className="w-3 h-3" />
                          GitHub
                        </a>
                      )}
                      {selectedProject.liveUrl && selectedProject.liveUrl !== "/under-construction" && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ver proyecto
                        </a>
                      )}
                    </div>
                  </div>
                }
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
