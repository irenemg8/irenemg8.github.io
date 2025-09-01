"use client"

import { useState, useEffect } from 'react'
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, Heart, Search, Home, Library } from 'lucide-react'
import { useSpotify, allSongs, type Song } from '@/contexts/spotify-context'

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
  const {
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
    setCurrentTime,
    toggleShuffle,
    toggleRepeat,
    setIsSpotifyOpen
  } = useSpotify()

  const [selectedView, setSelectedView] = useState('home')
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Update Spotify open state
  useEffect(() => {
    setIsSpotifyOpen(isOpen)
  }, [isOpen, setIsSpotifyOpen])

  // Demo playlists
  const playlists: Playlist[] = [
    {
      id: 'liked',
      name: 'Canciones que te gustan',
      description: 'Tus canciones favoritas',
      cover: '/music/reality.jpeg',
      songs: allSongs.filter(song => song.liked),
      createdBy: 'Tú'
    },
    {
      id: 'dance-hits',
      name: 'Dance Hits',
      description: '8 canciones • Los mejores éxitos de baile',
      cover: '/music/levitating.jpeg',
      songs: allSongs,
      createdBy: 'Spotify'
    },
    {
      id: 'chill-vibes',
      name: 'Chill Vibes',
      description: '5 canciones • Música relajante',
      cover: '/music/blindinglights.jpeg',
      songs: allSongs.slice(0, 5),
      createdBy: 'Spotify'
    }
  ]

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
      const filteredSongs = allSongs.filter(song => 
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
              <h2 className="text-2xl font-bold text-white mb-6">Resultados para "{searchQuery}"</h2>
              <div className="space-y-2">
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => setCurrentSong(song)}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/10"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded overflow-hidden">
                        <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{song.title}</p>
                      <p className="text-gray-400 text-sm">{song.artist}</p>
                    </div>
                    <span className="text-gray-400 text-sm">{formatTime(song.duration)}</span>
                  </div>
                ))}
              </div>
              {filteredSongs.length === 0 && (
                <p className="text-gray-400 text-center py-8">No se encontraron resultados</p>
              )}
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
              className="flex items-center bg-white/10 rounded-lg overflow-hidden hover:bg-white/20 cursor-pointer transition-all duration-300 group hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20"
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
              className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800/70 cursor-pointer transition-all duration-300 group hover:scale-105 hover:shadow-xl hover:shadow-green-500/20"
            >
              <div className="relative mb-4">
                <div className="w-full aspect-square rounded-lg overflow-hidden shadow-lg">
                  <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-2 right-2 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg hover:bg-green-300 hover:scale-110 hover:shadow-green-400/50">
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
                onClick={handleClose}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
              />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
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
                  onClick={toggleShuffle}
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
                  onClick={toggleRepeat}
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
                <div className="flex-1 bg-gray-600 h-1 rounded-full overflow-hidden cursor-pointer group relative">
                  <input
                    type="range"
                    min="0"
                    max={currentSong?.duration || 0}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                    className="absolute opacity-0 w-full h-4 cursor-pointer"
                    style={{ marginTop: '-6px' }}
                  />
                  <div
                    className="bg-white h-full transition-all duration-150 group-hover:bg-green-400"
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
              <div className="w-20 bg-gray-600 h-1 rounded-full overflow-hidden cursor-pointer group relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute opacity-0 w-20 h-4 cursor-pointer"
                  style={{ marginTop: '-6px' }}
                />
                <div
                  className="bg-white h-full transition-all duration-150 group-hover:bg-green-400"
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
