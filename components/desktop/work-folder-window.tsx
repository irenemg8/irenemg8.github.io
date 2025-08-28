"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { X, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { WorkNote } from './work-note'
import { WebsiteWindow } from './website-window'
import { SimpleWebWindow } from './simple-web-window'
import { MediaViewer } from './media-viewer'

interface MediaItem {
  id: string
  type: 'image' | 'video'
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

interface FilePosition {
  x: number
  y: number
}

interface WorkFolderWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function WorkFolderWindow({ isOpen, onClose }: WorkFolderWindowProps) {
  const { t } = useLanguage()
  const [selectedWork, setSelectedWork] = useState<WorkExperience | null>(null)
  const [openNotes, setOpenNotes] = useState<WorkExperience[]>([])
  const [openWebsites, setOpenWebsites] = useState<{ work: WorkExperience, url: string }[]>([])
  const [openMediaViewers, setOpenMediaViewers] = useState<{ work: WorkExperience, media: MediaItem[] }[]>([])
  const [size, setSize] = useState({ width: 768, height: 520 })
  const [isResizing, setIsResizing] = useState(false)
  const [filePositions, setFilePositions] = useState<{ [key: string]: FilePosition }>({})
  const [draggedFile, setDraggedFile] = useState<string | null>(null)
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const hasDraggedRef = useRef<{ [key: string]: boolean }>({})
  const dragStartPosRef = useRef<{ [key: string]: { x: number; y: number } }>({})

