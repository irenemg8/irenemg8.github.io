"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Music, Disc3 } from "lucide-react"
import { Howl } from "howler"

interface Track {
  id: string
  title: string
  artist: string
  url: string
  duration: number
}

// Lo-fi tracks playlist (en producción usarías URLs reales)
const lofiTracks: Track[] = [
  {
    id: "1",
    title: "Midnight Study",
    artist: "Chill Beats",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    duration: 180
  },
  {
    id: "2", 
    title: "Rain on Window",
    artist: "Ambient Sounds",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    duration: 210
  },
  {
    id: "3",
    title: "Coffee Shop Vibes",
    artist: "Lo-Fi Hip Hop",
    url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder
    duration: 195
  }
]

export function FloatingMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.3)
  const [isMuted, setIsMuted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isEnabled, setIsEnabled] = useState(false)
  
  const soundRef = useRef<Howl | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      setIsEnabled(true)
    }

    document.addEventListener('click', enableAudio, { once: true })
    document.addEventListener('keydown', enableAudio, { once: true })

    return () => {
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('keydown', enableAudio)
    }
  }, [])

  // Load track
  useEffect(() => {
    if (!isEnabled) return

    if (soundRef.current) {
      soundRef.current.unload()
    }

    const track = lofiTracks[currentTrack]
    soundRef.current = new Howl({
      src: [track.url],
      loop: false,
      volume: isMuted ? 0 : volume,
      onend: () => {
        nextTrack()
      },
      onload: () => {
        console.log(`Loaded: ${track.title}`)
      },
      onloaderror: (id, error) => {
        console.log('Audio load error:', error)
        // Fallback to next track
        nextTrack()
      }
    })

    return () => {
      if (soundRef.current) {
        soundRef.current.unload()
      }
    }
  }, [currentTrack, isEnabled])

  // Update volume
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : volume)
    }
  }, [volume, isMuted])

  // Progress tracking
  useEffect(() => {
    if (isPlaying && soundRef.current) {
      progressInterval.current = setInterval(() => {
        if (soundRef.current && soundRef.current.playing()) {
          const seek = soundRef.current.seek()
          const duration = soundRef.current.duration()
          setProgress((seek / duration) * 100)
        }
      }, 1000)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (!soundRef.current || !isEnabled) return

    if (isPlaying) {
      soundRef.current.pause()
    } else {
      soundRef.current.play()
      
      // Trigger music achievement
      if (typeof window !== 'undefined' && (window as any).portfolioAchievements) {
        (window as any).portfolioAchievements.triggerMusicAchievement()
      }
    }
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % lofiTracks.length)
    setProgress(0)
    if (isPlaying) {
      setTimeout(() => {
        soundRef.current?.play()
      }, 100)
    }
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + lofiTracks.length) % lofiTracks.length)
    setProgress(0)
    if (isPlaying) {
      setTimeout(() => {
        soundRef.current?.play()
      }, 100)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) {
      setIsMuted(false)
    }
  }

  const currentTrackData = lofiTracks[currentTrack]

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 3, duration: 0.8, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-40"
    >
      <AnimatePresence>
        {isMinimized ? (
          <motion.button
            key="minimized"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMinimized(false)}
            className="relative w-14 h-14 bg-gradient-to-br from-lavender-500 to-lilac-600 rounded-full shadow-lg flex items-center justify-center text-white overflow-hidden group"
          >
            {/* Rotating disc animation */}
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ 
                duration: 4, 
                repeat: isPlaying ? Infinity : 0, 
                ease: "linear" 
              }}
              className="absolute inset-2 border border-white/30 rounded-full"
            />
            
            {/* Vinyl record effect */}
            <motion.div
              animate={{ rotate: isPlaying ? -360 : 0 }}
              transition={{ 
                duration: 3, 
                repeat: isPlaying ? Infinity : 0, 
                ease: "linear" 
              }}
              className="absolute inset-3 bg-gradient-to-br from-lavender-600 to-lilac-700 rounded-full"
            />
            
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0, scale: isPlaying ? [1, 1.1, 1] : 1 }}
              transition={{ 
                duration: 2, 
                repeat: isPlaying ? Infinity : 0,
                ease: "easeInOut"
              }}
            >
              <Music size={20} className="relative z-10" />
            </motion.div>

            {/* Pulsing glow when playing */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 bg-lavender-400 rounded-full opacity-40"
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Status indicator */}
            <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-white ${
              isPlaying ? 'bg-green-400' : 'bg-gray-400'
            }`} />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-lavender-200 dark:border-lavender-800 p-4 w-80"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
                >
                  <Disc3 size={20} className="text-lavender-500" />
                </motion.div>
                <span className="font-medium text-sm text-foreground">Lo-Fi Ambient</span>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Track info */}
            <div className="mb-4">
              <h3 className="font-semibold text-foreground truncate">
                {currentTrackData.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {currentTrackData.artist}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-lavender-500 to-lilac-600 h-1 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevTrack}
                className="text-muted-foreground hover:text-lavender-500 transition-colors"
              >
                <SkipBack size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-12 h-12 bg-gradient-to-br from-lavender-500 to-lilac-600 rounded-full flex items-center justify-center text-white shadow-lg"
                disabled={!isEnabled}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextTrack}
                className="text-muted-foreground hover:text-lavender-500 transition-colors"
              >
                <SkipForward size={20} />
              </motion.button>
            </div>

            {/* Volume controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-muted-foreground hover:text-lavender-500 transition-colors"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, hsl(270, 50%, 65%) 0%, hsl(270, 50%, 65%) ${(isMuted ? 0 : volume) * 100}%, #e5e7eb ${(isMuted ? 0 : volume) * 100}%, #e5e7eb 100%)`
                }}
              />
            </div>

            {!isEnabled && (
              <div className="mt-2 text-xs text-center text-muted-foreground">
                Haz clic en cualquier lugar para habilitar audio
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(270, 50%, 65%);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(270, 50%, 65%);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </motion.div>
  )
}