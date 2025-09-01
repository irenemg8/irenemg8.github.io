"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Search } from 'lucide-react'

interface App {
  id: string
  name: string
  icon: string
  action: () => void
  category: 'productivity' | 'communication' | 'entertainment' | 'utilities' | 'development' | 'system'
}

interface LaunchpadWindowProps {
  isOpen: boolean
  onClose: () => void
  onOpenApp?: (appId: string) => void
}

export function LaunchpadWindow({ isOpen, onClose, onOpenApp }: LaunchpadWindowProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredApps, setFilteredApps] = useState<App[]>([])

  // Solo las apps que están en el dock actual
  const allApps: App[] = [
    // Apps principales del dock
    {
      id: 'finder',
      name: 'Finder',
      icon: '/Dock/finder.png',
      category: 'system',
      action: () => {
        console.log('Finder clicked')
        onClose()
      }
    },
    {
      id: 'safari',
      name: 'Safari',
      icon: '/Dock/Safari.png',
      category: 'utilities',
      action: () => {
        const button = document.querySelector('[data-github-safari-trigger]') as HTMLButtonElement;
        if (button) button.click();
        onClose()
      }
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: '/Dock/Messages.png',
      category: 'communication',
      action: () => {
        onOpenApp?.('messages')
        onClose()
      }
    },
    {
      id: 'mail',
      name: 'Mail',
      icon: '/Dock/Mail.png',
      category: 'communication',
      action: () => {
        window.location.href = 'mailto:irenebati4@gmail.com'
        onClose()
      }
    },
    {
      id: 'maps',
      name: 'Maps',
      icon: '/Dock/Maps.png',
      category: 'utilities',
      action: () => {
        const button = document.querySelector('[data-world-globe-trigger]') as HTMLButtonElement;
        if (button) button.click();
        onClose()
      }
    },
    {
      id: 'photos',
      name: 'Photos',
      icon: '/Dock/Photos.png',
      category: 'entertainment',
      action: () => {
        onOpenApp?.('photos')
        onClose()
      }
    },
    {
      id: 'facetime',
      name: 'FaceTime',
      icon: '/Dock/FaceTime.png',
      category: 'communication',
      action: () => {
        onOpenApp?.('facetime')
        onClose()
      }
    },
    {
      id: 'settings',
      name: 'System Preferences',
      icon: '/Dock/SystemPreferences.png',
      category: 'system',
      action: () => {
        console.log('Settings clicked')
        onClose()
      }
    },
    {
      id: 'calendar',
      name: 'Calendar',
      icon: '/Dock/Calendar.png',
      category: 'productivity',
      action: () => {
        onOpenApp?.('calendar')
        onClose()
      }
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: '/Dock/Notes.png',
      category: 'productivity',
      action: () => {
        onOpenApp?.('notes')
        onClose()
      }
    },
    {
      id: 'vs-code',
      name: 'VS Code',
      icon: '/Dock/vs.png',
      category: 'development',
      action: () => {
        onOpenApp?.('vs')
        onClose()
      }
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiMwRDBEMEQiLz4KPHBhdGggZD0iTTEyIDEySDUyVjUySDEyVjEyWiIgZmlsbD0iIzFBMUExQSIvPgo8cGF0aCBkPSJNMTYgMjQvMjQgMzJMMTYgNDBWMjRaIiBmaWxsPSIjMDBGRjAwIi8+CjxyZWN0IHg9IjI4IiB5PSIzNiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjMiIGZpbGw9IiMwMEZGMDAiLz4KPC9zdmc+',
      category: 'development',
      action: () => {
        onOpenApp?.('terminal')
        onClose()
      }
    }
    // Nota: No incluimos 'varios' (Launchpad) ni 'trash' (Papelera) en el launchpad
  ]

  useEffect(() => {
    if (searchQuery) {
      const filtered = allApps.filter(app =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredApps(filtered)
    } else {
      setFilteredApps(allApps)
    }
  }, [searchQuery])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] macos-glass rounded-3xl overflow-hidden macos-shadow border border-white/20 dark:border-gray-700/20">
        {/* Header con estética macOS */}
        <div className="flex items-center p-4 border-b border-white/10 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
            {/* Botones estilo macOS */}
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-sm"
                title="Cerrar"
              />
              <div className="w-3 h-3 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-sm transition-colors" />
              <div className="w-3 h-3 bg-green-400 hover:bg-green-500 rounded-full shadow-sm transition-colors" />
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Launchpad</h2>
          </div>
          <div className="w-16"></div> {/* Spacer for centering */}
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10 dark:border-gray-700/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar aplicaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700/50 rounded-lg text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all"
            />
          </div>
        </div>

        {/* Apps Grid - Todas las apps juntas */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6">
            {filteredApps.map(app => (
              <button
                key={app.id}
                onClick={app.action}
                className="group flex flex-col items-center p-3 rounded-2xl hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
              >
                <div className="w-16 h-16 mb-2 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src={app.icon}
                    alt={app.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300 text-center leading-tight group-hover:text-gray-800 dark:group-hover:text-white transition-colors max-w-full truncate">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
