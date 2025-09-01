"use client"

import { MacOSWindow } from '@/components/layout/macos-window'
import { MacOSCursor } from '@/components/ui/macos-cursor'
import { MacOSDock } from '@/components/ui/macos-dock'

import { StickyNote } from '@/components/desktop/sticky-note'

import { CentralWelcome } from '@/components/desktop/central-welcome'
import { MacOSFolder } from '@/components/desktop/macos-folder'
import { FolderWindow } from '@/components/desktop/folder-window'
import { WorldGlobe } from '@/components/shared/world-globe'
import { PressLibraryModal } from '@/components/shared/press-library-modal'
import { ArtworksGallery } from '@/components/shared/artworks-gallery'
import { GitHubSafariBrowser } from '@/components/shared/github-safari-browser'
import { WorkFolderWindow } from '@/components/desktop/work-folder-window'
import { FaceTimeWindow } from '@/components/desktop/facetime-window'
import { GEFolderWindow } from '@/components/desktop/ge-folder-window'
import { HackathonsFolderWindow } from '@/components/desktop/hackathons-folder-window'
import { MessagesWindow } from '@/components/desktop/messages-window'
import { PolaroidPhotos } from '@/components/desktop/polaroid-photos'
import { PhotosGalleryWindow } from '@/components/desktop/photos-gallery-window'
import { CodeEditorWindow } from '@/components/desktop/code-editor-window'
import { LaunchpadWindow } from '@/components/desktop/launchpad-window'
import { TerminalWindow } from '@/components/desktop/terminal-window'
import { CalculatorWindow } from '@/components/desktop/calculator-window'
import { AppStoreWindow } from '@/components/desktop/appstore-window'
import { SpotifyWindow } from '@/components/desktop/spotify-window'
import { SpotifyMiniPlayer } from '@/components/desktop/spotify-mini-player'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { AnimatePresence } from 'framer-motion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [stickyNoteKey, setStickyNoteKey] = useState(0) // Para resetear posición
  const [showGitHubBrowser, setShowGitHubBrowser] = useState(false)
  const [showWorkFolder, setShowWorkFolder] = useState(false)
  const [showFaceTime, setShowFaceTime] = useState(false)
  const [showGEFolder, setShowGEFolder] = useState(false)
  const [showHackathonsFolder, setShowHackathonsFolder] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showPolaroidPhotos, setShowPolaroidPhotos] = useState(false)
  const [showPhotosGallery, setShowPhotosGallery] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [showLaunchpad, setShowLaunchpad] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showAppStore, setShowAppStore] = useState(false)
  const [showSpotify, setShowSpotify] = useState(false)
  const [showConstructionAlert, setShowConstructionAlert] = useState(true)

  const [isMounted, setIsMounted] = useState(false)
  
  // State for positions to avoid hydration mismatch
  const [positions, setPositions] = useState(() => {
    // Static initial positions that are the same on server and client
    return {
      projects: [
        { x: 840, y: 60 },   // Projects
        { x: 740, y: 60 },   // Work experience
        { x: 640, y: 60 },   // Artworks
        { x: 840, y: 150 },  // GE
        { x: 740, y: 150 },  // Hackathons and Contests
        { x: 640, y: 150 }   // Press
      ],
      worldGlobe: { x: 540, y: 60 },
      aboutMe: { x: 540, y: 150 },
      resume: { x: 440, y: 150 }
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

  // This function is no longer needed as reorganization is completely automatic
  // const resetFolderPositions = () => {
  //   setResetKey(prev => prev + 1)
  // }

  const handleStickyNoteDelete = () => {
    setShowStickyNote(false)
  }

  const handleDragToTrash = (position: { x: number; y: number }) => {
    setTimeout(() => {
      setShowStickyNote(false)
    }, 300)
  }

  const showStickyNoteFromDock = () => {
    // Only show sticky note on large screens (when dock is fully visible)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setShowStickyNote(true)
      setStickyNoteKey(prev => prev + 1) // Forzar reset de posición
    }
  }

  // Calculate safe position for sticky note avoiding folder collisions
  const getSafePositionForStickyNote = () => {
    if (typeof window === 'undefined' || !isMounted) return { x: 60, y: 40 }
    
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const stickyWidth = 250 // Sticky note width
    const stickyHeight = 200 // Sticky note height
    const margin = 20
    
    // Get all folder positions
    const allPositions = [
      ...positions.projects,
      positions.worldGlobe,
      positions.aboutMe,
      positions.resume
    ]
    
    // Try different positions starting from top-left
    const possiblePositions = [
      { x: margin, y: margin }, // Top-left
      { x: margin, y: windowHeight / 2 - stickyHeight / 2 }, // Left center
      { x: margin, y: windowHeight - stickyHeight - 100 }, // Bottom-left (above dock)
      { x: windowWidth / 2 - stickyWidth / 2, y: margin }, // Top center
      { x: windowWidth - stickyWidth - margin, y: margin }, // Top-right
      { x: windowWidth - stickyWidth - margin, y: windowHeight / 2 - stickyHeight / 2 }, // Right center
    ]
    
    // Check each position for collisions
    for (const pos of possiblePositions) {
      let hasCollision = false
      
      for (const folderPos of allPositions) {
        const folderWidth = 100
        const folderHeight = 90
        
        // Check if sticky note overlaps with folder
        if (!(pos.x > folderPos.x + folderWidth || 
              pos.x + stickyWidth < folderPos.x ||
              pos.y > folderPos.y + folderHeight ||
              pos.y + stickyHeight < folderPos.y)) {
          hasCollision = true
          break
        }
      }
      
      if (!hasCollision) {
        return pos
      }
    }
    
    // If no safe position found, use default but ensure it's within bounds
    return { 
      x: Math.min(Math.max(margin, 60), windowWidth - stickyWidth - margin), 
      y: Math.min(Math.max(margin, 40), windowHeight - stickyHeight - 100) 
    }
  }

  // Update positions after hydration to avoid SSR/client mismatch
  useEffect(() => {
    setIsMounted(true) // Mark component as mounted on client
    
    const updatePositions = () => {
      if (typeof window !== 'undefined') {
        const calculatedPositions = getFolderPositions()
        setPositions(calculatedPositions)
        // Update sticky note visibility based on screen size
        const shouldShow = window.innerWidth >= 1024
        setShowStickyNote(shouldShow) // Only show on large screens (when dock is fully visible)
      }
    }

    updatePositions()
    
    // Auto-reset and reposition on window resize - completely automatic
    const handleResize = () => {
      // Immediate position update
      updatePositions()
      // Force reset of all components for immediate reorganization
      setResetKey(prev => prev + 1)
      setStickyNoteKey(prev => prev + 1) // Also reset sticky note position
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Remove resetKey dependency to avoid loops

  // Responsive folder positioning based on screen size
  const getFolderPositions = () => {
    if (typeof window !== 'undefined') {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const folderWidth = 100 // Approximate folder width including spacing
      const folderHeight = 90 // Approximate folder height including spacing
      const margin = 50 // Base margin
      
      // Large screens (1024px and up): Right side positioning (current behavior)
      if (windowWidth >= 1024) {
        const centerX = windowWidth / 2
        const rightOffset = Math.min(280, windowWidth * 0.25)
        const startX = Math.min(centerX + rightOffset, windowWidth - 120)
        const minStartX = folderWidth * 4 + margin
        const finalStartX = Math.max(startX, minStartX)
        
        return {
          projects: [
            { x: Math.min(finalStartX, windowWidth - 120), y: 60 },
            { x: Math.min(finalStartX - folderWidth, windowWidth - 120), y: 60 },
            { x: Math.min(finalStartX - (folderWidth * 2), windowWidth - 120), y: 60 },
            { x: Math.min(finalStartX, windowWidth - 120), y: 150 },
            { x: Math.min(finalStartX - folderWidth, windowWidth - 120), y: 150 },
            { x: Math.min(finalStartX - (folderWidth * 2), windowWidth - 120), y: 150 }
          ],
          worldGlobe: { x: Math.max(finalStartX - (folderWidth * 3), margin), y: 60 },
          aboutMe: { x: Math.max(finalStartX - (folderWidth * 3), margin), y: 150 },
          resume: { x: Math.max(finalStartX - (folderWidth * 4), margin), y: 150 }
        }
      }
      
             // Medium screens (500px-1023px): Center, 2 equal rows
       if (windowWidth >= 500 && windowWidth < 1024) {
         const centerX = windowWidth / 2
         const centerY = windowHeight / 2
         const totalWidth = folderWidth * 3 // 3 folders per row
         const startX = centerX - (totalWidth / 2)
         const rowHeight = folderHeight
         const heightOffset = 80 // Subir las carpetas un poco más
         const firstRowY = centerY - rowHeight - heightOffset
         const secondRowY = centerY - 20 // Small gap above center
         
         return {
           projects: [
             // First row - 3 folders centered
             { x: startX, y: firstRowY },
             { x: startX + folderWidth, y: firstRowY },
             { x: startX + (folderWidth * 2), y: firstRowY },
             // Second row - 3 folders centered  
             { x: startX, y: secondRowY },
             { x: startX + folderWidth, y: secondRowY },
             { x: startX + (folderWidth * 2), y: secondRowY }
           ],
           // Additional folders positioned below the main grid, centered
           worldGlobe: { x: centerX - folderWidth, y: secondRowY + rowHeight + 20 },
           aboutMe: { x: centerX - (folderWidth / 2), y: secondRowY + rowHeight + 20 },
           resume: { x: centerX, y: secondRowY + rowHeight + 20 }
         }
       }
      
             // Small screens (less than 500px): 3x3 grid centered
       const centerX = windowWidth / 2
       const totalWidth = folderWidth * 3
       const startX = centerX - (totalWidth / 2) // Perfect horizontal centering
       
       // 🎯 CONFIGURA AQUÍ LA ALTURA: Posición directa desde arriba
       const topMargin = 120 // Píxeles desde la parte superior (menor número = más arriba)
       const startY = topMargin
      
      return {
        projects: [
          // Row 1
          { x: startX, y: startY },
          { x: startX + folderWidth, y: startY },
          { x: startX + (folderWidth * 2), y: startY },
          // Row 2
          { x: startX, y: startY + folderHeight },
          { x: startX + folderWidth, y: startY + folderHeight },
          { x: startX + (folderWidth * 2), y: startY + folderHeight }
        ],
        // Row 3 - remaining folders
        worldGlobe: { x: startX, y: startY + (folderHeight * 2) },
        aboutMe: { x: startX + folderWidth, y: startY + (folderHeight * 2) },
        resume: { x: startX + (folderWidth * 2), y: startY + (folderHeight * 2) }
      }
    }
    
    // Fallback positions for SSR (large screen layout)
    const fallbackWidth = 1280
    const fallbackCenterX = fallbackWidth / 2
    const rightOffset = 280
    const fallbackStartX = fallbackCenterX + rightOffset - 120
    
    return {
      projects: [
        { x: fallbackStartX, y: 60 },
        { x: fallbackStartX - 100, y: 60 },
        { x: fallbackStartX - 200, y: 60 },
        { x: fallbackStartX, y: 150 },
        { x: fallbackStartX - 100, y: 150 },
        { x: fallbackStartX - 200, y: 150 }
      ],
      worldGlobe: { x: fallbackStartX - 300, y: 60 },
      aboutMe: { x: fallbackStartX - 300, y: 150 },
      resume: { x: fallbackStartX - 400, y: 150 }
    }
  }

  const projects = [
    { id: 'projects', name: 'Projects', icon: '📁', color: 'bg-blue-400' },
    { id: 'work-experience', name: 'Work experience', icon: '📁', color: 'bg-green-400' },
    { id: 'artworks', name: 'Artworks', icon: '📁', color: 'bg-purple-400' },
    { id: 'ge', name: 'GE', icon: '📁', color: 'bg-red-400' },
    { id: 'hackathons', name: 'Hackathons and Contests', icon: '📁', color: 'bg-yellow-400' },
    { id: 'press', name: 'Press', icon: '📁', color: 'bg-indigo-400' }
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
      {/* Alerta de construcción */}
      <AlertDialog open={showConstructionAlert} onOpenChange={setShowConstructionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🚧 Sitio Web en Construcción</AlertDialogTitle>
            <AlertDialogDescription>
              Esta página web sigue en construcción. Perdón por las molestias.
              <br />
              <br />
              Estoy trabajando para ofrecerte la mejor experiencia posible. ¡Gracias por tu paciencia!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowConstructionAlert(false)}>
              Continuar explorando
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MacOSCursor />
      <MacOSWindow>
        <div className="relative h-full overflow-hidden">
          {/* Sticky Note - Only on large screens */}
          {isMounted && showStickyNote && (
            <StickyNote 
              key={stickyNoteKey} // Resetear posición cuando cambie el key
              onDelete={handleStickyNoteDelete}
              onDragToTrash={handleDragToTrash}
              initialPosition={getSafePositionForStickyNote()}
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
              onOpen={() => {
                if (project.id === 'press') {
                  // Trigger the press library modal directly
                  const button = document.querySelector('[data-press-library-trigger]') as HTMLButtonElement;
                  if (button) button.click();
                } else if (project.id === 'artworks') {
                  // Trigger the artworks modal directly
                  const button = document.querySelector('[data-artworks-trigger]') as HTMLButtonElement;
                  if (button) button.click();
                } else if (project.id === 'work-experience') {
                  // Show work folder window
                  setShowWorkFolder(true);
                } else if (project.id === 'ge') {
                  // Show GE folder window
                  setShowGEFolder(true);
                } else if (project.id === 'hackathons') {
                  // Show Hackathons folder window
                  setShowHackathonsFolder(true);
                } else {
                  openWindow(project.id, project.name, projectContent(project.name))
                }
              }}
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

          {/* World Globe */}
          <MacOSFolder
            key={`world-globe-${resetKey}`}
            id="world-globe"
            name="World Map"
            initialPosition={positions.worldGlobe}
            onOpen={() => {
              // Trigger the dialog directly
              const button = document.querySelector('[data-world-globe-trigger]') as HTMLButtonElement;
              if (button) button.click();
            }}
            size="md"
            type="file"
            fileType="world"
          />

          {/* macOS Dock */}
          <MacOSDock 
            onShowStickyNote={showStickyNoteFromDock}
            onShowFaceTime={() => setShowFaceTime(true)}
            onShowMessages={() => setShowMessages(true)}
            onShowPhotos={() => setShowPhotosGallery(true)}
            onShowCodeEditor={() => setShowCodeEditor(true)}
            onShowLaunchpad={() => setShowLaunchpad(true)}
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
      
      {/* Hidden World Globe component */}
      {isMounted && <WorldGlobe />}
      
      {/* Hidden Press Library Modal component */}
      {isMounted && <PressLibraryModal />}
      
      {/* Hidden Artworks Gallery component */}
      {isMounted && <ArtworksGallery />}
      
      {/* Hidden GitHub Safari Browser trigger */}
      {isMounted && (
        <button
          data-github-safari-trigger
          onClick={() => setShowGitHubBrowser(true)}
          className="hidden"
        />
      )}
      
      {/* GitHub Safari Browser */}
      {isMounted && (
        <GitHubSafariBrowser
          isOpen={showGitHubBrowser}
          onClose={() => setShowGitHubBrowser(false)}
        />
      )}
      
      {/* Work Experience Folder Window */}
      {isMounted && (
        <WorkFolderWindow
          isOpen={showWorkFolder}
          onClose={() => setShowWorkFolder(false)}
        />
      )}
      
      {/* FaceTime Window */}
      {isMounted && showFaceTime && (
        <FaceTimeWindow onClose={() => setShowFaceTime(false)} />
      )}
      
      {/* Messages Window */}
      {isMounted && showMessages && (
        <MessagesWindow onClose={() => setShowMessages(false)} />
      )}
      
      {/* GE Folder Window */}
      {isMounted && (
        <GEFolderWindow
          isOpen={showGEFolder}
          onClose={() => setShowGEFolder(false)}
        />
      )}
      
      {/* Hackathons Folder Window */}
      {isMounted && (
        <HackathonsFolderWindow
          isOpen={showHackathonsFolder}
          onClose={() => setShowHackathonsFolder(false)}
        />
      )}
      
      {/* Polaroid Photos - Commented for future use */}
      {/* {showPolaroidPhotos && isMounted && (
        <PolaroidPhotos 
          onClose={() => setShowPolaroidPhotos(false)}
        />
      )} */}
      
      {/* Photos Gallery Window */}
      <PhotosGalleryWindow
        isOpen={showPhotosGallery}
        onClose={() => setShowPhotosGallery(false)}
      />
      
      {/* Code Editor Window */}
      {isMounted && (
        <CodeEditorWindow
          isOpen={showCodeEditor}
          onClose={() => setShowCodeEditor(false)}
        />
      )}
      
      {/* Launchpad Window */}
      {isMounted && (
        <LaunchpadWindow
          isOpen={showLaunchpad}
          onClose={() => setShowLaunchpad(false)}
          onOpenApp={(appId) => {
            // Handle opening apps from launchpad
            switch (appId) {
              case 'vs':
                setShowCodeEditor(true)
                break
              case 'terminal':
                setShowTerminal(true)
                break
              case 'calculator':
                setShowCalculator(true)
                break
              case 'appstore':
                setShowAppStore(true)
                break
              case 'spotify':
                setShowSpotify(true)
                break
              case 'messages':
                setShowMessages(true)
                break
              case 'facetime':
                setShowFaceTime(true)
                break
              case 'photos':
                setShowPhotosGallery(true)
                break
              case 'notes':
                showStickyNoteFromDock()
                break
              case 'calendar':
                const trigger = document.querySelector('[data-calendar-trigger]') as HTMLElement
                if (trigger) trigger.click()
                break
              default:
                console.log(`Opening app: ${appId}`)
            }
          }}
        />
      )}
      
      {/* Terminal Window */}
      {isMounted && (
        <TerminalWindow
          isOpen={showTerminal}
          onClose={() => setShowTerminal(false)}
        />
      )}
      
      {/* Calculator Window */}
      {isMounted && (
        <CalculatorWindow
          isOpen={showCalculator}
          onClose={() => setShowCalculator(false)}
        />
      )}
      
      {/* App Store Window */}
      {isMounted && (
        <AppStoreWindow
          isOpen={showAppStore}
          onClose={() => setShowAppStore(false)}
        />
      )}
      
      {/* Spotify Window */}
      {isMounted && (
        <SpotifyWindow
          isOpen={showSpotify}
          onClose={() => setShowSpotify(false)}
        />
      )}

      {/* Spotify Mini Player */}
      {isMounted && <SpotifyMiniPlayer />}
    </>
  )
}