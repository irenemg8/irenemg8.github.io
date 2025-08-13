"use client"

import { useRef, useEffect, useState } from 'react'
import Globe from 'react-globe.gl'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

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
  
  // Coordenadas aproximadas de las ubicaciones solicitadas
  const locations: Location[] = [
    { lat: 38.6167, lng: -1.1167, label: 'Yecla', color: '#ff6b6b', size: 0.4 },
    { lat: 38.9665, lng: -0.1661, label: 'Gandía', color: '#4ecdc4', size: 0.4 },
    { lat: 39.4699, lng: -0.3763, label: 'Valencia', color: '#45b7d1', size: 0.5 },
    { lat: 23.1291, lng: 113.2644, label: 'Guangzhou', color: '#f9ca24', size: 0.4 },
    { lat: 30.1104, lng: -97.3468, label: 'Bastrop', color: '#f0932b', size: 0.4 },
    { lat: 52.2297, lng: 21.0122, label: 'Warsaw', color: '#eb4d4b', size: 0.4 },
    { lat: 51.3583, lng: 1.4389, label: 'Broadstairs', color: '#6c5ce7', size: 0.4 }
  ]

  useEffect(() => {
    if (globeEl.current && isOpen) {
      // Configurar la vista inicial del globo
      globeEl.current.pointOfView({ lat: 40, lng: 0, altitude: 2 }, 1000)
      
      // Rotar automáticamente el globo
      const autoRotate = () => {
        if (globeEl.current) {
          globeEl.current.controls().autoRotate = true
          globeEl.current.controls().autoRotateSpeed = 1.5
        }
      }
      
      setTimeout(autoRotate, 1000)
    }
  }, [isOpen])

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
      <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 border-0 bg-black/95 backdrop-blur-sm">
        <div className="w-full h-full relative">
          {isOpen && (
            <Globe
              ref={globeEl}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
              
              // Configurar los puntos de ubicación
              pointsData={locations}
              pointAltitude={0.01}
              pointColor={(d: any) => d.color}
              pointRadius={(d: any) => d.size}
              pointResolution={8}
              
              // Etiquetas de las ubicaciones
              labelsData={locations}
              labelLat={(d: any) => d.lat}
              labelLng={(d: any) => d.lng}
              labelText={(d: any) => d.label}
              labelSize={1.5}
              labelDotRadius={0.3}
              labelColor={() => '#ffffff'}
              labelResolution={2}
              labelAltitude={0.02}
              
              // Configuración visual
              atmosphereColor="#3a82f6"
              atmosphereAltitude={0.25}
              
              // Animación y controles
              enablePointerInteraction={true}
              animateIn={true}
              
              width={typeof window !== 'undefined' ? window.innerWidth * 0.9 : 800}
              height={typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600}
            />
          )}
          
          {/* Botón de cerrar */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm 
                     rounded-full flex items-center justify-center text-white hover:bg-white/30 
                     transition-colors duration-200"
          >
            ✕
          </button>
          
          {/* Información */}
          <div className="absolute bottom-4 left-4 z-10 bg-black/50 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Ubicaciones</h3>
            <div className="text-sm text-white/80 space-y-1">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: location.color }}
                  />
                  <span>{location.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}