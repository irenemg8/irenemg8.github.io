"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles, Zap, Heart, Coffee } from "lucide-react"
import Lottie from "lottie-react"

// Simulación de una animación Lottie (puedes reemplazar con archivo real)
const floatingElementsAnimation = {
  v: "4.8.0",
  meta: { g: "LottieFiles AE ", a: "", k: "", d: "", tc: "" },
  fr: 29.9700012207031,
  ip: 0,
  op: 90.0000036657751,
  w: 800,
  h: 600,
  nm: "floating-elements",
  ddd: 0,
  assets: [],
  layers: []
}

interface FloatingElementProps {
  children: React.ReactNode
  delay?: number
  duration?: number
}

const FloatingElement: React.FC<FloatingElementProps> = ({ 
  children, 
  delay = 0, 
  duration = 6 
}) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-20, 20, -20] }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute"
  >
    {children}
  </motion.div>
)

const GradientOrb: React.FC<{ size: string; position: string; color: string }> = ({ 
  size, 
  position, 
  color 
}) => (
  <motion.div
    className={`absolute ${position} ${size} rounded-full blur-3xl opacity-20 dark:opacity-10`}
    style={{ background: color }}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.2, 0.3, 0.2],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentTime, setCurrentTime] = useState("")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -300])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Madrid'
      }
      setCurrentTime(now.toLocaleTimeString('es-ES', options))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const headlineVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 20, rotateX: -90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  }

  const interactiveElements = [
    { icon: Sparkles, color: "text-lavender-400", delay: 0 },
    { icon: Zap, color: "text-lilac-400", delay: 0.5 },
    { icon: Heart, color: "text-lavender-500", delay: 1 },
    { icon: Coffee, color: "text-lilac-500", delay: 1.5 },
  ]

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-lavender-50/30 to-lilac-50/20 dark:from-background dark:via-lavender-900/10 dark:to-lilac-900/5"
      style={{ y, opacity, scale }}
    >
      {/* Orbes de gradiente animados */}
      <GradientOrb 
        size="w-96 h-96" 
        position="top-20 -left-48" 
        color="linear-gradient(135deg, #E879F9, #A855F7)" 
      />
      <GradientOrb 
        size="w-80 h-80" 
        position="bottom-20 -right-40" 
        color="linear-gradient(135deg, #C084FC, #7C3AED)" 
      />
      <GradientOrb 
        size="w-64 h-64" 
        position="top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        color="linear-gradient(135deg, #DDD6FE, #C4B5FD)" 
      />

      {/* Elementos flotantes interactivos */}
      {interactiveElements.map((element, index) => (
        <FloatingElement key={index} delay={element.delay} duration={6 + index}>
          <div className={`absolute ${element.color} opacity-30`}
               style={{
                 top: `${20 + index * 15}%`,
                 right: `${10 + index * 8}%`,
                 transform: typeof window !== 'undefined' 
                   ? `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
                   : 'translate(0px, 0px)'
               }}>
            <element.icon size={24 + index * 4} />
          </div>
        </FloatingElement>
      ))}

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Saludo personalizado con hora */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-sm font-mono text-muted-foreground bg-white/80 dark:bg-black/30 px-3 py-1 rounded-full border border-lavender-200 dark:border-lavender-800">
            Madrid, España • {currentTime} • Disponible para proyectos ✨
          </span>
        </motion.div>

        {/* Headline principal animado */}
        <motion.div
          variants={headlineVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="overflow-hidden">
            <motion.h1 
              variants={wordVariants}
              className="text-display-sm md:text-display-lg font-poppins font-bold bg-gradient-to-r from-lavender-600 via-lilac-500 to-lavender-700 bg-clip-text text-transparent mb-4"
            >
              Diseñadora & Desarrolladora
            </motion.h1>
          </div>
          
          <div className="overflow-hidden">
            <motion.h2 
              variants={wordVariants}
              className="text-4xl md:text-6xl font-poppins font-light text-foreground/90"
            >
              que crea{" "}
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="bg-gradient-to-r from-lavender-500 to-lilac-600 bg-clip-text text-transparent font-bold">
                  experiencias
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-lavender-400 to-lilac-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                />
              </motion.span>
              {" "}inolvidables
            </motion.h2>
          </div>
        </motion.div>

        {/* Descripción con efectos */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Especializada en <strong className="text-lavender-600 dark:text-lavender-400">UX/UI Design</strong> y{" "}
          <strong className="text-lilac-600 dark:text-lilac-400">Frontend Development</strong>.
          Transformo ideas en productos digitales que conectan, emocionan e inspiran.
        </motion.p>

        {/* Botones de acción */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(147, 51, 234, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 bg-gradient-to-r from-lavender-500 to-lilac-600 text-white rounded-xl font-medium text-lg overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-lilac-600 to-lavender-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative z-10 flex items-center gap-2">
              Ver mis proyectos
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-lavender-300 dark:border-lavender-700 text-foreground rounded-xl font-medium text-lg hover:bg-lavender-50 dark:hover:bg-lavender-900/20 transition-colors"
          >
            Hablemos
          </motion.button>
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex flex-col items-center"
        >
          <span className="text-sm text-muted-foreground mb-2 font-mono">
            Descubre más
          </span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lavender-500"
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </div>

      {/* Cursor personalizado con trail - solo en cliente */}
      {typeof window !== 'undefined' && (
        <motion.div
          className="fixed top-0 left-0 w-4 h-4 bg-lavender-400 rounded-full mix-blend-difference pointer-events-none z-50"
          style={{
            x: mousePosition.x * (window.innerWidth || 0) / 100 - 8,
            y: mousePosition.y * (window.innerHeight || 0) / 100 - 8,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
        />
      )}
    </motion.section>
  )
}