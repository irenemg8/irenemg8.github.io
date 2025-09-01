"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Search, Star, Download, Crown, Gamepad2, Camera, Music, Code, Calculator, Palette, Globe } from 'lucide-react'

interface App {
  id: string
  name: string
  developer: string
  category: string
  price: string
  rating: number
  reviews: number
  description: string
  icon: string
  screenshots: string[]
  size: string
  version: string
  featured?: boolean
}

interface AppStoreWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function AppStoreWindow({ isOpen, onClose }: AppStoreWindowProps) {
  const [selectedCategory, setSelectedCategory] = useState('Featured')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState<App | null>(null)

  const categories = [
    { id: 'Featured', name: 'Destacados', icon: Crown },
    { id: 'Games', name: 'Juegos', icon: Gamepad2 },
    { id: 'Productivity', name: 'Productividad', icon: Code },
    { id: 'Photo', name: 'Fotografía', icon: Camera },
    { id: 'Music', name: 'Música', icon: Music },
    { id: 'Utilities', name: 'Utilidades', icon: Calculator },
    { id: 'Graphics', name: 'Gráficos', icon: Palette },
    { id: 'Social', name: 'Social', icon: Globe }
  ]

  const apps: App[] = [
    {
      id: '1',
      name: 'Final Cut Pro',
      developer: 'Apple',
      category: 'Video',
      price: '299,99 €',
      rating: 4.5,
      reviews: 2847,
      description: 'Editor de video profesional con funciones avanzadas de postproducción y efectos visuales.',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiMxNDE0MTQiLz4KPHBhdGggZD0iTTMyIDEyTDQ4IDMyTDMyIDUyTDE2IDMyTDMyIDEyWiIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K',
      screenshots: ['screenshot1.jpg', 'screenshot2.jpg'],
      size: '3.1 GB',
      version: '10.8',
      featured: true
    },
    {
      id: '2',
      name: 'Logic Pro',
      developer: 'Apple',
      category: 'Music',
      price: '199,99 €',
      rating: 4.7,
      reviews: 1923,
      description: 'Estación de trabajo de audio digital completa para compositores y productores musicales.',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiMzMzMzMzMiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMTYiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iOCIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K',
      screenshots: ['screenshot1.jpg', 'screenshot2.jpg'],
      size: '1.7 GB',
      version: '10.8.1',
      featured: true
    },
    {
      id: '3',
      name: 'Photoshop',
      developer: 'Adobe Inc.',
      category: 'Photo',
      price: '24,19 €/mes',
      rating: 4.2,
      reviews: 5621,
      description: 'El editor de imágenes más potente del mundo con herramientas profesionales.',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiMwMDFkMjYiLz4KPHN0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzMxYThmZiI+UHM8L3RleHQ+Cjwvc3ZnPgo=',
      screenshots: ['screenshot1.jpg', 'screenshot2.jpg'],
      size: '1.8 GB',
      version: '25.1.0'
    },
    {
      id: '4',
      name: 'Minecraft',
      developer: 'Mojang Studios',
      category: 'Games',
      price: '26,95 €',
      rating: 4.8,
      reviews: 12847,
      description: 'Juego de construcción y aventura en un mundo de bloques infinito.',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiM3NDUwM0UiLz4KPHJlY3QgeD0iMTYiIHk9IjE2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiM5Njc5NTkiLz4KPHJlY3QgeD0iMzIiIHk9IjE2IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiM4RDcwNTMiLz4KPHJlY3QgeD0iMTYiIHk9IjMyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiM4RDcwNTMiLz4KPHJlY3QgeD0iMzIiIHk9IjMyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9IiM5Njc5NTkiLz4KPC9zdmc+Cg==',
      screenshots: ['screenshot1.jpg', 'screenshot2.jpg'],
      size: '1.2 GB',
      version: '1.20.4',
      featured: true
    },
    {
      id: '5',
      name: 'Notion',
      developer: 'Notion Labs',
      category: 'Productivity',
      price: 'Gratis',
      rating: 4.6,
      reviews: 3421,
      description: 'Espacio de trabajo todo en uno para notas, tareas, wikis y bases de datos.',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTIwIDIwSDQ0VjQ0SDIwVjIwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNMjQgMjhIMzJWMzZIMjRWMjhaIiBmaWxsPSIjRkZGRkZGIi8+Cjwvdmc+Cg==',
      screenshots: ['screenshot1.jpg', 'screenshot2.jpg'],
      size: '89.5 MB',
      version: '3.1.0'
    },
    {
      id: '6',
      name: 'Figma',
      developer: 'Figma Inc.',
      category: 'Graphics',
      price: 'Gratis',
      rating: 4.4,
      reviews: 2156,
      description: 'Herramienta de diseño colaborativo para interfaces y prototipos.',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTYiIGZpbGw9IiMxRTE4MjQiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMiIgcj0iOCIgZmlsbD0iI0ZGNzI2MiIvPgo8cmVjdCB4PSIyNCIgeT0iMTYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjgiIGZpbGw9IiNGRjcyNjIiLz4KPHJlY3QgeD0iMjQiIHk9IjMyIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHJ4PSI4IiBmaWxsPSIjMUFCQ0ZFIi8+Cjwvc3ZnPgo=',
      screenshots: ['screenshot1.jpg', 'screenshot2.jpg'],
      size: '156.3 MB',
      version: '116.15.4'
    }
  ]

