"use client"

import { useState } from 'react'
import { MacOSWindow } from '@/components/layout/macos-window'
import { MacOSCursor } from '@/components/ui/macos-cursor'
import { MacOSDock } from '@/components/ui/macos-dock'
import { TodoList } from '@/components/desktop/todo-list'
import { CentralWelcome } from '@/components/desktop/central-welcome'
import { ProjectFolders } from '@/components/desktop/project-folders'
import { AboutFolder } from '@/components/desktop/about-folder'
import { FaceTimeWindow } from '@/components/desktop/facetime-window'

export function MacOSDesktop() {
  const [showFaceTime, setShowFaceTime] = useState(false)

  return (
    <>
      <MacOSCursor />
      <MacOSWindow>
        <div className="relative min-h-full">
          {/* Todo List - Top Left */}
          <TodoList />
          
          {/* Central Welcome Text */}
          <CentralWelcome />
          
          {/* Project Folders - Top Right */}
          <ProjectFolders />
          
          {/* About Folder - Bottom Left */}
          <AboutFolder />
        </div>
      </MacOSWindow>
      <MacOSDock onShowFaceTime={() => setShowFaceTime(true)} />
      
      {/* FaceTime Window */}
      {showFaceTime && (
        <FaceTimeWindow onClose={() => setShowFaceTime(false)} />
      )}
    </>
  )
}