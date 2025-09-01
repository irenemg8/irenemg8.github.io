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

  const allApps: App[] = [
    // Productividad
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
      id: 'vs-code',
      name: 'VS Code',
      icon: '/Dock/vs.png',
      category: 'development',
      action: () => {
        onOpenApp?.('vs')
        onClose()
      }
    },
    // Comunicación
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
      id: 'facetime',
      name: 'FaceTime',
      icon: '/Dock/FaceTime.png',
      category: 'communication',
      action: () => {
        onOpenApp?.('facetime')
        onClose()
      }
    },
    // Navegación y mapas
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
    // Sistema
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
      id: 'photos',
      name: 'Photos',
      icon: '/Dock/Photos.png',
      category: 'entertainment',
      action: () => {
        onOpenApp?.('photos')
        onClose()
      }
    },
    // Apps adicionales del sistema macOS
    {
      id: 'app-store',
      name: 'App Store',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxwYXRoIGQ9Ik0zMiAxNkMzMC4zNDMxIDE2IDI5IDEzLjY1NjkgMjkgMTJDMjkgMTAuMzQzMSAzMC4zNDMxIDkgMzIgOUMzMy42NTY5IDkgMzUgMTAuMzQzMSAzNSAxMkMzNSAxMy42NTY5IDMzLjY1NjkgMTYgMzIgMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDQgMjRMMjAgNDhIMjRMNDggMjRINDRaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iNjQiIHkyPSI2NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMDA3QUZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwNTlCNiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
      category: 'system',
      action: () => {
        console.log('App Store clicked')
        onClose()
      }
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiMwRDBEMEQiLz4KPHBhdGggZD0iTTEyIDIwSDUyVjQ0SDEyVjIwWiIgZmlsbD0iIzFBMUExQSIvPgo8cGF0aCBkPSJNMTYgMjhMMjQgMzJMMTYgMzZWMjhaIiBmaWxsPSIjMDBGRjAwIi8+CjxyZWN0IHg9IjI4IiB5PSIzNCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjIiIGZpbGw9IiMwMEZGMDAiLz4KPC9zdmc+Cg==',
      category: 'development',
      action: () => {
        console.log('Terminal clicked')
        onClose()
      }
    },
    {
      id: 'music',
      name: 'Music',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjE2IiBmaWxsPSJ3aGl0ZSIvPgo8Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSI4IiBmaWxsPSIjRkY0NTAwIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSI2NCIgeTI9IjY0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiNGRjQ1MDAiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjRkY4RjAwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
      category: 'entertainment',
      action: () => {
        console.log('Music clicked')
        onClose()
      }
    },
    {
      id: 'preview',
      name: 'Preview',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxyZWN0IHg9IjEyIiB5PSIxMiIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIGZpbGw9IiNGNEY0RjQiLz4KPHJlY3QgeD0iMTYiIHk9IjQ0IiB3aWR0aD0iMzIiIGhlaWdodD0iNCIgZmlsbD0iI0Y0RjRGNCIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDBfbGluZWFyXzFfMSIgeDE9IjAiIHkxPSIwIiB4Mj0iNjQiIHkyPSI2NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjRkZDQjAwIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGOEYwMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=',
      category: 'utilities',
      action: () => {
        console.log('Preview clicked')
        onClose()
      }
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiMzMzMzMzMiLz4KPHJlY3QgeD0iOCIgeT0iOCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzU1NTU1NSIvPgo8cmVjdCB4PSIxMiIgeT0iMTIiIHdpZHRoPSI0MCIgaGVpZ2h0PSIxMiIgZmlsbD0iIzIyMjIyMiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjM2IiByPSI0IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzYiIHI9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iNDQiIGN5PSIzNiIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjQ4IiByPSI0IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iNDgiIHI9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iNDQiIGN5PSI0OCIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K',
      category: 'utilities',
      action: () => {
        console.log('Calculator clicked')
        onClose()
      }
    },
    {
      id: 'contacts',
      name: 'Contacts',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMjQiIHI9IjgiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiA0OEMxNiA0MCAyNCa0IDMyIDQwQzQwIDQwIDQ4IDQwIDQ4IDQ4SDE2WiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQwX2xpbmVhcl8xXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjY0IiB5Mj0iNjQiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iIzg4N0NBRiIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiM2NjU0OEQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8L3N2Zz4K',
      category: 'communication',
      action: () => {
        console.log('Contacts clicked')
        onClose()
      }
    }
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

  const categories = {
    productivity: 'Productividad',
    communication: 'Comunicación',
    entertainment: 'Entretenimiento',
    utilities: 'Utilidades',
    development: 'Desarrollo',
    system: 'Sistema'
  }

  const groupedApps = filteredApps.reduce((groups, app) => {
    if (!groups[app.category]) {
      groups[app.category] = []
    }
    groups[app.category].push(app)
    return groups
  }, {} as Record<string, App[]>)

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] bg-gray-900/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-semibold text-white">Launchpad</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar aplicaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Apps Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {searchQuery ? (
            /* Resultados de búsqueda */
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6">
              {filteredApps.map(app => (
                <button
                  key={app.id}
                  onClick={app.action}
                  className="group flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
                >
                  <div className="w-16 h-16 mb-2 rounded-xl overflow-hidden shadow-lg">
                    <Image
                      src={app.icon}
                      alt={app.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-gray-300 text-center leading-tight group-hover:text-white transition-colors">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            /* Apps agrupadas por categoría */
            <div className="space-y-8">
              {Object.entries(groupedApps).map(([category, apps]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-300 mb-4">
                    {categories[category as keyof typeof categories]}
                  </h3>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6">
                    {apps.map(app => (
                      <button
                        key={app.id}
                        onClick={app.action}
                        className="group flex flex-col items-center p-3 rounded-xl hover:bg-white/10 transition-all duration-200 transform hover:scale-105"
                      >
                        <div className="w-16 h-16 mb-2 rounded-xl overflow-hidden shadow-lg">
                          <Image
                            src={app.icon}
                            alt={app.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-xs text-gray-300 text-center leading-tight group-hover:text-white transition-colors">
                          {app.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
