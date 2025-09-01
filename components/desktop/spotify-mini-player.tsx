"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react'
import { useSpotify } from '@/contexts/spotify-context'

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

  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const miniPlayerRef = useRef<HTMLDivElement>(null)

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!miniPlayerRef.current) return
    
    setIsDragging(true)
    const rect = miniPlayerRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    
    e.preventDefault()
  }

  // Handle mouse move - optimized for smooth dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      e.preventDefault()
      requestAnimationFrame(() => {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        })
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Set initial position at bottom left and keep within viewport bounds
  useEffect(() => {
    const setInitialPosition = () => {
      // Position at bottom left, avoiding dock (dock is typically 80px high)
      const initialY = window.innerHeight - 170 // 70px height + 100px margin from bottom
      setPosition({ x: 20, y: initialY })
    }

    const keepInBounds = () => {
      if (!miniPlayerRef.current) return
      
      const rect = miniPlayerRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      let newX = position.x
      let newY = position.y
      
      if (rect.right > viewportWidth) {
        newX = viewportWidth - rect.width
      }
      if (rect.left < 0) {
        newX = 0
      }
      // Keep above dock area (bottom 100px)
      if (rect.bottom > viewportHeight - 100) {
        newY = viewportHeight - rect.height - 100
      }
      if (rect.top < 0) {
        newY = 0
      }
      
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY })
      }
    }

    // Set initial position only once
    if (position.x === 20 && position.y === 20) {
      setInitialPosition()
    }

    keepInBounds()
    window.addEventListener('resize', keepInBounds)
    return () => window.removeEventListener('resize', keepInBounds)
  }, [position])

  if (!showMiniPlayer || !currentSong) {
    return null
  }

  return (
    <div
      ref={miniPlayerRef}
      className={`fixed z-50 bg-black/95 backdrop-blur-sm border border-gray-800 rounded-xl transition-all duration-200 ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: '300px',
        height: '80px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.1)',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* macOS-style window controls */}
      <div className="absolute top-2 left-3 flex space-x-1">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setCurrentSong(null)
          }}
          className="w-3 h-3 bg-red-500 hover:bg-red-400 rounded-full transition-colors"
        />
        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
        <div className="w-3 h-3 bg-green-400 rounded-full" />
      </div>
      
      <div className="relative flex items-center h-full p-3 space-x-3 mt-2">
        {/* Album cover */}
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-xs truncate">{currentSong.title}</p>
          <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
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
    </div>
  )
}
