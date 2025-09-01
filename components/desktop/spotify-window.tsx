"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, Search, Home, Library, Plus, Download } from 'lucide-react'

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

interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  songs: Song[]
  createdBy: string
}

interface SpotifyWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function SpotifyWindow({ isOpen, onClose }: SpotifyWindowProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')
  const [selectedView, setSelectedView] = useState('home')
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  // Demo songs
  const demoSongs: Song[] = [
    {
      id: '1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      duration: 355,
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZEIDAwMCIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNGRkZGRkYiPl88L3RleHQ+Cjwvc3ZnPgo=',
      liked: true
    },
    {
      id: '2',
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      album: 'Thriller',
      duration: 295,
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkYwMDAwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiI+TWo8L3RleHQ+Cjwvc3ZnPgo=',
      liked: false
    },
    {
      id: '3',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      duration: 391,
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkY4QzAwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiI+RWE8L3RleHQ+Cjwvc3ZnPgo=',
      liked: true
    },
    {
      id: '4',
      title: 'Sweet Child O\' Mine',
      artist: 'Guns N\' Roses',
      album: 'Appetite for Destruction',
      duration: 356,
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiI+R248L3RleHQ+Cjwvc3ZnPgo=',
      liked: false
    },
    {
      id: '5',
      title: 'Imagine',
      artist: 'John Lennon',
      album: 'Imagine',
      duration: 183,
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjQ4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMDAwMCI+Sks8L3RleHQ+Cjwvc3ZnPgo='
    }
  ]

  // Demo playlists
  const playlists: Playlist[] = [
    {
      id: 'liked',
      name: 'Canciones que te gustan',
      description: 'Tus canciones favoritas',
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50MCkiLz4KPHA8cGF0aCBkPSJNMTAwIDUwQzgwIDUwIDY1IDY1IDY1IDg1QzY1IDEwNSA4MCAxMjAgMTAwIDEyMEMxMjAgMTIwIDEzNSAxMDUgMTM1IDg1QzEzNSA2NSAxMjAgNTAgMTAwIDUwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudDAiIHgxPSIwIiB5MT0iMCIgeDI9IjIwMCIgeTI9IjIwMCI+CjxzdG9wIHN0b3AtY29sb3I9IiMxREI5NTQiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjMjFEQTVBIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+',
      songs: demoSongs.filter(song => song.liked),
      createdBy: 'Tú'
    },
    {
      id: 'rock-classics',
      name: 'Rock Clásicos',
      description: '50 canciones • Rock de los 70s y 80s',
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkY0NTAwIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjY0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiI+🎸PC90ZXh0Pgo8L3N2Zz4K',
      songs: demoSongs,
      createdBy: 'Spotify'
    },
    {
      id: 'chill-vibes',
      name: 'Chill Vibes',
      description: '25 canciones • Música relajante',
      cover: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjODc3RkY3Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjY0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0ZGRkZGRiI+🌙PC90ZXh0Pgo8L3N2Zz4K',
      songs: demoSongs.slice(0, 3),
      createdBy: 'Spotify'
    }
  ]

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Play/pause toggle
  const togglePlayPause = () => {
    if (!currentSong) {
      setCurrentSong(demoSongs[0])
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  // Previous song
  const previousSong = () => {
    if (!currentSong) return
    const currentIndex = demoSongs.findIndex(song => song.id === currentSong.id)
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : demoSongs.length - 1
    setCurrentSong(demoSongs[previousIndex])
  }

  // Next song
  const nextSong = () => {
    if (!currentSong) return
    const currentIndex = demoSongs.findIndex(song => song.id === currentSong.id)
    const nextIndex = currentIndex < demoSongs.length - 1 ? currentIndex + 1 : 0
    setCurrentSong(demoSongs[nextIndex])
  }

  // Like/unlike song
  const toggleLike = (songId: string) => {
    const songIndex = demoSongs.findIndex(song => song.id === songId)
    if (songIndex !== -1) {
      demoSongs[songIndex].liked = !demoSongs[songIndex].liked
      // Force re-render
      setCurrentSong(currentSong ? { ...currentSong } : null)
    }
  }

  // Progress simulation
  useEffect(() => {
    if (isPlaying && currentSong) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentSong.duration) {
            nextSong()
            return 0
          }
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isPlaying, currentSong])

  // Reset time when song changes
  useEffect(() => {
    setCurrentTime(0)
  }, [currentSong])

  const renderContent = () => {
    if (selectedPlaylist) {
      return (
        <div className="p-6">
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="mb-4 text-green-400 hover:text-green-300 text-sm font-medium"
          >
            ← Volver
          </button>
          
          <div className="flex items-end space-x-6 mb-8">
            <div className="w-56 h-56 rounded-lg overflow-hidden shadow-xl">
              <img 
                src={selectedPlaylist.cover} 
                alt={selectedPlaylist.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Playlist</p>
              <h1 className="text-5xl font-bold text-white mb-4">{selectedPlaylist.name}</h1>
              <p className="text-gray-400 mb-4">{selectedPlaylist.description}</p>
              <p className="text-sm text-gray-400">Creada por {selectedPlaylist.createdBy} • {selectedPlaylist.songs.length} canciones</p>
            </div>
          </div>

          <div className="space-y-2">
            {selectedPlaylist.songs.map((song, index) => (
              <div
                key={song.id}
                onClick={() => setCurrentSong(song)}
                className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors group ${
                  currentSong?.id === song.id ? 'bg-white/10' : ''
                }`}
              >
                <div className="w-8 text-center">
                  <span className="text-gray-400 text-sm group-hover:hidden">
                    {currentSong?.id === song.id ? '♪' : index + 1}
                  </span>
                  <Play className="w-4 h-4 text-white hidden group-hover:block" />
                </div>
                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                  <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{song.title}</p>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(song.id)
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    song.liked ? 'text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${song.liked ? 'fill-current' : ''}`} />
                </button>
                <span className="text-gray-400 text-sm">{formatTime(song.duration)}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (selectedView === 'search') {
      const filteredSongs = demoSongs.filter(song => 
        searchQuery === '' || 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )

      return (
        <div className="p-6">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="¿Qué quieres escuchar?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-md pl-12 pr-4 py-3 bg-white/10 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {searchQuery ? (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Resultados</h2>
              <div className="space-y-2">
                {filteredSongs.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => setCurrentSong(song)}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{song.title}</p>
                      <p className="text-gray-400 text-sm">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Busca tus canciones, artistas o álbumes favoritos</p>
            </div>
          )}
        </div>
      )
    }

    // Home view
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-white mb-8">Buenas tardes</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          {playlists.slice(0, 4).map(playlist => (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className="flex items-center bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 cursor-pointer transition-colors group"
            >
              <div className="w-16 h-16 flex-shrink-0">
                <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
              </div>
              <div className="px-4 flex-1">
                <p className="text-white font-medium truncate">{playlist.name}</p>
              </div>
              <div className="p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-green-400" />
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">Hechas para ti</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map(playlist => (
            <div
              key={playlist.id}
              onClick={() => setSelectedPlaylist(playlist)}
              className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800/70 cursor-pointer transition-colors group"
            >
              <div className="relative mb-4">
                <div className="w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                  <Play className="w-5 h-5 text-black" />
                </button>
              </div>
              <h3 className="font-semibold text-white mb-2 truncate">{playlist.name}</h3>
              <p className="text-sm text-gray-400 truncate">{playlist.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-full max-h-[90vh] bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
            <div className="text-2xl font-bold text-green-400">Spotify</div>
          </div>
        </div>

        <div className="flex h-full max-h-[calc(90vh-200px)]">
          {/* Sidebar */}
          <div className="w-60 bg-black border-r border-gray-800 p-6">
            <div className="space-y-4 mb-8">
              <button
                onClick={() => setSelectedView('home')}
                className={`flex items-center space-x-3 w-full text-left transition-colors ${
                  selectedView === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="font-medium">Inicio</span>
              </button>
              <button
                onClick={() => setSelectedView('search')}
                className={`flex items-center space-x-3 w-full text-left transition-colors ${
                  selectedView === 'search' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Search className="w-6 h-6" />
                <span className="font-medium">Buscar</span>
              </button>
              <button
                onClick={() => setSelectedView('library')}
                className={`flex items-center space-x-3 w-full text-left transition-colors ${
                  selectedView === 'library' ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Library className="w-6 h-6" />
                <span className="font-medium">Tu biblioteca</span>
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Playlists</h3>
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => setSelectedPlaylist(playlist)}
                  className="block w-full text-left text-gray-400 hover:text-white transition-colors truncate"
                >
                  {playlist.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-y-auto">
            {renderContent()}
          </div>
        </div>

        {/* Player */}
        <div className="bg-gray-900 border-t border-gray-800 p-4">
          <div className="flex items-center justify-between">
            {/* Current song info */}
            <div className="flex items-center space-x-4 flex-1">
              {currentSong && (
                <>
                  <div className="w-14 h-14 rounded overflow-hidden">
                    <img src={currentSong.cover} alt={currentSong.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{currentSong.title}</p>
                    <p className="text-gray-400 text-xs">{currentSong.artist}</p>
                  </div>
                  <button
                    onClick={() => toggleLike(currentSong.id)}
                    className={`p-2 transition-colors ${
                      currentSong.liked ? 'text-green-400' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${currentSong.liked ? 'fill-current' : ''}`} />
                  </button>
                </>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-2 rounded-full transition-colors ${
                    isShuffled ? 'text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button onClick={previousSong} className="text-gray-400 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlayPause}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-black" />
                  ) : (
                    <Play className="w-5 h-5 text-black ml-0.5" />
                  )}
                </button>
                <button onClick={nextSong} className="text-gray-400 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
                  className={`p-2 rounded-full transition-colors ${
                    repeatMode !== 'off' ? 'text-green-400' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="flex items-center space-x-2 w-full max-w-md">
                <span className="text-xs text-gray-400 w-8">{formatTime(currentTime)}</span>
                <div className="flex-1 bg-gray-600 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-1000"
                    style={{ width: currentSong ? `${(currentTime / currentSong.duration) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-8">
                  {currentSong ? formatTime(currentSong.duration) : '0:00'}
                </span>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-center space-x-2 flex-1 justify-end">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <div className="w-20 bg-gray-600 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
