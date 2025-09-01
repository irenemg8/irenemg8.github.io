"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '@/contexts/settings-context'

export function MacOSCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const { settings } = useSettings()

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('button, a, [role="button"], input, textarea, select') !== null
      setIsHovering(isInteractive)
    }

    document.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      document.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference"
        style={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: Math.max(15, Math.min(40, 15 + (settings.cursorSpeed - 1) * 3))
        }}
      >
        <motion.div
          className="bg-white rounded-full"
          style={{
            width: `${12 * settings.cursorSize}px`,
            height: `${12 * settings.cursorSize}px`,
          }}
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </motion.div>

      {/* Outer ring for hover effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          x: mousePosition.x - (12 * settings.cursorSize),
          y: mousePosition.y - (12 * settings.cursorSize),
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: Math.max(15, Math.min(35, 15 + (settings.cursorSpeed - 1) * 2.5))
        }}
      >
        <motion.div
          className="border border-white/30 rounded-full"
          style={{
            width: `${24 * settings.cursorSize}px`,
            height: `${24 * settings.cursorSize}px`,
          }}
          animate={{
            scale: isHovering ? 1.8 : 0,
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
      </motion.div>
    </>
  )
}