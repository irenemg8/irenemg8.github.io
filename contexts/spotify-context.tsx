"use client"

import React, { createContext, useContext, useRef, useEffect, useState, ReactNode } from 'react'
import { getAudioGenerator } from './audio-generator'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioUrl?: string
  liked?: boolean
}

interface SpotifyContextType {
  // Estado del reproductor
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  volume: number
  isShuffled: boolean
  repeatMode: 'off' | 'all' | 'one'
  
  // Controles de reproducción
  setCurrentSong: (song: Song | null) => void
  togglePlayPause: () => void
  previousSong: () => void
  nextSong: () => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  
  // Estado de la app
  isSpotifyOpen: boolean
  setIsSpotifyOpen: (open: boolean) => void
  showMiniPlayer: boolean
  
  // Audio ref
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined)

// Base de datos ampliada de canciones - Simulando la API de Spotify
const allSongs: Song[] = [
  // Canciones solicitadas por el usuario
  {
    id: '1',
    title: 'Reality',
    artist: 'Lost Frequencies',
    album: 'Reality',
    duration: 214,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Reality-Lost-Frequencies-Lyrics-Vietsub.mp3',
    liked: true
  },
  {
    id: '2',
    title: 'Call Me Maybe',
    artist: 'Carly Rae Jepsen',
    album: 'Kiss',
    duration: 193,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Carly-Rae-Jepsen-Call-Me-Maybe-Lyrics.mp3.webm',
    liked: false
  },
  {
    id: '3',
    title: 'Mr. Blue Sky',
    artist: 'Electric Light Orchestra',
    album: 'Out of the Blue',
    duration: 302,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Electric-Light-Orchestra-Mr-Blue-Sky-Lyrics.mp3',
    liked: true
  },
  {
    id: '4',
    title: 'Dancing in the Moonlight',
    artist: 'Toploader',
    album: 'Onka\'s Big Moka',
    duration: 234,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Toploader-Dancing-in-the-Moonlight-Lyrics.mp3',
    liked: false
  },
  {
    id: '5',
    title: 'Sugar',
    artist: 'Robin Schulz',
    album: 'Sugar',
    duration: 235,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Robin-Schulz-Sugar-Lyrics-feat-Francesco-Yates.mp3',
    liked: true
  },

  // Canciones populares adicionales
  {
    id: '6',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--The-Weeknd-Blinding-Lights-Lyrics.mp3',
    liked: true
  },
  {
    id: '7',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Dua-Lipa-Levitating-Feat-DaBaby.mp3',
    liked: false
  },
  {
    id: '8',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'SOUR',
    duration: 178,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Olivia-Rodrigo-good-4-u-Lyrics.mp3',
    liked: true
  },
  {
    id: '9',
    title: 'As It Was',
    artist: 'Harry Styles',
    album: 'Harry\'s House',
    duration: 167,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Harry-Styles-As-It-Was-Lyrics.mp3',
    liked: true
  },
  /*{
    id: '10',
    title: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*CK LOVE 3: OVER YOU',
    duration: 141,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: false
  },
  {
    id: '11',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    album: 'Midnights',
    duration: 201,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: true
  },
  {
    id: '12',
    title: 'Bad Habit',
    artist: 'Steve Lacy',
    album: 'Gemini Rights',
    duration: 222,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: false
  },
  {
    id: '13',
    title: 'Flowers',
    artist: 'Miley Cyrus',
    album: 'Endless Summer Vacation',
    duration: 200,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: true
  },
  {
    id: '14',
    title: 'Unholy',
    artist: 'Sam Smith ft. Kim Petras',
    album: 'Gloria',
    duration: 156,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: false
  },
  {
    id: '15',
    title: 'Something In The Way You Move',
    artist: 'Ellie Goulding',
    album: 'Halcyon',
    duration: 225,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: true
  },
  {
    id: '16',
    title: 'Watermelon Sugar',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: 174,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: false
  },
  {
    id: '17',
    title: 'Heat Waves',
    artist: 'Glass Animals',
    album: 'Dreamland',
    duration: 238,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: true
  },
  {
    id: '18',
    title: 'Circles',
    artist: 'Post Malone',
    album: 'Hollywood\'s Bleeding',
    duration: 215,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: false
  },
  {
    id: '19',
    title: 'Peaches',
    artist: 'Justin Bieber ft. Daniel Caesar, Giveon',
    album: 'Justice',
    duration: 198,
    cover: '/placeholder.svg',
    audioUrl: undefined, // Usar generador de audio
    liked: true
  },
  {
    id: '20',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233,
    cover: '/placeholder.svg',
    audioUrl: '/music/ssvid.net--Ed-Sheeran-Shape-of-You-Lyrics.mp3',
    liked: true
  }*/
]

