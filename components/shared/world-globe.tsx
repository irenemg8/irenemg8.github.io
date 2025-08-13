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
  const [globeRotation, setGlobeRotation] = useState({ lat: 0, lng: 0 })
  const animationRef = useRef<number>()
  
  // Ubicaciones con información detallada
  const travelLocations = [
    {
      id: "yecla",
      lat: 38.6145,
      lng: -1.1173,
      name: "Yecla",
      description: "Ciudad en Murcia conocida por su industria del mueble y vinos",
      event: "Visita cultural",
      date: "2023",
      cityInfo: "Municipio de la Región de Murcia con rica tradición vinícola",
      additionalInfo: "Yecla es famosa por sus vinos con Denominación de Origen y por la Fiesta de la Virgen que se celebra en diciembre con arcabuceros."
    },
    {
      id: "gandia",
      lat: 38.9680,
      lng: -0.1847,
      name: "Gandía",
      description: "Visita a la costa valenciana y su patrimonio histórico",
      event: "Vacaciones",
      date: "2022",
      cityInfo: "Ciudad costera en la provincia de Valencia con hermosas playas",
      additionalInfo: "Gandía fue la cuna de los Borja y cuenta con el magnífico Palacio Ducal, además de 7 kilómetros de playas de arena fina."
    },
    {
      id: "valencia",
      lat: 39.4699,
      lng: -0.3763,
      name: "Valencia",
      description: "Recorrido por la Ciudad de las Artes y las Ciencias",
      event: "Congreso tecnológico",
      date: "2023",
      cityInfo: "Capital de la Comunidad Valenciana, conocida por su arquitectura futurista",
      additionalInfo: "Valencia combina tradición y modernidad con su Ciudad de las Artes y las Ciencias diseñada por Santiago Calatrava y su casco histórico medieval."
    },
    {
      id: "guangzhou",
      lat: 23.1291,
      lng: 113.2644,
      name: "Guangzhou",
      description: "Intercambio cultural y comercial en China",
      event: "Feria internacional",
      date: "2023",
      cityInfo: "Gran metrópolis en el sur de China, importante centro económico",
      additionalInfo: "Guangzhou, anteriormente conocida como Cantón, es la tercera ciudad más grande de China y un importante centro comercial con más de 2200 años de historia."
    },
    {
      id: "warsaw",
      lat: 52.2297,
      lng: 21.0122,
      name: "Warsaw",
      description: "Visita cultural a la capital polaca",
      event: "Conferencia europea",
      date: "2024",
      cityInfo: "Capital de Polonia con un casco histórico reconstruido después de la guerra",
      additionalInfo: "El casco antiguo de Varsovia fue reconstruido meticulosamente tras la Segunda Guerra Mundial y hoy es Patrimonio de la Humanidad por la UNESCO."
    },
    {
      id: "broadstairs",
      lat: 51.3577,
      lng: 1.4400,
      name: "Broadstairs",
      description: "Visita a la costa inglesa y lugares históricos",
      event: "Intercambio cultural",
      date: "2023",
      cityInfo: "Pintoresca ciudad costera en Kent, Inglaterra",
      additionalInfo: "Broadstairs fue el lugar de veraneo favorito de Charles Dickens, quien escribió partes de 'David Copperfield' mientras se alojaba en Bleak House."
    },
    {
      id: "bastrop",
      lat: 30.1105,
      lng: -97.3152,
      name: "Bastrop",
      description: "Visita al corazón de Texas y sus parques naturales",
      event: "Viaje cultural",
      date: "2023",
      cityInfo: "Histórica ciudad en Texas conocida por sus bosques de pinos",
      additionalInfo: "Bastrop es conocida como la 'Puerta de entrada al Bosque Perdido de Pinos' y alberga el Parque Estatal de Bastrop con ecosistemas únicos en Texas."
    },
    {
      id: "rome",
      lat: 41.9028,
      lng: 12.4964,
      name: "Rome",
      description: "Visita a monumentos históricos y museos",
      event: "Viaje cultural",
      date: "2022",
      cityInfo: "Capital de Italia, ciudad eterna con miles de años de historia y arte",
      additionalInfo: "Roma alberga la Ciudad del Vaticano, el estado más pequeño del mundo, y conserva impresionantes monumentos como el Coliseo y el Foro Romano."
    },
    {
      id: "paris",
      lat: 48.8566,
      lng: 2.3522,
      name: "Paris",
      description: "Recorrido por los principales monumentos y museos",
      event: "Viaje de estudios",
      date: "2023",
      cityInfo: "Capital de Francia, ciudad de la luz y centro cultural mundial",
      additionalInfo: "París es famosa por la Torre Eiffel, el Louvre y Notre-Dame, pero también por sus cafés, la moda y la gastronomía que la convierten en un destino único."
    },
    {
      id: "barcelona",
      lat: 41.3851,
      lng: 2.1734,
      name: "Barcelona",
      description: "Visita a obras de Gaudí y la ciudad condal",
      event: "Congreso de diseño",
      date: "2022",
      cityInfo: "Capital catalana conocida por su arquitectura modernista y playas",
      additionalInfo: "Barcelona es conocida por las obras de Antoni Gaudí como la Sagrada Familia y el Parque Güell, además de por su vibrante vida cultural y gastronómica."
    },
    {
      id: "madrid",
      lat: 40.4168,
      lng: -3.7038,
      name: "Madrid",
      description: "Visita a museos y centros culturales",
      event: "Exposición de arte",
      date: "2023",
      cityInfo: "Capital de España, centro cultural con importantes museos",
      additionalInfo: "Madrid alberga el Triángulo del Arte con tres de los museos más importantes: el Prado, el Reina Sofía y el Thyssen-Bornemisza, además de una vibrante vida nocturna."
    },
    {
      id: "oporto",
      lat: 41.1579,
      lng: -8.6291,
      name: "Oporto",
      description: "Recorrido por bodegas y centro histórico",
      event: "Viaje gastronómico",
      date: "2024",
      cityInfo: "Segunda ciudad más importante de Portugal, famosa por su vino",
      additionalInfo: "Oporto es mundialmente conocida por sus vinos, sus puentes sobre el río Duero y su centro histórico declarado Patrimonio de la Humanidad."
    }
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
      controls.enableRotate = true // IMPORTANTE: Permitir rotación manual
      controls.autoRotate = false // Manejamos la rotación manualmente
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.rotateSpeed = 1.0 // Velocidad de rotación manual
      controls.minDistance = 1.5 // Distancia mínima de zoom
      controls.maxDistance = 5.0 // Distancia máxima de zoom
      
      // Actualizar estado cuando el usuario rota manualmente
      const updateRotationState = () => {
        const currentView = globe.pointOfView()
        if (currentView) {
          setGlobeRotation({ lat: currentView.lat, lng: currentView.lng })
        }
      }
      
      controls.addEventListener('change', updateRotationState)
      
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
          if (!isUserInteracting && globe && globeRef.current) {
            // Incrementar el ángulo de rotación de forma constante
            rotationAngle += 0.15 // grados por frame (un poco más rápido para que sea más visible)
            
            // Obtener la vista actual para mantener latitud y altitud
            const currentView = globe.pointOfView()
            if (currentView) {
              const newView = {
                lat: currentView.lat,
                lng: rotationAngle % 360,
                altitude: currentView.altitude
              }
              globe.pointOfView(newView, 0) // Sin animación para rotación suave
              setGlobeRotation({ lat: newView.lat, lng: newView.lng })
            }
          }
          
          animationRef.current = requestAnimationFrame(animate)
        }
        
        animationRef.current = requestAnimationFrame(animate)
      }
      
      // Detectar interacción del usuario mejorado
      let interactionTimeout: NodeJS.Timeout | null = null
      
      const handleInteractionStart = () => {
        setIsUserInteracting(true)
        // Limpiar timeout anterior si existe
        if (interactionTimeout) {
          clearTimeout(interactionTimeout)
        }
      }
      
      const handleInteractionEnd = () => {
        // Limpiar timeout anterior
        if (interactionTimeout) {
          clearTimeout(interactionTimeout)
        }
        
        // Reanudar después de 2 segundos de inactividad
        interactionTimeout = setTimeout(() => {
          setIsUserInteracting(false)
          // Sincronizar el ángulo de rotación con la posición actual
          const currentView = globe.pointOfView()
          if (currentView) {
            rotationAngle = currentView.lng
          }
        }, 2000)
      }
      
      // Agregar event listeners para detectar interacción
      const canvas = globe.renderer().domElement
      canvas.addEventListener('mousedown', handleInteractionStart)
      canvas.addEventListener('touchstart', handleInteractionStart)
      canvas.addEventListener('mouseup', handleInteractionEnd)
      canvas.addEventListener('touchend', handleInteractionEnd)
      canvas.addEventListener('mouseleave', handleInteractionEnd)
      canvas.addEventListener('wheel', handleInteractionStart)
      
      // También detectar cuando se arrastra
      canvas.addEventListener('mousemove', (e) => {
        if (e.buttons > 0) { // Si algún botón del mouse está presionado
          handleInteractionStart()
        }
      })
      
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
        canvas.removeEventListener('mouseleave', handleInteractionEnd)
        canvas.removeEventListener('wheel', handleInteractionStart)
        canvas.removeEventListener('mousemove', handleInteractionStart)
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
        
        {/* Barra superior estilo macOS con solo botón rojo */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200 flex items-center justify-center"
            />
          </div>
          <div className="text-white text-sm font-medium">
            Mapa Mundial - Mis Viajes
          </div>
          <div className="w-6"></div> {/* Espaciador más pequeño */}
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
              
              // Usar elementos HTML personalizados en lugar de puntos simples
              htmlElementsData={travelLocations}
              htmlLat="lat"
              htmlLng="lng"
              htmlAltitude={0.015}
              

              
              htmlElement={(d: any) => {
                // Creamos un elemento HTML personalizado para cada ubicación
                const el = document.createElement('div');
                
                // Crear el contenedor con estilos para mostrar nombre siempre
                el.style.position = 'relative';
                el.style.width = 'auto';
                el.style.height = 'auto';
                el.style.cursor = 'pointer';
                el.style.display = 'flex';
                el.style.flexDirection = 'column';
                el.style.alignItems = 'center';
                el.setAttribute('data-name', d.name);
                
                // Crear el punto rojo (chincheta) más grande
                const dot = document.createElement('div');
                dot.style.width = '16px';
                dot.style.height = '16px';
                dot.style.borderRadius = '50%';
                dot.style.background = 'radial-gradient(circle at 40% 40%, #ff5252, #d32f2f)';
                dot.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.8), 0 0 12px 3px rgba(255,41,41,0.7), 0 0 20px 5px rgba(255,41,41,0.3)';
                dot.style.marginTop = '3px';
                dot.style.animation = 'pulse 2s infinite';
                
                // Añadir animación CSS para el pulso
                if (!document.getElementById('globe-marker-animations')) {
                  const style = document.createElement('style');
                  style.id = 'globe-marker-animations';
                  style.textContent = `
                    @keyframes pulse {
                      0% { box-shadow: 0 0 0 3px rgba(255,255,255,0.8), 0 0 12px 3px rgba(255,41,41,0.7), 0 0 20px 5px rgba(255,41,41,0.3); }
                      50% { box-shadow: 0 0 0 5px rgba(255,255,255,1), 0 0 18px 5px rgba(255,41,41,0.8), 0 0 30px 8px rgba(255,41,41,0.4); }
                      100% { box-shadow: 0 0 0 3px rgba(255,255,255,0.8), 0 0 12px 3px rgba(255,41,41,0.7), 0 0 20px 5px rgba(255,41,41,0.3); }
                    }
                  `;
                  document.head.appendChild(style);
                }
                
                // Crear la etiqueta permanente con el nombre
                const nameLabel = document.createElement('div');
                nameLabel.textContent = d.name;
                nameLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                nameLabel.style.color = 'white';
                nameLabel.style.padding = '4px 8px';
                nameLabel.style.borderRadius = '6px';
                nameLabel.style.fontSize = '12px';
                nameLabel.style.fontWeight = 'bold';
                nameLabel.style.whiteSpace = 'nowrap';
                nameLabel.style.textAlign = 'center';
                nameLabel.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.3)';
                nameLabel.style.pointerEvents = 'none';
                nameLabel.style.display = 'block';
                nameLabel.style.maxWidth = '120px';
                nameLabel.style.border = '1px solid rgba(255,255,255,0.3)';
                nameLabel.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8)';
                nameLabel.style.marginBottom = '2px';
                
                // Estado para el tooltip detallado
                let tooltipVisible = false;
                
                // Función para mostrar el tooltip detallado
                function showDetailTooltip() {
                  // Primero ocultar cualquier otro tooltip detallado
                  document.querySelectorAll('[id^="detail-tooltip-"]').forEach(tip => {
                    tip.remove();
                  });
                  
                  // Crear tooltip detallado
                  const detailTooltip = document.createElement('div');
                  detailTooltip.id = 'detail-tooltip-' + d.id;
                  detailTooltip.style.position = 'absolute';
                  detailTooltip.style.bottom = '35px';
                  detailTooltip.style.left = '50%';
                  detailTooltip.style.transform = 'translateX(-50%)';
                  detailTooltip.style.backgroundColor = 'white';
                  detailTooltip.style.color = 'black';
                  detailTooltip.style.padding = '12px';
                  detailTooltip.style.borderRadius = '8px';
                  detailTooltip.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.1)';
                  detailTooltip.style.width = '260px';
                  detailTooltip.style.zIndex = '10000';
                  detailTooltip.style.border = '1px solid rgba(0,0,0,0.1)';
                  
                  // Contenido del tooltip
                  detailTooltip.innerHTML = `
                    <div style="position:relative; padding-right:25px;">
                      <button id="close-btn-${d.id}" style="position:absolute; top:0; right:0; background:#f0f0f0; border:none; border-radius:50%; width:20px; height:20px; font-size:14px; line-height:1; cursor:pointer; font-weight:bold;">×</button>
                      <h3 style="margin:0 0 8px; font-size:16px; font-weight:bold; color:#333;">${d.name}</h3>
                      <div style="color:#4299e1; font-size:12px; margin-bottom:8px; font-weight:500;">${d.cityInfo || ''}</div>
                      <hr style="margin:8px 0; border:none; height:1px; background:#e2e8f0;">
                      <div style="font-size:13px; margin:5px 0; font-weight:600; color:#2d3748;">${d.event || ''}</div>
                      <div style="font-size:12px; color:#718096; margin-bottom:8px;">${d.date || ''}</div>
                      <p style="font-size:13px; font-style:italic; margin:8px 0; color:#4a5568; line-height:1.4;">${d.description || ''}</p>
                      ${d.additionalInfo ? 
                        `<div style="margin-top:10px; padding-top:8px; border-top:1px solid #e2e8f0; font-size:12px; color:#718096; line-height:1.3;">${d.additionalInfo}</div>` 
                        : ''}
                    </div>
                  `;
                  
                  el.appendChild(detailTooltip);
                  tooltipVisible = true;
                  
                  // Agregar evento al botón cerrar
                  setTimeout(() => {
                    const closeBtn = document.getElementById('close-btn-' + d.id);
                    if (closeBtn) {
                      closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        detailTooltip.remove();
                        tooltipVisible = false;
                      });
                    }
                  }, 0);
                }
                
                // Eventos para el marcador
                el.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (tooltipVisible) {
                    const detailTooltip = document.getElementById('detail-tooltip-' + d.id);
                    if (detailTooltip) {
                      detailTooltip.remove();
                      tooltipVisible = false;
                    }
                  } else {
                    showDetailTooltip();
                  }
                });
                
                // Añadir primero la etiqueta con el nombre, luego el punto
                el.appendChild(nameLabel);
                el.appendChild(dot);
                return el;
              }}
              
              // Animación y controles
              enablePointerInteraction={true}
              animateIn={true}
              
              width={typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.95, 1000) : 800}
              height={typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.7, 650) : 600}
              />
            </Suspense>
          )}
          
          
          

        </div>
      </DialogContent>
    </Dialog>
  )
}