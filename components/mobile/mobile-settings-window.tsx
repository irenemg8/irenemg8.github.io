"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Monitor, Sun, Moon, Palette, Volume2, Bluetooth, Wifi, 
  Battery, Shield, Bell, User, Globe, Smartphone, Zap,
  Download, HardDrive, ChevronRight, Settings as SettingsIcon
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useSettings } from '@/contexts/settings-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'

interface MobileSettingsWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileSettingsWindow({ isOpen, onClose }: MobileSettingsWindowProps) {
  const { t, language, setLanguage } = useLanguage()
  const { settings, updateSettings } = useSettings()
  const isMobile = useIsMobile()
  
  const [brightness, setBrightness] = useState(75)
  const [volume, setVolume] = useState(60)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [isWifiOn, setIsWifiOn] = useState(true)
  const [isBluetoothOn, setIsBluetoothOn] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(true)

  // Detectar tema actual
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  const hapticFeedback = () => {
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(25)
    }
  }

  const toggleDarkMode = () => {
    hapticFeedback()
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      if (newMode) {
        html.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        html.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }

  const toggleLanguage = () => {
    hapticFeedback()
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0])
    if (typeof document !== 'undefined') {
      document.body.style.filter = `brightness(${value[0]}%)`
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    hapticFeedback()
  }

  const settingGroups = [
    {
      title: t('settings.categories.appearance'),
      icon: <Palette className="w-5 h-5" />,
      items: [
        {
          label: t('settings.general.dark_mode'),
          icon: isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />,
          control: (
            <Switch
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
          )
        },
        {
          label: t('settings.language'),
          icon: <Globe className="w-4 h-4" />,
          control: (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-blue-600 dark:text-blue-400"
            >
              {language.toUpperCase()}
            </Button>
          )
        }
      ]
    },
    {
      title: 'Sistema',
      icon: <Monitor className="w-5 h-5" />,
      items: [
        {
          label: 'Brillo',
          icon: <Sun className="w-4 h-4" />,
          control: (
            <div className="flex items-center space-x-3 min-w-32">
              <Slider
                value={[brightness]}
                onValueChange={handleBrightnessChange}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-10">
                {brightness}%
              </span>
            </div>
          )
        },
        {
          label: 'Volumen',
          icon: <Volume2 className="w-4 h-4" />,
          control: (
            <div className="flex items-center space-x-3 min-w-32">
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-10">
                {volume}%
              </span>
            </div>
          )
        }
      ]
    },
    {
      title: 'Conectividad',
      icon: <Wifi className="w-5 h-5" />,
      items: [
        {
          label: 'Wi-Fi',
          icon: <Wifi className="w-4 h-4" />,
          subtitle: isWifiOn ? 'Casa - Conectado' : 'Desconectado',
          control: (
            <Switch
              checked={isWifiOn}
              onCheckedChange={(checked) => {
                setIsWifiOn(checked)
                hapticFeedback()
              }}
            />
          )
        },
        {
          label: 'Bluetooth',
          icon: <Bluetooth className="w-4 h-4" />,
          subtitle: isBluetoothOn ? 'AirPods - Conectado' : 'Desconectado',
          control: (
            <Switch
              checked={isBluetoothOn}
              onCheckedChange={(checked) => {
                setIsBluetoothOn(checked)
                hapticFeedback()
              }}
            />
          )
        }
      ]
    },
    {
      title: 'Privacidad y Seguridad',
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          label: 'Notificaciones',
          icon: <Bell className="w-4 h-4" />,
          subtitle: notifications ? 'Permitidas' : 'Bloqueadas',
          control: (
            <Switch
              checked={notifications}
              onCheckedChange={(checked) => {
                setNotifications(checked)
                hapticFeedback()
              }}
            />
          )
        }
      ]
    },
    {
      title: 'Información del Sistema',
      icon: <Smartphone className="w-5 h-5" />,
      items: [
        {
          label: 'Batería',
          icon: <Battery className="w-4 h-4" />,
          subtitle: `${batteryLevel}% - Cargando`,
          control: (
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${batteryLevel}%` }}
              />
            </div>
          )
        },
        {
          label: 'Almacenamiento',
          icon: <HardDrive className="w-4 h-4" />,
          subtitle: '128 GB disponibles',
          /*control: <ChevronRight className="w-4 h-4 text-gray-400" />*/
        },
        {
          label: 'Actualizaciones',
          icon: <Download className="w-4 h-4" />,
          subtitle: autoUpdate ? 'Automáticas' : 'Manuales',
          control: (
            <Switch
              checked={autoUpdate}
              onCheckedChange={(checked) => {
                setAutoUpdate(checked)
                hapticFeedback()
              }}
            />
          )
        }
      ]
    }
  ]

  const mobileContent = (
    <div className="space-y-6">
      {/* Profile section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <img 
            src="/yo.png" 
            alt="Profile"
            className="w-16 h-16 rounded-full border-3 border-white/20"
          />
          <div>
            <h3 className="text-lg font-semibold">{t('settings.profile_title')}</h3>
            <p className="text-blue-100">{t('settings.profile_subtitle')}</p>
            <p className="text-sm text-blue-200 mt-1">{t('settings.profile_role')}</p>

          </div>
        </div>
      </div>

      {/* Settings groups */}
      {settingGroups.map((group, groupIndex) => (
        <motion.div
          key={group.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Group header */}
          <div className="px-4 py-3 bg-gray-50/70 dark:bg-gray-700/70 border-b border-gray-200/50 dark:border-gray-600/50">
            <div className="flex items-center space-x-3">
              <div className="text-purple-600 dark:text-purple-400">
                {group.icon}
              </div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200">
                {group.title}
              </h4>
            </div>
          </div>

          {/* Group items */}
          <div className="divide-y divide-gray-200/50 dark:divide-gray-600/50">
            {group.items.map((item, itemIndex) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                className="px-4 py-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-purple-500 dark:text-purple-400 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {item.label}
                    </p>
                    {item.subtitle && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 ml-4">
                  {item.control}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Footer info 
      <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Portfolio v2.1.0 - Desarrollado con Next.js y Tailwind CSS
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          © 2024 Irene Medina García
        </p>
      </div>*/}
    </div>
  )

  return (
    <MobileWindow
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings.mobile_title')}
      maxHeight="90vh"
      customGradient="from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10"
    >
      {mobileContent}
    </MobileWindow>
  )
}
