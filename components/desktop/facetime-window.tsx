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

  // Función para detectar rostros
  const detectFaces = useCallback(async () => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        console.log('[DetectFaces] ❌ Referencias no disponibles', {
          video: !!videoRef.current,
          canvas: !!canvasRef.current
        })
        return
      }

      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Log detallado del estado del video
      console.log('[DetectFaces] 📹 Estado del video:', {
        paused: video.paused,
        ended: video.ended,
        readyState: video.readyState,
        readyStateText: ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'][video.readyState],
        currentTime: video.currentTime,
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        srcObject: !!video.srcObject,
        networkState: video.networkState,
        error: video.error
      })
      
      // Verificar que el video esté realmente reproduciendo
      if (video.paused || video.ended || video.readyState < 2) {
        console.log('[DetectFaces] ⚠️ Video no está listo para reproducir')
        
        if (video.paused) {
          console.log('[DetectFaces] 🔄 Intentando reproducir video pausado...')
          video.play().catch(e => {
            console.error('[DetectFaces] ❌ Error al intentar reproducir video:', e.name, e.message)
            setCameraFailureCount(prev => {
              const newCount = prev + 1
              console.log(`[DetectFaces] Incrementando contador de fallos: ${newCount}`)
              return newCount
            })
          })
        }
        
        // Esperar un poco antes de reintentar
        setTimeout(() => {
          console.log('[DetectFaces] ⏳ Reintentando en 100ms...')
          animationRef.current = requestAnimationFrame(detectFaces)
        }, 100)
        return
      }
      
      const ctx = canvas.getContext('2d')
      
      if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) {
        console.log('[DetectFaces] ⚠️ Canvas no listo:', {
          ctx: !!ctx,
          videoWidth: video.videoWidth,
          videoHeight: video.videoHeight
        })
        // Reintentar en el siguiente frame
        animationRef.current = requestAnimationFrame(detectFaces)
        return
      }

      // Ajustar canvas al tamaño del video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      console.log('[DetectFaces] ✅ Video funcionando correctamente', {
        width: video.videoWidth,
        height: video.videoHeight,
        currentTime: video.currentTime
      })
      
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Resetear contador de fallos si llegamos aquí
      setCameraFailureCount(0)
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
        // Detección simulada cuando no hay FaceDetector API
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
      setStream(mediaStream)
      setHasPermission(true)
      setErrorMessage('')
      setCameraFailureCount(0) // Resetear contador
      
      if (videoRef.current) {
        console.log('[Camera] 🎬 Asignando stream al elemento video...')
        videoRef.current.srcObject = mediaStream
        
        // Configurar timeout para detectar si la cámara falla después de iniciar
        cameraTimeoutRef.current = setTimeout(() => {
          console.log('[Camera-Timeout] ⏱️ Verificando estado después de 3 segundos...')
          
          if (!videoRef.current) {
            console.error('[Camera-Timeout] ❌ videoRef ya no existe')
            return
          }
          
          const videoState = {
            paused: videoRef.current.paused,
            ended: videoRef.current.ended,
            readyState: videoRef.current.readyState,
            readyStateText: ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'][videoRef.current.readyState],
            currentTime: videoRef.current.currentTime,
            srcObject: !!videoRef.current.srcObject
          }
          
          console.log('[Camera-Timeout] Estado del video:', videoState)
          
          // Si después de 3 segundos no funciona, manejar el fallo
          if (videoRef.current.paused || videoRef.current.readyState < 2) {
            console.log('[Camera-Timeout] ⚠️ La cámara no está funcionando correctamente')
            
            // En localhost, activar simulador automáticamente
            if (window.location.hostname === 'localhost') {
              console.log('En localhost, activando simulador automáticamente...')
              // Detener el stream primero
              if (stream) {
                stream.getTracks().forEach(track => track.stop())
                setStream(null)
              }
              // Activar simulador
              setUseSimulator(true)
              setErrorMessage('')
            } else {
              handleCameraFailure()
            }
          }
        }, 3000)
        
        // Configurar eventos del video
        videoRef.current.onloadedmetadata = () => {
          if (!videoRef.current) return
          
          console.log('[Video-Event] 📊 Metadata cargada:', {
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight,
            duration: videoRef.current.duration,
            readyState: videoRef.current.readyState
          })
          
          console.log('[Video-Event] ▶️ Intentando reproducir video...')
          videoRef.current.play()
            .then(() => {
              console.log('[Video-Event] ✅ Video reproduciendo exitosamente')
              // Limpiar timeout ya que el video está funcionando
              if (cameraTimeoutRef.current) {
                console.log('[Video-Event] 🧹 Limpiando timeout inicial')
                clearTimeout(cameraTimeoutRef.current)
              }
              
              // Iniciar detección de rostros después de un pequeño delay
              console.log('[Video-Event] ⏰ Iniciando detección de rostros en 500ms...')
              setTimeout(() => {
                console.log('[Video-Event] 🔍 Llamando a detectFaces()')
                detectFaces()
              }, 500)
              
              // Configurar nuevo timeout para detectar si se detiene después
              cameraTimeoutRef.current = setTimeout(() => {
                console.log('[Video-Event-5s] 🕐 Verificando detecciones después de 5 segundos...')
                if (detections.length === 0) {
                  console.warn('[Video-Event-5s] ⚠️ No hay detecciones después de 5 segundos')
                  handleCameraFailure()
                } else {
                  console.log('[Video-Event-5s] ✅ Detecciones encontradas:', detections.length)
                }
              }, 5000)
            })
            .catch(error => {
              console.error('[Video-Event] ❌ Error al reproducir video:', {
                name: error.name,
                message: error.message,
                error
              })
              setCameraFailureCount(prev => {
                const newCount = prev + 1
                console.log(`[Video-Event] Incrementando contador de fallos a: ${newCount}`)
                return newCount
              })
              // Intentar de nuevo o mostrar error
              setTimeout(() => {
                console.log('[Video-Event] 💔 Llamando handleCameraFailure después de 2s...')
                handleCameraFailure()
              }, 2000)
            })
        }
        
        // Agregar más eventos para debugging
        videoRef.current.onloadstart = () => {
          console.log('[Video-Event] 🎬 loadstart - Comenzando a cargar')
        }
        
        videoRef.current.oncanplay = () => {
          console.log('[Video-Event] ✅ canplay - Video puede comenzar a reproducirse')
        }
        
        videoRef.current.oncanplaythrough = () => {
          console.log('[Video-Event] ✅ canplaythrough - Video puede reproducirse sin interrupciones')
        }
        
        videoRef.current.onplaying = () => {
          console.log('[Video-Event] ▶️ playing - Video está reproduciendo')
        }
        
        videoRef.current.onstalled = () => {
          console.warn('[Video-Event] ⚠️ stalled - Carga detenida inesperadamente')
        }
        
        videoRef.current.onsuspend = () => {
          console.warn('[Video-Event] ⚠️ suspend - Carga suspendida')
        }
        
        videoRef.current.onwaiting = () => {
          console.warn('[Video-Event] ⏳ waiting - Esperando más datos')
        }
        
        // Monitorear cambios de estado del video
        videoRef.current.onpause = () => {
          console.warn('[Video-Event] ⏸️ Video pausado inesperadamente')
          if (videoRef.current && stream) {
            console.log('[Video-Event] 🔄 Intentando reanudar...')
            videoRef.current.play().catch(e => {
              console.error('[Video-Event] ❌ No se pudo reanudar:', e)
              handleCameraFailure()
            })
          }
        }
        
        videoRef.current.onended = () => {
          console.warn('[Video-Event] 🛑 Video terminado inesperadamente')
          handleCameraFailure()
        }
        
        // Manejar errores del video
        videoRef.current.onerror = (e) => {
          const video = videoRef.current
          const error = video?.error
          console.error('[Video-Event] ❌ Error en video:', {
            code: error?.code,
            message: error?.message,
            MEDIA_ERR_ABORTED: error?.code === 1,
            MEDIA_ERR_NETWORK: error?.code === 2,
            MEDIA_ERR_DECODE: error?.code === 3,
            MEDIA_ERR_SRC_NOT_SUPPORTED: error?.code === 4
          })
          handleCameraFailure()
        }
        
        // Detectar si el stream se detiene
        const tracks = mediaStream.getTracks()
        console.log('[Camera] 🎞️ Configurando eventos para tracks:', tracks.length)
        tracks.forEach((track, index) => {
          console.log(`[Camera] Track ${index + 1}:`, {
            kind: track.kind,
            label: track.label,
            id: track.id,
            readyState: track.readyState,
            enabled: track.enabled,
            muted: track.muted,
            constraints: track.getConstraints(),
            settings: track.getSettings()
          })
          
          track.onended = () => {
            console.error(`[Track] 🛑 Track ${track.kind} terminado inesperadamente`)
            handleCameraFailure()
          }
          
          track.onmute = () => {
            console.warn(`[Track] 🔇 Track ${track.kind} muteado`)
          }
          
          track.onunmute = () => {
            console.log(`[Track] 🔊 Track ${track.kind} desmuteado`)
          }
        })
        
        console.log('[Camera] ✅ Configuración completa del video')
      } else {
        console.warn('[Camera] ⚠️ videoRef.current no disponible')
      }
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
                    onContextMenu={(e) => e.preventDefault()}
                  />
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
                    {!faceDetectorSupported && (
                      <div className="text-yellow-400 text-xs">
                        Detección básica (FaceDetector API no disponible)
                      </div>
                    )}
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
