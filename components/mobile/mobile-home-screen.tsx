"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { MobileApp } from './mobile-app'
import { MobileDock } from './mobile-dock'
import { useLanguage } from '@/contexts/language-context'
import { Battery, BatteryCharging, Wifi, Signal } from 'lucide-react'

// Import existing window components
import { WorldGlobe } from '@/components/shared/world-globe'
import { PressLibraryModal } from '@/components/shared/press-library-modal'
import { ArtworksGallery } from '@/components/shared/artworks-gallery'
import { GitHubSafariBrowser } from '@/components/shared/github-safari-browser'
import { WorkFolderWindow } from '@/components/desktop/work-folder-window'
import { FaceTimeWindow } from '@/components/desktop/facetime-window'
import { GEFolderWindow } from '@/components/desktop/ge-folder-window'
import { HackathonsFolderWindow } from '@/components/desktop/hackathons-folder-window'
import { MessagesWindow } from '@/components/desktop/messages-window'
import { PhotosGalleryWindow } from '@/components/desktop/photos-gallery-window'
import { CodeEditorWindow } from '@/components/desktop/code-editor-window'
import { LaunchpadWindow } from '@/components/desktop/launchpad-window'
import { TerminalWindow } from '@/components/desktop/terminal-window'
import { CalculatorWindow } from '@/components/desktop/calculator-window'
import { AppStoreWindow } from '@/components/desktop/appstore-window'
import { SpotifyWindow } from '@/components/desktop/spotify-window'
import { SpotifyMiniPlayer } from '@/components/desktop/spotify-mini-player'
import { SettingsWindow } from '@/components/desktop/settings-window'
import { AboutMeWindow } from '@/components/desktop/about-me-window'
import { AppleBooksWindow } from '@/components/desktop/apple-books-window'

interface MobileApp {
  id: string
  name: string
  icon?: string
  image?: string
  onTap: () => void
}

interface MobileHomeScreenProps {
  className?: string
}

