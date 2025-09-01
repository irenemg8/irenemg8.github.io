"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { DualRowGallery } from '@/components/shared/dual-row-gallery'

interface ArtworksGalleryProps {
  isOpen: boolean
  onClose: () => void
}

export function ArtworksGallery({ isOpen, onClose }: ArtworksGalleryProps) {

  // Artworks items - organizados en 2 filas equilibradas
  const artworkItems = [
    // Fila superior (alineada al bottom)
    {
      id: "forest1",
      img: "/art/forest.png",
      url: "https://example.com/forest",
      height: 280,
      width: 280,
    },
    {
      id: "urbancity",
      img: "/art/urbancity.png", 
      url: "https://example.com/urbancity",
      height: 210,
      width: 240,
    },
    {
      id: "champinon",
      img: "/art/champinon.png",
      url: "https://example.com/champinon",
      height: 220,
      width: 230,
    },
    {
      id: "luna",
      img: "/art/luna.png",
      url: "https://example.com/luna",
      height: 260,
      width: 260,
    },
    {
      id: "nemo",
      img: "/art/nemo.png",
      url: "https://example.com/nemo", 
      height: 235,
      width: 250,
    },
    
    // Fila inferior (alineada al top)
    {
      id: "doll",
      img: "/art/doll.png", 
      url: "https://example.com/doll",
      height: 380,
      width: 210,
    },
    {
      id: "mario",
      img: "/art/mario.png",
      url: "https://example.com/mario", 
      height: 220,
      width: 235,
    },
    {
      id: "icon",
      img: "/art/icon.png",
      url: "https://example.com/icon",
      height: 320,
      width: 260,
    },
    {
      id: "pulpo",
      img: "/art/pulpo.png",
      url: "https://example.com/pulpo",
      height: 265,
      width: 265,
    },
    {
      id: "forest2",
      img: "/art/forest2.png",
      url: "https://example.com/forest2",
      height: 190,
      width: 230,
    }
  ]



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={() => onClose()}
          />

          {/* Masonry Gallery Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-6xl h-full max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* macOS Header */}
              <div className="sticky top-0 z-10 flex items-center h-11 px-4 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b border-gray-300 dark:border-gray-700">
                {/* Traffic Light Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onClose()}
                    className="w-3 h-3 bg-gradient-to-b from-red-400 to-red-500 rounded-full flex items-center justify-center group hover:from-red-500 hover:to-red-600 transition-colors shadow-sm"
                  >
                    <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <div className="w-3 h-3 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center group hover:from-yellow-500 hover:to-yellow-600 transition-colors shadow-sm">
                    <div className="w-1.5 h-0.5 bg-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="w-3 h-3 bg-gradient-to-b from-green-400 to-green-500 rounded-full flex items-center justify-center group hover:from-green-500 hover:to-green-600 transition-colors shadow-sm">
                    <div className="w-1 h-1 bg-green-900 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>

                {/* Window Title */}
                <div className="flex-1 flex justify-center">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Galería de Arte
                    </span>
                </div>
              </div>
              
              {/* Dual Row Gallery Content */}
              <div className="p-6 h-full overflow-hidden">
                <div className="h-[calc(85vh-120px)] w-full">
                  <DualRowGallery
                    items={artworkItems}
                    duration={0.4}
                    stagger={0.12}
                    scaleOnHover={true}
                    hoverScale={0.98}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
        )}
      </AnimatePresence>
  )
}