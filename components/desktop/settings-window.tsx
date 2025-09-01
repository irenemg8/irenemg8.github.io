"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Square, Monitor, Mouse, Keyboard, Volume2, Wifi, Bluetooth, Battery, Shield, User, Bell } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useSettings } from '@/contexts/settings-context'

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
  const { settings, updateSetting } = useSettings()
  const [selectedCategory, setSelectedCategory] = useState<string>('general')
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 200, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

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
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">General</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configuración básica del sistema</p>
            </div>

            {/* Información del dispositivo */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-100 dark:border-gray-600">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">CherryBook Pro de Irene</h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Modelo:</span>
                      <span className="font-medium">CherryBook Pro (15 pulgadas, 2025)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Procesador:</span>
                      <span className="font-medium">Intel Core i9</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Memoria:</span>
                      <span className="font-medium">1 TB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Almacenamiento:</span>
                      <span className="font-medium">512 GB SSD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sistema Operativo:</span>
                      <span className="font-medium">Pu 8.6</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Número de serie:</span>
                      <span className="font-medium text-xs">PVCH1PU/02</span>

                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cambiar la apariencia del sistema</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.darkMode}
                    onChange={(e) => updateSetting('darkMode', e.target.checked)}
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
                    checked={settings.autoLogin}
                    onChange={(e) => updateSetting('autoLogin', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        )

      case 'mouse':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Ratón</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Configura el comportamiento del ratón y el trackpad</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tamaño del cursor: {settings.cursorSize.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={settings.cursorSize}
                  onChange={(e) => updateSetting('cursorSize', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((settings.cursorSize - 0.5) / 2.5) * 100}%, #d1d5db ${((settings.cursorSize - 0.5) / 2.5) * 100}%, #d1d5db 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Pequeño</span>
                  <span>Grande</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Velocidad del puntero: {settings.cursorSpeed}
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.cursorSpeed}
                    onChange={(e) => updateSetting('cursorSpeed', parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 range-slider"
                    style={{
                      background: `linear-gradient(to right, #10b981 0%, #10b981 ${(settings.cursorSpeed / 10) * 100}%, #e5e7eb ${(settings.cursorSpeed / 10) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Lento</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Normal</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Rápido</span>
                  </div>
                  {/* Indicador visual */}
                  <div className="flex justify-between mt-1 px-1">
                    {Array.from({length: 10}, (_, i) => (
                      <div 
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          i + 1 <= settings.cursorSpeed 
                            ? 'bg-emerald-500' 
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-base">Vista previa del cursor</h3>
                <div className="flex items-center justify-center h-24 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <motion.div 
                    className="bg-black dark:bg-white rounded-full"
                    style={{
                      width: `${12 * settings.cursorSize}px`,
                      height: `${12 * settings.cursorSize}px`,
                    }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'sound':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Sonido</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Controla el volumen y los dispositivos de audio</p>
            </div>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Volumen principal: {settings.volume}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => updateSetting('volume', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${settings.volume}%, #d1d5db ${settings.volume}%, #d1d5db 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Silencio</span>
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Máximo</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-base">Dispositivos de salida</h3>
                  <div className="space-y-3">
                    <label className="flex items-center group cursor-pointer">
                      <input type="radio" name="output" className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600">Altavoces internos</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input type="radio" name="output" className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600">Auriculares</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-base">Dispositivos de entrada</h3>
                  <div className="space-y-3">
                    <label className="flex items-center group cursor-pointer">
                      <input type="radio" name="input" className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600">Micrófono interno</span>
                    </label>
                    <label className="flex items-center group cursor-pointer">
                      <input type="radio" name="input" className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600">Micrófono externo</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Notificaciones</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Gestiona cómo y cuándo recibes notificaciones</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">Permitir notificaciones</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Recibir alertas y banners</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.notifications}
                    onChange={(e) => updateSetting('notifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {settings.notifications && (
                <div className="ml-4 space-y-3 border-l-2 border-blue-200 pl-4">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-3" 
                      checked={settings.showOnLockScreen}
                      onChange={(e) => updateSetting('showOnLockScreen', e.target.checked)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar en pantalla de bloqueo</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-3" 
                      checked={settings.showBanners}
                      onChange={(e) => updateSetting('showBanners', e.target.checked)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar banners</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="mr-3"
                      checked={settings.notificationSounds}
                      onChange={(e) => updateSetting('notificationSounds', e.target.checked)}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reproducir sonidos</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Privacidad y Seguridad</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tu privacidad es nuestra prioridad</p>
            </div>
            
            <div className="space-y-6">
              {/* Política de privacidad */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">Compromiso de Privacidad</h3>
                    <div className="space-y-3 text-sm text-green-800 dark:text-green-200">
                      <p>
                        <strong>No recopilamos datos personales:</strong> Este portfolio no recopila, almacena ni transmite ningún tipo de información personal de los usuarios.
                      </p>
                      <p>
                        <strong>Cámara y procesamiento local:</strong> Aunque utilices funciones de cámara, todas las imágenes se procesan localmente en tu dispositivo. No se guardan, envían ni almacenan fotos en ningún servidor.
                      </p>
                      <p>
                        <strong>Demostraciones en tiempo real:</strong> Las funciones de detección de objetos y procesamiento de imágenes son meras demostraciones técnicas que funcionan completamente en tu navegador.
                      </p>
                      <p>
                        <strong>Sin cookies de seguimiento:</strong> No utilizamos cookies de seguimiento ni analytics que comprometan tu privacidad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Configuraciones de privacidad */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Permisos de aplicaciones</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">📷</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">Cámara</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">FaceTime, Reconocimiento facial</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Solo demostraciones</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🎤</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">Micrófono</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Aplicaciones de audio</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">No se graba</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">🗄️</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">Almacenamiento local</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Solo configuraciones de usuario</div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Solo preferencias</span>
                  </div>
                </div>
              </div>
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
          className="relative w-[920px] h-[640px] bg-gray-50 dark:bg-gray-900 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
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
              <h1 className="text-[13px] font-medium text-gray-700 dark:text-gray-300 tracking-tight">Preferencias del Sistema</h1>
            </div>
          </div>

          {/* Window Content */}
          <div className="flex h-[calc(100%-48px)]">
            {/* Sidebar */}
            <div className="w-72 bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-300/50 dark:border-gray-600/50 overflow-y-auto">
              <div className="p-4">
                <div className="space-y-1">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-blue-500 dark:bg-blue-600 text-white shadow-lg'
                            : 'hover:bg-white dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <IconComponent className={`w-5 h-5 ${
                          selectedCategory === category.id 
                            ? 'text-white' 
                            : category.color
                        }`} />
                        <span className="text-[13px] font-medium tracking-tight">{category.name}</span>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto">
              <div className="p-8">
                {renderCategoryContent()}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