  // Datos de experiencia laboral con logos
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
      type: 'Tiempo completo',
      date: 'Abr 2025 - Actualidad',
      location: 'Valencia, España / Texas, USA',
      description: 'Desarrollo de soluciones de automatización y análisis de datos para sistemas de túneles. UX/UI designer & developer, data analyst, and performance optimizer.',
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
        {
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
        }
      ]
    },
    {
      id: 'gomarco',
      company: 'GOMARCO',
      position: 'Scrum Master & Programadora',
      type: 'Contrato de prácticas',
      date: 'Abr 2025 - Jul 2025',
      location: 'Yecla, Murcia, España · Híbrido',
      description: 'Gestión ágil de proyectos y desarrollo de software en entorno industrial.',
      responsibilities: [
        'Gestión ágil de sprints',
        'Coordinación de equipos multidisciplinarios',
        'Automatización de procesos empresariales',
        'Desarrollo de aplicaciones de escritorio'
      ],
      skills: ['Scrum', 'Trello', 'C#', 'Automatización', 'Liderazgo'],
      icon: '/work/gomarco.png'
    },
    {
      id: 'profesora',
      company: 'Profesora Particular',
      position: 'Profesora de programación',
      type: 'Autónomo',
      date: 'Sept 2023 - Feb 2025',
      location: 'Gandía, Valencia, España · Híbrido',
      description: 'Ayudo a estudiantes a fortalecer sus habilidades de programación y diseño en C++, JavaScript y desarrollo web.',
      responsibilities: [
        'Diseño de clases personalizadas según nivel del alumno',
        'Enseñanza de C++, JavaScript y desarrollo web',
        'Combinación de teoría y práctica',
        'Fortalecimiento de habilidades de programación'
      ],
      skills: ['C++', 'JavaScript', 'HTML/CSS', 'React', 'Pedagogía'],
      icon: '/work/particulares.png'
    },
    {
      id: 'centromat',
      company: 'Centromat',
      position: 'Diseñadora y desarrolladora web',
      type: 'Autónomo',
      date: 'Feb 2023 - Jun 2023',
      location: 'En remoto',
      description: 'Gestioné un proyecto web completo con Scrum y Trello, desde la investigación hasta el lanzamiento.',
      responsibilities: [
        'Gestión de proyecto con metodología Scrum',
        'Diseño de wireframes y prototipos UI',
        'Desarrollo de sitio web responsivo y accesible',
        'Mejora continua basada en feedback'
      ],
      skills: ['Scrum', 'Trello', 'Figma', 'JavaScript', 'UX/UI'],
      icon: '/work/centromat.png',
      website: 'https://centromat.info/',
      media: [
        {
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
        }
      ]
    }
  ]

  // Inicializar las posiciones de los archivos dispersos por la pantalla
  useEffect(() => {
    const initialPositions: { [key: string]: FilePosition } = {}
    
    // Posiciones dispersas manualmente diseñadas para que se vean naturales
    const scatteredPositions = [
      { x: 60, y: 50 },     // UPV - arriba izquierda
      { x: 380, y: 140 },   // Talpa - centro derecha
      { x: 180, y: 240 },   // GOMARCO - centro izquierda
      { x: 480, y: 280 },   // Profesora - abajo derecha
      { x: 290, y: 80 },    // Centromat - arriba centro
    ]
    
    workExperiences.forEach((work, index) => {
      if (index < scatteredPositions.length) {
        initialPositions[work.id] = scatteredPositions[index]
      } else {
        // Por si se agregan más experiencias, usar posición aleatoria
        initialPositions[work.id] = {
          x: Math.random() * 400 + 50,
          y: Math.random() * 250 + 50
        }
      }
    })
    setFilePositions(initialPositions)
  }, [])

  const handleOpenNote = (work: WorkExperience) => {
    if (!openNotes.find(note => note.id === work.id)) {
      setOpenNotes([...openNotes, work])
      
      // Si tiene website, abrirlo automáticamente
      if (work.website && !openWebsites.find(w => w.work.id === work.id)) {
        const websiteUrl = work.website
        setOpenWebsites(prev => [...prev, { work, url: websiteUrl }])
      }
      
      // Si tiene medios, abrirlos automáticamente también
      if (work.media && work.media.length > 0 && !openMediaViewers.find(m => m.work.id === work.id)) {
        setOpenMediaViewers(prev => [...prev, { work, media: work.media! }])
      }
    }
  }

  const handleCloseNote = (workId: string) => {
    setOpenNotes(openNotes.filter(note => note.id !== workId))
  }

  const handleCloseWebsite = (workId: string) => {
    setOpenWebsites(openWebsites.filter(w => w.work.id !== workId))
  }

  const handleOpenMedia = (work: WorkExperience) => {
    if (work.media && work.media.length > 0 && !openMediaViewers.find(m => m.work.id === work.id)) {
      setOpenMediaViewers(prev => [...prev, { work, media: work.media! }])
    }
  }

  const handleCloseMedia = (workId: string) => {
    setOpenMediaViewers(openMediaViewers.filter(m => m.work.id !== workId))
  }

  // Handle resize
  const handleMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    
    const startX = e.pageX
    const startY = e.pageY
    const startWidth = size.width
    const startHeight = size.height

    const handleMouseMove = (e: MouseEvent) => {
      let newWidth = startWidth
      let newHeight = startHeight

      if (direction.includes('e')) {
        newWidth = startWidth + e.pageX - startX
      }
      if (direction.includes('w')) {
        newWidth = startWidth - e.pageX + startX
      }
      if (direction.includes('s')) {
        newHeight = startHeight + e.pageY - startY
      }
      if (direction.includes('n')) {
        newHeight = startHeight - e.pageY + startY
      }

      setSize({
        width: Math.max(400, Math.min(newWidth, window.innerWidth - 100)),
        height: Math.max(300, Math.min(newHeight, window.innerHeight - 100))
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  if (!isOpen) return null

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={onClose}
            />
            
            <motion.div
              ref={windowRef}
              key="window"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed z-50"
              style={{
                left: '15%',
                top: '10%',
                width: `${size.width}px`,
                height: `${size.height}px`,
                cursor: isResizing ? 'nwse-resize' : 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full bg-gray-50 dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">
                {/* macOS Window Title Bar */}
                <div className="flex items-center h-11 px-4 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b border-gray-300 dark:border-gray-700">
                  {/* Traffic Light Buttons */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className="w-3 h-3 bg-gradient-to-b from-red-400 to-red-500 rounded-full flex items-center justify-center group hover:from-red-500 hover:to-red-600 transition-colors shadow-sm"
                    >
                      <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-3 h-3 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center group hover:from-yellow-500 hover:to-yellow-600 transition-colors shadow-sm"
                    >
                      <div className="w-1.5 h-0.5 bg-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-3 h-3 bg-gradient-to-b from-green-400 to-green-500 rounded-full flex items-center justify-center group hover:from-green-500 hover:to-green-600 transition-colors shadow-sm"
                    >
                      <div className="w-1 h-1 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </motion.button>
                  </div>

                  {/* Window Title */}
                  <div className="flex-1 flex justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Experiencia Laboral
                    </span>
                  </div>
                </div>

                {/* Content - File Icons con posiciones arrastrables */}
                <div 
                  ref={contentRef}
                  className="relative h-[calc(100%-44px)] overflow-auto bg-white dark:bg-gray-800"
                >
                  {/* Botón de prueba temporal para debug */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    zIndex: 1000
                  }}>
                    <button
                      onClick={() => {
                        console.log('🟢 BOTÓN PRUEBA: Abriendo ventana web en posición fija')
                        const talpa = workExperiences.find(w => w.id === 'talpa')
                        if (talpa && talpa.website) {
                          setOpenWebsites([{ work: talpa, url: talpa.website }])
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#00FF00',
                        color: 'black',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px',
                        border: '2px solid black'
                      }}
                    >
                      🌐 PRUEBA WEB
                    </button>
                  </div>

                  <div style={{
                    position: 'absolute',
                    top: '50px',
                    left: '10px',
                    zIndex: 1000
                  }}>
                    <button
                      onClick={() => {
                        console.log('🟢 BOTÓN PRUEBA: Abriendo ventana media en posición fija')
                        const talpa = workExperiences.find(w => w.id === 'talpa')
                        if (talpa && talpa.media) {
                          setOpenMediaViewers([{ work: talpa, media: talpa.media }])
                        }
                      }}
                      style={{
                        padding: '8px 16px',
                        background: '#FF6600',
                        color: 'white',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px',
                        border: '2px solid black'
                      }}
                    >
                      📷 PRUEBA MEDIA
                    </button>
                  </div>

               
                 
                  {workExperiences.map((work) => {
                    const isDragging = draggedFile === work.id
                    return (
                      <motion.div
                        key={work.id}
                        drag
                        dragMomentum={false}
                        dragElastic={0}
                        dragConstraints={contentRef}
                        onMouseDown={(e) => {
                          // Guardar posición inicial para detectar si es click o drag
                          dragStartPosRef.current[work.id] = {
                            x: e.clientX,
                            y: e.clientY
                          }
                          hasDraggedRef.current[work.id] = false
                        }}
                        onMouseUp={(e) => {
                          const startPos = dragStartPosRef.current[work.id]
                          if (startPos) {
                            const moved = Math.abs(e.clientX - startPos.x) > 5 || Math.abs(e.clientY - startPos.y) > 5
                            if (!moved) {
                              handleOpenNote(work)
                            }
                          }
                        }}
                        onDragStart={() => {
                          setDraggedFile(work.id)
                          setIsDraggingFile(true)
                          hasDraggedRef.current[work.id] = true
                        }}
                        onDragEnd={(event, info) => {
                          const hasActuallyDragged = Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5
                          
                          // Solo actualizar posición si realmente se movió
                          if (hasActuallyDragged) {
                            hasDraggedRef.current[work.id] = true
                            setFilePositions(prev => ({
                              ...prev,
                              [work.id]: {
                                x: (filePositions[work.id]?.x || 0) + info.offset.x,
                                y: (filePositions[work.id]?.y || 0) + info.offset.y
                              }
                            }))
                          }
                          
                          // Limpiar estados
                          setDraggedFile(null)
                          setIsDraggingFile(false)
                          hasDraggedRef.current[work.id] = false
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation()
                          handleOpenNote(work)
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute"
                        style={{
                          left: filePositions[work.id]?.x || 0,
                          top: filePositions[work.id]?.y || 0,
                          zIndex: isDragging ? 50 : 10,
                          cursor: isDragging ? 'grabbing' : 'pointer'
                        }}
                      >
                        <div className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors group">
                          {/* Icono sin recuadro */}
                          <img 
                            src={work.icon} 
                            alt={work.company}
                            className="w-16 h-16 object-contain pointer-events-none"
                            draggable={false}
                            onError={(e) => {
                              // Fallback to document icon if image fails to load
                              (e.target as HTMLImageElement).src = '/document.png'
                            }}
                          />

                          {/* Nombre del archivo con saltos de línea y mejor ancho */}
                          <div className="w-24 flex items-center justify-center">
                            <span className="text-[10px] text-gray-700 dark:text-gray-300 text-center group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors select-none pointer-events-none break-words leading-tight">
                              {work.company}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Resize handles */}
                <div 
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'se')}
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize"
                  onMouseDown={(e) => handleMouseDown(e, 's')}
                />
                <div 
                  className="absolute top-0 bottom-0 right-0 w-1 cursor-ew-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'e')}
                />
                <div 
                  className="absolute top-0 bottom-0 left-0 w-1 cursor-ew-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'w')}
                />
                <div 
                  className="absolute top-0 left-0 right-0 h-1 cursor-ns-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'n')}
                />
                <div 
                  className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'nw')}
                />
                <div 
                  className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'ne')}
                />
                <div 
                  className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
                  onMouseDown={(e) => handleMouseDown(e, 'sw')}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Work Notes - aparecen encima de la ventana de archivos */}
      <AnimatePresence>
        {openNotes.map((work, index) => (
          <WorkNote
            key={work.id}
            work={work}
            onClose={() => handleCloseNote(work.id)}
            onOpenWebsite={() => {
              if (work.website && !openWebsites.find(w => w.work.id === work.id)) {
                const websiteUrl = work.website
                setOpenWebsites(prev => [...prev, { work, url: websiteUrl }])
              }
            }}
            onOpenMedia={() => {
              handleOpenMedia(work)
            }}
            initialPosition={{
              x: 100 + index * 40,
              y: 100 + index * 40
            }}
          />
        ))}
      </AnimatePresence>


      
      {/* DEBUG PANEL - indicador visual del estado */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999999,
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        border: '2px solid #00FF00',
        maxWidth: '300px'
      }}>
        <div style={{ fontWeight: 'bold', color: '#00FF00', marginBottom: '8px' }}>
          🔍 DEBUG PANEL
        </div>
        <div>Ventanas Web: {openWebsites.length}</div>
        {openWebsites.map((w, i) => (
          <div key={i} style={{ fontSize: '10px', color: '#FFFF00', marginLeft: '10px' }}>
            → {w.work.company}
          </div>
        ))}
        <div>Ventanas Media: {openMediaViewers.length}</div>
        {openMediaViewers.map((m, i) => (
          <div key={i} style={{ fontSize: '10px', color: '#FF6600', marginLeft: '10px' }}>
            → {m.work.company} ({m.media.length} items)
          </div>
        ))}
        <div>Notas: {openNotes.length}</div>
        <div style={{ marginTop: '8px', fontSize: '10px', color: '#CCCCCC' }}>
          Usa los botones de prueba verdes
        </div>
      </div>

      {/* Website Windows - ventanas con sitios web embebidos */}
      {openWebsites.map(({ work, url }, index) => (
          <WebsiteWindow
            key={`website-${work.id}`}
            url={url}
            title={`${work.company} - Sitio Web`}
            onClose={() => handleCloseWebsite(work.id)}
            initialPosition={{
              x: 100 + index * 30,
              y: 50 + index * 30
            }}
          />
      ))}

      {/* Media Viewers - ventanas con fotos/videos */}
      {openMediaViewers.map(({ work, media }, index) => (
        <MediaViewer
          key={`media-${work.id}`}
          media={media}
          title={`${work.company} - Medios`}
          onClose={() => handleCloseMedia(work.id)}
          initialPosition={{
            x: 150 + index * 40,
            y: 100 + index * 40
          }}
        />
      ))}
    </>
  )
}
