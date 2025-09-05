"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Globe, Image, Music, Video, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'
import { WorkNote } from '../desktop/work-note'
import { WebsiteWindow } from '../desktop/website-window'
import { SimpleWebWindow } from '../desktop/simple-web-window'
import { MediaViewer } from '../desktop/media-viewer'

interface MediaItem {
  id: string
  type: 'image' | 'video' | 'audio'
  src: string
  alt: string
  title?: string
  description?: string
}

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
  website?: string
  media?: MediaItem[]
}

interface MobileWorkFolderWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileWorkFolderWindow({ isOpen, onClose }: MobileWorkFolderWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [selectedWork, setSelectedWork] = useState<WorkExperience | null>(null)
  const [openNotes, setOpenNotes] = useState<WorkExperience[]>([])
  const [openWebsites, setOpenWebsites] = useState<{ work: WorkExperience, url: string }[]>([])
  const [openMediaViewers, setOpenMediaViewers] = useState<{ work: WorkExperience, media: MediaItem[] }[]>([])

  // Datos de experiencia laboral optimizados para móvil
  const workExperiences: WorkExperience[] = [
    {
      id: 'upv-ta',
      company: 'Universidad Politécnica de Valencia',
      position: 'Teaching Assistant',
      type: 'Tiempo parcial',
      date: 'Sept 2025 - Dic 2026',
      location: 'Gandía, España',
      description: 'Apoyo docente en asignaturas de programación e ingeniería informática, tutorías y desarrollo de material educativo.',
      responsibilities: [
        'Asistencia en clases prácticas de programación',
        'Tutorías personalizadas a estudiantes',
        'Corrección de ejercicios y exámenes',
        'Desarrollo de material didáctico',
        'Apoyo en proyectos de investigación'
      ],
      skills: ['Docencia', 'Programación', 'Mentoría', 'Investigación', 'Comunicación'],
      icon: '/work/upv.png'
    },
    {
      id: 'talpa',
      company: 'Talpa Tunneling UPV',
      position: 'Especialista en automatización',
      type: 'Tiempo parcial',
      date: 'Abr 2025 - Actualidad',
      location: 'Valencia, España / Texas, USA',
      description: 'Desarrollo de la GUI de la microtuneladora para participar en la Not A Boring Competition 2026, organizado por Elon Musk.',
      responsibilities: [
        'Diseño UX/UI para interfaces de control',
        'Desarrollo de aplicaciones de automatización',
        'Análisis de datos y optimización de rendimiento',
        'Colaboración en proyectos internacionales'
      ],
      skills: ['Figma', 'Python', 'Data Analysis', 'UX/UI', 'Automatización'],
      icon: '/work/talpa.png',
      website: 'https://talpatunneling.webs.upv.es/',
    },
    {
      id: 'upv-researcher',
      company: 'Universidad Politécnica de Valencia',
      position: 'Investigadora',
      type: 'Tiempo parcial',
      date: 'Sept 2024 - Mar 2025',
      location: 'Gandía, España',
      description: 'Investigación en aplicación de tecnologías de realidad virtual para la educación, trabajando con tecnologías inmersivas y desarrollo de aplicaciones educativas.',
      responsibilities: [
        'Desarrollo de aplicaciones VR educativas',
        'Investigación en tecnologías inmersivas',
        'Análisis de métricas de engagement',
        'Publicación de resultados académicos'
      ],
      skills: ['Unity 3D', 'C#', 'Realidad Virtual', 'Investigación', 'Publicaciones académicas'],
      icon: '/work/upv.png'
    },
    {
      id: 'freelance-dev',
      company: 'Desarrollo Freelance',
      position: 'Desarrolladora Full-Stack',
      type: 'Freelance',
      date: 'Jun 2024 - Actualidad',
      location: 'Remoto',
      description: 'Desarrollo de aplicaciones web y móviles para clientes diversos, especializada en React, Next.js y desarrollo mobile.',
      responsibilities: [
        'Desarrollo de aplicaciones web responsive',
        'Creación de APIs y bases de datos',
        'Diseño UX/UI de interfaces',
        'Gestión completa de proyectos'
      ],
      skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Figma'],
      icon: '/work/freelance.png'
    }
  ]

  const handleFileDoubleClick = (work: WorkExperience) => {
    if (work.website) {
      const newWebsite = { work, url: work.website }
      setOpenWebsites(prev => [...prev, newWebsite])
    } else {
      setOpenNotes(prev => [...prev, work])
    }
  }

  const handleMediaClick = (work: WorkExperience) => {
    if (work.media && work.media.length > 0) {
      const newMediaViewer = { work, media: work.media }
      setOpenMediaViewers(prev => [...prev, newMediaViewer])
    }
  }

  const closeNote = (workId: string) => {
    setOpenNotes(prev => prev.filter(w => w.id !== workId))
  }

  const closeWebsite = (workId: string) => {
    setOpenWebsites(prev => prev.filter(w => w.work.id !== workId))
  }

  const closeMediaViewer = (workId: string) => {
    setOpenMediaViewers(prev => prev.filter(w => w.work.id !== workId))
  }

  const getFileIcon = (work: WorkExperience) => {
    if (work.media && work.media.length > 0) {
      return <Image className="w-6 h-6 text-blue-500" />
    }
    if (work.website) {
      return <Globe className="w-6 h-6 text-green-500" />
    }
    return <FileText className="w-6 h-6 text-gray-500" />
  }

  // Mobile optimized content
  const mobileContent = (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Experiencia Profesional
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Toca cualquier archivo para ver los detalles de la experiencia laboral
        </p>
      </div>

      {/* Work experiences grid - Mobile optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workExperiences.map((work) => (
          <motion.div
            key={work.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/20 cursor-pointer shadow-sm"
            onClick={() => handleFileDoubleClick(work)}
          >
            <div className="flex items-start space-x-3">
              {work.icon ? (
                <img 
                  src={work.icon} 
                  alt={work.company}
                  className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {getFileIcon(work)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                  {work.position}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {work.company}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {work.date}
                </p>
                
                {/* Skills preview */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {work.skills.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {work.skills.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{work.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {work.website && (
                <ExternalLink className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {workExperiences.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Experiencias</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {new Set(workExperiences.flatMap(w => w.skills)).size}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Habilidades</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {workExperiences.filter(w => w.website).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Proyectos</div>
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
        title="Experiencia Laboral"
        maxHeight="90vh"
        customGradient="from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"
      >
        {mobileContent}
      </MobileWindow>

      {/* Sub-windows */}
      <AnimatePresence>
        {openNotes.map((work) => (
          <WorkNote
            key={work.id}
            isOpen={true}
            onClose={() => closeNote(work.id)}
            work={work}
          />
        ))}
        
        {openWebsites.map((item, index) => (
          <SimpleWebWindow
            key={`${item.work.id}-${index}`}
            isOpen={true}
            onClose={() => closeWebsite(item.work.id)}
            url={item.url}
            title={item.work.company}
          />
        ))}
        
        {openMediaViewers.map((item, index) => (
          <MediaViewer
            key={`${item.work.id}-media-${index}`}
            isOpen={true}
            onClose={() => closeMediaViewer(item.work.id)}
            mediaItems={item.media}
            title={`${item.work.company} - Archivos multimedia`}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
