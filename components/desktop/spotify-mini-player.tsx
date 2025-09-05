"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSpotify } from '@/contexts/spotify-context'
import { useIsMobile } from '@/hooks/use-mobile'

export function SpotifyMiniPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    previousSong,
    nextSong,
    setCurrentSong,
    setIsSpotifyOpen,
    showMiniPlayer
  } = useSpotify()

  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const miniPlayerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Mostrar el reproductor automáticamente cuando hay una nueva canción
  useEffect(() => {
    if (currentSong && !isVisible) {
      setIsVisible(true)
    }
  }, [currentSong, isVisible])

  // No mostrar en pantallas móviles
  if (isMobile) {
    return null
  }

  // Debug: Crear un mini player visible forzadamente para testing
  const debugMode = false // Cambiar a true para debugging
  
  if (debugMode) {
    return (
      <div className="fixed bottom-20 left-5 z-50 w-80 h-20 bg-red-500 text-white flex items-center justify-center rounded-xl">
        DEBUG: Mini Player - Show: {String(showMiniPlayer)}, Song: {String(!!currentSong)}
      </div>
    )
  }

  // Si no es visible, no mostramos el reproductor
  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      ref={miniPlayerRef}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
             className={`fixed bottom-40 left-60 z-50 select-none bg-black/95 backdrop-blur-sm border border-gray-800 rounded-xl ${
         isDragging ? 'cursor-grabbing' : 'cursor-grab'
       }`}
      style={{
        width: '300px',
        height: '80px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 9999 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
    >
      {/* macOS-style window controls */}
      <div className="absolute top-2 left-3 flex space-x-1">
         <button
           onClick={(e) => {
             e.stopPropagation()
             setCurrentSong(null)  // Parar la música
             setIsVisible(false)   // Ocultar el reproductor
           }}
           className="w-3 h-3 bg-red-500 hover:bg-red-400 rounded-full transition-colors"
           title="Cerrar reproductor"
         />
         <button
           onClick={(e) => {
             e.stopPropagation()
             setCurrentSong(null)  // Parar la música
             setIsVisible(false)   // Ocultar el reproductor
           }}
           className="w-3 h-3 bg-yellow-400 hover:bg-yellow-300 rounded-full transition-colors"
           title="Cerrar reproductor"
         />
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsSpotifyOpen(true)
          }}
          className="w-3 h-3 bg-green-400 hover:bg-green-300 rounded-full transition-colors"
          title="Abrir Spotify"
        />
      </div>

      
      <div className="relative flex items-center h-full p-3 space-x-3 mt-2">
        {/* Album cover */}
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={currentSong?.cover || '/placeholder.svg'} 
            alt={currentSong?.title || 'Sin reproducir'}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-xs truncate">
            {currentSong?.title || 'Sin reproducir'}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {currentSong?.artist || 'Selecciona música'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              previousSong()
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              togglePlayPause()
            }}
            className="w-6 h-6 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 text-black" />
            ) : (
              <Play className="w-3 h-3 text-black ml-0.5" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextSong()
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

       
        </div>
      </div>

      {/* Progress bar at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 rounded-b-xl overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-1000"
          style={{ 
            width: `${currentSong ? (Date.now() % (currentSong.duration * 1000)) / (currentSong.duration * 10) : 0}%`
          }}
        />
      </div>
    </motion.div>
  )
}
