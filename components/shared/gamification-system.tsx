"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trophy, 
  Star, 
  Zap, 
  Eye, 
  Clock, 
  MousePointer, 
  Music, 
  Heart,
  Coffee,
  Palette,
  Code,
  Sparkles,
  Award,
  Target,
  Gamepad2
} from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  unlocked: boolean
  progress: number
  maxProgress: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'exploration' | 'interaction' | 'time' | 'curiosity' | 'special'
}

const initialAchievements: Achievement[] = [
  {
    id: 'first_visit',
    title: '¡Bienvenido!',
    description: 'Has visitado mi portafolio',
    icon: Eye,
    color: 'from-blue-400 to-blue-600',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: 'common',
    category: 'exploration'
  },
  {
    id: 'cursor_trail',
    title: 'Siguiendo el rastro',
    description: 'Has descubierto el cursor personalizado',
    icon: MousePointer,
    color: 'from-lavender-400 to-lilac-600',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    rarity: 'common',
    category: 'interaction'
  },
  {
    id: 'music_lover',
    title: 'Melómano',
    description: 'Has reproducido música ambiental',
    icon: Music,
    color: 'from-purple-400 to-pink-600',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: 'rare',
    category: 'interaction'
  },
  {
    id: 'explorer',
    title: 'Explorador Digital',
    description: 'Has visitado todas las secciones',
    icon: Target,
    color: 'from-green-400 to-emerald-600',
    unlocked: false,
    progress: 0,
    maxProgress: 6,
    rarity: 'rare',
    category: 'exploration'
  },
  {
    id: 'time_traveler',
    title: 'Viajero del Tiempo',
    description: 'Has pasado más de 5 minutos explorando',
    icon: Clock,
    color: 'from-orange-400 to-red-600',
    unlocked: false,
    progress: 0,
    maxProgress: 300, // 5 minutes
    rarity: 'epic',
    category: 'time'
  },
  {
    id: 'click_master',
    title: 'Maestro del Click',
    description: 'Has realizado 100 interacciones',
    icon: Zap,
    color: 'from-yellow-400 to-orange-600',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    rarity: 'epic',
    category: 'interaction'
  },
  {
    id: 'theme_switcher',
    title: 'Camaleón',
    description: 'Has cambiado entre modo claro y oscuro',
    icon: Palette,
    color: 'from-indigo-400 to-purple-600',
    unlocked: false,
    progress: 0,
    maxProgress: 2,
    rarity: 'rare',
    category: 'interaction'
  },
  {
    id: 'code_whisperer',
    title: 'Susurrador de Código',
    description: 'Has encontrado todos los easter eggs',
    icon: Code,
    color: 'from-teal-400 to-cyan-600',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    rarity: 'legendary',
    category: 'curiosity'
  },
  {
    id: 'coffee_break',
    title: 'Hora del Café',
    description: 'Has estado aquí durante la hora del café (3-4 PM)',
    icon: Coffee,
    color: 'from-amber-400 to-brown-600',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: 'special',
    category: 'special'
  },
  {
    id: 'night_owl',
    title: 'Búho Nocturno',
    description: 'Has visitado después de las 22:00',
    icon: Star,
    color: 'from-violet-400 to-purple-600',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: 'special',
    category: 'special'
  }
]

