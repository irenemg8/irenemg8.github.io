"use client"

import { MacOSWindow } from '@/components/layout/macos-window'
import { MacOSCursor } from '@/components/ui/macos-cursor'

import { StickyNote } from '@/components/desktop/sticky-note'
import { TrashCan } from '@/components/desktop/trash-can'
import { CentralWelcome } from '@/components/desktop/central-welcome'
import { MacOSFolder } from '@/components/desktop/macos-folder'
import { FolderWindow } from '@/components/desktop/folder-window'
import { DesktopResetButton } from '@/components/desktop/desktop-reset-button'
import { useState, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface OpenWindow {
  id: string
  title: string
  content: React.ReactNode
}

export function ResponsiveDesktop() {
  const { t } = useLanguage()
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([])
  const [resetKey, setResetKey] = useState(0)
  const [showStickyNote, setShowStickyNote] = useState(true)
  const [isTrashActive, setIsTrashActive] = useState(false)

  const openWindow = (id: string, title: string, content: React.ReactNode) => {
    if (!openWindows.find(w => w.id === id)) {
      setOpenWindows(prev => [...prev, { id, title, content }])
    }
  }

  const closeWindow = (id: string) => {
    setOpenWindows(prev => prev.filter(w => w.id !== id))
  }

  const resetFolderPositions = () => {
    setResetKey(prev => prev + 1)
  }

  const handleStickyNoteDelete = () => {
    setShowStickyNote(false)
  }

  const handleDragToTrash = (position: { x: number; y: number }) => {
    setIsTrashActive(true)
    setTimeout(() => {
      setShowStickyNote(false)
      setIsTrashActive(false)
    }, 300)
  }

  // Fixed folder positions - centered towards right, two rows, right to left arrangement
  const getFolderPositions = () => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth
      const folderWidth = 100 // Approximate folder width including spacing
      const centerX = windowWidth / 2 // Center of screen
      const rightOffset = 280 // Offset towards right from center (increased from 200)
      const startX = centerX + rightOffset // Start position (center + right offset)
      
      return {
        projects: [
          // Primera fila (4 elementos de derecha a izquierda) - moved up from y: 80 to y: 60
          { x: startX, y: 60 },                           // Project 02 (Simplingo) - más a la derecha
          { x: startX - folderWidth, y: 60 },             // Project 01 (AbsolutMess)
          { x: startX - (folderWidth * 2), y: 60 },       // Project 03 (Leafpress)  
          { x: startX - (folderWidth * 3), y: 60 },       // Project 04 (Amazon)
          // Segunda fila (1 elemento restante) - moved up from y: 180 to y: 150
          { x: startX, y: 150 }                           // Don't Look - más a la derecha en segunda fila
        ],
        // Segunda fila (2 elementos más de derecha a izquierda) - moved up from y: 180 to y: 150
        aboutMe: { x: startX - folderWidth, y: 150 },     // About Me 
        resume: { x: startX - (folderWidth * 2), y: 150 }, // Resume.pdf
        // Posición de la papelera - abajo a la izquierda del área de carpetas - moved up from y: 280 to y: 240
        trash: { x: startX - (folderWidth * 4), y: 240 }
      }
    }
    
    // Fallback positions for SSR - centered towards right
    const fallbackCenterX = 640 // Approximate center for 1280px width
    const rightOffset = 280 // Increased from 200 to match above
    const fallbackStartX = fallbackCenterX + rightOffset
    const folderWidth = 100
    
    return {
      projects: [
        // Primera fila (4 elementos de derecha a izquierda) - moved up from y: 80 to y: 60
        { x: fallbackStartX, y: 60 },                      // Project 02 (Simplingo)
        { x: fallbackStartX - folderWidth, y: 60 },        // Project 01 (AbsolutMess)
        { x: fallbackStartX - (folderWidth * 2), y: 60 },  // Project 03 (Leafpress)
        { x: fallbackStartX - (folderWidth * 3), y: 60 },  // Project 04 (Amazon)
        // Segunda fila (1 elemento restante) - moved up from y: 180 to y: 150
        { x: fallbackStartX, y: 150 }                      // Don't Look
      ],
      // Segunda fila (2 elementos más de derecha a izquierda) - moved up from y: 180 to y: 150
      aboutMe: { x: fallbackStartX - folderWidth, y: 150 },     // About Me
      resume: { x: fallbackStartX - (folderWidth * 2), y: 150 }, // Resume.pdf
      // Posición de la papelera - abajo a la izquierda del área de carpetas - moved up from y: 280 to y: 240
      trash: { x: fallbackStartX - (folderWidth * 4), y: 240 }
    }
  }

  const positions = getFolderPositions()

  const projects = [
    { id: 'project-02', name: 'Project 02 (Simplingo)', icon: '📁', color: 'bg-blue-400' },
    { id: 'project-01', name: 'Project 01 (AbsolutMess)', icon: '📁', color: 'bg-blue-400' },
    { id: 'project-03', name: 'Project 03 (Leafpress)', icon: '📁', color: 'bg-blue-400' },
    { id: 'project-04', name: 'Project 04 (Amazon)', icon: '📁', color: 'bg-blue-400' },
    { id: 'dont-look', name: "Don't Look", icon: '⚫', color: 'bg-gray-400' }
  ]

  const projectContent = (projectName: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold macos-text-semibold">{projectName}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 aspect-video flex items-center justify-center">
          <span className="text-4xl">🖼️</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 aspect-video flex items-center justify-center">
          <span className="text-4xl">📊</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 macos-text">
        Descripción del proyecto y detalles técnicos...
      </p>
    </div>
  )

  const aboutContent = (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold macos-text-semibold">Sobre Mí</h3>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-2xl">
          👋
        </div>
        <div>
          <h4 className="font-semibold macos-text-semibold">Irene MG</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 macos-text">UX/UI Designer & Frontend Developer</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 macos-text leading-relaxed">
        Soy una diseñadora UX/UI y desarrolladora frontend apasionada por crear experiencias digitales que no solo funcionen perfectamente, sino que también emocionen e inspiren.
      </p>
    </div>
  )

  return (
    <>
      <MacOSCursor />
      <MacOSWindow>
        <div className="relative min-h-full overflow-hidden">
          {/* Sticky Note */}
          {showStickyNote && (
            <StickyNote 
              onDelete={handleStickyNoteDelete}
              onDragToTrash={handleDragToTrash}
            />
          )}
          
          {/* Central Welcome Text - Always centered, behind everything */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <CentralWelcome />
          </div>
          
          {/* macOS Style Folders */}
          {projects.map((project, index) => (
            <MacOSFolder
              key={`${project.id}-${resetKey}`}
              id={project.id}
              name={project.name}
              initialPosition={positions.projects[index]}
              onOpen={() => openWindow(project.id, project.name, projectContent(project.name))}
              size="md"
              type="folder"
            />
          ))}
          
          {/* About Me Folder */}
          <MacOSFolder
            key={`about-me-${resetKey}`}
            id="about-me"
            name="About Me"
            initialPosition={positions.aboutMe}
            onOpen={() => openWindow('about-me', 'About Me', aboutContent)}
            size="md"
            type="folder"
          />
          
          {/* Resume File */}
          <MacOSFolder
            key={`resume-${resetKey}`}
            id="resume"
            name="Resume.pdf"
            initialPosition={positions.resume}
            onOpen={() => window.open('/irene-medina-garcia-cv.pdf', '_blank')}
            type="file"
            fileType="pdf"
            size="md"
          />

          {/* Trash Can - inside desktop */}
          <TrashCan 
            isActive={isTrashActive} 
            position={positions.trash}
          />

        </div>
      </MacOSWindow>
      
      {/* Folder Windows */}
      {openWindows.map((window, index) => (
        <FolderWindow
          key={window.id}
          isOpen={true}
          onClose={() => closeWindow(window.id)}
          title={window.title}
          initialPosition={{ x: 120 + index * 30, y: 120 + index * 30 }}
        >
          {window.content}
        </FolderWindow>
      ))}
      
      {/* Reset Button */}
      <DesktopResetButton onReset={resetFolderPositions} />
    </>
  )
}