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

  // Datos de experiencia laboral sincronizados con desktop
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
      media: [
       /* {
          id: 'talpa-1',
          type: 'image',
          src: '/work/talpa-project.png',
          alt: 'Proyecto Talpa Dashboard',
          title: 'Dashboard de Control',
          description: 'Interfaz principal del sistema de automatización'
        },
        {
          id: 'talpa-2',
          type: 'image',
          src: '/work/talpa-ui.png',
          alt: 'UI Design Talpa',
          title: 'Diseño UI/UX',
          description: 'Wireframes y prototipos del sistema'
        }*/
      ]
    },
    {
      id: 'gomarco',
      company: 'GOMARCO',
      position: 'Scrum Master & Programadora',
      type: 'Contrato de prácticas',
      date: 'Abr 2025 - Jul 2025',
      location: 'Yecla (Murcia)',
      description: 'Gestión ágil de proyectos y desarrollo de software en entorno industrial.',
      responsibilities: [
        'Gestión ágil del departamento de informática',
        'Automatización de procesos internos',
        'Desarrollo de aplicaciones de escritorio',
        'Desarrollo de IAs locales',
        'Diseño de interfaces de usuario',
        'Diseño del tablero de Trello',
      ],
      skills: ['Scrum', 'Trello', 'C#', 'Automatización', 'Python'],
      icon: '/work/gomarco.png'
    },
    {
      id: 'profesora',
      company: 'Profesora Particular',
      position: 'Profesora de programación',
      type: 'Autónomo',
      date: 'Sept 2023 - Feb 2025',
      location: 'Gandía (Comunidad Valenciana)',
      description: 'Ayudo a estudiantes a fortalecer sus conocimientos de programación y diseño en C++, JS, Python y desarrollo web.',
      responsibilities: [
        'Diseño de clases personalizadas según nivel del alumno',
        'Enseñanza de C++, JS, Python y desarrollo web',
        'Combinación de teoría y práctica',
        'Organización de clases y material de apoyo',
      ],
      skills: ['C++', 'JS', 'Python', 'HTML/CSS', 'SQL'],
      icon: '/work/particulares.png'
    },
    {
      id: 'centromat-web',
      company: 'Centromat - Web',
      position: 'Diseñadora y desarrolladora web',
      type: 'Autónomo',
      date: 'Jun 2025 - Jul 2025',
      location: 'En remoto',
      description: 'Diseño y desarrollo de la página web enfocado a las nuevas necesidades de la empresa.',
      responsibilities: [
        'Diseño de wireframes y prototipos UI',
        'Desarrollo de la página web',
        'Desarrollo de sitio web responsive y accesible',
        'Mejora del SEO de la página web',
        'Optimización del rendimiento de la página web',
      ],
      skills: ['Figma', 'UX/UI', 'React', 'TS'],
      icon: '/work/centromat.png',
      website: 'https://centromat.info/',
      media: [
       /* {
          id: 'centromat-1',
          type: 'image',
          src: '/work/centromat-home.png',
          alt: 'Página principal Centromat',
          title: 'Diseño Homepage',
          description: 'Página de inicio del sitio web responsivo'
        },
        {
          id: 'centromat-2',
          type: 'image',
          src: '/work/centromat-wireframes.png',
          alt: 'Wireframes Centromat',
          title: 'Wireframes y Prototipos',
          description: 'Proceso de diseño y arquitectura de información'
        }*/
      ]
    },
    {
      id: 'centromat-trello',
      company: 'Centromat - Scrum',
      position: 'Scrum Master',
      type: 'Autónomo',
      date: 'May 2025',
      location: 'En remoto',
      description: 'Implementación de la metodología Scrum en la empresa junto a la creación de un tablero de Trello para la gestión de proyectos.',
      responsibilities: [
        'Formación a los trabajadores de la empresa en la metodología Scrum',
        'Creación de un tablero de Trello para la gestión de proyectos',
        'Gestión de proyecto con metodología Scrum',
        'Mejora del rendimiento de los proyectos',
        'Análisis de datos y optimización de rendimiento de los trabajadores',
      ],
      skills: ['Scrum', 'Trello'],
      icon: '/work/centromat.png',
      website: 'https://centromat.info/',
      media: [
       /* {
          id: 'centromat-1',
          type: 'image',
          src: '/work/centromat-home.png',
          alt: 'Página principal Centromat',
          title: 'Diseño Homepage',
          description: 'Página de inicio del sitio web responsivo'
        },
        {
          id: 'centromat-2',
          type: 'image',
          src: '/work/centromat-wireframes.png',
          alt: 'Wireframes Centromat',
          title: 'Wireframes y Prototipos',
          description: 'Proceso de diseño y arquitectura de información'
        }*/
      ]
    },
    {
      id: 'centromat-radio',
      company: 'Centromat - Radio',
      position: 'Creadora de anuncios de radio',
      type: 'Autónomo',
      date: 'Jul 2023 - Sept 2023',
      location: 'En remoto',
      description: 'Desarrollo creativo y producción de anuncios radiofónicos para la empresa, desde la conceptualización hasta la producción final.',
      responsibilities: [
        'Desarrollo de conceptos creativos para anuncios',
        'Escritura de guiones publicitarios',
        'Producción y edición de audio',
        'Coordinación con programas de radio locales',
        'Optimización de mensajes para diferentes audiencias'
      ],
      skills: ['Creatividad', 'Guión', 'Edición de audio', 'Marketing', 'Comunicación'],
      icon: '/work/centromat.png',
      media: [
        {
          id: 'centromat-radio-1',
          type: 'audio',
          src: '/work/centromat(1).mp3',
          alt: 'Anuncio de radio Centromat - Versión 1',
          title: 'Septiembre 2025',
          description: 'Anuncio radiofónico principal de 30 segundos'
        },
        /*{
          id: 'centromat-radio-2',
          type: 'audio',
          src: '/music/centromat-anuncio-2.mp3',
          alt: 'Anuncio de radio Centromat - Versión 2',
          title: 'Anuncio Promocional',
          description: 'Versión promocional del anuncio de 20 segundos'
        },
        {
          id: 'centromat-radio-3',
          type: 'audio',
          src: '/music/centromat-jingle.mp3',
          alt: 'Jingle Centromat',
          title: 'Jingle Corporativo',
          description: 'Jingle musical de identificación de marca'
        }*/
      ]
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


  const closeNote = (workId: string) => {
    setOpenNotes(prev => prev.filter(w => w.id !== workId))
  }

  const closeWebsite = (workId: string) => {
    setOpenWebsites(prev => prev.filter(w => w.work.id !== workId))
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
          ¿Dónde he trabajado?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Toca cualquier archivo para ver los detalles de qué he hecho en cada trabajo que he tenido.
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
                  className="w-10 h-10 rounded-lg object-cover bg-white p-1"
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
                      className="px-2 py-1 bg-purple-400 dark:bg-purple-600/50 text-white dark:text-white rounded-md text-xs"
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

      {/* Quick stats 
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
      </div>*/}
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
            onClose={() => closeNote(work.id)}
            work={work}
          />
        ))}
        
        {openWebsites.map((item, index) => (
          <SimpleWebWindow
            key={`${item.work.id}-${index}`}
            onClose={() => closeWebsite(item.work.id)}
            url={item.url}
            title={item.work.company}
          />
        ))}
      </AnimatePresence>
    </>
  )
}
