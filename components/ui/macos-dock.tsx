"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CalendarModal } from '@/components/shared/calendar-modal'

interface DockItem {
  id: string
  name: string
  image: string
  label: string
  action: () => void
}

interface MacOSDockProps {
  onShowStickyNote?: () => void
  onShowFaceTime?: () => void
  onShowMessages?: () => void
}

export function MacOSDock({ onShowStickyNote, onShowFaceTime, onShowMessages }: MacOSDockProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [visibleItems, setVisibleItems] = useState<DockItem[]>([])
  const [screenSize, setScreenSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('xl')
  const [activeItem, setActiveItem] = useState<string | null>('trash') // Papelera activa por defecto

  // Todos los iconos del dock en el orden especificado
  const allDockItems: DockItem[] = [
    {
      id: 'finder',
      name: 'Finder',
      image: '/Dock/finder.png',
      label: 'Finder',
      action: () => {
        setActiveItem('finder')
        if (onShowStickyNote) {
          onShowStickyNote()
        }
      }
    },
    {
      id: 'safari',
      name: 'Safari',
      image: '/Dock/Safari.png',
      label: 'Safari',
      action: () => {
        setActiveItem('safari')
        // Trigger the GitHub Safari browser
        const button = document.querySelector('[data-github-safari-trigger]') as HTMLButtonElement;
        if (button) button.click();
      }
    },
    {
      id: 'messages',
      name: 'Messages',
      image: '/Dock/Messages.png',
      label: 'Mensajes',
      action: () => {
        setActiveItem('messages')
        if (onShowMessages) {
          onShowMessages()
        }
      }
    },
    {
      id: 'mail',
      name: 'Mail',
      image: '/Dock/Mail.png',
      label: 'Mail',
      action: () => {
        setActiveItem('mail')
        window.location.href = 'mailto:irenebati4@gmail.com'
      }
    },
    {
      id: 'maps',
      name: 'Maps',
      image: '/Dock/Maps.png',
      label: 'Mapas',
      action: () => {
        setActiveItem('maps')
        // Buscar y hacer click en el botón del globo mundial
        const button = document.querySelector('[data-world-globe-trigger]') as HTMLButtonElement;
        if (button) {
          button.click();
        }
      }
    },
    {
      id: 'photos',
      name: 'Photos',
      image: '/Dock/Photos.png',
      label: 'Fotos',
      action: () => {
        setActiveItem('photos')
        console.log('Photos clicked')
      }
    },
    {
      id: 'facetime',
      name: 'FaceTime',
      image: '/Dock/FaceTime.png',
      label: 'FaceTime',
      action: () => {
        setActiveItem('facetime')
        if (onShowFaceTime) {
          onShowFaceTime()
        }
      }
    },
    {
      id: 'settings',
      name: 'System Preferences',
      image: '/Dock/SystemPreferences.png',
      label: 'Preferencias del Sistema',
      action: () => {
        setActiveItem('settings')
        console.log('Settings clicked')
      }
    },
    {
      id: 'calendar',
      name: 'Calendar',
      image: '/Dock/Calendar.png',
      label: 'Calendario',
      action: () => {
        setActiveItem('calendar')
        const trigger = document.querySelector('[data-calendar-trigger]') as HTMLElement
        if (trigger) {
          trigger.click()
        }
      }
    },
    {
      id: 'notes',
      name: 'Notes',
      image: '/Dock/Notes.png',
      label: 'Notas',
      action: () => {
        setActiveItem('notes')
        console.log('Notes clicked')
      }
    },
    {
      id: 'trash',
      name: 'Trash',
      image: '/bin.png',
      label: 'Papelera',
      action: () => {
        setActiveItem('trash')
        console.log('Trash clicked')
      }
    }
  ]

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize('sm')
      } else if (width < 768) {
        setScreenSize('md')
      } else if (width < 1024) {
        setScreenSize('lg')
      } else {
        setScreenSize('xl')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Actualizar iconos visibles según el tamaño de pantalla
  useEffect(() => {
    let itemsToShow: DockItem[] = []
    
    switch (screenSize) {
      case 'sm':
        // Móvil: iconos más importantes + papelera (5 iconos)
        itemsToShow = [...allDockItems.slice(0, 4), allDockItems[allDockItems.length - 1]]
        break
      case 'md':
        // Tablet: iconos principales + papelera (7 iconos)
        itemsToShow = [...allDockItems.slice(0, 6), allDockItems[allDockItems.length - 1]]
        break
      case 'lg':
        // Desktop pequeño: mayoría de iconos + papelera (9 iconos)
        itemsToShow = [...allDockItems.slice(0, 8), allDockItems[allDockItems.length - 1]]
        break
      case 'xl':
        // Desktop grande: todos los iconos
        itemsToShow = allDockItems
        break
    }
    
    setVisibleItems(itemsToShow)
  }, [screenSize])

  return (
    <>
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className="macos-glass rounded-2xl px-4 py-3 macos-shadow border border-white/20 dark:border-gray-700/20">
        <div className="flex items-center space-x-2">
          {visibleItems.map((item, index) => (
            <div key={item.id} className="flex items-center">
              {/* Separador antes de la papelera */}
              {item.id === 'trash' && (
                <div className="w-px h-10 bg-white/20 dark:bg-gray-600/30 mx-2" />
              )}
              <button
                className="macos-dock-item relative flex flex-col items-center group transition-transform duration-200 ease-out hover:scale-110"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={item.action}
              >
              {/* Icon container */}
              <div className={`${
                item.id === 'trash' ? (
                  screenSize === 'sm' ? 'w-10 h-10' : 
                  screenSize === 'md' ? 'w-12 h-12' : 'w-14 h-14'
                ) : (
                  screenSize === 'sm' ? 'w-12 h-12' : 
                  screenSize === 'md' ? 'w-14 h-14' : 'w-16 h-16'
                )
              } rounded-xl overflow-hidden shadow-lg relative`}>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Tooltip - solo en pantallas medianas y grandes */}
              {screenSize !== 'sm' && hoveredItem === item.id && (
                <div
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 macos-glass rounded-lg px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap pointer-events-none transition-opacity duration-200"
                >
                  {item.label}
                  {/* Tooltip arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rotate-45 border-r border-b border-white/30 dark:border-gray-700/30"></div>
                </div>
              )}

              {/* Active indicator */}
              {activeItem === item.id && (
                <div className="absolute -bottom-1 w-1 h-1 bg-gray-600 dark:bg-gray-400 rounded-full" />
              )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    {/* Calendar Modal */}
    <CalendarModal />
    </>
  )
}