// Función para obtener una canción aleatoria
const getRandomSong = (): Song => {
  const randomIndex = Math.floor(Math.random() * allSongs.length)
  return allSongs[randomIndex]
}

interface SpotifyProviderProps {
  children: ReactNode
}

export function SpotifyProvider({ children }: SpotifyProviderProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(getRandomSong())
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(0.7)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [isSpotifyOpen, setIsSpotifyOpen] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Mini player visibility logic
  const showMiniPlayer = currentSong !== null && !isSpotifyOpen

  // Sistema de reproducción híbrido (archivos reales + generador sintético)
  useEffect(() => {
    if (!currentSong) {
      // Detener cualquier reproducción
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      const audioGen = getAudioGenerator()
      audioGen.stop()
      return
    }

    if (isPlaying) {
      if (currentSong.audioUrl) {
        // Usar archivo real
        if (audioRef.current) {
          audioRef.current.src = currentSong.audioUrl
          audioRef.current.volume = volume
          audioRef.current.play().catch(err => {
            console.log('Error reproduciendo audio:', err)
            // Fallback al generador sintético si falla
            const audioGen = getAudioGenerator()
            audioGen.play(currentSong.id, volume)
          })
        }
      } else {
        // Usar generador sintético como fallback
        const audioGen = getAudioGenerator()
        audioGen.play(currentSong.id, volume)
        
        // Simular progreso para canciones sintéticas
        const interval = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= currentSong.duration) {
              nextSong()
              return 0
            }
            return prev + 1
          })
        }, 1000)

        return () => {
          clearInterval(interval)
        }
      }
    } else {
      // Pausar reproducción
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audioGen = getAudioGenerator()
      audioGen.stop()
    }

    return () => {
      const audioGen = getAudioGenerator()
      audioGen.stop()
    }
  }, [currentSong, isPlaying])

  // Control volume para ambos sistemas
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
    const audioGen = getAudioGenerator()
    audioGen.setVolume(volume)
  }, [volume])

  // Reset time when song changes
  useEffect(() => {
    setCurrentTime(0)
  }, [currentSong])

  // Configurar eventos del elemento audio HTML5
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (currentSong?.audioUrl) {
        setCurrentTime(Math.floor(audio.currentTime))
      }
    }

    const handleEnded = () => {
      nextSong()
    }

    const handleLoadedMetadata = () => {
      if (currentSong && audio.duration) {
        // Actualizar duración si está disponible en los metadatos
        const duration = Math.floor(audio.duration)
        if (duration !== currentSong.duration) {
          console.log(`Duración real: ${duration}s para ${currentSong.title}`)
        }
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [currentSong?.audioUrl])

  const togglePlayPause = () => {
    if (!currentSong) {
      setCurrentSong(allSongs[0])
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const previousSong = () => {
    if (!currentSong) return
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : allSongs.length - 1
    setCurrentSong(allSongs[previousIndex])
  }

  const nextSong = () => {
    if (!currentSong) return
    const currentIndex = allSongs.findIndex(song => song.id === currentSong.id)
    const nextIndex = currentIndex < allSongs.length - 1 ? currentIndex + 1 : 0
    setCurrentSong(allSongs[nextIndex])
  }

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume)
  }

  const setCurrentTimeManual = (time: number) => {
    setCurrentTime(time)
    
    // Ajustar tiempo tanto en archivos reales como sintéticos
    if (currentSong?.audioUrl && audioRef.current) {
      // Para archivos reales, ajustar la posición del audio
      audioRef.current.currentTime = time
    } else {
      // Para canciones sintéticas, solo actualizar el estado
      // (el generador sintético no soporta seek)
    }
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const toggleRepeat = () => {
    setRepeatMode(current => 
      current === 'off' ? 'all' : 
      current === 'all' ? 'one' : 'off'
    )
  }

  const value: SpotifyContextType = {
    currentSong,
    isPlaying,
    currentTime,
    volume,
    isShuffled,
    repeatMode,
    setCurrentSong,
    togglePlayPause,
    previousSong,
    nextSong,
    setVolume,
    setCurrentTime: setCurrentTimeManual,
    toggleShuffle,
    toggleRepeat,
    isSpotifyOpen,
    setIsSpotifyOpen,
    showMiniPlayer,
    audioRef
  }

  return (
    <SpotifyContext.Provider value={value}>
      {/* Elemento audio HTML5 oculto para reproducir archivos reales */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        style={{ display: 'none' }}
      />
      {children}
    </SpotifyContext.Provider>
  )
}

export function useSpotify() {
  const context = useContext(SpotifyContext)
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider')
  }
  return context
}

export { allSongs }
export type { Song }
