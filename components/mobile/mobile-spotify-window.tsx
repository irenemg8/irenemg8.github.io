"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Heart, Shuffle, Download } from 'lucide-react'
import { useSpotify, allSongs, type Song } from '@/contexts/spotify-context'
import { MobileWindow } from './mobile-window'
import { useIsMobile } from '@/hooks/use-mobile'

interface MobileSpotifyWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSpotifyWindow({ isOpen, onClose }: MobileSpotifyWindowProps) {
  const {
    currentSong,
    isPlaying,
    currentTime,
    volume,
    setCurrentSong,
    togglePlayPause,
    previousSong,
    nextSong,
    setIsSpotifyOpen
  } = useSpotify()

  const isMobile = useIsMobile()

  // Update Spotify open state
  useEffect(() => {
    setIsSpotifyOpen(isOpen)
  }, [isOpen, setIsSpotifyOpen])

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Like/unlike song
  const toggleLike = (songId: string) => {
    const songIndex = allSongs.findIndex(song => song.id === songId)
    if (songIndex !== -1) {
      allSongs[songIndex].liked = !allSongs[songIndex].liked
    }
  }

  const handleClose = () => {
    setIsSpotifyOpen(false)
    onClose()
  }

  const mobileContent = (
    <div className="space-y-6 pb-24">
      {/* Header with playlist info */}
      <div className="relative">
        <div 
          className="w-full h-48 rounded-2xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C084FC 100%)'
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-4 left-4">
            <Heart className="w-16 h-16 text-white/90" fill="currentColor" />
          </div>
          <div className="absolute bottom-4 left-4">
            <p className="text-white/80 text-sm font-medium">Lista</p>
            <h1 className="text-white text-2xl font-bold">Canciones que te gustan</h1>
            <div className="flex items-center gap-1 mt-1">
              <img 
                src="/profile-ge1.png" 
                alt="Irene" 
                className="w-5 h-5 rounded-full"
              />
              <span className="text-white/90 text-sm">Irene • {allSongs.filter(song => song.liked).length} canciones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
          <Download className="w-6 h-6 text-white/70" />
          <Shuffle className="w-6 h-6 text-white/70" />
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-black" />
          ) : (
            <Play className="w-6 h-6 text-black ml-0.5" />
          )}
        </motion.button>
      </div>

      {/* Song list */}
      <div className="space-y-1">
        {allSongs.map((song, index) => (
          <motion.div
            key={song.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentSong(song)}
            className={`flex items-center gap-4 px-2 py-3 rounded-lg active:bg-white/5 ${
              currentSong?.id === song.id ? 'bg-white/5' : ''
            }`}
          >
            <div className="w-8 text-center">
              <span className="text-white/70 text-sm">
                {index + 1}
              </span>
            </div>
            
            <div className="w-12 h-12 rounded-lg overflow-hidden">
              <img 
                src={song.cover} 
                alt={song.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-base truncate">
                {song.title}
              </p>
              <p className="text-white/70 text-sm truncate">
                {song.artist}
              </p>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                toggleLike(song.id)
              }}
              className="p-2"
            >
              <Heart 
                className={`w-5 h-5 ${
                  song.liked ? 'text-green-400 fill-current' : 'text-white/50'
                }`} 
              />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const playerBar = currentSong && (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 z-[70]"
    >
      {/* Progress bar */}
      <div className="w-full bg-white/20 h-1 rounded-full mb-3 overflow-hidden">
        <div
          className="bg-white h-full transition-all duration-150"
          style={{ width: currentSong ? `${(currentTime / currentSong.duration) * 100}%` : '0%' }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Current song info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden">
            <img 
              src={currentSong.cover} 
              alt={currentSong.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-medium text-sm truncate">
              {currentSong.title}
            </p>
            <p className="text-white/70 text-xs truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={previousSong}
          >
            <SkipBack className="w-6 h-6 text-white/80" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={togglePlayPause}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-black" />
            ) : (
              <Play className="w-5 h-5 text-black ml-0.5" />
            )}
          </motion.button>
          
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={nextSong}
          >
            <SkipForward className="w-6 h-6 text-white/80" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <>
      <MobileWindow
        isOpen={isOpen}
        onClose={handleClose}
        title="Spotify"
        maxHeight="90vh"
        customGradient="from-black via-gray-900 to-black"
      >
        <div className="text-white">
          {mobileContent}
        </div>
      </MobileWindow>

      {/* Player bar - only show when Spotify is open */}
      {isOpen && playerBar}
    </>
  )
}
