"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { 
  Wifi, 
  Bluetooth, 
  Signal, 
  Flashlight, 
  RotateCcw,
  Volume2,
  Sun,
  Moon,
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X
} from 'lucide-react'
import { useSpotify } from '@/contexts/spotify-context'

interface MobileControlCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileControlCenter({ isOpen, onClose }: MobileControlCenterProps) {
  const [brightness, setBrightness] = useState(70)
  const [volume, setVolume] = useState(50)
  const [isWifiOn, setIsWifiOn] = useState(true)
  const [isBluetoothOn, setIsBluetoothOn] = useState(true)
  const [isFlashlightOn, setIsFlashlightOn] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isRotationLocked, setIsRotationLocked] = useState(false)
  const [flashlightStream, setFlashlightStream] = useState<MediaStream | null>(null)
  const constraintsRef = useRef(null)
  
  const customColor = "#C9A3DC"
  const customColorDark = "#B091C7"
  
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    previousSong,
    nextSong,
    setVolume: setSpotifyVolume
  } = useSpotify()

  // Detectar gesto de deslizar hacia arriba para cerrar
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.velocity.y < -500 || info.offset.y < -150) {
      handleClose()
    }
  }

  // Funciones para controlar dispositivos reales
  
  // Feedback háptico
  const hapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50) // Vibración suave de 50ms
    }
  }
  
  // Linterna
  const toggleFlashlight = async () => {
    hapticFeedback()
    if (!isFlashlightOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        const track = stream.getVideoTracks()[0]
        const capabilities = track.getCapabilities()
        
        if ('torch' in capabilities) {
          await track.applyConstraints({
            advanced: [{ torch: true } as any]
          })
          setFlashlightStream(stream)
          setIsFlashlightOn(true)
        } else {
          console.log('Linterna no disponible en este dispositivo')
          // Fallback: usar flash de la pantalla
          document.body.style.backgroundColor = '#ffffff'
          document.body.style.opacity = '0.9'
          setIsFlashlightOn(true)
        }
      } catch (error) {
        console.log('Error al acceder a la linterna:', error)
        // Fallback: flash de pantalla
        document.body.style.backgroundColor = '#ffffff'
        document.body.style.opacity = '0.9'
        setIsFlashlightOn(true)
      }
    } else {
      if (flashlightStream) {
        const track = flashlightStream.getVideoTracks()[0]
        track.stop()
        setFlashlightStream(null)
      } else {
        // Restaurar estilo original
        document.body.style.backgroundColor = ''
        document.body.style.opacity = ''
      }
      setIsFlashlightOn(false)
    }
  }

  // Modo oscuro
  const toggleDarkMode = () => {
    hapticFeedback()
    setIsDarkMode(!isDarkMode)
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      if (!isDarkMode) {
        html.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        html.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }

  // Rotación de pantalla
  const toggleRotation = async () => {
    hapticFeedback()
    try {
      if ('screen' in window && 'orientation' in screen) {
        if (isRotationLocked) {
          await (screen.orientation as any).unlock()
          setIsRotationLocked(false)
        } else {
          await screen.orientation.lock('portrait')
          setIsRotationLocked(true)
        }
      }
    } catch (error) {
      console.log('Control de rotación no disponible:', error)
      setIsRotationLocked(!isRotationLocked) // Solo cambiar estado visual
    }
  }

  // WiFi (simulado - no hay API real para esto)
  const toggleWifi = () => {
    hapticFeedback()
    setIsWifiOn(!isWifiOn)
    // En un entorno real necesitarías permisos de sistema operativo
    console.log('WiFi toggled:', !isWifiOn)
  }

  // Bluetooth
  const toggleBluetooth = async () => {
    hapticFeedback()
    try {
      if ('bluetooth' in navigator) {
        if (!isBluetoothOn) {
          await (navigator as any).bluetooth.requestDevice({
            acceptAllDevices: true
          })
          setIsBluetoothOn(true)
        } else {
          setIsBluetoothOn(false)
        }
      } else {
        console.log('Bluetooth API no disponible')
        setIsBluetoothOn(!isBluetoothOn) // Solo cambiar estado visual
      }
    } catch (error) {
      console.log('Error con Bluetooth:', error)
      setIsBluetoothOn(!isBluetoothOn) // Solo cambiar estado visual
    }
  }

  // Detectar modo oscuro inicial
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const isDark = savedTheme === 'dark' || (!savedTheme && systemDark)
      setIsDarkMode(isDark)
    }
  }, [])

  // Actualizar volumen de Spotify cuando cambie el volumen del control center
  useEffect(() => {
    setSpotifyVolume(volume / 100)
  }, [volume, setSpotifyVolume])

  // Control de brillo (simulado con filtro CSS)
  const handleBrightnessChange = (newBrightness: number) => {
    setBrightness(newBrightness)
    // Aplicar filtro de brillo al body (simulado)
    const brightnessValue = newBrightness / 100
    document.body.style.filter = `brightness(${brightnessValue})`
  }

  // Control de volumen del sistema (usando Web Audio API)
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    // También actualizar volumen de Spotify
    setSpotifyVolume(newVolume / 100)
  }

  // Restaurar brillo al cerrar
  const handleClose = () => {
    document.body.style.filter = ''
    onClose()
  }

  // Limpiar stream de linterna al cerrar
  useEffect(() => {
    return () => {
      if (flashlightStream) {
        flashlightStream.getVideoTracks().forEach(track => track.stop())
      }
      // Restaurar estilos al desmontar
      document.body.style.filter = ''
      document.body.style.backgroundColor = ''
      document.body.style.opacity = ''
    }
  }, [flashlightStream])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            ref={constraintsRef}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 100 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200 
            }}
            className="absolute top-0 left-0 right-0 bg-gray-100/95 dark:bg-gray-900/95 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle indicator */}
            <div className="flex justify-center pt-2 pb-4">
              <div 
                className="w-8 h-1 rounded-full opacity-60" 
                style={{ background: `linear-gradient(90deg, ${customColor}, ${customColorDark})` }}
              />
            </div>

            {/* Close button 
            <div className="absolute top-4 right-4">
              <button
                onClick={handleClose}
                className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>*/}

            <div className="px-6 pb-6">
              {/* Connectivity Controls */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* WiFi Card */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleWifi}
                  className={`p-4 rounded-2xl cursor-pointer ${
                    isWifiOn 
                      ? 'text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  style={isWifiOn ? { 
                    background: `linear-gradient(135deg, ${customColor} 0%, ${customColorDark} 100%)` 
                  } : {}}
                >
                  <Wifi className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Wi-Fi</p>
                  <p className="text-xs opacity-70">
                    {isWifiOn ? 'Casa' : 'Desactivado'}
                  </p>
                </motion.div>

                {/* Bluetooth Card */}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleBluetooth}
                  className={`p-4 rounded-2xl cursor-pointer ${
                    isBluetoothOn 
                      ? 'text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  style={isBluetoothOn ? { 
                    background: `linear-gradient(135deg, ${customColor} 0%, ${customColorDark} 100%)` 
                  } : {}}
                >
                  <Bluetooth className="w-8 h-8 mb-2" />
                  <p className="text-sm font-medium">Bluetooth</p>
                  <p className="text-xs opacity-70">
                    {isBluetoothOn ? 'Conectado' : 'Desactivado'}
                  </p>
                </motion.div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {/* Flashlight */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleFlashlight}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center ${
                    isFlashlightOn 
                      ? 'text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  style={isFlashlightOn ? { 
                    background: `linear-gradient(135deg, ${customColor} 0%, ${customColorDark} 100%)` 
                  } : {}}
                >
                  <Flashlight className="w-6 h-6 mb-1" />
                  <span className="text-xs">Linterna</span>
                </motion.button>

                {/* Screen Rotation */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleRotation}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center ${
                    isRotationLocked 
                      ? 'text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  style={isRotationLocked ? { 
                    background: `linear-gradient(135deg, ${customColor} 0%, ${customColorDark} 100%)` 
                  } : {}}
                >
                  <RotateCcw className="w-6 h-6 mb-1" />
                  <span className="text-xs">Rotación</span>
                </motion.button>

                {/* Dark Mode */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleDarkMode}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center ${
                    isDarkMode 
                      ? 'text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  style={isDarkMode ? { 
                    background: `linear-gradient(135deg, ${customColor} 0%, ${customColorDark} 100%)` 
                  } : {}}
                >
                  {isDarkMode ? <Moon className="w-6 h-6 mb-1" /> : <Sun className="w-6 h-6 mb-1" />}
                  <span className="text-xs">Modo</span>
                </motion.button>

                {/* Music - Toggle Spotify */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => currentSong ? togglePlayPause() : null}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center ${
                    currentSong && isPlaying
                      ? 'text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  style={currentSong && isPlaying ? { 
                    background: `linear-gradient(135deg, ${customColor} 0%, ${customColorDark} 100%)` 
                  } : {}}
                >
                  <Music className="w-6 h-6 mb-1" />
                  <span className="text-xs">Música</span>
                </motion.button>
              </div>

              {/* Brightness Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Brillo</span>
                  <Sun className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={brightness}
                    onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider-lavender"
                  />
                </div>
              </div>

              {/* Volume Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Volumen</span>
                  <Volume2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider-lavender"
                  />
                </div>
              </div>

              {/* Music Player (if song is playing) */}
              {currentSong && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {currentSong.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {currentSong.artist}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={previousSong}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      <SkipBack className="w-6 h-6" />
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePlayPause}
                      className="w-12 h-12 text-white rounded-full flex items-center justify-center shadow-lg"
                      style={{ 
                        background: `linear-gradient(135deg, ${customColor} 0%, ${customColorDark} 100%)` 
                      }}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={nextSong}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      <SkipForward className="w-6 h-6" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}