export function GamificationSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements)
  const [showNotification, setShowNotification] = useState<Achievement | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [level, setLevel] = useState(1)
  
  const visitStartTime = useRef(Date.now())
  const clickCount = useRef(0)
  const sectionsVisited = useRef(new Set<string>())
  const themeChanges = useRef(0)
  const easterEggsFound = useRef(new Set<string>())

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-achievements')
    if (saved) {
      try {
        const savedAchievements = JSON.parse(saved)
        setAchievements(savedAchievements)
      } catch (error) {
        console.log('Error loading achievements:', error)
      }
    }

    // Check for first visit
    unlockAchievement('first_visit')
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-achievements', JSON.stringify(achievements))
    
    // Calculate total score and level
    const score = achievements.reduce((total, achievement) => {
      if (achievement.unlocked) {
        const rarityMultiplier = {
          common: 10,
          rare: 25,
          epic: 50,
          legendary: 100
        }
        return total + rarityMultiplier[achievement.rarity]
      }
      return total
    }, 0)
    
    setTotalScore(score)
    setLevel(Math.floor(score / 100) + 1)
  }, [achievements])

  // Time tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - visitStartTime.current) / 1000)
      updateProgress('time_traveler', timeSpent)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Time-based achievements
  useEffect(() => {
    const now = new Date()
    const hour = now.getHours()
    
    // Coffee break achievement (3-4 PM)
    if (hour >= 15 && hour < 16) {
      unlockAchievement('coffee_break')
    }
    
    // Night owl achievement (after 10 PM)
    if (hour >= 22 || hour < 6) {
      unlockAchievement('night_owl')
    }
  }, [])

  // Event listeners
  useEffect(() => {
    const handleClick = () => {
      clickCount.current++
      updateProgress('click_master', clickCount.current)
      updateProgress('cursor_trail', Math.min(clickCount.current, 10))
    }

    const handleScroll = () => {
      // Track section visibility
      const sections = ['hero', 'projects', 'artworks', 'hackathons', 'press', 'ge', 'travels']
      sections.forEach(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            sectionsVisited.current.add(section)
          }
        }
      })
      
      updateProgress('explorer', sectionsVisited.current.size)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Easter egg: Konami code or special combinations
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        easterEggsFound.current.add('inspect')
        updateProgress('code_whisperer', easterEggsFound.current.size)
      }
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', handleScroll)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === id && !achievement.unlocked) {
          const unlocked = { ...achievement, unlocked: true, progress: achievement.maxProgress }
          setShowNotification(unlocked)
          setTimeout(() => setShowNotification(null), 4000)
          return unlocked
        }
        return achievement
      })
      return updated
    })
  }

  const updateProgress = (id: string, progress: number) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === id && !achievement.unlocked) {
          const newProgress = Math.min(progress, achievement.maxProgress)
          const updatedAchievement = { ...achievement, progress: newProgress }
          
          if (newProgress >= achievement.maxProgress) {
            updatedAchievement.unlocked = true
            setShowNotification(updatedAchievement)
            setTimeout(() => setShowNotification(null), 4000)
          }
          
          return updatedAchievement
        }
        return achievement
      })
      return updated
    })
  }

  // Public methods for external components
  useEffect(() => {
    // @ts-ignore - Adding to window for global access
    window.portfolioAchievements = {
      unlock: unlockAchievement,
      updateProgress,
      triggerMusicAchievement: () => unlockAchievement('music_lover'),
      triggerThemeChange: () => {
        themeChanges.current++
        updateProgress('theme_switcher', themeChanges.current)
      },
      addEasterEgg: (eggId: string) => {
        easterEggsFound.current.add(eggId)
        updateProgress('code_whisperer', easterEggsFound.current.size)
      }
    }
  }, [])

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-pink-600'
      case 'legendary': return 'from-yellow-400 to-orange-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <>
      {/* Achievement Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-20 right-6 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-lavender-200 dark:border-lavender-800 p-4 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${showNotification.color} flex items-center justify-center text-white shadow-lg`}
              >
                {React.createElement(showNotification.icon, { size: 20 })}
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy size={16} className="text-yellow-500" />
                  <span className="font-bold text-sm text-foreground">¡Logro Desbloqueado!</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {showNotification.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {showNotification.description}
                </p>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 bg-gradient-to-r ${getRarityColor(showNotification.rarity)} text-white`}>
                  {showNotification.rarity.toUpperCase()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Panel Toggle */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-lg flex items-center justify-center text-white"
      >
        <div className="relative">
          <Trophy size={20} />
          {unlockedCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
            >
              {unlockedCount}
            </motion.div>
          )}
        </div>
      </motion.button>

      {/* Achievement Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-6 bottom-24 z-40 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-lavender-200 dark:border-lavender-800 p-6 max-h-96 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Logros</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Nivel {level}</span>
                  <span>•</span>
                  <span>{totalScore} puntos</span>
                  <span>•</span>
                  <span>{unlockedCount}/{achievements.length}</span>
                </div>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Achievements grid */}
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    achievement.unlocked 
                      ? 'bg-lavender-50 dark:bg-lavender-900/20 border border-lavender-200 dark:border-lavender-800' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      achievement.unlocked 
                        ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg` 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {React.createElement(achievement.icon, { size: 16 })}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium text-sm ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    
                    {!achievement.unlocked && achievement.maxProgress > 1 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                          <div
                            className="bg-gradient-to-r from-lavender-400 to-lilac-500 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    achievement.unlocked 
                      ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white`
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}>
                    {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}