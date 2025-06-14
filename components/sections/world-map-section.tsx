"use client"
import React, { useRef, useState, useEffect, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

// Importación dinámica para evitar problemas con SSR
const GlobeGL = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => <div className="h-[600px] w-full flex items-center justify-center">Loading map...</div>
})

export interface TravelLocation {
  id: string
  lat: number
  lng: number
  name: string
  description: string
  event?: string
  date?: string
  cityInfo?: string
  additionalInfo?: string
}

interface WorldMapSectionProps {
  title: string
}

export function WorldMapSection({ title }: WorldMapSectionProps) {
  const globeRef = useRef<any>()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 })
  const [globeMounted, setGlobeMounted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  
  // Ubicaciones específicas
  const travelLocations: TravelLocation[] = [
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
      id: "varsovia",
      lat: 52.2297,
      lng: 21.0122,
      name: "Varsovia",
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
      id: "roma",
      lat: 41.9028,
      lng: 12.4964,
      name: "Roma",
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
      name: "París",
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
    }
  ]

  // Ajustar las dimensiones del globo en función del tamaño del contenedor
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = Math.min(600, Math.max(350, width * 0.7)); // Aumentado la proporción altura/anchura
        setDimensions({ width, height });
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Configurar el globo después de que se monte
  useEffect(() => {
    if (!globeRef.current) return;
    
    const globe = globeRef.current;
    
    // Ajustar la distancia de la cámara para que se vea más grande
    globe.pointOfView({ altitude: 2.5 });
    
    setGlobeMounted(true);
    
    // Configurar rotación automática
    let rotationSpeed = 0.001; // Velocidad de rotación aumentada
    
    // Usar un intervalo en lugar de requestAnimationFrame para garantizar la rotación continua
    const intervalId = setInterval(() => {
      if (globe && globe.scene && globe.scene.rotation && !isPaused) {
        globe.scene.rotation.y += rotationSpeed * 16; // Aproximadamente 16ms por frame a 60fps
      }
    }, 16);
    
    // Limpiar el intervalo al desmontar
    return () => {
      clearInterval(intervalId);
    };
  }, [isPaused]);

  // Manejadores para pausar/reanudar la rotación al interactuar
  const handleGlobePointerDown = () => {
    setIsPaused(true);
  };

  const handleGlobePointerUp = () => {
    // Reanudar la rotación inmediatamente
    setIsPaused(false);
  };

  // Usar un efecto para manejar la pausa/reanudación de la rotación
  useEffect(() => {
    let resumeTimeout: NodeJS.Timeout | null = null;
    
    if (isPaused) {
      // Programar la reanudación de la rotación después de un tiempo
      resumeTimeout = setTimeout(() => {
        setIsPaused(false);
      }, 3000);
    }
    
    // Limpiar el timeout al desmontar o cuando cambie isPaused
    return () => {
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
      }
    };
  }, [isPaused]);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold font-pecita mb-8 flex justify-center items-center gap-2">
        {title}
      </h2>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="w-full"
      >
        <div 
          ref={containerRef} 
          className="relative w-full h-auto"
          onPointerDown={handleGlobePointerDown}
          onPointerUp={handleGlobePointerUp}
          onPointerLeave={handleGlobePointerUp}
        >
          {/* Contenedor para el globo */}
          <Suspense fallback={<div style={{ height: `${dimensions.height}px` }} className="w-full flex items-center justify-center">Loading map...</div>}>
            <GlobeGL
              ref={globeRef}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundColor="rgba(0,0,0,0)"
              enablePointerInteraction={true}
              htmlElementsData={travelLocations}
              htmlLat="lat"
              htmlLng="lng"
              htmlAltitude={0.015} // Aumentado para que las chinchetas se vean más alejadas de la superficie
              htmlElement={(d: any) => {
                const el = document.createElement('div');
                
                // Crear el contenedor principal
                const container = document.createElement('div');
                container.className = 'relative';
                container.style.width = '30px';
                container.style.height = '30px';
                
                // Crear la chincheta
                const marker = document.createElement('div');
                marker.className = 'cursor-pointer';
                marker.style.width = '14px';
                marker.style.height = '14px';
                marker.style.background = 'radial-gradient(circle at 40% 40%, #ff5252, #d32f2f)';
                marker.style.borderRadius = '50%';
                marker.style.boxShadow = '0 0 0 4px rgba(255,255,255,0.6), 0 0 8px 3px rgba(255,41,41,0.6), inset 0 3px 2px rgba(255,255,255,0.4)';
                marker.style.position = 'absolute';
                marker.style.top = '8px';
                marker.style.left = '8px';
                marker.style.zIndex = '2';
                
                // Crear la parte inferior de la chincheta
                const pin = document.createElement('div');
                pin.style.position = 'absolute';
                pin.style.top = '22px';
                pin.style.left = '13px';
                pin.style.width = '6px';
                pin.style.height = '14px';
                pin.style.background = 'linear-gradient(135deg, #ff5252, #b71c1c)';
                pin.style.transform = 'perspective(15px) rotateX(-35deg)';
                pin.style.transformOrigin = 'top center';
                pin.style.clipPath = 'polygon(0% 0%, 100% 0%, 50% 100%)';
                pin.style.boxShadow = '0 4px 6px rgba(0,0,0,0.6)';
                pin.style.zIndex = '1';
                
                // Añadir eventos a la chincheta
                marker.addEventListener('click', () => {
                  const tooltip = container.querySelector('.tooltip') as HTMLElement;
                  
                  // Si ya hay un tooltip activo para otra chincheta, ocultarlo
                  const activeTooltips = document.querySelectorAll('.tooltip.active');
                  activeTooltips.forEach(t => {
                    if (t !== tooltip) {
                      t.classList.remove('active');
                      (t as HTMLElement).style.display = 'none';
                    }
                  });
                  
                  if (tooltip) {
                    // Alternar visibilidad del tooltip
                    if (tooltip.classList.contains('active')) {
                      tooltip.classList.remove('active');
                      tooltip.style.display = 'none';
                    } else {
                      tooltip.classList.add('active');
                      tooltip.style.display = 'block';
                    }
                  }
                });
                
                // Añadir la chincheta al contenedor
                container.appendChild(marker);
                container.appendChild(pin);
                
                // Crear el tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.style.position = 'absolute';
                tooltip.style.bottom = '30px';
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translateX(-50%)';
                tooltip.style.backgroundColor = 'white';
                tooltip.style.color = 'black';
                tooltip.style.padding = '12px';
                tooltip.style.borderRadius = '8px';
                tooltip.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
                tooltip.style.width = '250px';
                tooltip.style.textAlign = 'center';
                tooltip.style.zIndex = '100';
                tooltip.style.display = 'none';
                tooltip.style.pointerEvents = 'auto';
                
                // Crear el contenido del tooltip
                tooltip.innerHTML = `
                  <div class="relative">
                    <button class="close-btn" style="position:absolute; top:0; right:0; background:#f0f0f0; border-radius:50%; width:20px; height:20px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-weight:bold;">×</button>
                    <h3 style="font-weight:bold; margin-bottom:5px; padding-right:20px;">${d.name}</h3>
                    <div style="color:#4299e1; font-size:12px; margin-bottom:5px;">${d.cityInfo || ''}</div>
                    <hr style="border:none; height:1px; background-color:#e2e8f0; margin:8px 0;" />
                    <div style="font-size:12px; font-weight:500;">${d.event || ''}</div>
                    <div style="font-size:12px; color:#718096; margin-bottom:5px;">${d.date || ''}</div>
                    <p style="font-size:12px; font-style:italic; margin-top:8px;">"${d.description || ''}"</p>
                    ${d.additionalInfo ? `
                      <div style="margin-top:12px; padding-top:12px; border-top:1px solid #e2e8f0;">
                        <p style="font-size:12px; color:#4a5568;">${d.additionalInfo}</p>
                      </div>
                    ` : ''}
                  </div>
                `;
                
                // Añadir el tooltip al contenedor
                container.appendChild(tooltip);
                
                // Añadir evento al botón de cerrar inmediatamente sin setTimeout
                const closeBtn = tooltip.querySelector('.close-btn');
                if (closeBtn) {
                  closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    tooltip.style.display = 'none';
                    tooltip.classList.remove('active');
                  });
                }
                
                el.appendChild(container);
                return el;
              }}
              width={dimensions.width}
              height={dimensions.height}
            />
          </Suspense>
        </div>
      </motion.div>
    </div>
  )
} 