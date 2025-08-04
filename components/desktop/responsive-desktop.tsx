"use client"

import { MacOSWindow } from '@/components/layout/macos-window'
import { MacOSCursor } from '@/components/ui/macos-cursor'

import { StickyNote } from '@/components/desktop/sticky-note'
import { TrashCan } from '@/components/desktop/trash-can'
import { CentralWelcome } from '@/components/desktop/central-welcome'
import { MacOSFolder } from '@/components/desktop/macos-folder'
import { FolderWindow } from '@/components/desktop/folder-window'

import { useState, useRef, useEffect } from 'react'
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
  
  // State for positions to avoid hydration mismatch
  const [positions, setPositions] = useState(() => {
    // Static initial positions that are the same on server and client
    return {
      projects: [
        { x: 840, y: 60 },   // Project 02 (Simplingo)
        { x: 740, y: 60 },   // Project 01 (AbsolutMess)
        { x: 640, y: 60 },   // Project 03 (Leafpress)
        { x: 540, y: 60 },   // Project 04 (Amazon)
        { x: 840, y: 150 }   // Don't Look
      ],
      aboutMe: { x: 740, y: 150 },
      resume: { x: 640, y: 150 },
      trash: { x: 440, y: 240 }
    }
  })

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

  // Update positions after hydration to avoid SSR/client mismatch
  useEffect(() => {
    const updatePositions = () => {
      if (typeof window !== 'undefined') {
        const calculatedPositions = getFolderPositions()
        setPositions(calculatedPositions)
      }
    }

    updatePositions()
    
    // Update positions on window resize
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [resetKey]) // Also update when resetKey changes

  // Fixed folder positions - centered towards right, two rows, right to left arrangement
  const getFolderPositions = () => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth
      const folderWidth = 100 // Approximate folder width including spacing
      const minMargin = 50 // Minimum margin from edges
      const maxMargin = 120 // Maximum margin from right edge
      
      // Calculate constraints for small screens
      const centerX = windowWidth / 2
      const rightOffset = Math.min(280, windowWidth * 0.25) // Responsive right offset
      let startX = Math.min(centerX + rightOffset, windowWidth - maxMargin)
      
      // Ensure all folders fit within screen bounds
      const totalFoldersWidth = folderWidth * 4 // 4 folders in first row
      const minStartX = totalFoldersWidth + minMargin
      startX = Math.max(startX, minStartX)
      
      // For very small screens, reorganize in single column
      if (windowWidth < 800) {
        return {
          projects: [
            // Single column layout for small screens
            { x: windowWidth - 150, y: 60 },   // Project 02 (Simplingo)
            { x: windowWidth - 150, y: 140 },  // Project 01 (AbsolutMess)
            { x: windowWidth - 150, y: 220 },  // Project 03 (Leafpress)
            { x: windowWidth - 150, y: 300 },  // Project 04 (Amazon)
            { x: windowWidth - 150, y: 380 }   // Don't Look
          ],
          aboutMe: { x: windowWidth - 270, y: 60 },   // About Me (left column)
          resume: { x: windowWidth - 270, y: 140 },   // Resume.pdf (left column)
          trash: { x: windowWidth - 270, y: 220 }     // Trash (left column)
        }
      }
      
      return {
        projects: [
          // Primera fila (4 elementos de derecha a izquierda) - with constraints
          { x: Math.min(startX, windowWidth - maxMargin), y: 60 },                           
          { x: Math.min(startX - folderWidth, windowWidth - maxMargin), y: 60 },             
          { x: Math.min(startX - (folderWidth * 2), windowWidth - maxMargin), y: 60 },       
          { x: Math.max(startX - (folderWidth * 3), minMargin), y: 60 },       
          // Segunda fila (1 elemento restante)
          { x: Math.min(startX, windowWidth - maxMargin), y: 150 }                           
        ],
        // Segunda fila (2 elementos más de derecha a izquierda) - with constraints
        aboutMe: { x: Math.min(startX - folderWidth, windowWidth - maxMargin), y: 150 },     
        resume: { x: Math.max(startX - (folderWidth * 2), minMargin), y: 150 }, 
        // Posición de la papelera - with constraints
        trash: { x: Math.max(startX - (folderWidth * 4), minMargin), y: 240 }
      }
    }
    
    // Fallback positions for SSR - centered towards right with constraints
    const fallbackWidth = 1280 // Assumed width for SSR
    const fallbackCenterX = fallbackWidth / 2
    const rightOffset = Math.min(280, fallbackWidth * 0.25)
    const minMargin = 50
    const maxMargin = 120
    const folderWidth = 100
    let fallbackStartX = Math.min(fallbackCenterX + rightOffset, fallbackWidth - maxMargin)
    
    // Ensure all folders fit within bounds
    const totalFoldersWidth = folderWidth * 4
    const minStartX = totalFoldersWidth + minMargin
    fallbackStartX = Math.max(fallbackStartX, minStartX)
    
    return {
      projects: [
        // Primera fila (4 elementos de derecha a izquierda) - with constraints
        { x: Math.min(fallbackStartX, fallbackWidth - maxMargin), y: 60 },                      
        { x: Math.min(fallbackStartX - folderWidth, fallbackWidth - maxMargin), y: 60 },        
        { x: Math.min(fallbackStartX - (folderWidth * 2), fallbackWidth - maxMargin), y: 60 },  
        { x: Math.max(fallbackStartX - (folderWidth * 3), minMargin), y: 60 },  
        // Segunda fila (1 elemento restante) - with constraints
        { x: Math.min(fallbackStartX, fallbackWidth - maxMargin), y: 150 }                      
      ],
      // Segunda fila (2 elementos más de derecha a izquierda) - with constraints
      aboutMe: { x: Math.min(fallbackStartX - folderWidth, fallbackWidth - maxMargin), y: 150 },     
      resume: { x: Math.max(fallbackStartX - (folderWidth * 2), minMargin), y: 150 }, 
      // Posición de la papelera - with constraints
      trash: { x: Math.max(fallbackStartX - (folderWidth * 4), minMargin), y: 240 }
    }
  }

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
      <MacOSWindow onReset={resetFolderPositions}>
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
    </>
  )
}