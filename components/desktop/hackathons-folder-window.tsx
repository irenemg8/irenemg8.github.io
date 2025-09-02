"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion'
import { X, Minus, Square } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { MediaViewer } from './media-viewer'
import { StickyNote } from './sticky-note'
import ProfileCard from './ProfileCard'

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

interface HackathonsFolderWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function HackathonsFolderWindow({ isOpen, onClose }: HackathonsFolderWindowProps) {
  const { t } = useLanguage()
  const [selectedHackathon, setSelectedHackathon] = useState<HackathonData | null>(null)
  const [showMediaViewer, setShowMediaViewer] = useState(false)
  const [mediaViewerContent, setMediaViewerContent] = useState<HackathonData | null>(null)
  const [showStickyNote, setShowStickyNote] = useState(false)
  const [stickyNoteContent, setStickyNoteContent] = useState<HackathonData | null>(null)
  const [size, setSize] = useState({ width: 900, height: 480 })
  const [isResizing, setIsResizing] = useState(false)
  const [position, setPosition] = useState({ x: 100, y: 50 })
  const [isMaximized, setIsMaximized] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  const dragControls = useDragControls()

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
      /*mediaUrl: '/hackathon/emobility.pdf',*/
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
        },

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
      /*liveUrl: 'https://www.canva.com/design/DAGmUaMmc1Q/qEBb7fra-d-sfrh8tSUNvQ/view?utm_content=DAGmUaMmc1Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h917ff62e5e',
      mediaUrl: 'https://cienciagandia.webs.upv.es/ca/2025/05/tercera-edicio-campus-salud-gandia/amp/',*/
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
        },
        {
          id: 'urbanvive-app1',
          name: 'App Screenshot 1',
          type: 'image',
          url: '/urbanvive_app/Urbanviveapp1.png'
        },
        {
          id: 'urbanvive-app2', 
          name: 'Equipo',
          type: 'image',
          url: '/urbanvive_app/equipo.jpeg'
        },
        {
          id: 'urbanvive-app3',
          name: 'Todos los ganadores', 
          type: 'image',
          url: '/urbanvive_app/todos.jpeg'
        },
        {
          id: 'urbanvive-diploma',
          name: 'Diploma', 
          type: 'image',
          url: 'urbanvive_app/Irene-medina-CSG25.jpg'
        },

      ]
    },
         {
       id: 'aura',
       eventName: 'VRAIN',
       logo: '/hackathon/vrain_logo.jpeg',
       userPhoto: '/hackathon/profile-aura.png',
       title: 'Aura',
       projectTitle: 'Aura',
       role: 'Diseñadora UX/UI & Frontend Dev', 
      description: 'Asistente impulsado por IA para personas invidentes.',
      date: 'Jun 2025',
      awards: ['2º Premio'],
      fullStory: 'Aura es una aplicación móvil innovadora diseñada para empoderar a personas con discapacidad visual.',
      technologies: ['Figma', 'React Native', 'TypeScript', 'Speech-To-Text', 'AWS', 'Open Data APIs'],
      team: ['Irene Medina García (UX/UI & Frontend)', 'Vicente Rivas Monferrer (Backend)', 'Ada González (Frontend)', 'Raúl Fortea (Backend)'],
      challenges: 'Nuestro principal desafío fue lograr un reconocimiento de imágenes en tiempo real de alta precisión.',
             mediaFiles: [
         {
           id: 'aura-demo',
           name: 'Demo de Aura',
           type: 'video',
           url: '/hackathon/aura/Aura-Demo.mp4'
         },
         {
           id: 'aura-pdf',
           name: 'Memoria Técnica Aura',
           type: 'pdf',
           url: '/hackathon/Memoria Técnica Aura.pdf'
         },
         {
           id: 'aura-diploma',
           name: 'Diploma 2º Premio',
           type: 'image',
           url: '/hackathon/aura/8A78D552-3BCC-41F4-BA26-DD248DD24681.JPEG'
         },
         {
           id: 'aura-premio',
           name: 'Premio 2º Posición',
           type: 'image',
           url: '/hackathon/aura/DA656DA8-C5D7-4416-B2C0-9AEF26A79E1F.jpg'
         },
         {
           id: 'aura-equipo',
           name: 'Equipo',
           type: 'image',
           url: '/hackathon/aura/IMG_7565.JPG'
         },
         {
           id: 'aura-entrega',
           name: 'Entrega de premios',
           type: 'image',
           url: '/hackathon/aura/IMG_7563.JPEG'
         },
         {
           id: 'aura-ganadores',
           name: 'Ganadores',
           type: 'image',
           url: '/hackathon/aura/IMG_7564.JPG'
         },
         {
           id: 'aura-team-extra',
           name: 'Equipo (foto extra)',
           type: 'image',
           url: '/hackathon/aura/IMG_7567.JPG'
         },
         {
           id: 'aura-event',
           name: 'Evento VRAIN',
           type: 'image',
           url: '/hackathon/aura/IMG_7569.JPG'
         }
       ]
    },

  ]

  const handleHackathonClick = (hackathon: HackathonData) => {
    // Mostrar tanto la sticky note como el media viewer
    setStickyNoteContent(hackathon)
    setShowStickyNote(true)
    setMediaViewerContent(hackathon)
    setShowMediaViewer(true)
  }

  const handleMediaViewerClick = (hackathon: HackathonData) => {
    setMediaViewerContent(hackathon)
    setShowMediaViewer(true)
  }

  const handleCloseMediaViewer = () => {
    setShowMediaViewer(false)
    setMediaViewerContent(null)
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
      setSize({ width: 900, height: 480 })
      setPosition({ x: 100, y: 50 })
    } else {
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 100 })
      setPosition({ x: 20, y: 30 })
    }
    setIsMaximized(!isMaximized)
  }

  if (!isOpen) return null
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
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
                  Hackathons and Contests
                </span>
              </div>
            </div>

            {/* Window Content */}
            <div className="p-4 h-[calc(100%-60px)] overflow-auto bg-white dark:bg-gray-900 flex items-center justify-center">
              {/* Hackathons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    onClick={() => handleHackathonClick(hackathon)}
                    className="hover:scale-105 transition-transform cursor-pointer"
                  >
                    <ProfileCard
                      title={hackathon.projectTitle}
                      handle={hackathon.eventName}
                      status="Active"
                      contactText="+"
                      avatarUrl={hackathon.userPhoto}
                      iconUrl={hackathon.logo}
                      miniAvatarUrl={hackathon.logo}
                      showUserInfo={true}
                      enableTilt={true}
                      enableMobileTilt={false}
                      showBehindGradient={true}
                      behindGradient={
                        hackathon.id === 'urbanvive' 
                          ? "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(120,70%,80%,var(--card-opacity)) 4%,hsla(120,50%,70%,calc(var(--card-opacity)*0.75)) 10%,hsla(120,30%,60%,calc(var(--card-opacity)*0.5)) 50%,hsla(120,0%,40%,0) 100%),linear-gradient(135deg,#4ade80ff 0%,#22c55eff 50%,#16a34aff 100%)"
                          : hackathon.id === 'aura'
                          ? "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(240,70%,80%,var(--card-opacity)) 4%,hsla(240,50%,70%,calc(var(--card-opacity)*0.75)) 10%,hsla(240,30%,60%,calc(var(--card-opacity)*0.5)) 50%,hsla(240,0%,40%,0) 100%),linear-gradient(135deg,#8b5cf6ff 0%,#7c3aedff 50%,#6d28d9ff 100%)"
                          : "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(45,70%,80%,var(--card-opacity)) 4%,hsla(45,50%,70%,calc(var(--card-opacity)*0.75)) 10%,hsla(45,30%,60%,calc(var(--card-opacity)*0.5)) 50%,hsla(45,0%,40%,0) 100%),linear-gradient(135deg,#fbbf24ff 0%,#f59e0bff 50%,#d97706ff 100%)"
                      }
                      innerGradient={
                        hackathon.id === 'urbanvive'
                          ? "linear-gradient(135deg,#4ade8055 0%,#22c55e33 100%)"
                          : hackathon.id === 'aura'
                          ? "linear-gradient(135deg,#8b5cf655 0%,#7c3aed33 100%)"
                          : "linear-gradient(135deg,#fbbf2455 0%,#f59e0b33 100%)"
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Viewer para archivos multimedia */}
      <AnimatePresence>
        {showMediaViewer && mediaViewerContent && (
          <MediaViewer
            project={mediaViewerContent}
            onClose={handleCloseMediaViewer}
          />
        )}
      </AnimatePresence>

      {/* Sticky Note para información del hackathon */}
      <AnimatePresence>
        {showStickyNote && stickyNoteContent && (
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
                  x: 400,
                  y: 100
                }}
                customContent={
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      <img 
                        src={stickyNoteContent.logo || "/placeholder.svg"} 
                        className="w-14 h-14 object-cover rounded-lg"
                        alt={stickyNoteContent.eventName}
                      />
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {stickyNoteContent.projectTitle}
                        </h3>
                        <p className="text-sm text-gray-600">{stickyNoteContent.role}</p>
                        <p className="text-xs text-gray-500">{stickyNoteContent.date}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700 mb-3">
                        {stickyNoteContent.description}
                      </p>
                    </div>

                    {stickyNoteContent.awards && stickyNoteContent.awards.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          🏆 Premios:
                        </h4>
                        <ul className="text-xs space-y-1">
                          {stickyNoteContent.awards.map((award: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2 text-yellow-600">•</span>
                              <span className="text-gray-600">{award}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {stickyNoteContent.technologies && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          💻 Tecnologías:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {stickyNoteContent.technologies.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-yellow-200/50 text-xs rounded-full text-gray-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {stickyNoteContent.team && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">
                          👥 Equipo:
                        </h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {stickyNoteContent.team.map((member: string, idx: number) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2 text-yellow-600">•</span>
                              <span>{member}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {(stickyNoteContent.liveUrl || stickyNoteContent.githubUrl || stickyNoteContent.mediaUrl) && (
                      <div className="pt-2 border-t border-gray-300 space-y-1">
                        {stickyNoteContent.liveUrl && (
                          <a
                            href={stickyNoteContent.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            🔗 Ver proyecto
                          </a>
                        )}
                        {stickyNoteContent.githubUrl && (
                          <a
                            href={stickyNoteContent.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            📁 Repositorio
                          </a>
                        )}
                        {stickyNoteContent.mediaUrl && (
                          <button
                            onClick={() => handleMediaViewerClick(stickyNoteContent)}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
                          >
                            📄 Ver archivos multimedia
                          </button>
                        )}
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
