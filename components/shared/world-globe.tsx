"use client"

import { useRef, useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

// Importación dinámica para evitar problemas con SSR
const GlobeGL = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center text-white">Cargando mapa...</div>
})

interface Location {
  lat: number
  lng: number
  label: string
  color?: string
  size?: number
}

export function WorldGlobe() {
  const globeEl = useRef<any>()
  const [isOpen, setIsOpen] = useState(false)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const animationRef = useRef<number>()
  
  // Coordenadas aproximadas de las ubicaciones solicitadas con tamaños más grandes
  const locations: Location[] = [
    { lat: 38.6167, lng: -1.1167, label: 'Yecla', color: '#ff6b6b', size: 0.8 },
    { lat: 38.9665, lng: -0.1661, label: 'Gandía', color: '#4ecdc4', size: 0.8 },
    { lat: 39.4699, lng: -0.3763, label: 'Valencia', color: '#45b7d1', size: 1.0 },
    { lat: 23.1291, lng: 113.2644, label: 'Guangzhou', color: '#f9ca24', size: 0.8 },
    { lat: 30.1104, lng: -97.3468, label: 'Bastrop', color: '#f0932b', size: 0.8 },
    { lat: 52.2297, lng: 21.0122, label: 'Warsaw', color: '#eb4d4b', size: 0.8 },
    { lat: 51.3583, lng: 1.4389, label: 'Broadstairs', color: '#6c5ce7', size: 0.8 }
  ]
  
  // Función para calcular la posición del sol en tiempo real
  const getSunPosition = () => {
    const now = new Date()
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const hourOfDay = now.getUTCHours() + now.getUTCMinutes() / 60
    
    // Cálculo simplificado de la posición del sol
    const sunLongitude = (hourOfDay - 12) * 15 // 15 grados por hora
    const sunLatitude = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180)
    
    return { lat: sunLatitude, lng: sunLongitude }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && globeEl.current && isOpen) {
      const globe = globeEl.current
      
      // Configurar la vista inicial perfectamente centrada
      globe.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 2000)
      
      // Asegurar que el globo esté centrado en el contenedor
      globe.controls().target.set(0, 0, 0)
      
      // Configurar controles para permitir interacción del usuario
      const controls = globe.controls()
      controls.enableZoom = true
      controls.enablePan = false // Deshabilitamos pan para mejor experiencia
      controls.enableRotate = true
      controls.autoRotate = false // Manejamos la rotación manualmente
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      
      // Configurar iluminación solar en tiempo real
      const updateSolarIllumination = () => {
        const sunPos = getSunPosition()
        // Actualizar la posición de la luz solar
        if (globe.scene && globe.scene.children) {
          const lights = globe.scene().children.filter((child: any) => 
            child.type === 'DirectionalLight'
          )
          if (lights.length > 0) {
            const sunLight = lights[0]
            const phi = (90 - sunPos.lat) * Math.PI / 180
            const theta = (sunPos.lng + 180) * Math.PI / 180
            
            sunLight.position.x = Math.sin(phi) * Math.cos(theta)
            sunLight.position.y = Math.cos(phi)
            sunLight.position.z = Math.sin(phi) * Math.sin(theta)
            sunLight.position.normalize().multiplyScalar(5)
          }
        }
      }
      
      // Rotación automática realista como la Tierra
      let rotationAngle = 0
      
      const startEarthRotation = () => {
        const animate = () => {
          if (!isUserInteracting && globe) {
            // Incrementar el ángulo de rotación (más lento y suave)
            rotationAngle += 0.1 // grados por frame
            
            // Obtener la vista actual para mantener latitud y altitud
            const currentView = globe.pointOfView()
            if (currentView) {
              globe.pointOfView({
                lat: currentView.lat,
                lng: rotationAngle % 360,
                altitude: currentView.altitude
              })
            }
          }
          
          animationRef.current = requestAnimationFrame(animate)
        }
        
        animationRef.current = requestAnimationFrame(animate)
      }
      
      // Detectar interacción del usuario
      const handleInteractionStart = () => {
        setIsUserInteracting(true)
      }
      
      const handleInteractionEnd = () => {
        setTimeout(() => setIsUserInteracting(false), 2000) // Reanudar después de 2s
      }
      
      // Agregar event listeners
      const canvas = globe.renderer().domElement
      canvas.addEventListener('mousedown', handleInteractionStart)
      canvas.addEventListener('touchstart', handleInteractionStart)
      canvas.addEventListener('mouseup', handleInteractionEnd)
      canvas.addEventListener('touchend', handleInteractionEnd)
      canvas.addEventListener('wheel', handleInteractionStart)
      
      // Inicializar después de un breve delay
      setTimeout(() => {
        updateSolarIllumination()
        startEarthRotation()
      }, 1000)
      
      // Actualizar iluminación cada 5 minutos
      const solarInterval = setInterval(updateSolarIllumination, 5 * 60 * 1000)
      
      // Cleanup function
      return () => {
        clearInterval(solarInterval)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        canvas.removeEventListener('mousedown', handleInteractionStart)
        canvas.removeEventListener('touchstart', handleInteractionStart)
        canvas.removeEventListener('mouseup', handleInteractionEnd)
        canvas.removeEventListener('touchend', handleInteractionEnd)
        canvas.removeEventListener('wheel', handleInteractionStart)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isOpen, isUserInteracting])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="focus:outline-none opacity-0 pointer-events-none absolute"
          data-world-globe-trigger
        >
          <img
            src="/mundo.png"
            alt="Mundo"
            className="w-12 h-12 object-contain hover:scale-105 transition-all duration-200 drop-shadow-sm"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] p-0 border-0 bg-gradient-to-b from-slate-900/98 to-black/98 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
        <VisuallyHidden.Root>
          <DialogTitle>Mapa Mundial Interactivo</DialogTitle>
        </VisuallyHidden.Root>
        
        {/* Barra superior estilo macOS */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
              />
              <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-colors duration-200" />
              <div className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-200" />
            </div>
          </div>
          <div className="text-white text-sm font-medium">
            Mapa Mundial - Mis Viajes
          </div>
          <div className="w-16"></div> {/* Espaciador */}
        </div>

        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          {isOpen && (
            <Suspense fallback={<div className="h-full w-full flex items-center justify-center text-white">Cargando mapa...</div>}>
              <GlobeGL
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundColor="rgba(0,0,0,0)"
              
              // Configurar iluminación solar realista
              showAtmosphere={true}
              atmosphereColor="#87CEEB"
              atmosphereAltitude={0.15}
              
              // Configurar los puntos de ubicación con chinchetas más grandes
              pointsData={locations}
              pointAltitude={0.025}
              pointColor={(d: any) => d.color}
              pointRadius={(d: any) => d.size * 2.5} // Chinchetas más grandes
              pointResolution={16}
              
              // Etiquetas más grandes y visibles
              labelsData={locations}
              labelLat={(d: any) => d.lat}
              labelLng={(d: any) => d.lng}
              labelText={(d: any) => d.label}
              labelSize={3.5} // Texto más grande
              labelDotRadius={0.6} // Punto más grande
              labelColor={() => '#ffffff'}
              labelResolution={4}
              labelAltitude={0.035} // Más elevado para mejor visibilidad
              

              
              // Animación y controles
              enablePointerInteraction={true}
              animateIn={true}
              
              width={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.95, 1000) : 800}
              height={typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.7, 650) : 600}
              />
            </Suspense>
          )}
          
          {/* Fondo de estrellas animadas */}
          <div className="absolute inset-0 z-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full opacity-60 animate-pulse"
                style={{
                  width: Math.random() * 2 + 1 + 'px',
                  height: Math.random() * 2 + 1 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 3 + 's',
                  animationDuration: (Math.random() * 3 + 2) + 's'
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}