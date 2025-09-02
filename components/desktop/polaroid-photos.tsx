"use client"

import { useState, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import Image from 'next/image'

interface PhotoItem {
  id: string
  src: string
  alt: string
  title: string
  position: { x: number; y: number }
  rotation: number
  zIndex: number
}

interface PolaroidPhotosProps {
  onClose?: () => void
}

export function PolaroidPhotos({ onClose }: PolaroidPhotosProps) {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [draggedPhoto, setDraggedPhoto] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Lista de fotos con títulos personalizados
  const photoData = [
    { 
      filename: 'IMG_7788.jpg', 
      title: 'Mercadillo griego',
      alt: 'Momento especial capturado'
    },
    { 
      filename: 'IMG_8035.jpg', 
      title: 'Más comida polaca',
      alt: 'Fotografía memorable'
    },
    { 
      filename: 'IMG_8294.jpg', 
      title: 'El viaje más largo',
      alt: 'Momento capturado'
    },
    { 
      filename: 'IMG_8457.jpg', 
      title: 'Pierogis',
      alt: 'Momento feliz'
    },
    { 
      filename: 'IMG_8483.jpg', 
      title: 'Atardecer en Varsovia',
      alt: 'Buen momento'
    },
    { 
      filename: 'IMG_8541.jpg', 
      title: 'Happy!',
      alt: 'Momento de felicidad'
    }
  ]

  useEffect(() => {
    setIsMounted(true)
    
    if (typeof window !== 'undefined') {
      // Generar posiciones aleatorias para las fotos estilo polaroid esparcidas
      const initialPhotos: PhotoItem[] = photoData.map((photo, index) => {
        // Posiciones aleatorias pero controladas para que no se superpongan demasiado
        const cols = 3
        const rows = 2
        const colIndex = index % cols
        const rowIndex = Math.floor(index / cols)
        
        const baseX = 100 + (colIndex * 300) + (Math.random() - 0.5) * 150
        const baseY = 80 + (rowIndex * 250) + (Math.random() - 0.5) * 100
        
        return {
          id: photo.filename.replace('.jpg', ''),
          src: `/pics/${photo.filename}`,
          alt: photo.alt,
          title: photo.title,
          position: { x: baseX, y: baseY },
          rotation: (Math.random() - 0.5) * 20, // Rotación aleatoria entre -10 y 10 grados
          zIndex: 1000 + index
        }
      })
      
      setPhotos(initialPhotos)
    }
  }, [])

  const handleDragStart = (photoId: string) => {
    setDraggedPhoto(photoId)
  }

  const handleDragEnd = (photoId: string, event: any, info: PanInfo) => {
    if (typeof window === 'undefined' || !isMounted) return
    
    setDraggedPhoto(null)
    
    setPhotos(prev => {
      const currentPhoto = prev.find(p => p.id === photoId)
      if (!currentPhoto) return prev
      
      const newX = Math.max(10, Math.min(window.innerWidth - 210, currentPhoto.position.x + info.offset.x))
      const newY = Math.max(10, Math.min(window.innerHeight - 290, currentPhoto.position.y + info.offset.y))
      
      // Check if dragged to trash area (dock area at bottom center)
      const dockCenterX = window.innerWidth / 2
      const dockY = window.innerHeight - 80 // Área del dock
      
      // Área más amplia alrededor del dock para facilitar el drop
      const isNearTrash = Math.abs(newX - dockCenterX) < 150 && 
                         newY > window.innerHeight - 150
      
      if (isNearTrash) {
        // Eliminar foto si se arrastra a la papelera
        return prev.filter(photo => photo.id !== photoId)
      }
      
      return prev.map(photo => {
        if (photo.id === photoId) {
          return {
            ...photo,
            position: { x: newX, y: newY },
            zIndex: Math.max(...prev.map(p => p.zIndex)) + 1 // Traer al frente
          }
        }
        return photo
      })
    })
  }

  const handlePhotoClick = (photoId: string) => {
    // Traer foto al frente cuando se hace clic
    setPhotos(prev => prev.map(photo => {
      if (photo.id === photoId) {
        return {
          ...photo,
          zIndex: Math.max(...prev.map(p => p.zIndex)) + 1
        }
      }
      return photo
    }))
  }



  if (!isMounted) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {photos.map((photo) => {
        const isDragging = draggedPhoto === photo.id
        
        return (
          <motion.div
            key={photo.id}
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
            onDragStart={() => handleDragStart(photo.id)}
            onDragEnd={(event, info) => handleDragEnd(photo.id, event, info)}
            onClick={() => handlePhotoClick(photo.id)}
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              rotate: photo.rotation
            }}
            animate={{ 
              opacity: 1, 
              scale: isDragging ? 1.05 : 1,
              rotate: isDragging ? photo.rotation + 2 : photo.rotation,
              x: photo.position.x, 
              y: photo.position.y,
              zIndex: isDragging ? 50000 : photo.zIndex
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              transition: { duration: 0.3 }
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              opacity: { duration: 0.6, delay: Math.random() * 0.3 }
            }}
            className={`absolute select-none pointer-events-auto ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {/* Polaroid Container */}
            <div 
              className="bg-white shadow-2xl transform transition-shadow duration-300 hover:shadow-3xl relative"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translate3d(0, 0, 0)',
                WebkitTransform: 'translate3d(0, 0, 0)',
                willChange: 'transform',
              }}
            >
              {/* Foto */}
              <div className="p-3 pb-0">
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
                    src={photo.src}
                    alt={photo.alt}
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
                      // Si la imagen no se puede cargar, usar placeholder local
                      console.log(`Error cargando imagen: ${photo.src}`)
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder.jpg'
                    }}
                  />
                </div>
              </div>
              
              {/* Título en fuente Pecita */}
              <div className="p-3 pt-2">
                <p 
                  className="text-center text-gray-800 text-lg tracking-wide"
                  style={{ 
                    fontFamily: 'Pecita, cursive',
                    fontWeight: 'normal'
                  }}
                >
                  {photo.title}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
      
      {/* Botón para cerrar todas las fotos */}
      {photos.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed top-6 right-6 z-[10000] pointer-events-auto bg-gray-800/80 hover:bg-gray-900/90 text-white p-3 rounded-full shadow-lg transition-colors duration-200 backdrop-blur-sm"
          title="Cerrar todas las fotos"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </motion.button>
      )}
    </div>
  )
}
