"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface GalleryItem {
  id: string
  img: string
  url?: string
  width: number
  height: number
}

interface DualRowGalleryProps {
  items: GalleryItem[]
  duration?: number
  stagger?: number
  scaleOnHover?: boolean
  hoverScale?: number
}

export function DualRowGallery({ 
  items, 
  duration = 0.4,
  stagger = 0.12,
  scaleOnHover = true,
  hoverScale = 0.98
}: DualRowGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Dividir items en dos filas
  const midPoint = Math.ceil(items.length / 2)
  const topRowItems = items.slice(0, midPoint)
  const bottomRowItems = items.slice(midPoint)

  return (
    <div className="relative w-full h-full flex flex-col justify-center items-center gap-8 p-4">
      {/* Fila Superior - Alineada al bottom */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 0 }}
        className="flex items-end justify-center gap-4 flex-wrap"
      >
        {topRowItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration,
              delay: index * stagger,
              ease: [0.23, 1, 0.320, 1]
            }}
            className="cursor-pointer"
            style={{
              width: `${item.width * 0.6}px`,
              height: `${item.height * 0.6}px`,
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
            whileHover={scaleOnHover ? { 
              scale: hoverScale,
              y: -5,
              transition: { duration: 0.2 }
            } : {}}
          >
            <img
              src={item.img}
              alt={`Artwork ${item.id}`}
              className="w-full h-full object-contain shadow-lg transition-shadow duration-300 hover:shadow-xl"
              style={{
                filter: hoveredId === item.id ? 'brightness(1.1)' : 'brightness(1)',
                transition: 'filter 0.2s ease'
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Fila Inferior - Alineada al top */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: 0.2 }}
        className="flex items-start justify-center gap-4 flex-wrap"
      >
        {bottomRowItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration,
              delay: (midPoint + index) * stagger,
              ease: [0.23, 1, 0.320, 1]
            }}
            className="cursor-pointer"
            style={{
              width: `${item.width * 0.6}px`,
              height: `${item.height * 0.6}px`,
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
            whileHover={scaleOnHover ? { 
              scale: hoverScale,
              y: 5,
              transition: { duration: 0.2 }
            } : {}}
          >
            <img
              src={item.img}
              alt={`Artwork ${item.id}`}
              className="w-full h-full object-contain shadow-lg transition-shadow duration-300 hover:shadow-xl"
              style={{
                filter: hoveredId === item.id ? 'brightness(1.1)' : 'brightness(1)',
                transition: 'filter 0.2s ease'
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
