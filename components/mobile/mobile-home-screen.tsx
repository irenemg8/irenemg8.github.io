"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MobileApp } from './mobile-app'
import { MobileDock } from './mobile-dock'
import { useLanguage } from '@/contexts/language-context'
import { Battery, BatteryCharging, Wifi, Signal } from 'lucide-react'

// Import existing window components
import { WorldGlobe } from '@/components/shared/world-globe'
import { GitHubSafariBrowser } from '@/components/shared/github-safari-browser'
import { CalendarModal } from '@/components/shared/calendar-modal'

// Import new mobile window components
import { MobileWorkFolderWindow } from './mobile-work-folder-window'
import { MobileGEFolderWindow } from './mobile-ge-folder-window'
import { MobileHackathonsFolderWindow } from './mobile-hackathons-folder-window'
import { MobileAboutMeWindow } from './mobile-about-me-window'
import { MobileProjectsWindow } from './mobile-projects-window'
import { MobileArtworksWindow } from './mobile-artworks-window'
import { MobilePressWindow } from './mobile-press-window'

// Import remaining components
import { FaceTimeWindow } from '@/components/desktop/facetime-window'
import { MobileMessagesWindow } from './mobile-messages-window'
import { PhotosGalleryWindow } from '@/components/desktop/photos-gallery-window'
import { MobileCodeEditorWindow } from './mobile-code-editor-window'
import { LaunchpadWindow } from '@/components/desktop/launchpad-window'
import { TerminalWindow } from '@/components/desktop/terminal-window'
import { CalculatorWindow } from '@/components/desktop/calculator-window'
import { AppStoreWindow } from '@/components/desktop/appstore-window'
import { MobileSpotifyWindow } from './mobile-spotify-window'
import { MobileSettingsWindow } from './mobile-settings-window'
import { MobileControlCenter } from './mobile-control-center'

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
  const [batteryLevel, setBatteryLevel] = useState<number>(100)
  const [isCharging, setIsCharging] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState(false)

  // Window states
  // New mobile window states
  const [showWorkFolder, setShowWorkFolder] = useState(false)
  const [showGEFolder, setShowGEFolder] = useState(false)
  const [showHackathons, setShowHackathons] = useState(false)
  const [showAboutMe, setShowAboutMe] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [showArtworks, setShowArtworks] = useState(false)
  const [showPress, setShowPress] = useState(false)
  
  // Other window states
  const [showFaceTime, setShowFaceTime] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [showPhotosGallery, setShowPhotosGallery] = useState(false)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [showLaunchpad, setShowLaunchpad] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showAppStore, setShowAppStore] = useState(false)
  const [showSpotify, setShowSpotify] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showGitHubBrowser, setShowGitHubBrowser] = useState(false)
  const [showControlCenter, setShowControlCenter] = useState(false)

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

  // Control Center gesture detection (mejorado)
  useEffect(() => {
    let startY = 0
    let startTime = 0
    let isTracking = false
    
    const handleTouchStart = (e: TouchEvent) => {
      // Ampliar el área de activación a los primeros 100px para que sea más fácil
      if (e.touches[0].clientY <= 100) {
        startY = e.touches[0].clientY
        startTime = Date.now()
        isTracking = true
      }
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isTracking || startY === 0) return
      
      const currentY = e.touches[0].clientY
      const deltaY = currentY - startY
      const deltaTime = Date.now() - startTime
      
      // Condiciones más flexibles: 80px de deslizamiento en 800ms
      if (deltaY > 80 && deltaTime < 800 && startY <= 100) {
        setShowControlCenter(true)
        isTracking = false
        startY = 0
      }
    }
    
    const handleTouchEnd = () => {
      startY = 0
      startTime = 0
      isTracking = false
    }

    // También detectar gestos en desktop con mouse para testing
    const handleMouseDown = (e: MouseEvent) => {
      if (e.clientY <= 100) {
        startY = e.clientY
        startTime = Date.now()
        isTracking = true
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isTracking || startY === 0) return
      
      const currentY = e.clientY
      const deltaY = currentY - startY
      const deltaTime = Date.now() - startTime
      
      if (deltaY > 80 && deltaTime < 800 && startY <= 100) {
        setShowControlCenter(true)
        isTracking = false
        startY = 0
      }
    }

    const handleMouseUp = () => {
      startY = 0
      startTime = 0
      isTracking = false
    }
    
    // Event listeners para touch y mouse
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
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

  // Apps that are in the dock - these will be excluded from the main grid
  const dockAppIds = ['messages', 'safari', 'spotify', 'mail']
  
  // All apps configuration using your real images
  const allApps: MobileApp[] = [
    {
      id: 'projects',
      name: t('mobile.apps.projects'),
      image: '/folder.png',
      onTap: () => setShowProjects(true)
    },
    {
      id: 'work-experience',
      name: t('mobile.apps.work_experience'),
      image: '/folder.png',
      onTap: () => setShowWorkFolder(true)
    },
    {
      id: 'about-me',
      name: t('mobile.apps.about_me'),
      image: '/folder.png',
      onTap: () => setShowAboutMe(true)
    },
    {
      id: 'artworks',
      name: t('mobile.apps.artworks'),
      image: '/folder.png',
      onTap: () => setShowArtworks(true)
    },
    {
      id: 'ge',
      name: t('mobile.apps.ge'),
      image: '/folder.png',
      onTap: () => setShowGEFolder(true)
    },
    {
      id: 'hackathons',
      name: t('mobile.apps.hackathons'),
      image: '/folder.png',
      onTap: () => setShowHackathons(true)
    },
    {
      id: 'press',
      name: t('mobile.apps.press'),
      image: '/folder.png',
      onTap: () => setShowPress(true)
    },
    {
      id: 'world-map',
      name: t('mobile.apps.world_map'),
      image: '/mundo.png',
      onTap: () => {
        const button = document.querySelector('[data-world-globe-trigger]') as HTMLButtonElement;
        if (button) button.click();
      }
    },
    {
      id: 'resume',
      name: t('mobile.apps.resume'),
      image: '/document.png',
      onTap: () => window.open('/irene-medina-garcia-cv.pdf', '_blank')
    },
    {
      id: 'code',
      name: t('mobile.apps.code'),
      image: '/Dock/vs.png',
      onTap: () => setShowCodeEditor(true)
    },
    {
      id: 'terminal',
      name: t('mobile.apps.terminal'),
      image: '/Dock/terminal.png',
      onTap: () => setShowTerminal(true)
    },
    {
      id: 'calculator',
      name: t('mobile.apps.calculator'),
      image: '/Dock/calculadora.png',
      onTap: () => setShowCalculator(true)
    },
    {
      id: 'appstore',
      name: t('mobile.apps.appstore'),
      image: '/Dock/appstore.png',
      onTap: () => setShowAppStore(true)
    },
    {
      id: 'settings',
      name: t('mobile.apps.settings'),
      image: '/Dock/SystemPreferences.png',
      onTap: () => setShowSettings(true)
    },
    {
      id: 'maps',
      name: t('mobile.apps.maps'),
      image: '/Dock/Maps.png',
      onTap: () => {
        const button = document.querySelector('[data-world-globe-trigger]') as HTMLButtonElement;
        if (button) button.click();
      }
    },
    {
      id: 'notes',
      name: t('mobile.apps.notes'),
      image: '/Dock/Notes.png',
      onTap: () => console.log('Notes app')
    },
    {
      id: 'calendar',
      name: t('mobile.apps.calendar'),
      image: '/Dock/Calendar.png',
      onTap: () => {
        const trigger = document.querySelector('[data-calendar-trigger]') as HTMLElement
        if (trigger) trigger.click()
      }
    },
    {
      id: 'finder',
      name: t('mobile.apps.finder'),
      image: '/Dock/finder.png',
      onTap: () => console.log('Finder app')
    },
    {
      id: 'photos',
      name: t('mobile.apps.photos'),
      image: '/Dock/Photos.png',
      onTap: () => setShowPhotosGallery(true)
    },
    {
      id: 'facetime',
      name: t('mobile.apps.facetime'),
      image: '/Dock/FaceTime.png',
      onTap: () => setShowFaceTime(true)
    }
  ]

  // Filter out apps that are in the dock to avoid duplicates
  const apps = allApps.filter(app => !dockAppIds.includes(app.id))

  // All apps in a single page - no pagination needed

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 relative overflow-hidden ${className}`}>
      {/* iOS Status Bar with Control Center indicator */}
      <div 
        className="relative z-50 h-12 px-6 flex items-center justify-between text-black dark:text-white cursor-pointer"
        onClick={() => setShowControlCenter(true)}
      >
        <div className="flex items-center space-x-1 text-sm font-medium">
          <span>{currentTime}</span>
        </div>
        
        {/* Control Center pull indicator */}
        <div 
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 rounded-full opacity-40"
          style={{ background: 'linear-gradient(90deg, #C9A3DC, #B091C7)' }}
        ></div>
        
        {/* Testing button for desktop - only visible on large screens */}
        <div className="absolute top-2 right-20 hidden lg:block">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowControlCenter(true)
            }}
            className="text-xs px-2 py-1 rounded-md transition-colors"
            style={{ 
              backgroundColor: '#C9A3DC20',
              color: '#C9A3DC'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A3DC30'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A3DC20'
            }}
            title="Abrir Panel de Control (Testing)"
          >
            {t('mobile.status_bar.panel')}
          </button>
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

      {/* App Grid Container - Single page, no scrolling */}
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full"
        >
          {/* App Grid - Single screen with all apps */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-10 max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto">
            {apps.map((app, index) => (
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
        </motion.div>
      </div>

      {/* Mobile Dock */}
      <MobileDock 
        onShowMessages={() => setShowMessages(true)}
        onShowGitHubBrowser={() => setShowGitHubBrowser(true)}
        onShowSpotify={() => setShowSpotify(true)}
      />

      {/* Hidden components for modals and triggers */}
      {isMounted && <WorldGlobe />}

      {/* All Windows */}
      {isMounted && (
        <>
          {/* New Mobile Windows */}
          <MobileArtworksWindow 
            isOpen={showArtworks}
            onClose={() => setShowArtworks(false)}
          />
          <MobileGEFolderWindow
            isOpen={showGEFolder}
            onClose={() => setShowGEFolder(false)}
          />
          <MobileHackathonsFolderWindow
            isOpen={showHackathons}
            onClose={() => setShowHackathons(false)}
          />
          <MobileAboutMeWindow
            isOpen={showAboutMe}
            onClose={() => setShowAboutMe(false)}
          />
          <MobileProjectsWindow
            isOpen={showProjects}
            onClose={() => setShowProjects(false)}
          />
          <MobilePressWindow
            isOpen={showPress}
            onClose={() => setShowPress(false)}
          />
          
          {/* Other Windows */}
          <GitHubSafariBrowser
            isOpen={showGitHubBrowser}
            onClose={() => setShowGitHubBrowser(false)}
          />
          <MobileWorkFolderWindow
            isOpen={showWorkFolder}
            onClose={() => setShowWorkFolder(false)}
          />
          {showFaceTime && (
            <FaceTimeWindow onClose={() => setShowFaceTime(false)} />
          )}
          <MobileMessagesWindow
            isOpen={showMessages}
            onClose={() => setShowMessages(false)}
          />
          <PhotosGalleryWindow
            isOpen={showPhotosGallery}
            onClose={() => setShowPhotosGallery(false)}
          />
          <MobileCodeEditorWindow
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
          <MobileSpotifyWindow
            isOpen={showSpotify}
            onClose={() => setShowSpotify(false)}
          />
          <MobileSettingsWindow
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
          
          {/* Mobile Control Center */}
          <MobileControlCenter
            isOpen={showControlCenter}
            onClose={() => setShowControlCenter(false)}
          />
          
          {/* Calendar Modal */}
          {isMounted && <CalendarModal />}
        </>
      )}
    </div>
  )
}
