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

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Keep mini player within viewport bounds
  useEffect(() => {
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
      if (rect.bottom > viewportHeight) {
        newY = viewportHeight - rect.height
      }
      if (rect.top < 0) {
        newY = 0
      }
      
      if (newX !== position.x || newY !== position.y) {
        setPosition({ x: newX, y: newY })
      }
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
      className={`fixed z-50 bg-black/95 backdrop-blur-md rounded-xl border border-green-500/30 shadow-2xl shadow-green-500/20 transition-all duration-200 ${
        isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab hover:scale-105'
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: '320px',
        height: '80px'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-sm -z-10" />
      
      <div className="flex items-center h-full p-3 space-x-3">
        {/* Album cover */}
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{currentSong.title}</p>
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
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              togglePlayPause()
            }}
            className="w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-black" />
            ) : (
              <Play className="w-4 h-4 text-black ml-0.5" />
            )}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextSong()
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Open Spotify button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsSpotifyOpen(true)
            }}
            className="text-green-400 hover:text-green-300 transition-colors ml-2 font-bold text-xs"
          >
            ABRIR
          </button>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setCurrentSong(null)
            }}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-xl overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 relative"
          style={{ 
            width: `${currentSong ? (Date.now() % (currentSong.duration * 1000)) / (currentSong.duration * 10) : 0}%`
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      {/* Spotify logo floating animation */}
      <div className="absolute -top-2 -right-2 text-green-400 opacity-20">
        <div className="animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.062 14.615c-.2.317-.636.417-.953.216-2.61-1.59-5.892-1.95-9.758-1.067-.376.085-.755-.133-.84-.509s.133-.755.509-.84c4.248-.969 7.86-.563 10.766 1.233.317.2.417.636.216.953zm1.36-3.028c-.251.397-.793.52-1.19.269-2.985-1.836-7.54-2.364-11.066-1.295-.47.143-.97-.122-1.113-.592s.122-.97.592-1.113c4.113-1.247 9.265-.683 12.508 1.541.397.251.52.793.269 1.19zm.117-3.157c-3.583-2.128-9.495-2.325-12.913-1.287-.564.171-1.16-.15-1.331-.714s.15-1.16.714-1.331c3.96-1.204 10.54-.969 14.709 1.489.488.289.649.918.36 1.406s-.918.649-1.406.36l-.133-.063z"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
