"use client"

import { MacOSWindow } from '@/components/layout/macos-window'
import { MacOSCursor } from '@/components/ui/macos-cursor'
import { MacOSDock } from '@/components/ui/macos-dock'
import { TodoList } from '@/components/desktop/todo-list'
import { CentralWelcome } from '@/components/desktop/central-welcome'
import { EnhancedFolder } from '@/components/desktop/enhanced-folder'
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

  // Fixed folder positions - always the same initial layout
  const getFolderPositions = () => {
    return {
      projects: [
        { x: 650, y: 80 },   // Project 02 (Simplingo)
        { x: 650, y: 160 },  // Project 01 (AbsolutMess) 
        { x: 650, y: 240 },  // Project 03 (Leafpress)
        { x: 650, y: 320 },  // Project 04 (Amazon)
        { x: 750, y: 80 }    // Don't Look
      ],
      aboutMe: { x: 80, y: 400 },    // About Me - bottom left
      resume: { x: 180, y: 400 }     // Resume.pdf - bottom left area
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
          {/* Todo List - Responsive positioning */}
          <div className="hidden md:block">
            <TodoList />
          </div>
          
          {/* Central Welcome Text - Always centered */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <CentralWelcome />
          </div>
          
          {/* Enhanced Draggable Folders */}
          {projects.map((project, index) => (
            <EnhancedFolder
              key={`${project.id}-${resetKey}`}
              id={project.id}
              name={project.name}
              icon={project.icon}
              color={project.color}
              initialPosition={positions.projects[index]}
              onOpen={() => openWindow(project.id, project.name, projectContent(project.name))}
              size="md"
              type="folder"
            />
          ))}
          
          {/* About Me Folder */}
          <EnhancedFolder
            key={`about-me-${resetKey}`}
            id="about-me"
            name="About Me"
            icon="📁"
            color="bg-blue-400"
            initialPosition={positions.aboutMe}
            onOpen={() => openWindow('about-me', 'About Me', aboutContent)}
            size="md"
            type="folder"
          />
          
          {/* Resume File */}
          <EnhancedFolder
            key={`resume-${resetKey}`}
            id="resume"
            name="Resume.pdf"
            initialPosition={positions.resume}
            onOpen={() => window.open('/irene-medina-garcia-cv.pdf', '_blank')}
            type="file"
            fileType="pdf"
            size="md"
          />

          {/* Mobile Todo List */}
          <div className="md:hidden absolute top-4 left-4 right-4">
            <div className="macos-glass rounded-lg p-3 shadow-lg border border-white/20 backdrop-blur-xl">
              <h3 className="macos-text-semibold text-gray-800 dark:text-gray-200 text-sm mb-2">
                {t('about.todo')}
              </h3>
              <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                {(() => {
                  const todoItems = t('about.todo.items');
                  if (Array.isArray(todoItems)) {
                    return todoItems.slice(0, 4).map((item, index) => (
                      <div key={index} className="text-gray-700 dark:text-gray-300">
                        {item}
                      </div>
                    ));
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
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
      
      <MacOSDock />
      
      {/* Reset Button */}
      <DesktopResetButton onReset={resetFolderPositions} />
    </>
  )
}