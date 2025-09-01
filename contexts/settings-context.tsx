"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useTheme } from 'next-themes'

interface SettingsState {
  // Cursor settings
  cursorSize: number
  cursorSpeed: number
  
  // Theme settings  
  darkMode: boolean
  autoLogin: boolean
  
  // Sound settings
  volume: number
  soundEnabled: boolean
  
  // Notification settings
  notifications: boolean
  notificationSounds: boolean
  showOnLockScreen: boolean
  showBanners: boolean
  
  // System settings
  reducedMotion: boolean
}

interface SettingsContextType {
  settings: SettingsState
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void
  resetSettings: () => void
}

const defaultSettings: SettingsState = {
  cursorSize: 1.0,
  cursorSpeed: 5,
  darkMode: false,
  autoLogin: false,
  volume: 75,
  soundEnabled: true,
  notifications: true,
  notificationSounds: false,
  showOnLockScreen: true,
  showBanners: true,
  reducedMotion: false,
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings)
  const { setTheme, theme, resolvedTheme } = useTheme()

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('macos-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.warn('Failed to parse saved settings:', error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('macos-settings', JSON.stringify(settings))
  }, [settings])

  // Sync dark mode with theme system
  useEffect(() => {
    const isDark = resolvedTheme === 'dark'
    if (settings.darkMode !== isDark) {
      setSettings(prev => ({ ...prev, darkMode: isDark }))
    }
  }, [resolvedTheme])

  // Apply cursor size to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--cursor-size', settings.cursorSize.toString())
    document.documentElement.style.setProperty('--cursor-speed', `${11 - settings.cursorSpeed}`) // Invert for damping
  }, [settings.cursorSize, settings.cursorSpeed])

  // Apply volume to all audio elements
  useEffect(() => {
    const audioElements = document.querySelectorAll('audio, video')
    audioElements.forEach(element => {
      if (element instanceof HTMLMediaElement) {
        element.volume = settings.volume / 100
      }
    })
  }, [settings.volume])

  // Apply reduced motion preference
  useEffect(() => {
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s')
      document.documentElement.style.setProperty('--transition-duration', '0s')
    } else {
      document.documentElement.style.removeProperty('--animation-duration')
      document.documentElement.style.removeProperty('--transition-duration')
    }
  }, [settings.reducedMotion])

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    
    // Handle special cases
    if (key === 'darkMode') {
      setTheme(value ? 'dark' : 'light')
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('macos-settings')
    setTheme('system')
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
