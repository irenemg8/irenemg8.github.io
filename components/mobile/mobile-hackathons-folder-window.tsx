"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Calendar, Users, ExternalLink, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'
import { MediaViewer } from '../desktop/media-viewer'
import { StickyNote } from '../desktop/sticky-note'

interface HackathonData {
  id: string
  eventName: string
  logo: string
  userPhoto: string
  title: string
  projectTitle: string
  role: string
  description: string
  date: string
  awards: string[]
  fullStory: string
  technologies: string[]
  team: string[]
  challenges: string
  githubUrl?: string
  liveUrl?: string
  mediaUrl?: string
  mediaFiles?: MediaFile[]
}

interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'pdf' | 'presentation' | 'document' | 'web'
  url: string
  thumbnail?: string
}

interface MobileHackathonsFolderWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileHackathonsFolderWindow({ isOpen, onClose }: MobileHackathonsFolderWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonData | null>(null)
  const [showMediaViewer, setShowMediaViewer] = useState(false)
  const [mediaViewerContent, setMediaViewerContent] = useState<HackathonData | null>(null)
  const [showStickyNote, setShowStickyNote] = useState(false)

  // Datos de hackathons con archivos multimedia
  const hackathons: HackathonData[] = [
    {
      id: 'emobility',
      eventName: 'eMobility',
      logo: '/hackathon/IMG_7130.jpeg',
      userPhoto: '/hackathon/profile-onklub.png',
      title: 'EcoSpot',
      projectTitle: 'EcoSpot',
      role: 'Software Dev',
      description: 'Participé en el Hackathon eMobility de Valencia, diseñando una aplicación móvil para estaciones de carga de vehículos eléctricos. El objetivo era promover soluciones de movilidad inteligentes, intuitivas y sostenibles.',
      date: 'Sept 2023',
      awards: ['Semifinalistas'],
      fullStory: 'Durante el hackathon de dos días, trabajé en un equipo que desarrolló una aplicación para localizar, reservar y revisar puntos de carga de vehículos eléctricos en tiempo real. Me centré en el diseño front-end y la experiencia de usuario (UX), creando una interfaz sencilla e intuitiva. Aplicamos métodos ágiles para desarrollar un MVP funcional y lo presentamos a los líderes del sector.',
      technologies: ['Axure', 'Android', 'Canva'],
      team: ['Irene Medina García', 'Vicente Rivas Monferrer', 'Teresa López Garrido', 'Raúl Real González'],
      challenges: 'Uno de los principales desafíos fue desarrollar un MVP funcional en menos de 36 horas, lo que requirió una rápida toma de decisiones y una estrecha coordinación. Además, la falta de datos de estaciones de carga en tiempo real nos obligó a simular respuestas, lo que complicó la integración del backend. Diseñar una experiencia de usuario que funcionara para diferentes tipos de usuarios de vehículos eléctricos exigió iteración y validación continuas. Finalmente, trabajar en un equipo multidisciplinario implicó alinear las perspectivas técnicas, de diseño y de negocio bajo una presión de tiempo constante.',
      mediaFiles: [
        {
          id: 'emobility-pdf',
          name: 'Presentación EcoSpot',
          type: 'pdf',
          url: '/hackathon/emobility.pdf'
        },
        {
          id: 'emobility-app',
          name: 'Prototipo Interactivo EcoSpot',
          type: 'web',
          url: 'https://y37yne.axshare.com/?id=paqflt&p=registro'
        },
        {
          id: 'emobility-presentación',
          name: 'Presentación',
          type: 'image',
          url: '/hackathon/presentacion_onklub.jpeg'
        },
        {
          id: 'emobility-pase',
          name: 'Acreditación',
          type: 'image',
          url: '/hackathon/pase_onklub.jpeg'
        },
        {
          id: 'emobility-diploma',
          name: 'Diploma',
          type: 'image',
          url: '/hackathon/diploma_onklub.jpeg'
        }
      ]
    },
    {
      id: 'urbanvive',
      eventName: 'CSG 2025',
      logo: '/hackathon/IMG_7131.png',
      userPhoto: '/hackathon/profile-urbanvive.png',
      title: 'URBANVIVE',
      projectTitle: 'URBANVIVE',
      role: 'Especialista UX/UI',
      description: 'Un sistema de suelo inteligente con microbiota integrada para promover el bienestar al caminar.',
      date: 'May 2025',
      awards: ['1º Premio'],
      fullStory: 'UrbanVive es una solución innovadora de health-tech diseñada durante la 3ª edición del Hackathon Safor Salut en Gandía. El proyecto se centra en crear un sistema de suelo inteligente con microbiota integrada que interactúa con el cuerpo a través del contacto físico, promoviendo el bienestar al caminar.',
      technologies: ['Figma', 'Arduino', 'Biosensores'],
      team: [
        'Irene Medina García (Diseñadora UX/UI)',
        'Pablo Rebollo De Miguel (Hardware Dev)',
        'Nuria Casañ (Especialista Biomédica)',
        'Juan Chucuri (Investigador Biológico)'
      ],
      challenges: 'El principal desafío fue traducir la investigación compleja de microbiota en un producto tangible centrado en el usuario.',
      mediaFiles: [
        {
          id: 'urbanvive-pdf',
          name: 'Memoria Técnica UrbanVive',
          type: 'pdf',
          url: '/hackathon/UrbanVive.pdf'
        },
        {
          id: 'urbanvive-web',
          name: 'Artículo web',
          type: 'web',
          url: 'https://cienciagandia.webs.upv.es/ca/2025/05/tercera-edicio-campus-salud-gandia/amp/'
        }
      ]
    }
  ]

  const handleHackathonClick = (hackathon: HackathonData) => {
    setSelectedHackathon(hackathon)
    setShowStickyNote(true)
  }

  const handleMediaClick = (hackathon: HackathonData) => {
    if (hackathon.mediaFiles && hackathon.mediaFiles.length > 0) {
      setMediaViewerContent(hackathon)
      setShowMediaViewer(true)
    }
  }

  const handleCloseSticky = () => {
    setShowStickyNote(false)
    setSelectedHackathon(null)
  }

  const handleCloseMediaViewer = () => {
    setShowMediaViewer(false)
    setMediaViewerContent(null)
  }

  // Mobile optimized content
  const mobileContent = (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Hackathons
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Proyectos e innovaciones desarrolladas en competencias tecnológicas
        </p>
      </div>

      {/* Hackathons grid - Mobile optimized */}
      <div className="grid grid-cols-1 gap-4">
        {hackathons.map((hackathon) => (
          <motion.div
            key={hackathon.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20 cursor-pointer shadow-sm"
            onClick={() => handleHackathonClick(hackathon)}
          >
            <div className="flex items-start space-x-4">
              {/* Hackathon logo */}
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src={hackathon.logo} 
                  alt={hackathon.eventName}
                  className="w-full h-full rounded-xl object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-base">
                      {hackathon.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {hackathon.eventName} - {hackathon.role}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {hackathon.date}
                      </p>
                    </div>
                  </div>
                  
                  {hackathon.mediaFiles && hackathon.mediaFiles.length > 0 && (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMediaClick(hackathon)
                      }}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                  )}
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                  {hackathon.description}
                </p>
                
                {/* Awards */}
                {hackathon.awards.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {hackathon.awards.map((award, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-md text-xs flex items-center gap-1"
                      >
                        <Trophy className="w-3 h-3" />
                        {award}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Technologies preview */}
                <div className="flex flex-wrap gap-1">
                  {hackathon.technologies.slice(0, 3).map((tech, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                  {hackathon.technologies.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{hackathon.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {hackathons.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Hackathons</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600 dark:text-red-400">
              {hackathons.filter(h => h.awards.includes('1º Premio')).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Primeros Premios</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              {hackathons.reduce((acc, h) => acc + (h.mediaFiles?.length || 0), 0)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Archivos</div>
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
        title="Hackathons"
        maxHeight="90vh"
        customGradient="from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20"
      >
        {mobileContent}
      </MobileWindow>

      {/* Media Viewer */}
      <AnimatePresence>
        {showMediaViewer && mediaViewerContent && mediaViewerContent.mediaFiles && (
          <MediaViewer
            isOpen={showMediaViewer}
            onClose={handleCloseMediaViewer}
            mediaItems={mediaViewerContent.mediaFiles.map(file => ({
              id: file.id,
              type: file.type === 'image' ? 'image' : file.type === 'video' ? 'video' : 'image',
              src: file.url,
              alt: file.name,
              title: file.name,
              description: `Archivo de ${mediaViewerContent.title}`
            }))}
            title={`${mediaViewerContent.title} - Archivos multimedia`}
          />
        )}
      </AnimatePresence>

      {/* Sticky Note para información del hackathon */}
      <AnimatePresence>
        {showStickyNote && selectedHackathon && (
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
                        src={selectedHackathon.logo} 
                        className="w-14 h-14 object-cover rounded-lg"
                        alt={selectedHackathon.eventName}
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {selectedHackathon.title}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedHackathon.eventName}</p>
                        <p className="text-xs text-gray-500">{selectedHackathon.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        {selectedHackathon.fullStory}
                      </p>
                    </div>

                    {selectedHackathon.awards.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          Premios:
                        </h4>
                        <ul className="text-xs space-y-1">
                          {selectedHackathon.awards.map((award, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2 text-yellow-600">🏆</span>
                              <span className="text-gray-600">{award}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Tecnologías:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedHackathon.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-yellow-200/50 text-xs rounded-full text-gray-700"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">
                        Equipo:
                      </h4>
                      <div className="text-xs text-gray-600">
                        {selectedHackathon.team.join(', ')}
                      </div>
                    </div>

                    {selectedHackathon.challenges && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          Desafíos:
                        </h4>
                        <p className="text-xs text-gray-600">
                          {selectedHackathon.challenges}
                        </p>
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
