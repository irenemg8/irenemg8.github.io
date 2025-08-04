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

  // Fixed folder positions - top left arrangement
  const getFolderPositions = () => {
    return {
      projects: [
        { x: 80, y: 120 },   // Project 02 (Simplingo)
        { x: 180, y: 120 },  // Project 01 (AbsolutMess) 
        { x: 280, y: 120 },  // Project 04 (Amazon)
        { x: 380, y: 120 },  // Project 03 (Leafpress)
        { x: 480, y: 120 }   // Don't Look
      ],
      aboutMe: { x: 80, y: 220 },     // About Me - second row
      resume: { x: 180, y: 220 }      // Resume.pdf - second row
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
          
          {/* Central Welcome Text - Always centered */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
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
      
      {/* Trash Can */}
      <TrashCan isActive={isTrashActive} />
      
      {/* Reset Button */}
      <DesktopResetButton onReset={resetFolderPositions} />
    </>
  )
}