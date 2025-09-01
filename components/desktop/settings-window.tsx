"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Square, Monitor, Mouse, Keyboard, Volume2, Wifi, Bluetooth, Battery, Shield, User, Bell } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface SettingsWindowProps {
  isOpen: boolean
  onClose: () => void
}

interface SettingsCategory {
  id: string
  name: string
  icon: any
  color: string
}

export function SettingsWindow({ isOpen, onClose }: SettingsWindowProps) {
  const { t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>('general')
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 200, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Settings states
  const [cursorSize, setCursorSize] = useState(1.0)
  const [cursorSpeed, setCursorSpeed] = useState(5)
  const [volume, setVolume] = useState(75)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoLogin, setAutoLogin] = useState(false)

  // Categories for sidebar
  const categories: SettingsCategory[] = [
    { id: 'general', name: 'General', icon: Monitor, color: 'text-gray-600' },
    { id: 'mouse', name: 'Ratón', icon: Mouse, color: 'text-blue-600' },
    { id: 'keyboard', name: 'Teclado', icon: Keyboard, color: 'text-purple-600' },
    { id: 'sound', name: 'Sonido', icon: Volume2, color: 'text-green-600' },
    { id: 'network', name: 'Red', icon: Wifi, color: 'text-cyan-600' },
    { id: 'bluetooth', name: 'Bluetooth', icon: Bluetooth, color: 'text-blue-500' },
    { id: 'battery', name: 'Batería', icon: Battery, color: 'text-yellow-600' },
    { id: 'notifications', name: 'Notificaciones', icon: Bell, color: 'text-red-600' },
    { id: 'users', name: 'Usuarios', icon: User, color: 'text-indigo-600' },
    { id: 'privacy', name: 'Privacidad', icon: Shield, color: 'text-gray-700' },
  ]

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  // Render content based on selected category
  const renderCategoryContent = () => {
    switch (selectedCategory) {
      case 'general':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Configuración General</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cambiar la apariencia del sistema</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Iniciar sesión automáticamente</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Inicia sesión sin contraseña al encender</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={autoLogin}
                    onChange={(e) => setAutoLogin(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )

      case 'mouse':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ratón</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamaño del cursor: {cursorSize.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={cursorSize}
                  onChange={(e) => setCursorSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((cursorSize - 0.5) / 2.5) * 100}%, #d1d5db ${((cursorSize - 0.5) / 2.5) * 100}%, #d1d5db 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Pequeño</span>
                  <span>Grande</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Velocidad del puntero: {cursorSpeed}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={cursorSpeed}
                  onChange={(e) => setCursorSpeed(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(cursorSpeed / 10) * 100}%, #d1d5db ${(cursorSpeed / 10) * 100}%, #d1d5db 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Lento</span>
                  <span>Rápido</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Vista previa del cursor</h3>
                <div className="flex items-center justify-center h-20 bg-white dark:bg-gray-700 rounded border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div 
                    className="bg-black dark:bg-white rounded-full transition-all duration-200"
                    style={{
                      width: `${12 * cursorSize}px`,
                      height: `${12 * cursorSize}px`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'sound':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Sonido</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volumen principal: {volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume}%, #d1d5db ${volume}%, #d1d5db 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>🔇</span>
                  <span>🔊</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Dispositivos de salida</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="output" className="mr-2" defaultChecked />
                      <span className="text-sm">Altavoces internos</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="output" className="mr-2" />
                      <span className="text-sm">Auriculares</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Dispositivos de entrada</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="input" className="mr-2" defaultChecked />
                      <span className="text-sm">Micrófono interno</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="input" className="mr-2" />
                      <span className="text-sm">Micrófono externo</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Notificaciones</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Permitir notificaciones</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recibir alertas y banners</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {notifications && (
                <div className="ml-4 space-y-3 border-l-2 border-blue-200 pl-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar en pantalla de bloqueo</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar banners</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reproducir sonidos</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Próximamente</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Esta sección estará disponible pronto</p>
            </div>
          </div>
        )
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ pointerEvents: 'auto' }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
        
        {/* Settings Window */}
        <motion.div
          className="relative w-[900px] h-[600px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
          animate={{ 
            scale: isMinimized ? 0.95 : 1,
            opacity: isMinimized ? 0.8 : 1 
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title Bar */}
          <div 
            className="flex items-center h-12 px-4 bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 cursor-move"
            onMouseDown={handleMouseDown}
          >
            {/* Traffic Light Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-3 h-3 bg-gradient-to-b from-red-400 to-red-500 rounded-full flex items-center justify-center group hover:from-red-500 hover:to-red-600 transition-colors shadow-sm"
              >
                <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMinimized(!isMinimized)}
                className="w-3 h-3 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center group hover:from-yellow-500 hover:to-yellow-600 transition-colors shadow-sm"
              >
                <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-3 h-3 bg-gradient-to-b from-green-400 to-green-500 rounded-full flex items-center justify-center group hover:from-green-500 hover:to-green-600 transition-colors shadow-sm"
              >
                <Square className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>

            {/* Window Title */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferencias del Sistema</h1>
            </div>
          </div>

          {/* Window Content */}
          <div className="flex h-[calc(100%-48px)]">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 p-4 overflow-y-auto">
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${category.color}`} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderCategoryContent()}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
