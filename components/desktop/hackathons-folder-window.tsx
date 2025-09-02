"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion'
import { X, Minus, Square } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { MediaViewer } from './media-viewer'
import ProfileCard from './ProfileCard'

interface HackathonData {
  id: string
  eventName: string
  logo: string
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
       title: 'EcoSpot',
       projectTitle: 'EcoSpot',
       role: 'Software developer',
      description: 'Participated in the eMobility Hackathon in Valencia, designing a mobile app for electric vehicle charging stations. The goal was to promote smart, user-friendly, and sustainable mobility solutions.',
      date: 'Sept 2023',
      awards: ['Semifinalists'],
      fullStory: 'During the 2-day hackathon, I worked on a team that developed an app to locate, reserve, and review EV charging points in real time. I focused on front-end design and UX, creating a simple, intuitive interface. We applied agile methods to deliver a working MVP and presented it to industry leaders.',
      technologies: ['Axure', 'Figma', 'Android'],
      team: ['Irene Medina García', 'Vicente Rivas Monferrer', 'Teresa López Garrido', 'Raúl Real González'],
      challenges: 'One of the main challenges was developing a functional MVP in less than 36 hours, which required rapid decision-making and tight coordination. Additionally, the lack of real-time charging station data forced us to simulate responses, complicating backend integration. Designing a user experience that worked for different types of EV users demanded continuous iteration and validation. Finally, working within a multidisciplinary team meant aligning technical, design, and business perspectives under constant time pressure.',
      mediaUrl: '/hackathon/emobility.pdf',
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
       title: 'URBANVIVE',
       projectTitle: 'URBANVIVE',
       role: 'UX/UI/UC Specialist',
      description: 'A smart microbiota-integrated flooring system to promote wellness while walking',
      date: 'May 2025',
      awards: ['1st Place – Overall Winner'],
      fullStory: 'UrbanVive es una solución innovadora de health-tech diseñada durante la 3ª edición del Hackathon Safor Salut en Gandía.',
      technologies: ['Figma', 'Arduino', 'Biosensors'],
      team: [
        'Irene Medina García (UX/UI/UC Specialist)',
        'Pablo Rebollo De Miguel (Hardware Developer)',
        'Nuria Casañ (Biomedical Intern)',
        'Juan Chucuri (Biological Researcher)'
      ],
      challenges: 'El principal desafío fue traducir la investigación compleja de microbiota en un producto tangible centrado en el usuario.',
      liveUrl: 'https://www.canva.com/design/DAGmUaMmc1Q/qEBb7fra-d-sfrh8tSUNvQ/view?utm_content=DAGmUaMmc1Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h917ff62e5e',
      mediaUrl: 'https://cienciagandia.webs.upv.es/ca/2025/05/tercera-edicio-campus-salud-gandia/amp/',
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
          name: 'App Screenshot 2',
          type: 'image',
          url: '/urbanvive_app/Urbanviveapp2.png'
        },
        {
          id: 'urbanvive-app3',
          name: 'App Screenshot 3', 
          type: 'image',
          url: '/urbanvive_app/Urbanviveapp3.png'
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
       logo: '/hackathon/vrain_logo_back.png',
       title: 'Aura',
       projectTitle: 'Aura',
       role: 'UX/UI & Frontend Developer', 
      description: 'AI-powered assistant for visually impaired people',
      date: 'Jun 2025',
      awards: ['Pending'],
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
    setMediaViewerContent(hackathon)
    setShowMediaViewer(true)
  }

  const handleCloseMediaViewer = () => {
    setShowMediaViewer(false)
    setMediaViewerContent(null)
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
                      avatarUrl={hackathon.logo}
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
    </>
  )
}
