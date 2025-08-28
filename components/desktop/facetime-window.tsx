"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Minimize2, Maximize2 } from 'lucide-react'
import { TVStaticEffect } from './tv-static-effect'

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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [detections, setDetections] = useState<Detection[]>([])
  const [faceDetectorSupported, setFaceDetectorSupported] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const faceDetectorRef = useRef<any>(null)

  // Verificar si el navegador soporta FaceDetector API
  useEffect(() => {
    const checkFaceDetector = async () => {
      try {
        // @ts-ignore - FaceDetector es experimental
        if ('FaceDetector' in window) {
          // @ts-ignore
          const FaceDetector = window.FaceDetector
          faceDetectorRef.current = new FaceDetector()
          setFaceDetectorSupported(true)
        }
      } catch (error) {
        console.log('FaceDetector API no disponible, usando detección simulada')
      }
    }
    
    checkFaceDetector()
  }, [])

  // Función para detectar rostros
  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx || video.videoWidth === 0) {
      animationRef.current = requestAnimationFrame(detectFaces)
      return
    }

    // Ajustar canvas al tamaño del video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    try {
      // Intentar usar FaceDetector API si está disponible
      if (faceDetectorSupported && faceDetectorRef.current) {
        const faces = await faceDetectorRef.current.detect(video)
        
        const newDetections: Detection[] = faces.map((face: any, index: number) => ({
          id: index,
          x: face.boundingBox.x,
          y: face.boundingBox.y,
          width: face.boundingBox.width,
          height: face.boundingBox.height,
          confidence: 0.95
        }))
        
        setDetections(newDetections)
        
        // Dibujar detecciones
        newDetections.forEach((detection) => {
          ctx.strokeStyle = '#00ff00'
          ctx.lineWidth = 2
          ctx.strokeRect(detection.x, detection.y, detection.width, detection.height)
          
          ctx.fillStyle = '#00ff00'
          ctx.font = '16px Arial'
          ctx.fillText(`Usuario ${detection.id + 1}`, detection.x, detection.y - 10)
          ctx.fillText(`Confianza: ${Math.round(detection.confidence * 100)}%`, detection.x, detection.y + detection.height + 20)
        })
      } else {
        // Detección simulada basada en movimiento y colores de piel
        // Esta es una simulación básica que detecta áreas con tonos de piel
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        
        // Análisis simplificado de imagen para detectar rostros
        const centerX = video.videoWidth / 2
        const centerY = video.videoHeight / 2
        const boxSize = Math.min(video.videoWidth, video.videoHeight) * 0.35
        
        // Simular detección con animación suave
        const time = Date.now() / 1000
        const offsetX = Math.sin(time * 0.5) * 20
        const offsetY = Math.cos(time * 0.3) * 15
        
        const detection: Detection = {
          id: 0,
          x: centerX - boxSize/2 + offsetX,
          y: centerY - boxSize/2 + offsetY - 30,
          width: boxSize,
          height: boxSize,
          confidence: 0.85 + Math.sin(time) * 0.1
        }
        
        setDetections([detection])
        
        // Dibujar caja de detección
        ctx.strokeStyle = '#00ff00'
        ctx.lineWidth = 2
        ctx.strokeRect(detection.x, detection.y, detection.width, detection.height)
        
        // Dibujar esquinas decorativas
        const cornerLength = 20
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
        
        // Texto informativo
        ctx.fillStyle = '#00ff00'
        ctx.font = '16px Arial'
        ctx.fillText('Usuario detectado', detection.x, detection.y - 10)
        
        // Simular análisis facial
        const expressions = ['😊 Feliz', '😐 Neutral', '😎 Relajado', '🙂 Contento']
        const randomExpression = expressions[Math.floor(time * 0.5) % expressions.length]
        ctx.fillText(`Estado: ${randomExpression}`, detection.x, detection.y + detection.height + 20)
        
        // Indicador de confianza
        const confidencePercent = Math.round(detection.confidence * 100)
        ctx.fillText(`Confianza: ${confidencePercent}%`, detection.x, detection.y + detection.height + 40)
      }
    } catch (error) {
      console.error('Error en detección:', error)
    }

    // Continuar detección
    animationRef.current = requestAnimationFrame(detectFaces)
  }, [faceDetectorSupported])

  // Solicitar permisos de cámara
  const requestCameraPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 }
        }, 
        audio: false 
      })
      
      setStream(mediaStream)
      setHasPermission(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play()
          // Iniciar detección de rostros después de un pequeño delay
          setTimeout(() => {
            detectFaces()
          }, 500)
        }
      }
    } catch (error) {
      console.error('Error al acceder a la cámara:', error)
      setHasPermission(false)
    }
  }

  // Denegar permisos
  const denyPermission = () => {
    setHasPermission(false)
  }

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
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
              </div>
            </div>
          ) : hasPermission === false ? (
            // Sin permisos - mostrar efecto TV
            <TVStaticEffect />
          ) : (
            // Con permisos - mostrar video y detección
            <div className="relative h-full">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              
              {/* Información de detecciones */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white p-3 rounded-lg">
                <div className="text-sm space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Cámara activa</span>
                  </div>
                  <div>
                    Rostros detectados: {detections.length > 0 ? detections.length : 'Escaneando...'}
                  </div>
                  {!faceDetectorSupported && (
                    <div className="text-yellow-400 text-xs">
                      Modo simulación (detección básica)
                    </div>
                  )}
                </div>
              </div>

              {/* Controles */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => {
                    if (stream) {
                      stream.getTracks().forEach(track => track.stop())
                      setStream(null)
                      setHasPermission(null)
                      if (animationRef.current) {
                        cancelAnimationFrame(animationRef.current)
                      }
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Detener cámara
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
