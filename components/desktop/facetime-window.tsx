"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Minimize2, Maximize2 } from 'lucide-react'
import { TVStaticEffect } from './tv-static-effect'
import { FaceTimeSimulator } from './facetime-simulator'

interface FaceTimeWindowProps {
  onClose: () => void
}

interface Detection {
  id: number
  x: number
  y: number
  width: number
  height: number
  confidence: number
}

export function FaceTimeWindow({ onClose }: FaceTimeWindowProps) {
  console.log('[FaceTime] 🚀 Componente FaceTimeWindow montado')
  
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [detections, setDetections] = useState<Detection[]>([])
  const [faceDetectorSupported, setFaceDetectorSupported] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [useSimulator, setUseSimulator] = useState(false)
  const [cameraFailureCount, setCameraFailureCount] = useState(0)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const faceDetectorRef = useRef<any>(null)
  const cameraTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const previousDetectionsRef = useRef<Detection[]>([])
  
  console.log('[FaceTime] Estado inicial:', {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    userAgent: navigator.userAgent
  })

  // Verificar si el navegador soporta FaceDetector API
  useEffect(() => {
    const checkFaceDetector = async () => {
      try {
        // @ts-ignore - FaceDetector es experimental
        if ('FaceDetector' in window) {
          // @ts-ignore - API experimental
          const FaceDetectorClass = (window as any).FaceDetector
          if (FaceDetectorClass) {
            faceDetectorRef.current = new FaceDetectorClass()
            setFaceDetectorSupported(true)
          }
        }
      } catch (error) {
        console.log('FaceDetector API no disponible, usando detección simulada')
      }
    }
    
    checkFaceDetector()
  }, [])

  // Función para suavizar las detecciones (evitar saltos bruscos)
  const smoothDetections = (newDetections: Detection[], previousDetections: Detection[]): Detection[] => {
    if (previousDetections.length === 0) return newDetections
    
    return newDetections.map(newDet => {
      // Buscar la detección más cercana en el frame anterior
      let closestPrev = previousDetections[0]
      let minDistance = Infinity
      
      previousDetections.forEach(prevDet => {
        const distance = Math.sqrt(
          Math.pow(newDet.x - prevDet.x, 2) + 
          Math.pow(newDet.y - prevDet.y, 2)
        )
        if (distance < minDistance) {
          minDistance = distance
          closestPrev = prevDet
        }
      })
      
      // Si la detección está muy lejos, es probablemente una nueva cara
      if (minDistance > 100) return newDet
      
      // Suavizar la posición y tamaño (interpolación)
      const smoothingFactor = 0.5 // Balance entre suavidad y respuesta
      
      return {
        ...newDet,
        x: closestPrev.x + (newDet.x - closestPrev.x) * smoothingFactor,
        y: closestPrev.y + (newDet.y - closestPrev.y) * smoothingFactor,
        width: closestPrev.width + (newDet.width - closestPrev.width) * smoothingFactor,
        height: closestPrev.height + (newDet.height - closestPrev.height) * smoothingFactor
      }
    })
  }
  
  // Función mejorada para analizar el estado de ánimo
  const analyzeExpression = (imageData: ImageData, x: number, y: number, width: number, height: number) => {
    const data = imageData.data
    
    // Analizar diferentes regiones del rostro
    const analyzeRegion = (rx: number, ry: number, rw: number, rh: number) => {
      let brightness = 0
      let contrast = 0
      let pixelCount = 0
      let minBright = 255
      let maxBright = 0
      
      for (let py = ry; py < ry + rh && py < imageData.height; py += 3) {
        for (let px = rx; px < rx + rw && px < imageData.width; px += 3) {
          const idx = (py * imageData.width + px) * 4
          const bright = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
          brightness += bright
          minBright = Math.min(minBright, bright)
          maxBright = Math.max(maxBright, bright)
          pixelCount++
        }
      }
      
      if (pixelCount > 0) {
        brightness /= pixelCount
        contrast = maxBright - minBright
      }
      
      return { brightness, contrast }
    }
    
    // Analizar región superior (frente/cejas) - detecta preocupación
    const upperRegion = analyzeRegion(
      Math.floor(x + width * 0.2),
      Math.floor(y + height * 0.1),
      Math.floor(width * 0.6),
      Math.floor(height * 0.3)
    )
    
    // Analizar región media (ojos) - detecta felicidad/tristeza
    const middleRegion = analyzeRegion(
      Math.floor(x + width * 0.15),
      Math.floor(y + height * 0.35),
      Math.floor(width * 0.7),
      Math.floor(height * 0.25)
    )
    
    // Analizar región inferior (boca) - detecta sonrisa
    const lowerRegion = analyzeRegion(
      Math.floor(x + width * 0.25),
      Math.floor(y + height * 0.65),
      Math.floor(width * 0.5),
      Math.floor(height * 0.25)
    )
    
    // Análisis de expresión basado en patrones
    const avgBrightness = (upperRegion.brightness + middleRegion.brightness + lowerRegion.brightness) / 3
    const avgContrast = (upperRegion.contrast + middleRegion.contrast + lowerRegion.contrast) / 3
    
    // Análisis más preciso de expresión basado en regiones faciales
    const smileScore = (lowerRegion.brightness - avgBrightness) / avgBrightness
    const eyeOpenness = middleRegion.contrast / 100
    const foreheadTension = upperRegion.contrast / 100
    
    // Detectar sonrisa (región inferior más brillante)
    if (smileScore > 0.15 && lowerRegion.contrast > 40) {
      if (smileScore > 0.25) return '😄 Muy feliz'
      return '😊 Feliz'
    }
    
    // Detectar tristeza (región inferior más oscura)
    if (smileScore < -0.1 && eyeOpenness < 0.5) {
      return '😞 Triste'
    }
    
    // Detectar preocupación (alta tensión en frente)
    if (foreheadTension > 0.8 && middleRegion.brightness < avgBrightness) {
      return '😟 Preocupado'
    }
    
    // Detectar sorpresa (ojos muy abiertos)
    if (eyeOpenness > 0.7 && upperRegion.brightness > avgBrightness * 1.1) {
      return '😮 Sorprendido'
    }
    
    // Detectar seriedad (bajo brillo general)
    if (avgBrightness < 90 && avgContrast < 40) {
      return '😔 Serio'
    }
    
    // Detectar relajación (contraste uniforme)
    if (Math.abs(smileScore) < 0.05 && avgContrast < 45) {
      return '😎 Relajado'
    }
    
    // Estados por defecto más matizados
    if (avgBrightness > 160) return '🙂 Contento'
    if (avgBrightness > 120) return '😐 Neutral'
    if (avgBrightness > 80) return '🤔 Pensativo'
    return '😑 Concentrado'
  }
  
  // Función mejorada para detectar rostros con análisis de píxeles más preciso
  const detectFacesInCanvas = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => {
    const width = video.videoWidth
    const height = video.videoHeight
    
    // Dibujar el video en un canvas temporal para análisis
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return []
    
    tempCtx.drawImage(video, 0, 0, width, height)
    const imageData = tempCtx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    const detectedFaces: Detection[] = []
    
    // Crear mapa de densidad de tonos de piel
    const skinMap: boolean[][] = []
    for (let y = 0; y < height; y++) {
      skinMap[y] = []
      for (let x = 0; x < width; x++) {
        skinMap[y][x] = false
      }
    }
    
    // Detectar píxeles con tono de piel con mayor precisión
    for (let y = 0; y < height; y += 4) { // Análisis más fino
      for (let x = 0; x < width; x += 4) {
        const idx = (y * width + x) * 4
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]
        
        // Fórmula mejorada para detectar tonos de piel en diferentes iluminaciones
        // YCrCb color space es más efectivo para detección de piel
        const Y = 0.299 * r + 0.587 * g + 0.114 * b
        const Cr = (r - Y) * 0.713 + 128
        const Cb = (b - Y) * 0.564 + 128
        
        // Rangos mejorados para detección de piel en YCrCb
        const isSkin = (
          // Rangos YCrCb más ajustados para mejor precisión
          (Cr > 135 && Cr < 180) &&
          (Cb > 85 && Cb < 135) &&
          (Y > 60 && Y < 255) // Rango más amplio de luminancia
        ) || (
          // Alternativa en RGB para pieles más claras/oscuras
          (r > 80 && g > 50 && b > 30) &&
          (r > g && g > b) &&
          (r - g > 10) &&
          (Math.max(r, g, b) - Math.min(r, g, b) > 10)
        )
        
        if (isSkin) {
          // Marcar región alrededor del píxel
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const ny = y + dy
              const nx = x + dx
              if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                skinMap[ny][nx] = true
              }
            }
          }
        }
      }
    }
    
    // Buscar regiones conectadas usando flood fill
    const visited: boolean[][] = []
    for (let y = 0; y < height; y++) {
      visited[y] = new Array(width).fill(false)
    }
    
    const findConnectedRegion = (startX: number, startY: number): {points: number, bounds: {minX: number, minY: number, maxX: number, maxY: number}} => {
      const stack: {x: number, y: number}[] = [{x: startX, y: startY}]
      let minX = startX, maxX = startX
      let minY = startY, maxY = startY
      let points = 0
      
      while (stack.length > 0) {
        const {x, y} = stack.pop()!
        
        if (x < 0 || x >= width || y < 0 || y >= height || visited[y][x] || !skinMap[y][x]) {
          continue
        }
        
        visited[y][x] = true
        points++
        
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
        
        // Agregar vecinos
        stack.push({x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1})
      }
      
      return {points, bounds: {minX, minY, maxX, maxY}}
    }
    
    // Encontrar todas las regiones conectadas
    const regions: {points: number, bounds: {minX: number, minY: number, maxX: number, maxY: number}}[] = []
    
    for (let y = 0; y < height; y += 10) {
      for (let x = 0; x < width; x += 10) {
        if (skinMap[y][x] && !visited[y][x]) {
          const region = findConnectedRegion(x, y)
          if (region.points > 500) { // Mínimo de píxeles para ser considerado rostro
            regions.push(region)
          }
        }
      }
    }
    
    // Convertir regiones en detecciones de rostros
    regions
      .sort((a, b) => b.points - a.points) // Ordenar por tamaño
      .slice(0, 5) // Máximo 5 rostros
      .forEach((region, index) => {
        const regionWidth = region.bounds.maxX - region.bounds.minX
        const regionHeight = region.bounds.maxY - region.bounds.minY
        
        // Calcular el centro de la región
        const centerX = (region.bounds.minX + region.bounds.maxX) / 2
        const centerY = (region.bounds.minY + region.bounds.maxY) / 2
        
        // Estimar tamaño del rostro basado en la región de piel
        // Un rostro típicamente es más alto que ancho (proporción 1.4:1)
        let faceWidth = regionWidth * 0.6 // Reducir un 40% el ancho para un ajuste más preciso
        let faceHeight = faceWidth * 1.4 // Proporción típica de rostro humano
        
        // Limitar tamaño máximo del rostro
        const maxFaceSize = Math.min(width, height) * 0.25 // Reducido del 40% al 25%
        if (faceWidth > maxFaceSize) {
          faceWidth = maxFaceSize
          faceHeight = faceWidth * 1.4
        }
        
        // Limitar tamaño mínimo del rostro
        const minFaceSize = Math.min(width, height) * 0.08 // Reducido del 10% al 8%
        if (faceWidth < minFaceSize) {
          faceWidth = minFaceSize
          faceHeight = faceWidth * 1.4
        }
        
        // Ajustar posición Y (la piel detectada suele estar en la parte media-baja del rostro)
        const faceY = centerY - faceHeight * 0.45 // Subir el recuadro un poco más
        const faceX = centerX - faceWidth / 2
        
        detectedFaces.push({
          id: index,
          x: Math.max(0, faceX),
          y: Math.max(0, faceY),
          width: Math.min(faceWidth, width - faceX),
          height: Math.min(faceHeight, height - faceY),
          confidence: Math.min(0.95, 0.6 + (region.points / 5000))
        })
      })
    
    return detectedFaces
  }

  // Función para detectar rostros
  const detectFaces = useCallback(async () => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Verificar que el video esté reproduciendo
      if (video.paused || video.ended || video.readyState < 2) {
        if (video.paused) {
          video.play().catch(() => {})
        }
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(detectFaces)
        }, 100)
        return
      }
      
      const ctx = canvas.getContext('2d')
      
      if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
        animationRef.current = requestAnimationFrame(detectFaces)
        return
      }

      // Ajustar canvas al tamaño del video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Resetear contador de fallos
      if (cameraFailureCount > 0) {
        setCameraFailureCount(0)
      }

      let detectedFaces: Detection[] = []
      
      // Intentar usar FaceDetector API si está disponible
      if (faceDetectorSupported && faceDetectorRef.current) {
        try {
          const faces = await faceDetectorRef.current.detect(video)
        
          detectedFaces = faces.map((face: any, index: number) => ({
            id: index,
            x: face.boundingBox.x,
            y: face.boundingBox.y,
            width: face.boundingBox.width,
            height: face.boundingBox.height,
            confidence: 0.95
          }))
        } catch (e) {
          console.log('[DetectFaces] FaceDetector API falló, usando detección por píxeles')
        }
      }
      
      // Si no hay detecciones con FaceDetector, usar detección por análisis de píxeles
      if (detectedFaces.length === 0) {
        detectedFaces = detectFacesInCanvas(ctx, video)
      }
      
      // Aplicar suavizado a las detecciones
      const smoothedDetections = smoothDetections(detectedFaces, previousDetectionsRef.current)
      previousDetectionsRef.current = smoothedDetections
      
      setDetections(smoothedDetections)
      
      // Obtener imagen para análisis de expresiones
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      
      // Dibujar las detecciones suavizadas
      smoothedDetections.forEach((detection, index) => {
        // Configurar estilo para el cuadro
        ctx.strokeStyle = '#00ff00'
        ctx.lineWidth = 2
        ctx.setLineDash([])
        
        // Dibujar rectángulo principal
        ctx.strokeRect(detection.x, detection.y, detection.width, detection.height)
        
        // Dibujar esquinas decorativas
        const cornerLength = 15
        ctx.lineWidth = 3
        
        // Esquina superior izquierda
        ctx.beginPath()
        ctx.moveTo(detection.x, detection.y + cornerLength)
        ctx.lineTo(detection.x, detection.y)
        ctx.lineTo(detection.x + cornerLength, detection.y)
        ctx.stroke()
        
        // Esquina superior derecha
        ctx.beginPath()
        ctx.moveTo(detection.x + detection.width - cornerLength, detection.y)
        ctx.lineTo(detection.x + detection.width, detection.y)
        ctx.lineTo(detection.x + detection.width, detection.y + cornerLength)
        ctx.stroke()
        
        // Esquina inferior izquierda
        ctx.beginPath()
        ctx.moveTo(detection.x, detection.y + detection.height - cornerLength)
        ctx.lineTo(detection.x, detection.y + detection.height)
        ctx.lineTo(detection.x + cornerLength, detection.y + detection.height)
        ctx.stroke()
        
        // Esquina inferior derecha
        ctx.beginPath()
        ctx.moveTo(detection.x + detection.width - cornerLength, detection.y + detection.height)
        ctx.lineTo(detection.x + detection.width, detection.y + detection.height)
        ctx.lineTo(detection.x + detection.width, detection.y + detection.height - cornerLength)
        ctx.stroke()
        
        // Analizar expresión
        const expression = analyzeExpression(imageData, detection.x, detection.y, detection.width, detection.height)
        
        // Dibujar información
        ctx.fillStyle = '#00ff00'
        ctx.font = 'bold 14px monospace'
        ctx.shadowColor = 'black'
        ctx.shadowBlur = 3
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        
        // Etiqueta del usuario
        const userLabel = smoothedDetections.length > 1 ? `Persona ${index + 1}` : 'Usuario detectado'
        ctx.fillText(userLabel, detection.x, detection.y - 10)
        
        // Estado de ánimo
        ctx.fillText(`Estado: ${expression}`, detection.x, detection.y + detection.height + 20)
        
        // Confianza
        const confidencePercent = Math.round(detection.confidence * 100)
        ctx.fillText(`Precisión: ${confidencePercent}%`, detection.x, detection.y + detection.height + 40)
        
        // Reset shadow
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
      })
      
      // Si no hay detecciones, mostrar indicador de búsqueda
      if (smoothedDetections.length === 0) {
        const time = Date.now() / 1000
        const scanLineY = (Math.sin(time * 2) * 0.5 + 0.5) * canvas.height
        
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(0, scanLineY)
        ctx.lineTo(canvas.width, scanLineY)
        ctx.stroke()
        
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)'
        ctx.font = '12px monospace'
        ctx.fillText('Buscando rostros...', 10, 30)
      }

      // Continuar detección si todo está bien
      animationRef.current = requestAnimationFrame(detectFaces)
      
    } catch (error) {
      console.error('Error en detección de rostros:', error)
      setCameraFailureCount(prev => prev + 1)
      
      // Intentar continuar la detección a menos que haya demasiados errores
      if (cameraFailureCount < 10) {
        setTimeout(() => {
          animationRef.current = requestAnimationFrame(detectFaces)
        }, 500) // Esperar medio segundo antes de reintentar
      } else {
        // Demasiados errores, detener y mostrar error
        handleCameraFailure()
      }
    }
  }, [faceDetectorSupported]) // No incluir cameraFailureCount para evitar recrear la función constantemente

  // Asignar stream al video cuando ambos estén disponibles
  useEffect(() => {
    console.log('[UseEffect-Stream] 🔄 useEffect ejecutado')
    console.log('[UseEffect-Stream] Condiciones:', {
      hasStream: !!stream,
      hasVideoRef: !!videoRef.current,
      hasPermission,
      useSimulator
    })
    
    if (!stream) {
      console.log('[UseEffect-Stream] ⏸️ No hay stream todavía')
      return
    }
    
    if (!hasPermission) {
      console.log('[UseEffect-Stream] ⏸️ No hay permisos')
      return
    }
    
    if (useSimulator) {
      console.log('[UseEffect-Stream] ⏸️ Usando simulador')
      return
    }
    
    // Verificar repetidamente hasta que el video esté disponible
    const checkInterval = setInterval(() => {
      console.log('[UseEffect-Stream] 🔍 Verificando videoRef...')
      
      if (videoRef.current && stream) {
        console.log('[UseEffect-Stream] ✅ Video y stream disponibles!')
        
        if (videoRef.current.srcObject !== stream) {
          console.log('[UseEffect-Stream] 🎬 Asignando stream al video')
          videoRef.current.srcObject = stream
          
          // Configurar todos los event handlers aquí mismo
          videoRef.current.onloadedmetadata = () => {
            console.log('[UseEffect-Stream] 📊 Metadata cargada desde useEffect')
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  console.log('[UseEffect-Stream] ▶️ Video reproduciendo')
                  setTimeout(() => {
                    detectFaces()
                  }, 500)
                })
                .catch(e => {
                  console.error('[UseEffect-Stream] ❌ Error al reproducir:', e)
                })
            }
          }
        }
        
        clearInterval(checkInterval)
      }
    }, 100) // Verificar cada 100ms
    
    // Limpiar el interval después de 3 segundos si no se encuentra el video
    setTimeout(() => {
      clearInterval(checkInterval)
      if (!videoRef.current) {
        console.error('[UseEffect-Stream] ❌ Timeout: No se pudo encontrar videoRef después de 3 segundos')
      }
    }, 3000)
    
    return () => {
      console.log('[UseEffect-Stream] 🧹 Limpiando interval')
      clearInterval(checkInterval)
    }
  }, [stream, hasPermission, useSimulator, detectFaces])

  // Solicitar permisos de cámara
  const requestCameraPermission = async () => {
    console.log('[Camera] 🎥 Iniciando solicitud de permisos de cámara...')
    try {
      // Verificar si navigator.mediaDevices está disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('[Camera] ❌ navigator.mediaDevices no disponible')
        throw new Error('Tu navegador no soporta acceso a la cámara')
      }

      console.log('[Camera] ✅ navigator.mediaDevices disponible')

      // Listar dispositivos disponibles
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter(device => device.kind === 'videoinput')
        console.log('[Camera] 📷 Dispositivos de video encontrados:', videoDevices.length, videoDevices)
      } catch (e) {
        console.error('[Camera] ⚠️ No se pudieron enumerar dispositivos:', e)
      }

      // Intentar diferentes configuraciones de cámara
      let mediaStream = null
      const configurations = [
        { 
          video: { 
            width: { min: 320, ideal: 640, max: 1280 },
            height: { min: 240, ideal: 480, max: 720 },
            facingMode: 'user'
          }, 
          audio: false 
        },
        { video: { width: 640, height: 480 }, audio: false },
        { video: true, audio: false }, // Configuración más básica
      ]

      for (let i = 0; i < configurations.length; i++) {
        const config = configurations[i]
        try {
          console.log(`[Camera] 🔄 Intento ${i + 1}/${configurations.length}:`, JSON.stringify(config))
          mediaStream = await navigator.mediaDevices.getUserMedia(config)
          console.log('[Camera] ✅ Stream obtenido exitosamente:', {
            active: mediaStream.active,
            tracks: mediaStream.getTracks().map(t => ({
              kind: t.kind,
              label: t.label,
              readyState: t.readyState,
              enabled: t.enabled,
              muted: t.muted
            }))
          })
          break
        } catch (e: any) {
          console.error(`[Camera] ❌ Configuración ${i + 1} falló:`, {
            name: e.name,
            message: e.message,
            constraint: e.constraint
          })
        }
      }

      if (!mediaStream) {
        // Verificar si es un problema de HTTP vs HTTPS
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        const isHTTP = window.location.protocol === 'http:'
        
        console.error('[Camera] ❌ No se pudo obtener ningún stream')
        
        if (isHTTP && !isLocalhost) {
          throw new Error('La cámara requiere HTTPS. Estás usando HTTP en ' + window.location.hostname)
        } else {
          throw new Error('No se pudo acceder a la cámara. Verifica que esté conectada y no esté siendo usada por otra aplicación')
        }
      }
      
      console.log('[Camera] 🎯 Configurando stream en el componente...')
      
      // Solo guardar el stream, el useEffect se encargará de asignarlo al video
      setStream(mediaStream)
      setHasPermission(true)
      setErrorMessage('')
      setCameraFailureCount(0) // Resetear contador
      
      // Monitorear los tracks del stream
      const tracks = mediaStream.getTracks()
      console.log('[Camera] 🎞️ Monitoreando tracks del stream:', tracks.length)
      tracks.forEach((track, index) => {
        console.log(`[Camera] Track ${index + 1}:`, {
          kind: track.kind,
          label: track.label,
          readyState: track.readyState,
          enabled: track.enabled
        })
        
        // Detectar si el track se detiene
        track.onended = () => {
          console.error(`[Track] 🛑 Track ${track.kind} terminado inesperadamente`)
          if (handleCameraFailure) {
            handleCameraFailure()
          }
        }
      })
      
      console.log('[Camera] ✅ Estado actualizado, el useEffect manejará la conexión del video')
    } catch (error: any) {
      console.error('[Camera] ❌ Error crítico al acceder a la cámara:', error)
      
      // Determinar el tipo de error y mostrar mensaje apropiado
      let message = 'No se pudo acceder a la cámara'
      
      // Verificar si es un problema de contexto seguro (HTTPS)
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      const isHTTP = window.location.protocol === 'http:'
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        message = 'Permiso denegado: Por favor, permite el acceso a la cámara en tu navegador'
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        message = 'No se detectó ninguna cámara en tu dispositivo'
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        message = 'La cámara está siendo usada por otra aplicación (Teams, Zoom, etc.)'
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        message = 'La cámara no soporta la configuración solicitada'
      } else if (error.name === 'TypeError' || error.name === 'SecurityError') {
        if (isHTTP && !isLocalhost) {
          message = '⚠️ PROBLEMA DE SEGURIDAD: La cámara requiere HTTPS. Actualmente estás en HTTP.'
        } else {
          message = 'Tu navegador no permite el acceso a la cámara en este contexto'
        }
      } else if (error.message) {
        message = error.message
      }
      
      // Agregar nota sobre localhost si es relevante
      if (isLocalhost && message.includes('No se pudo acceder')) {
        message += '\n\nNOTA: En localhost, algunos navegadores requieren configuración especial. Prueba con Chrome o Edge.'
      }
      
      setErrorMessage(message)
      setHasPermission(false)
    }
  }

  // Denegar permisos
  const denyPermission = () => {
    setHasPermission(false)
  }

  // Activar simulador (para desarrollo en localhost)
  const activateSimulator = () => {
    setUseSimulator(true)
    setHasPermission(true)
    setErrorMessage('')
  }

  // Manejar fallo de cámara
  const handleCameraFailure = useCallback(() => {
    console.log('[HandleFailure] 🚨 handleCameraFailure llamado')
    console.log('[HandleFailure] Estado actual:', {
      hasStream: !!stream,
      hasPermission,
      cameraFailureCount,
      useSimulator,
      errorMessage
    })
    
    // Prevenir múltiples llamadas simultáneas
    if (!stream && !hasPermission) {
      console.log('[HandleFailure] ⏭️ Ya se manejó el fallo, ignorando...')
      return
    }
    
    // Detener el stream si existe
    if (stream) {
      console.log('[HandleFailure] 🛑 Deteniendo stream...')
      const tracks = stream.getTracks()
      console.log(`[HandleFailure] Tracks a detener: ${tracks.length}`)
      tracks.forEach((track, index) => {
        console.log(`[HandleFailure] Deteniendo track ${index + 1}:`, {
          kind: track.kind,
          label: track.label,
          readyState: track.readyState
        })
        track.stop()
      })
      setStream(null)
    }
    
    // Limpiar timers
    if (animationRef.current) {
      console.log('[HandleFailure] 🧹 Cancelando animationFrame')
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (cameraTimeoutRef.current) {
      console.log('[HandleFailure] 🧹 Limpiando timeout')
      clearTimeout(cameraTimeoutRef.current)
      cameraTimeoutRef.current = null
    }
    
    // Mostrar error
    const isLocalhost = window.location.hostname === 'localhost'
    const errorMsg = isLocalhost 
      ? 'La cámara se detuvo. En localhost esto es común. Usa el simulador para continuar.'
      : 'La cámara se detuvo inesperadamente. Puede estar siendo usada por otra aplicación.'
    
    console.log('[HandleFailure] 📝 Configurando mensaje de error:', errorMsg)
    setErrorMessage(errorMsg)
    setHasPermission(false)
    setCameraFailureCount(0) // Reset counter
    console.log('[HandleFailure] ✅ Proceso de fallo completado')
  }, [stream, hasPermission, cameraFailureCount, useSimulator, errorMessage])

  // Monitorear fallos de cámara
  useEffect(() => {
    console.log('[Monitor-Failures] 📊 Contador de fallos:', cameraFailureCount)
    // Si hay stream activo y demasiados fallos, manejar el error
    if (stream && cameraFailureCount > 10) {
      console.log('[Monitor-Failures] ❌ Demasiados fallos (>10), llamando handleCameraFailure')
      handleCameraFailure()
    }
  }, [cameraFailureCount, stream, handleCameraFailure])

  // Timeout adicional para detectar cámara muerta
  useEffect(() => {
    if (stream && hasPermission && !useSimulator) {
      console.log('[Monitor-Detection] ⏱️ Configurando timeout de 5s para verificar detecciones')
      const timeoutId = setTimeout(() => {
        console.log('[Monitor-Detection] 🔍 Verificando detecciones después de 5 segundos...')
        console.log('[Monitor-Detection] Detecciones actuales:', detections.length)
        
        if (detections.length === 0) {
          console.warn('[Monitor-Detection] ⚠️ No hay detecciones después de 5 segundos')
          // Verificar si el stream sigue activo
          const tracks = stream.getTracks()
          console.log('[Monitor-Detection] Tracks encontrados:', tracks.length)
          
          const activeTrack = tracks.find(track => track.readyState === 'live')
          
          if (!activeTrack) {
            console.error('[Monitor-Detection] ❌ No hay tracks activos, cámara falló')
            handleCameraFailure()
          } else {
            console.log('[Monitor-Detection] ✅ Hay tracks activos pero no detecciones')
          }
        } else {
          console.log('[Monitor-Detection] ✅ Detecciones funcionando correctamente')
        }
      }, 5000)

      return () => {
        console.log('[Monitor-Detection] 🧹 Limpiando timeout de detección')
        clearTimeout(timeoutId)
      }
    }
  }, [stream, hasPermission, useSimulator, detections.length, handleCameraFailure])

  // Limpiar al desmontar
  useEffect(() => {
    console.log('[Cleanup] 🔄 Configurando limpieza del componente')
    return () => {
      console.log('[Cleanup] 🧹 Desmontando componente FaceTime')
      if (stream) {
        console.log('[Cleanup] 🛑 Deteniendo stream al desmontar')
        stream.getTracks().forEach(track => {
          console.log(`[Cleanup] Deteniendo track: ${track.kind}`)
          track.stop()
        })
      }
      if (animationRef.current) {
        console.log('[Cleanup] 🖼️ Cancelando animación')
        cancelAnimationFrame(animationRef.current)
      }
      if (cameraTimeoutRef.current) {
        console.log('[Cleanup] ⏰ Limpiando timeout')
        clearTimeout(cameraTimeoutRef.current)
      }
      console.log('[Cleanup] ✅ Limpieza completada')
    }
  }, [stream])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
        {/* Barra de título estilo macOS */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            {/* Botones de ventana macOS */}
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors group relative"
            >
              <X className="w-2 h-2 text-red-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
            <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors group relative">
              <Minimize2 className="w-2 h-2 text-yellow-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors group relative">
              <Maximize2 className="w-2 h-2 text-green-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
          <div className="text-sm font-medium text-gray-300">FaceTime</div>
          <div className="w-16" /> {/* Espaciador para centrar el título */}
        </div>

        {/* Contenido principal */}
        <div className="relative bg-black" style={{ height: '500px' }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-white">Cargando...</div>
            </div>
          ) : hasPermission === null ? (
            // Solicitud de permisos
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center space-y-6">
                <div className="text-6xl">📹</div>
                <h2 className="text-2xl font-bold text-white">
                  FaceTime necesita acceso a tu cámara
                </h2>
                <p className="text-gray-400 max-w-md mx-auto">
                  Para poder realizar videollamadas y detectar rostros, 
                  necesitamos tu permiso para acceder a la cámara.
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={denyPermission}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    No permitir
                  </button>
                  <button
                    onClick={requestCameraPermission}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Permitir acceso
                  </button>
                </div>
                {window.location.hostname === 'localhost' && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-500 text-xs mb-2">¿Problemas con la cámara en localhost?</p>
                    <button
                      onClick={activateSimulator}
                      className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
                    >
                      Usar simulador de videollamada
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : hasPermission === false ? (
            // Sin permisos - mostrar efecto TV o mensaje de error
            <div className="relative h-full">
              {errorMessage ? (
                // Mostrar mensaje de error específico
                <div className="flex flex-col items-center justify-center h-full p-8 bg-gray-900">
                  <div className="text-center space-y-6 max-w-md">
                    <div className="text-1xl">⚠️</div>
                    <h2 className="text-2xl font-bold text-white">
                      Error al acceder a la cámara
                    </h2>
                    <p className="text-red-400 whitespace-pre-line">
                      {errorMessage}
                    </p>
                    <div className="space-y-3">
                      <p className="text-gray-400 text-sm">
                        Posibles soluciones:
                      </p>
                      <ul className="text-left text-gray-400 text-sm space-y-2">
                        <li>• Asegúrate de que tu cámara esté conectada y funcionando</li>
                        <li>• Cierra otras aplicaciones que usen la cámara (Teams, Zoom, Discord, etc.)</li>
                        <li>• Verifica los permisos en la configuración del navegador</li>
                        <li>• En Chrome: chrome://settings/content/camera</li>
                        <li>• En Edge: edge://settings/content/camera</li>
                        <li>• Si estás en localhost, usa Chrome o Edge (Firefox puede tener restricciones)</li>
                      </ul>
                      {window.location.hostname === 'localhost' && (
                        <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 text-yellow-400 text-sm">
                          <strong>⚠️ Estás en localhost:</strong> Algunos navegadores tienen restricciones especiales. 
                          Chrome y Edge suelen funcionar mejor para desarrollo local.
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => {
                          setHasPermission(null)
                          setErrorMessage('')
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Intentar de nuevo
                      </button>
                      {window.location.hostname === 'localhost' && (
                        <button
                          onClick={activateSimulator}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Usar simulador
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Efecto TV sin señal normal
                <TVStaticEffect />
              )}
            </div>
          ) : (
            // Con permisos - mostrar video y detección o simulador
            <div className="relative h-full bg-gray-900">
              {useSimulator ? (
                <FaceTimeSimulator />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover bg-black"
                    autoPlay={true}
                    playsInline={true}
                    muted={true}
                    controls={false}
                    style={{ display: stream ? 'block' : 'none' }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {!stream && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <div className="text-gray-400">Iniciando cámara...</div>
                      </div>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  />
                </>
              )}
              
              {/* Información de detecciones */}
              {!useSimulator && (
                <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span>Cámara activa</span>
                    </div>
                    <div>
                      Rostros detectados: {detections.length > 0 ? detections.length : 'Escaneando...'}
                    </div>
                   
                  </div>
                </div>
              )}

              {/* Controles */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => {
                    if (stream) {
                      stream.getTracks().forEach(track => track.stop())
                      setStream(null)
                    }
                    setHasPermission(null)
                    setErrorMessage('')
                    setUseSimulator(false)
                    if (animationRef.current) {
                      cancelAnimationFrame(animationRef.current)
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  {useSimulator ? 'Detener simulador' : 'Detener cámara'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