  const filteredApps = apps.filter(app => {
    if (selectedCategory === 'Featured') {
      return app.featured || true
    }
    if (selectedCategory === 'Games') return app.category === 'Games'
    if (selectedCategory === 'Productivity') return app.category === 'Productivity'
    if (selectedCategory === 'Photo') return app.category === 'Photo'
    if (selectedCategory === 'Music') return app.category === 'Music'
    if (selectedCategory === 'Graphics') return app.category === 'Graphics'
    return true
  }).filter(app => 
    searchQuery === '' || 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.developer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 fill-yellow-400/50 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />)
    }

    return stars
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-full max-h-[90vh] macos-glass rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-gray-700/20">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-white/10 dark:border-gray-700/30">
          <div className="flex items-center space-x-3">
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
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">App Store</h2>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10 dark:border-gray-700/30">
          <div className="relative max-w-md mx-auto">
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

        <div className="flex h-full max-h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-48 p-4 border-r border-white/10 dark:border-gray-700/30 overflow-y-auto">
            <div className="space-y-1">
              {categories.map(category => {
                const IconComponent = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedApp ? (
              /* App Detail View */
              <div className="p-6">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="mb-4 text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  ← Volver
                </button>
                
                <div className="flex items-start space-x-6 mb-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                    <img 
                      src={selectedApp.icon} 
                      alt={selectedApp.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      {selectedApp.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{selectedApp.developer}</p>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        {renderStars(selectedApp.rating)}
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          {selectedApp.rating} ({selectedApp.reviews.toLocaleString()})
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {selectedApp.size} • v{selectedApp.version}
                      </span>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>{selectedApp.price === 'Gratis' ? 'Descargar' : selectedApp.price}</span>
                    </button>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none">
                  <h3>Descripción</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedApp.description}</p>
                </div>
              </div>
            ) : (
              /* Apps Grid */
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                  {categories.find(c => c.id === selectedCategory)?.name || 'Todas las apps'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredApps.map(app => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all cursor-pointer border border-white/10 dark:border-gray-700/20"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                          <img 
                            src={app.icon} 
                            alt={app.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {app.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {app.developer}
                          </p>
                          <div className="flex items-center space-x-1 mt-2">
                            {renderStars(app.rating)}
                            <span className="text-xs text-gray-500 ml-1">
                              ({app.reviews})
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {app.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
