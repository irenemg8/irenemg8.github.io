"use client"

import { useEffect, useRef, useState } from 'react'

export function FaceTimeSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [userName] = useState('Usuario')

  useEffect(() => {
    const animate = () => {
      if (!canvasRef.current) return
      
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Configurar canvas
      canvas.width = 640
      canvas.height = 480

      // Limpiar canvas
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Crear un gradiente de fondo
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0f3460')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Simular imagen de usuario con círculo
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2 - 30
      const radius = 80

      // Sombra para el avatar
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.shadowBlur = 20
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 5

      // Avatar circular
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = '#4a5568'
      ctx.fill()

      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0

      // Icono de usuario
      ctx.fillStyle = '#718096'
      ctx.font = '60px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('👤', centerX, centerY)

      // Animación de detección facial
      const time = Date.now() / 1000
      const boxSize = 160
      const offsetX = Math.sin(time * 0.5) * 10
      const offsetY = Math.cos(time * 0.3) * 8
      
      // Dibujar caja de detección
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(
        centerX - boxSize/2 + offsetX,
        centerY - boxSize/2 + offsetY,
        boxSize,
        boxSize
      )
      ctx.setLineDash([])

      // Esquinas decorativas
      const cornerLength = 20
      ctx.lineWidth = 3
      ctx.strokeStyle = '#00ff00'
      
      const boxX = centerX - boxSize/2 + offsetX
      const boxY = centerY - boxSize/2 + offsetY

      // Esquina superior izquierda
      ctx.beginPath()
      ctx.moveTo(boxX, boxY + cornerLength)
      ctx.lineTo(boxX, boxY)
      ctx.lineTo(boxX + cornerLength, boxY)
      ctx.stroke()

      // Esquina superior derecha
      ctx.beginPath()
      ctx.moveTo(boxX + boxSize - cornerLength, boxY)
      ctx.lineTo(boxX + boxSize, boxY)
      ctx.lineTo(boxX + boxSize, boxY + cornerLength)
      ctx.stroke()

      // Esquina inferior izquierda
      ctx.beginPath()
      ctx.moveTo(boxX, boxY + boxSize - cornerLength)
      ctx.lineTo(boxX, boxY + boxSize)
      ctx.lineTo(boxX + cornerLength, boxY + boxSize)
      ctx.stroke()

      // Esquina inferior derecha
      ctx.beginPath()
      ctx.moveTo(boxX + boxSize - cornerLength, boxY + boxSize)
      ctx.lineTo(boxX + boxSize, boxY + boxSize)
      ctx.lineTo(boxX + boxSize, boxY + boxSize - cornerLength)
      ctx.stroke()

      // Texto de información
      ctx.fillStyle = '#00ff00'
      ctx.font = '14px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`${userName} detectado`, boxX, boxY - 10)
      
      // Simular análisis
      const confidence = 85 + Math.sin(time * 2) * 10
      ctx.fillText(`Confianza: ${Math.round(confidence)}%`, boxX, boxY + boxSize + 20)

      // Indicadores adicionales
      ctx.font = '12px monospace'
      ctx.fillStyle = '#00ff00'
      
      // Simular FPS
      const fps = 28 + Math.random() * 4
      ctx.textAlign = 'left'
      ctx.fillText(`FPS: ${Math.round(fps)}`, 10, 20)
      
      // Resolución
      ctx.fillText(`Resolución: 640x480`, 10, 40)
      
      // Hora
      const now = new Date()
      const timeStr = now.toLocaleTimeString()
      ctx.textAlign = 'right'
      ctx.fillText(timeStr, canvas.width - 10, 20)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [userName])

  return (
    <div className="relative w-full h-full bg-gray-900">
      <canvas 
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-900/80 text-yellow-300 px-4 py-2 rounded-lg text-sm">
        Modo Simulación - Sin cámara real
      </div>
    </div>
  )
}