export function MobileHomeScreen({ className }: MobileHomeScreenProps) {
  const { t } = useLanguage()
  const [currentTime, setCurrentTime] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [batteryLevel, setBatteryLevel] = useState<number>(100)
  const [isCharging, setIsCharging] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState(false)

  // Window states
  const [showWorkFolder, setShowWorkFolder] = useState(false)
  const [showFaceTime, setShowFaceTime] = useState(false)
  const [showGEFolder, setShowGEFolder] = useState(false)
  const [showHackathonsFolder, setShowHackathonsFolder] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showPhotosGallery, setShowPhotosGallery] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [showLaunchpad, setShowLaunchpad] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showAppStore, setShowAppStore] = useState(false)
  const [showSpotify, setShowSpotify] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showArtworksGallery, setShowArtworksGallery] = useState(false)
  const [showAboutMe, setShowAboutMe] = useState(false)
  const [showAppleBooks, setShowAppleBooks] = useState(false)
  const [showGitHubBrowser, setShowGitHubBrowser] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const updateDateTime = () => {
      const now = new Date()
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/Madrid'
      }
      setCurrentTime(now.toLocaleTimeString('es-ES', timeOptions))
    }
    
    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Battery status detection
  useEffect(() => {
    const checkBatteryStatus = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery()
          
          const updateBatteryInfo = () => {
            setBatteryLevel(Math.round(battery.level * 100))
            setIsCharging(battery.charging)
          }

          updateBatteryInfo()
          
          battery.addEventListener('chargingchange', updateBatteryInfo)
          battery.addEventListener('levelchange', updateBatteryInfo)

          return () => {
            battery.removeEventListener('chargingchange', updateBatteryInfo)
            battery.removeEventListener('levelchange', updateBatteryInfo)
          }
        } catch (error) {
          console.log('Battery API not available')
        }
      }
    }

    checkBatteryStatus()
  }, [])

  // Apps configuration using your real images
  const apps: MobileApp[] = [
    {
      id: 'projects',
      name: 'Proyectos',
      image: '/folder.png',
      onTap: () => setShowAppleBooks(true)
    },
    {
      id: 'work-experience',
      name: 'Experiencia',
      image: '/folder.png',
      onTap: () => setShowWorkFolder(true)
    },
    {
      id: 'about-me',
      name: 'Sobre Mí',
      image: '/folder.png',
      onTap: () => setShowAboutMe(true)
    },
    {
      id: 'artworks',
      name: 'Arte',
      image: '/folder.png',
      onTap: () => setShowArtworksGallery(true)
    },
    {
      id: 'ge',
      name: 'GE',
      image: '/folder.png',
      onTap: () => setShowGEFolder(true)
    },
    {
      id: 'hackathons',
      name: 'Hackathons',
      image: '/folder.png',
      onTap: () => setShowHackathonsFolder(true)
    },
    {
      id: 'press',
      name: 'Prensa',
      image: '/folder.png',
      onTap: () => {
        const button = document.querySelector('[data-press-library-trigger]') as HTMLButtonElement;
        if (button) button.click();
      }
    },
    {
      id: 'world-map',
      name: 'Mundo',
      image: '/mundo.png',
      onTap: () => {
        const button = document.querySelector('[data-world-globe-trigger]') as HTMLButtonElement;
        if (button) button.click();
      }
    },
    {
      id: 'resume',
      name: 'CV',
      image: '/document.png',
      onTap: () => window.open('/irene-medina-garcia-cv.pdf', '_blank')
    },
    {
      id: 'safari',
      name: 'Safari',
      image: '/Dock/Safari.png',
      onTap: () => setShowGitHubBrowser(true)
    },
    {
      id: 'messages',
      name: 'Mensajes',
      image: '/Dock/Messages.png',
      onTap: () => setShowMessages(true)
    },
    {
      id: 'photos',
      name: 'Fotos',
      image: '/Dock/Photos.png',
      onTap: () => setShowPhotosGallery(true)
    },
    {
      id: 'facetime',
      name: 'FaceTime',
      image: '/Dock/FaceTime.png',
      onTap: () => setShowFaceTime(true)
    },
    {
      id: 'code',
      name: 'VS Code',
      image: '/Dock/vs.png',
      onTap: () => setShowCodeEditor(true)
    },
    {
      id: 'terminal',
      name: 'Terminal',
      image: '/Dock/terminal.png',
      onTap: () => setShowTerminal(true)
    },
    {
      id: 'calculator',
      name: 'Calculadora',
      image: '/Dock/calculadora.png',
      onTap: () => setShowCalculator(true)
    },
    {
      id: 'appstore',
      name: 'App Store',
      image: '/Dock/appstore.png',
      onTap: () => setShowAppStore(true)
    },
    {
      id: 'spotify',
      name: 'Spotify',
      image: '/Dock/spotify.png',
      onTap: () => setShowSpotify(true)
    },
    {
      id: 'settings',
      name: 'Ajustes',
      image: '/Dock/SystemPreferences.png',
      onTap: () => setShowSettings(true)
    },
    {
      id: 'mail',
      name: 'Mail',
      image: '/Dock/Mail.png',
      onTap: () => window.location.href = 'mailto:irenebati4@gmail.com'
    },
    {
      id: 'maps',
      name: 'Mapas',
      image: '/Dock/Maps.png',
      onTap: () => {
        const button = document.querySelector('[data-world-globe-trigger]') as HTMLButtonElement;
        if (button) button.click();
      }
    },
    {
      id: 'notes',
      name: 'Notas',
      image: '/Dock/Notes.png',
      onTap: () => console.log('Notes app')
    },
    {
      id: 'calendar',
      name: 'Calendario',
      image: '/Dock/Calendar.png',
      onTap: () => {
        const trigger = document.querySelector('[data-calendar-trigger]') as HTMLElement
        if (trigger) trigger.click()
      }
    },
    {
      id: 'finder',
      name: 'Finder',
      image: '/Dock/finder.png',
      onTap: () => console.log('Finder app')
    }
  ]

  // Apps per page state
  const [appsPerPage, setAppsPerPage] = useState(20)
  
  // Update apps per page based on screen size
  useEffect(() => {
    const updateAppsPerPage = () => {
      const width = window.innerWidth
      if (width >= 1024) setAppsPerPage(30) // lg: 6 cols x 5 rows
      else if (width >= 768) setAppsPerPage(25) // md: 5 cols x 5 rows  
      else setAppsPerPage(20) // sm: 4 cols x 5 rows
    }
    
    updateAppsPerPage()
    window.addEventListener('resize', updateAppsPerPage)
    return () => window.removeEventListener('resize', updateAppsPerPage)
  }, [])

  // Reset current page if out of bounds when apps per page changes
  useEffect(() => {
    const totalPages = Math.ceil(apps.length / appsPerPage)
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1))
    }
  }, [appsPerPage, apps.length, currentPage])

  // Split apps into pages
  const pages = []
  for (let i = 0; i < apps.length; i += appsPerPage) {
    pages.push(apps.slice(i, i + appsPerPage))
  }

  const handlePageSwipe = (event: any, info: PanInfo) => {
    const threshold = 50
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0 && currentPage > 0) {
        setCurrentPage(currentPage - 1)
      } else if (info.offset.x < 0 && currentPage < pages.length - 1) {
        setCurrentPage(currentPage + 1)
      }
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden ${className}`}>
      {/* iOS Status Bar */}
      <div className="relative z-50 h-12 px-6 flex items-center justify-between text-black dark:text-white">
        <div className="flex items-center space-x-1 text-sm font-medium">
          <span>{currentTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Signal className="h-4 w-4" />
          <Wifi className="h-4 w-4" />
          {isCharging ? (
            <BatteryCharging className="h-4 w-4" />
          ) : (
            <Battery className="h-4 w-4" />
          )}
          <span className="text-sm">{batteryLevel}%</span>
        </div>
      </div>

      {/* App Grid Container */}
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 pb-32">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handlePageSwipe}
          animate={{ x: -currentPage * 100 + '%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex"
          style={{ width: `${pages.length * 100}%` }}
        >
          {pages.map((pageApps, pageIndex) => (
            <div
              key={pageIndex}
              className="w-full flex-shrink-0 px-2 sm:px-4"
              style={{ width: `${100 / pages.length}%` }}
            >
              {/* App Grid - Responsive grid with better spacing for larger icons */}
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-10 max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto">
                {pageApps.map((app, index) => (
                  <MobileApp
                    key={app.id}
                    name={app.name}
                    image={app.image}
                    icon={app.icon}
                    onTap={app.onTap}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Page Dots */}
        {pages.length > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentPage 
                    ? 'bg-white dark:bg-gray-300' 
                    : 'bg-gray-400 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Dock */}
      <MobileDock />

      {/* Hidden components for modals and triggers */}
      {isMounted && <WorldGlobe />}
      {isMounted && <PressLibraryModal />}

      {/* All Windows */}
      {isMounted && (
        <>
          <ArtworksGallery 
            isOpen={showArtworksGallery}
            onClose={() => setShowArtworksGallery(false)}
          />
          <GitHubSafariBrowser
            isOpen={showGitHubBrowser}
            onClose={() => setShowGitHubBrowser(false)}
          />
          <WorkFolderWindow
            isOpen={showWorkFolder}
            onClose={() => setShowWorkFolder(false)}
          />
          {showFaceTime && (
            <FaceTimeWindow onClose={() => setShowFaceTime(false)} />
          )}
          {showMessages && (
            <MessagesWindow onClose={() => setShowMessages(false)} />
          )}
          <GEFolderWindow
            isOpen={showGEFolder}
            onClose={() => setShowGEFolder(false)}
          />
          <HackathonsFolderWindow
            isOpen={showHackathonsFolder}
            onClose={() => setShowHackathonsFolder(false)}
          />
          <PhotosGalleryWindow
            isOpen={showPhotosGallery}
            onClose={() => setShowPhotosGallery(false)}
          />
          <CodeEditorWindow
            isOpen={showCodeEditor}
            onClose={() => setShowCodeEditor(false)}
          />
          <LaunchpadWindow
            isOpen={showLaunchpad}
            onClose={() => setShowLaunchpad(false)}
            onOpenApp={(appId) => {
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
                default:
                  console.log(`Opening app: ${appId}`)
              }
            }}
          />
          <TerminalWindow
            isOpen={showTerminal}
            onClose={() => setShowTerminal(false)}
          />
          <CalculatorWindow
            isOpen={showCalculator}
            onClose={() => setShowCalculator(false)}
          />
          <AppStoreWindow
            isOpen={showAppStore}
            onClose={() => setShowAppStore(false)}
          />
          <SpotifyWindow
            isOpen={showSpotify}
            onClose={() => setShowSpotify(false)}
          />
          <SpotifyMiniPlayer />
          <SettingsWindow
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
          <AboutMeWindow 
            isOpen={showAboutMe} 
            onClose={() => setShowAboutMe(false)}
          />
          <AppleBooksWindow
            isOpen={showAppleBooks}
            onClose={() => setShowAppleBooks(false)}
          />
        </>
      )}
    </div>
  )
}
