"use client"

import { motion, PanInfo } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface AboutMeWindowProps {
  isOpen: boolean
  onClose: () => void
}

interface StickyNoteProps {
  title: string
  content: React.ReactNode
  initialPosition: { x: number; y: number }
  color?: string
  onClose?: () => void
}

interface PolaroidPhotoProps {
  src: string
  alt: string
  title: string
  initialPosition: { x: number; y: number }
  onClose?: () => void
}

interface VideoPolaroidPhotoProps {
  src: string
  alt: string
  title: string
  initialPosition: { x: number; y: number }
  onClose?: () => void
}

function AboutStickyNote({ title, content, initialPosition, color = "#FEF3C7", onClose }: StickyNoteProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (typeof window === 'undefined' || !isMounted) return
    
    const newPosition = {
      x: Math.max(20, Math.min(window.innerWidth - 250, position.x + info.offset.x)),
      y: Math.max(20, Math.min(window.innerHeight - 200, position.y + info.offset.y))
    }
    
    setPosition(newPosition)
    setIsDragging(false)
  }

  if (!isVisible || !isMounted) return null

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={isMounted ? {
        left: 20,
        right: window.innerWidth - 250,
        top: 20,
        bottom: window.innerHeight - 200,
      } : {
        left: 20,
        right: 1000,
        top: 20,
        bottom: 600,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{ 
        x: position.x, 
        y: position.y,
        rotate: isDragging ? 2 : -1,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 60000 : 55000
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -1 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
      className={`absolute select-none pointer-events-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div 
        className="w-60 min-h-fit relative"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, #FDE68A 100%)`,
          boxShadow: `
            0 4px 12px rgba(0, 0, 0, 0.15),
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.8)
          `,
          transform: 'rotate(-1deg)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-yellow-300/30">
          <h3 className="text-sm font-semibold text-gray-800 macos-text-semibold">
            {title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsVisible(false)
              if (onClose) onClose()
            }}
            className="w-4 h-4 rounded-full bg-red-400 hover:bg-red-500 transition-colors"
          />
        </div>

        {/* Content */}
        <div className="p-4 pb-6 text-xs text-gray-700">
          {content}
        </div>

        {/* Paper texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                rgba(0,0,0,0.1) 21px
              )
            `
          }}
        />
      </div>
    </motion.div>
  )
}

function AboutPolaroidPhoto({ src, alt, title, initialPosition, onClose }: PolaroidPhotoProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (typeof window === 'undefined' || !isMounted) return
    
    const newPosition = {
      x: Math.max(10, Math.min(window.innerWidth - 210, position.x + info.offset.x)),
      y: Math.max(10, Math.min(window.innerHeight - 290, position.y + info.offset.y))
    }
    
    setPosition(newPosition)
    setIsDragging(false)
  }

  if (!isVisible || !isMounted) return null

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={isMounted ? {
        left: 20,
        right: window.innerWidth - 210,
        top: 20,
        bottom: window.innerHeight - 280,
      } : {
        left: 20,
        right: 1000,
        top: 20,
        bottom: 600,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{ 
        x: position.x, 
        y: position.y,
        rotate: isDragging ? 2 : (Math.random() - 0.5) * 10,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 60000 : 56000
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
      className={`absolute select-none pointer-events-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div 
        className="bg-white shadow-2xl transform transition-shadow duration-300 hover:shadow-3xl relative" 
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      >
        {/* Traffic lights para polaroid */}
        <div className="absolute top-2 left-2 flex space-x-1 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsVisible(false)
              if (onClose) onClose()
            }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* Foto */}
        <div className="p-3 pb-0 pt-6">
          <div 
            className="w-48 h-48 relative overflow-hidden bg-gray-100" 
            style={{ 
              imageRendering: 'auto',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              style={{
                imageRendering: 'auto',
                WebkitImageSmoothing: true,
                imageSmoothing: true,
                filter: 'blur(0)',
                backfaceVisibility: 'hidden',
                transform: 'translate3d(0, 0, 0)',
                WebkitTransform: 'translate3d(0, 0, 0)',
                willChange: 'transform',
              } as any}
              quality={100}
              sizes="192px"
              priority={false}
              unoptimized={false}
              onError={(e) => {
                console.log(`Error cargando imagen: ${src}`)
                const target = e.target as HTMLImageElement
                target.src = '/placeholder.jpg'
              }}
            />
          </div>
        </div>
        
        {/* Título */}
        <div className="p-3 pt-2">
          <p 
            className="text-center text-gray-800 text-lg tracking-wide"
            style={{ 
              fontFamily: 'Pecita, cursive',
              fontWeight: 'normal'
            }}
          >
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function AboutVideoPolaroidPhoto({ src, alt, title, initialPosition, onClose }: VideoPolaroidPhotoProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (typeof window === 'undefined' || !isMounted) return
    
    const newPosition = {
      x: Math.max(10, Math.min(window.innerWidth - 210, position.x + info.offset.x)),
      y: Math.max(10, Math.min(window.innerHeight - 290, position.y + info.offset.y))
    }
    
    setPosition(newPosition)
    setIsDragging(false)
  }

  if (!isVisible || !isMounted) return null

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragConstraints={isMounted ? {
        left: 20,
        right: window.innerWidth - 210,
        top: 20,
        bottom: window.innerHeight - 280,
      } : {
        left: 20,
        right: 1000,
        top: 20,
        bottom: 600,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      animate={{ 
        x: position.x, 
        y: position.y,
        rotate: isDragging ? 2 : (Math.random() - 0.5) * 10,
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 60000 : 56000
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }}
      className={`absolute select-none pointer-events-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div 
        className="bg-white shadow-2xl transform transition-shadow duration-300 hover:shadow-3xl relative" 
        style={{
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      >
        {/* Traffic lights para polaroid */}
        <div className="absolute top-2 left-2 flex space-x-1 z-10">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              setIsVisible(false)
              if (onClose) onClose()
            }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>

        {/* Video */}
        <div className="p-3 pb-0 pt-6">
          <div 
            className="w-48 h-48 relative overflow-hidden bg-gray-100 polaroid-image-container" 
            style={{ 
              imageRendering: 'auto',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              backfaceVisibility: 'hidden',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            <video
              src={src}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              preload="auto"
              style={{ 
                pointerEvents: 'none',
                imageRendering: 'auto',
                WebkitImageSmoothing: true,
                imageSmoothing: true,
                filter: 'blur(0) contrast(1.02) saturate(1.01)',
                backfaceVisibility: 'hidden',
                transform: 'translate3d(0, 0, 0)',
                WebkitTransform: 'translate3d(0, 0, 0)',
                willChange: 'transform',
                WebkitVideoDecodedFrameCount: 'auto',
                objectFit: 'cover',
                objectPosition: 'center',
              } as any}
            />
          </div>
        </div>
        
        {/* Título */}
        <div className="p-3 pt-2">
          <p 
            className="text-center text-gray-800 text-lg tracking-wide"
            style={{ 
              fontFamily: 'Pecita, cursive',
              fontWeight: 'normal'
            }}
          >
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function AboutMeWindow({ isOpen, onClose }: AboutMeWindowProps) {
  const [showStickyNotes, setShowStickyNotes] = useState(false)
  const [showPolaroids, setShowPolaroids] = useState(false)
  
  // Estados individuales para cada sticky note
  const [showEducationNote, setShowEducationNote] = useState(true)
  const [showHobbiesNote, setShowHobbiesNote] = useState(true)
  const [showAchievementsNote, setShowAchievementsNote] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // Mostrar sticky notes inmediatamente
      setShowStickyNotes(true)
      setShowEducationNote(true)
      setShowHobbiesNote(true)
      setShowAchievementsNote(true)
      // Mostrar polaroids con delay
      setTimeout(() => setShowPolaroids(true), 300)
    } else {
      setShowStickyNotes(false)
      setShowPolaroids(false)
      setShowEducationNote(false)
      setShowHobbiesNote(false)
      setShowAchievementsNote(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onClose}
      />

      {/* Contenido de About Me */}
      <div className="fixed inset-0 z-50">
        
        {/* Sticky Notes */}
        {showStickyNotes && (
          <>
            {/* Educación Combinada */}
            {showEducationNote && (
              <AboutStickyNote
                title="🎓 Educación"
                initialPosition={{ x: 100, y: 100 }}
                color="#FEF3C7"
                onClose={() => setShowEducationNote(false)}
                content={
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/UPV-Emblem.png"
                      alt="UPV Logo"
                      width={35}
                      height={35}
                      className="object-contain"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">Universidad Politécnica de Valencia (UPV)</p>
                      <p className="text-gray-700">G. Tecnologías Interactivas</p>
                      <p className="text-gray-600 text-xs">2022 - 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 pt-2 border-t border-yellow-300/30">
                    <Image
                      src="/Warsaw_University_of_Technology.png"
                      alt="WUT Logo"
                      width={35}
                      height={35}
                      className="object-contain"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">Warsaw University of Technology (WUT)</p>
                      <p className="text-gray-700">Erasmus+ BIP</p>
                      <p className="text-gray-600 text-xs">2025</p>
                    </div>
                  </div>
                </div>
              }
              />
            )}

            {/* Curiosidades y Hobbies */}
            {showHobbiesNote && (
              <AboutStickyNote
                title="🌟 Curiosidades & Hobbies"
                initialPosition={{ x: 200, y: 350 }}
                color="#FEF3C7"
                onClose={() => setShowHobbiesNote(false)}
                content={
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span>🧘‍♀️</span>
                    <span className="text-gray-800">Practico yoga aéreo</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🌍</span>
                    <span className="text-gray-800">Me encanta viajar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🏖️</span>
                    <span className="text-gray-800">La playa es mi rincón de paz</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🏎️</span>
                    <span className="text-gray-800">Fan de las carreras de coches</span>
                  </div>
                </div>
              }
              />
            )}

            {/* URBANVIVE logros */}
            {showAchievementsNote && (
              <AboutStickyNote
                title="🏆 Logros"
                initialPosition={{ x: 500, y: 300 }}
                color="#FEF3C7"
                onClose={() => setShowAchievementsNote(false)}
                content={
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold text-gray-800">🥇 Premios</p>
                    <p className="text-gray-700">Finalista en varios Hackathones</p>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-gray-800">🌍 UPV en China</p>
                    <p className="text-gray-700">Representé a la UPV en Guangzhou</p>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-gray-800">🎯 Agenda 2030</p>
                    <p className="text-gray-700">Candidatura de la ciudad de Gandía con el proyecto URBANVIVE</p>
                  </div>
                </div>
              }
              />
            )}
          </>
        )}

        {/* Polaroid Photos */}
        {showPolaroids && (
          <>
            <AboutPolaroidPhoto
              src="/pics/IMG_8457.jpg"
              alt="Mi primer pierogi en Varsovia"
              title="Mi primer pierogi 🥟"
              initialPosition={{ x: 150, y: 200 }}
            />

            <AboutPolaroidPhoto
              src="/pics/IMG_4488.JPEG"
              alt="Guerreros de terracota"
              title="Guerreros de Xian 🏺"
              initialPosition={{ x: 450, y: 120 }}
            />

            <AboutPolaroidPhoto
              src="/pics/IMG_8294.jpg"
              alt="Templo chino en Guangzhou"
              title="Guangzhou 🏯"
              initialPosition={{ x: 350, y: 400 }}
            />

            <AboutVideoPolaroidPhoto
              src="/pics/coches.MP4"
              alt="Coches en movimiento"
              title="Velocidad a tope 🏎️"
              initialPosition={{ x: 600, y: 250 }}
            />

            <AboutPolaroidPhoto
              src="/pics/IMG_7508.JPEG"
              alt="Playa de Gandía"
              title="Playa de Gandía 🏖️"
              initialPosition={{ x: 750, y: 350 }}
            />
          </>
        )}
      </div>
    </>
  )
}
