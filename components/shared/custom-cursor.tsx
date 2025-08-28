"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Howl } from "howler"

interface TrailPoint {
  x: number
  y: number
  id: number
}

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)
  
  const trailIdRef = useRef(0)
  const soundsRef = useRef<{ hover?: Howl; click?: Howl }>({})

  // Initialize sounds
  useEffect(() => {
    // Create subtle hover and click sounds
    const initSounds = () => {
      try {
        soundsRef.current.hover = new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGF'],
          volume: 0.2,
          preload: true,
        })
        
        soundsRef.current.click = new Howl({
          src: ['data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGFhYqFbF2FBYSFX4eFhYSJhY+Fh4KEbWyFhYWMhYGF'],
          volume: 0.3,
          preload: true,
        })
        
        setSoundEnabled(true)
      } catch (error) {
        console.log("Audio not supported or blocked")
      }
    }

    // Initialize sounds after user interaction
    const handleFirstInteraction = () => {
      initSounds()
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('keydown', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY }
      setMousePosition(newPosition)
      
      // Add trail point
      setTrail(prev => {
        const newTrail = [...prev, { ...newPosition, id: trailIdRef.current++ }]
        return newTrail.slice(-12) // Keep only last 12 points
      })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        target.role === "button"

      if (isInteractive && !isHovering) {
        setIsHovering(true)
        if (soundEnabled && soundsRef.current.hover) {
          soundsRef.current.hover.play()
        }
      } else if (!isInteractive && isHovering) {
        setIsHovering(false)
      }
    }

    const handleMouseDown = () => {
      setIsClicking(true)
      if (soundEnabled && soundsRef.current.click) {
        soundsRef.current.click.play()
      }
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseover", handleMouseOver)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isHovering, soundEnabled])

  // Clean up old trail points
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => prev.slice(1))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  if (isMobile) return null

  return (
    <>
      {/* Trail particles */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed w-1 h-1 rounded-full pointer-events-none z-[999998]"
          style={{
            background: `linear-gradient(135deg, 
              hsl(270, 50%, ${70 - index * 3}%), 
              hsl(285, 45%, ${75 - index * 2}%))`,
            opacity: (index + 1) / trail.length * 0.6,
            left: point.x - 2,
            top: point.y - 2,
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1 - (index * 0.1),
            opacity: (trail.length - index) / trail.length * 0.6
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      ))}

      {/* Main cursor ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 z-[999999] pointer-events-none"
        style={{
          borderColor: 'hsl(270, 50%, 65%)',
          width: isHovering ? 40 : 24,
          height: isHovering ? 40 : 24,
        }}
        animate={{
          x: mousePosition.x - (isHovering ? 20 : 12),
          y: mousePosition.y - (isHovering ? 20 : 12),
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 250,
          mass: 0.5,
        }}
      >
        {/* Inner glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(270, 50%, 65%) 0%, transparent 70%)',
            opacity: isHovering ? 0.3 : 0.1,
          }}
          animate={{
            opacity: isHovering ? 0.3 : 0.1,
            scale: isClicking ? 1.2 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full z-[999999] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, hsl(270, 50%, 65%), hsl(285, 45%, 70%))',
        }}
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isClicking ? 0.5 : 1,
        }}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 400,
        }}
      />

      {/* Hover state sparkles */}
      {isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[999997]"
          animate={{
            x: mousePosition.x - 20,
            y: mousePosition.y - 20,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: `hsl(${270 + i * 15}, 50%, 70%)`,
                left: Math.cos(i * Math.PI / 3) * 20 + 20,
                top: Math.sin(i * Math.PI / 3) * 20 + 20,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </>
  )
}
