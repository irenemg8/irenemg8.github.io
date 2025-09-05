"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, GraduationCap, Heart, Trophy, Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileWindow } from './mobile-window'
import { StickyNote } from '../desktop/sticky-note'

interface MobileAboutMeWindowProps {
  isOpen: boolean
  onClose: () => void
}

interface PhotoItem {
  id: string
  src: string
  alt: string
  title: string
  type: 'image' | 'video'
}

export function MobileAboutMeWindow({ isOpen, onClose }: MobileAboutMeWindowProps) {
  const { t } = useLanguage()
  const isMobile = useIsMobile()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showStickyNote, setShowStickyNote] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null)
  const [showPhotoViewer, setShowPhotoViewer] = useState(false)

  // Información personal organizada por categorías
  const aboutData = {
    education: {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Educación",
      color: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      content: [
        {
          institution: "Universidad Politécnica de Valencia (UPV)",
          program: "G. Tecnologías Interactivas",
          period: "2022 - 2026",
          logo: "/UPV-Emblem.png"
        },
        {
          institution: "Warsaw University of Technology (WUT)",
          program: "Erasmus+ BIP",
          period: "2025",
          logo: "/Warsaw_University_of_Technology.png"
        }
      ]
    },
    hobbies: {
      icon: <Heart className="w-5 h-5" />,
      title: "Hobbies & Curiosidades",
      color: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      content: [
        { emoji: "🧘‍♀️", text: "Practico yoga aéreo" },
        { emoji: "🌍", text: "Me encanta viajar" },
        { emoji: "🏖️", text: "La playa es mi rincón de paz" },
        { emoji: "🏎️", text: "Fan de las carreras de coches" }
      ]
    },
    achievements: {
      icon: <Trophy className="w-5 h-5" />,
      title: "Logros",
      color: "from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20",
      content: [
        { title: "🥇 Premios", description: "Finalista de varios Hackathones" },
        { title: "🌍 UPV en China", description: "Representé a la UPV en Guangzhou" },
        { title: "🎯 Agenda 2030", description: "Candidatura de la ciudad de Gandía con el proyecto URBANVIVE" }
      ]
    }
  }

  // Fotos y videos
  const photos: PhotoItem[] = [
    {
      id: 'gandis',
      src: '/gandis.JPG',
      alt: 'Gandis',
      title: 'Gandis',
      type: 'image'
    },
    {
      id: 'ciberseguridad',
      src: '/ciberseguridad.jpg',
      alt: 'Ciberseguridad',
      title: 'Evento Ciberseguridad',
      type: 'image'
    },
    {
      id: 'china1',
      src: '/china1.JPG',
      alt: 'China Trip 1',
      title: 'China 1',
      type: 'image'
    },
    {
      id: 'china2',
      src: '/china2.JPG',
      alt: 'China Trip 2',
      title: 'China 2',
      type: 'image'
    },
    {
      id: 'china3',
      src: '/china3.JPG',
      alt: 'China Trip 3',
      title: 'China 3',
      type: 'image'
    },
    {
      id: 'yoga',
      src: '/yoga.mov',
      alt: 'Yoga Practice',
      title: 'Yoga Aéreo',
      type: 'video'
    }
  ]

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey)
    setShowStickyNote(true)
  }

  const handlePhotoClick = (photo: PhotoItem) => {
    setSelectedPhoto(photo)
    setShowPhotoViewer(true)
  }

  const handleCloseSticky = () => {
    setShowStickyNote(false)
    setSelectedCategory(null)
  }

  const handleClosePhoto = () => {
    setShowPhotoViewer(false)
    setSelectedPhoto(null)
  }

  // Mobile optimized content
  const mobileContent = (
    <div className="space-y-4">
      {/* Header info */}
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Sobre Mí
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Conoce más sobre mi formación, intereses y logros
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {Object.entries(aboutData).map(([key, data]) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-r ${data.color} rounded-xl p-4 border border-white/20 dark:border-gray-700/20 cursor-pointer shadow-sm`}
            onClick={() => handleCategoryClick(key)}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center">
                {data.icon}
              </div>
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                {data.title}
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Toca para ver detalles
            </p>
          </motion.div>
        ))}
      </div>

      {/* Photos Gallery */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          📸 Galería Personal
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md bg-white"
              onClick={() => handlePhotoClick(photo)}
            >
              {photo.type === 'image' ? (
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="relative w-full h-full bg-gray-200 flex items-center justify-center">
                  <div className="text-4xl">🎥</div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs">
                    Video
                  </div>
                </div>
              )}
              
              {/* Polaroid style title */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2">
                <p className="text-xs text-center text-gray-800 font-medium">
                  {photo.title}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick stats */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              2
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Universidades</div>
          </div>
          <div>
            <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
              4
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Hobbies</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {photos.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Fotos</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <MobileWindow
        isOpen={isOpen}
        onClose={onClose}
        title="Sobre Mí"
        maxHeight="90vh"
        customGradient="from-purple-50 via-pink-50 to-rose-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20"
      >
        {mobileContent}
      </MobileWindow>

      {/* Sticky Note para información detallada */}
      <AnimatePresence>
        {showStickyNote && selectedCategory && (
          <div style={{ 
            position: 'fixed', 
            left: 0, 
            top: 0, 
            width: '100%', 
            height: '100%',
            pointerEvents: 'none',
            zIndex: 50000 
          }}>
            <div style={{ pointerEvents: 'auto' }}>
              <StickyNote
                onDelete={handleCloseSticky}
                onDragToTrash={handleCloseSticky}
                initialPosition={{ 
                  x: isMobile ? 20 : 400,
                  y: isMobile ? 120 : 100
                }}
                customContent={
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 mb-4">
                      {aboutData[selectedCategory as keyof typeof aboutData].icon}
                      <h3 className="font-bold text-lg text-gray-800">
                        {aboutData[selectedCategory as keyof typeof aboutData].title}
                      </h3>
                    </div>
                    
                    {selectedCategory === 'education' && (
                      <div className="space-y-3">
                        {(aboutData.education.content as any[]).map((edu, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <Image
                              src={edu.logo}
                              alt={`${edu.institution} Logo`}
                              width={35}
                              height={35}
                              className="object-contain"
                            />
                            <div>
                              <p className="font-semibold text-gray-800">{edu.institution}</p>
                              <p className="text-gray-700">{edu.program}</p>
                              <p className="text-gray-600 text-xs">{edu.period}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCategory === 'hobbies' && (
                      <div className="space-y-2">
                        {(aboutData.hobbies.content as any[]).map((hobby, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <span>{hobby.emoji}</span>
                            <span className="text-gray-800">{hobby.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedCategory === 'achievements' && (
                      <div className="space-y-2">
                        {(aboutData.achievements.content as any[]).map((achievement, idx) => (
                          <div key={idx}>
                            <p className="font-semibold text-gray-800">{achievement.title}</p>
                            <p className="text-gray-700">{achievement.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Viewer */}
      <AnimatePresence>
        {showPhotoViewer && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[60000] flex items-center justify-center p-4"
            onClick={handleClosePhoto}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedPhoto.type === 'image' ? (
                <div className="aspect-square relative">
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <div className="text-6xl">🎥</div>
                </div>
              )}
              
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">{selectedPhoto.title}</h3>
                <button
                  onClick={handleClosePhoto}
                  className="mt-2 px-4 py-2 bg-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
