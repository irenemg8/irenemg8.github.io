"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Users } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'
import { StickyNote } from '../desktop/sticky-note'

interface GETeam {
  id: string
  role: string
  handle: string
  description: string
  responsibilities: string[]
  skills: string[]
  avatarUrl: string
  iconUrl: string
  iconUrlDark?: string
  website?: string
}

interface MobileGEFolderWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileGEFolderWindow({ isOpen, onClose }: MobileGEFolderWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [selectedTeam, setSelectedTeam] = useState<GETeam | null>(null)
  const [showStickyNote, setShowStickyNote] = useState(false)

  // Datos de equipos de GE
  const geTeams: GETeam[] = [
    {
      id: 'talpa',
      role: 'Automatización',
      handle: 'talpatunneling',
      description: 'Diseño y desarrollo de una microtuneladora para participar en la Not A Boring Competition 2026, organizado por Elon Musk.',
      responsibilities: [
        'Diseño UX/UI para interfaces',
        'Desarrollo de automatizaciones',
        'Posicionamiento SEO',
        'Análisis de datos y optimización de rendimiento',
        'Colaboración en proyectos internacionales',
      ],
      skills: ['Figma', 'Three.js', 'React', 'TS'],
      avatarUrl: '/placeholder-user.png',
      iconUrl: '/work/logo_talpa.png',
      iconUrlDark: '/work/logo_talpa_negro.png',
      website: 'https://talpatunneling.webs.upv.es/'
    },
    {
      id: 'zyndra',
      role: 'Co-fundadora',
      handle: 'zyndra',
      description: 'Co-fundadora y coordinadora de Zyndra. Desarrollo de un perro guía robot y asistente virtual zero-UI para invidentes y personas con movilidad reducida.',
      responsibilities: [
        'Representante del equipo en eventos',
        'Liderazgo de equipo',
        'Jefa de sección de frontend, márketing y partners',
        'Diseño de interfaces',
      ],
      skills: ['Trello','React','TS', 'Figma'],
      avatarUrl: '/profile-ge1.png',
      iconUrl: '/work/zyndra.png',
      iconUrlDark: '/work/zyndra.png',
      website: 'https://zyndra.com'
    }
  ]

  const handleTeamClick = (team: GETeam) => {
    setSelectedTeam(team)
    setShowStickyNote(true)
  }

  const handleCloseSticky = () => {
    setShowStickyNote(false)
    setSelectedTeam(null)
  }

  // Mobile optimized content
  const mobileContent = (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Mis equipos de GE
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Equipos y proyectos de innovación en los que participo
        </p>
      </div>

      {/* Teams grid - Mobile optimized */}
      <div className="grid grid-cols-1 gap-4">
        {geTeams.map((team) => (
          <motion.div
            key={team.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20 cursor-pointer shadow-sm"
            onClick={() => handleTeamClick(team)}
          >
            <div className="flex items-start space-x-4">
              {/* Team logo */}
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src={team.iconUrl} 
                  alt={team.handle}
                  className="w-full h-full rounded-xl object-contain bg-black/50 p-2"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-base">
                      {team.id === 'talpa' ? 'Talpa Tunneling UPV' : 'Zyndra'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {team.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      @{team.handle}
                    </p>
                  </div>
                  
                  {team.website && (
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
                  {team.description}
                </p>
                
                {/* Skills preview */}
                <div className="flex flex-wrap gap-1">
                  {team.skills.slice(0, 4).map((skill, index) => (
                    <span 
                      key={index}
                      className={`px-2 py-1 rounded-md text-xs ${
                        team.id === 'talpa' 
                          ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                          : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {team.skills.length > 4 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{team.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick info 
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {geTeams.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Equipos</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {geTeams.filter(t => t.website).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Proyectos activos</div>
          </div>
        </div>
      </div>*/}
    </div>
  )

  return (
    <>
      <MobileWindow
        isOpen={isOpen}
        onClose={onClose}
        title="Generación Espontánea"
        maxHeight="90vh"
        customGradient="from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-purple-900/20"
      >
        {mobileContent}
      </MobileWindow>

      {/* Sticky Note para información del equipo */}
      <AnimatePresence>
        {showStickyNote && selectedTeam && (
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
                      <img 
                        src={selectedTeam.iconUrlDark || selectedTeam.iconUrl} 
                        className="w-14 h-14 object-contain"
                        alt={selectedTeam.handle}
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {selectedTeam.id === 'talpa' ? 'Talpa Tunneling UPV' : 'Zyndra'}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedTeam.role}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        {selectedTeam.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Responsabilidades:
                      </h4>
                      <ul className="text-xs space-y-1">
                        {selectedTeam.responsibilities.map((resp, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2 text-yellow-600">•</span>
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
                        {selectedTeam.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-yellow-200/50 text-xs rounded-full text-gray-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedTeam.website && (
                      <div className="pt-2 border-t border-purple-300">
                        <a
                          href={selectedTeam.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-600 hover:underline flex items-center gap-1"
                        >
                          🔗 Visitar sitio web
                        </a>
                      </div>
                    )}
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
