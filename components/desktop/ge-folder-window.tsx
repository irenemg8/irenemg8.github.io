"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion'
import { X, Minus, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { StickyNote } from './sticky-note'
import ProfileCard from './ProfileCard'

interface GETeam {
  id: string
  role: string
  handle: string
  description: string
  responsibilities: string[]
  skills: string[]
  avatarUrl: string
  iconUrl: string
  website?: string
}

interface GEFolderWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function GEFolderWindow({ isOpen, onClose }: GEFolderWindowProps) {
  const { t } = useLanguage()
  const [selectedTeam, setSelectedTeam] = useState<GETeam | null>(null)
  const [showStickyNote, setShowStickyNote] = useState(false)
  const [stickyNoteContent, setStickyNoteContent] = useState<GETeam | null>(null)
  const [size, setSize] = useState({ width: 580, height: 480 })
  const [isResizing, setIsResizing] = useState(false)
  const [position, setPosition] = useState({ x: 230, y: 80 })
  const [isMaximized, setIsMaximized] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

  // Datos de equipos de GE
  const geTeams: GETeam[] = [
    {
      id: 'talpa',
      role: 'Automatización',
      handle: 'talpatunneling',
      description: 'Desarrollo de soluciones de automatización y análisis de datos para sistemas de túneles. UX/UI designer & developer, data analyst, and performance optimizer.',
      responsibilities: [
        'Diseño UX/UI para interfaces de control',
        'Desarrollo de aplicaciones de automatización',
        'Análisis de datos y optimización de rendimiento',
        'Colaboración en proyectos internacionales',
        'Investigación en tecnologías de perforación'
      ],
      skills: ['Figma', 'Python', 'Data Analysis', 'UX/UI', 'Automatización', 'React', 'IoT'],
      avatarUrl: '/placeholder-user.png', // Aquí pondrás tu foto del equipo Talpa
      iconUrl: '/work/logo_talpa.png',
      website: 'https://talpatunneling.webs.upv.es/'
    },
    {
      id: 'zyndra',
      role: 'Co-fundadora',
      handle: 'zyndra',
      description: 'Desarrollo de aplicaciones web y móviles innovadoras con enfoque en experiencia de usuario y rendimiento optimizado.',
      responsibilities: [
        'Desarrollo de aplicaciones web full-stack',
        'Diseño de arquitecturas escalables',
        'Implementación de APIs REST',
        'Optimización de rendimiento',
        'Gestión de bases de datos'
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'GraphQL'],
      avatarUrl: '/placeholder-user.png', // Aquí pondrás tu foto del equipo Zyndra
      iconUrl: '/work/zyndra.png', // Añadir logo de Zyndra
      website: 'https://zyndra.com'
    }
  ]

  const handleTeamClick = (team: GETeam) => {
    setStickyNoteContent(team)
    setShowStickyNote(true)
  }

  const handleCloseSticky = () => {
    setShowStickyNote(false)
    setStickyNoteContent(null)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (!isMaximized) {
      setPosition(prev => ({
        x: Math.max(0, Math.min(window.innerWidth - size.width, prev.x + info.offset.x)),
        y: Math.max(0, Math.min(window.innerHeight - size.height, prev.y + info.offset.y))
      }))
    }
  }

  const handleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 580, height: 480 })
      setPosition({ x: 230, y: 80 })
    } else {
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 100 })
      setPosition({ x: 20, y: 30 })
    }
    setIsMaximized(!isMaximized)
  }

  // Generar posición aleatoria para la sticky note
  const getStickyNotePosition = () => {
    const windowWidth = window.innerWidth || 1024
    const windowHeight = window.innerHeight || 768
    const noteWidth = 320
    const noteHeight = 400

    return {
      x: Math.min(
        Math.max(50, position.x + size.width + 20),
        windowWidth - noteWidth - 50
      ),
      y: Math.min(
        Math.max(50, position.y + 50),
        windowHeight - noteHeight - 50
      )
    }
  }

  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            ref={windowRef}
            drag
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: position.x,
              y: position.y,
              width: size.width,
              height: size.height
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-300 dark:border-gray-700"
            style={{ 
              zIndex: 9999,
              touchAction: 'none',
              left: position.x,
              top: position.y,
              width: size.width,
              height: size.height
            }}
          >
            {/* Window Header */}
            <div 
              className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b border-gray-300 dark:border-gray-700 px-4 py-3 flex items-center justify-between select-none"
            >
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center group hover:bg-red-600 transition-colors"
                >
                  <X className="w-2 h-2 text-red-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMaximized(false)}
                  className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center group hover:bg-yellow-600 transition-colors"
                >
                  <Minus className="w-2 h-2 text-yellow-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMaximize}
                  className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center group hover:bg-green-600 transition-colors"
                >
                  <Square className="w-2 h-2 text-green-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </div>
              
              <div 
                className="flex-1 text-center cursor-move"
                onPointerDown={(e) => dragControls.start(e)}
              >
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Generación Espontánea (GE)
                </span>
              </div>
              
            </div>

            {/* Window Content */}
            <div className="p-6 h-[calc(100%-60px)] overflow-hidden bg-white dark:bg-gray-900 flex items-center justify-center">
             
              {/* Profile Cards Grid */}
              <div className="flex justify-center items-center gap-5">
                {geTeams.map((team) => (
                  <ProfileCard
                    key={team.id}
                    title={team.role}
                    handle={team.handle}
                    status="Active"
                    contactText="+"
                    avatarUrl={team.avatarUrl}
                    iconUrl={team.iconUrl}
                    miniAvatarUrl={team.iconUrl}
                    showUserInfo={true}
                    enableTilt={true}
                    enableMobileTilt={false}
                    onContactClick={() => handleTeamClick(team)}
                    showBehindGradient={true}
                    behindGradient={
                      team.id === 'talpa' 
                        ? "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(217,100%,70%,var(--card-opacity)) 4%,hsla(217,80%,50%,calc(var(--card-opacity)*0.75)) 10%,hsla(217,60%,40%,calc(var(--card-opacity)*0.5)) 50%,hsla(217,0%,30%,0) 100%),linear-gradient(135deg,#00338Dff 0%,#00338Daa 50%,#00338D66 100%)"
                        : "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(280,70%,80%,var(--card-opacity)) 4%,hsla(280,50%,70%,calc(var(--card-opacity)*0.75)) 10%,hsla(280,30%,60%,calc(var(--card-opacity)*0.5)) 50%,hsla(280,0%,40%,0) 100%),linear-gradient(135deg,#FFA28Dff 0%,#9A5796ff 50%,#340073ff 100%)"
                    }
                    innerGradient={
                      team.id === 'talpa'
                        ? "linear-gradient(135deg,#00338D55 0%,#00338D33 100%)"
                        : "linear-gradient(135deg,#FFA28D44 0%,#9A579644 50%,#34007344 100%)"
                    }
                  />
                ))}
              </div>

            
            </div>
          </motion.div>

          {/* Sticky Note para información del equipo */}
          {showStickyNote && stickyNoteContent && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              style={{
                position: 'fixed',
                ...getStickyNotePosition(),
                zIndex: 60
              }}
            >
              <StickyNote
                onDelete={handleCloseSticky}
                initialPosition={getStickyNotePosition()}
                customContent={
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={stickyNoteContent.iconUrl} 
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        
                        <p className="text-sm text-gray-600">{stickyNoteContent.role}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        {stickyNoteContent.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Responsabilidades:
                      </h4>
                      <ul className="text-xs space-y-1">
                        {stickyNoteContent.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span className="text-gray-600">{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Tecnologías:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {stickyNoteContent.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-yellow-200/50 text-xs rounded-full text-gray-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {stickyNoteContent.website && (
                      <div className="pt-2 border-t border-gray-300">
                        <a
                          href={stickyNoteContent.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                        >
                          🔗 Visitar sitio web
                        </a>
                      </div>
                    )}
                  </div>
                }
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
