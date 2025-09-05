"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, ExternalLink, Eye, Heart, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'

interface ArtworkItem {
  id: string
  img: string
  url: string
  title: string
  description?: string
  technique?: string
  year?: string
  category?: string
}

interface MobileArtworksWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileArtworksWindow({ isOpen, onClose }: MobileArtworksWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null)
  const [showArtworkViewer, setShowArtworkViewer] = useState(false)

  // Artworks items con información adicional para móvil
  const artworkItems: ArtworkItem[] = [
    {
      id: "forest1",
      img: "/art/forest.png",
      url: "https://example.com/forest",
      title: "Bosque Encantado",
      description: "Una representación mágica de la naturaleza en su estado más puro",
      technique: "Arte Digital",
      year: "2024",
      category: "Paisajes"
    },
    {
      id: "urbancity",
      img: "/art/urbancity.png", 
      url: "https://example.com/urbancity",
      title: "Ciudad Urbana",
      description: "Visión futurista de la vida urbana moderna",
      technique: "Ilustración Digital",
      year: "2024",
      category: "Urbano"
    },
    {
      id: "champinon",
      img: "/art/champinon.png",
      url: "https://example.com/champinon",
      title: "Reino de los Hongos",
      description: "Exploración del mundo fantástico de los champiñones",
      technique: "Arte Digital",
      year: "2024",
      category: "Fantasía"
    },
    {
      id: "luna",
      img: "/art/luna.png",
      url: "https://example.com/luna",
      title: "Luz de Luna",
      description: "Serenidad nocturna bajo la luz lunar",
      technique: "Pintura Digital",
      year: "2024",
      category: "Nocturno"
    },
    {
      id: "nemo",
      img: "/art/nemo.png",
      url: "https://example.com/nemo", 
      title: "Mundo Submarino",
      description: "Aventura en las profundidades del océano",
      technique: "Ilustración",
      year: "2024",
      category: "Marina"
    },
    {
      id: "doll",
      img: "/art/doll.png", 
      url: "https://example.com/doll",
      title: "Muñeca Vintage",
      description: "Nostalgia y recuerdos de la infancia",
      technique: "Arte Digital",
      year: "2024",
      category: "Retrato"
    },
    {
      id: "mario",
      img: "/art/mario.png",
      url: "https://example.com/mario", 
      title: "Super Mario",
      description: "Homenaje al icónico personaje de videojuegos",
      technique: "Pixel Art",
      year: "2024",
      category: "Gaming"
    },
    {
      id: "icon",
      img: "/art/icon.png",
      url: "https://example.com/icon",
      title: "Icono Abstracto",
      description: "Exploración de formas y colores abstractos",
      technique: "Diseño Digital",
      year: "2024",
      category: "Abstracto"
    },
    {
      id: "pulpo",
      img: "/art/pulpo.png",
      url: "https://example.com/pulpo",
      title: "Pulpo Místico",
      description: "Criatura marina en un entorno mágico",
      technique: "Arte Digital",
      year: "2024",
      category: "Marina"
    },
    {
      id: "forest2",
      img: "/art/forest2.png",
      url: "https://example.com/forest2",
      title: "Bosque Otoñal",
      description: "Colores cálidos del otoño en el bosque",
      technique: "Pintura Digital",
      year: "2024",
      category: "Paisajes"
    }
  ]

  const handleArtworkClick = (artwork: ArtworkItem) => {
    setSelectedArtwork(artwork)
    setShowArtworkViewer(true)
  }

  const handleCloseArtwork = () => {
    setShowArtworkViewer(false)
    setSelectedArtwork(null)
  }

  const handleExternalLink = (url: string) => {
    if (url !== "https://example.com/forest") {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Get unique categories for stats
  const categories = [...new Set(artworkItems.map(item => item.category))].filter(Boolean)

  // Mobile optimized content
  const mobileContent = (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Explora mis obras
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Estas obras digitales han sido creadas con mi pasión por el diseño y la creatividad digital.
        </p>
      </div>

      {/* Artworks grid - Mobile optimized */}
      <div className="grid grid-cols-2 gap-3">
        {artworkItems.map((artwork) => (
          <motion.div
            key={artwork.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md bg-transparent"
            onClick={() => handleArtworkClick(artwork)}
          >
            <Image
              src={artwork.img}
              alt={artwork.title}
              fill
              className="object-contain"
            />
            
            {/* Overlay with title 
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-white font-medium text-sm mb-1">
                  {artwork.title}
                </h4>
                <p className="text-white/80 text-xs">
                  {artwork.technique}
                </p>
              </div>
            </div>*/}

            {/* Category badge 
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                {artwork.category}
              </span>
            </div>*/}
          </motion.div>
        ))}
      </div>

      {/* Quick stats
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
              {artworkItems.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Obras</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {categories.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Categorías</div>
          </div>
          <div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              2024
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Año</div>
          </div>
        </div>
      </div> */}

      {/* Categories list 
      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Categorías
        </h4>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span 
              key={category}
              className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium"
            >
              {category} ({artworkItems.filter(item => item.category === category).length})
            </span>
          ))}
        </div>
      </div>*/}
    </div>
  )

  return (
    <>
      <MobileWindow
        isOpen={isOpen}
        onClose={onClose}
        title="Galería de Arte"
        maxHeight="90vh"
        customGradient="from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-pink-900/20 dark:to-purple-900/20"
      >
        {mobileContent}
      </MobileWindow>

      {/* Artwork Viewer */}
      <AnimatePresence>
        {showArtworkViewer && selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-[60000] flex items-center justify-center p-4"
            onClick={handleCloseArtwork}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-sm w-full transparent rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Artwork image */}
              <div className="aspect-square relative">
                <Image
                  src={selectedArtwork.img}
                  alt={selectedArtwork.title}
                  fill
                  className="object-contain"
                />
              </div>
              
              {/* Artwork details 
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{selectedArtwork.title}</h3>
                    <p className="text-sm text-gray-600">{selectedArtwork.technique} • {selectedArtwork.year}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => handleExternalLink(selectedArtwork.url)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>
                </div>
                
                {selectedArtwork.description && (
                  <p className="text-sm text-gray-700 mb-3">
                    {selectedArtwork.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                    {selectedArtwork.category}
                  </span>
                  
                  <button
                    onClick={handleCloseArtwork}
                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>*/}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
