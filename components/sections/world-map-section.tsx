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
  const globeRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rotationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [dimensions, setDimensions] = useState({ width: 900, height: 600 })
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  
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
        const height = Math.min(600, Math.max(350, width * 0.7)); 
        setDimensions({ width, height });
      }
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Configurar rotación automática del globo
  useEffect(() => {
    if (!globeRef.current) return;
    
    const globe = globeRef.current;
    const controls = globe.controls();
    
    // Configuración inicial del globo
    globe.pointOfView({ lat: 0, lng: 0, altitude: 2.5 });
    
    // Configurar rotación automática
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8; // Velocidad constante y suave
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Función para manejar el inicio de la interacción
    const handleInteractionStart = () => {
      if (!isUserInteracting) {
        setIsUserInteracting(true);
        controls.autoRotate = false;
        
        // Limpiar timeout previo si existe
        if (rotationTimeoutRef.current) {
          clearTimeout(rotationTimeoutRef.current);
        }
      }
    };
    
    // Función para manejar el fin de la interacción
    const handleInteractionEnd = () => {
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
      
      // Reanudar rotación después de 2 segundos de inactividad
      rotationTimeoutRef.current = setTimeout(() => {
        setIsUserInteracting(false);
        if (globeRef.current) {
          const currentControls = globeRef.current.controls();
          currentControls.autoRotate = true;
          currentControls.autoRotateSpeed = 0.8;
        }
      }, 2000);
    };
    
    // Eventos del globo para detectar interacción
    const canvas = globe.renderer().domElement;
    
    // Eventos de mouse
    canvas.addEventListener('mousedown', handleInteractionStart);
    canvas.addEventListener('mouseup', handleInteractionEnd);
    canvas.addEventListener('mouseleave', handleInteractionEnd);
    
    // Eventos táctiles
    canvas.addEventListener('touchstart', handleInteractionStart);
    canvas.addEventListener('touchend', handleInteractionEnd);
    canvas.addEventListener('touchcancel', handleInteractionEnd);
    
    // Eventos de rueda del mouse (zoom)
    canvas.addEventListener('wheel', () => {
      handleInteractionStart();
      handleInteractionEnd();
    });
    
    return () => {
      // Limpiar eventos
      canvas.removeEventListener('mousedown', handleInteractionStart);
      canvas.removeEventListener('mouseup', handleInteractionEnd);
      canvas.removeEventListener('mouseleave', handleInteractionEnd);
      canvas.removeEventListener('touchstart', handleInteractionStart);
      canvas.removeEventListener('touchend', handleInteractionEnd);
      canvas.removeEventListener('touchcancel', handleInteractionEnd);
      canvas.removeEventListener('wheel', handleInteractionStart);
      
      // Limpiar timeout
      if (rotationTimeoutRef.current) {
        clearTimeout(rotationTimeoutRef.current);
      }
    };
  }, [isUserInteracting]);

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
        >
          {/* Contenedor para el globo */}
          <Suspense fallback={<div style={{ height: `${dimensions.height}px` }} className="w-full flex items-center justify-center">Loading map...</div>}>
            <style jsx global>{`
              .location-label {
                position: absolute;
                background-color: rgba(0, 0, 0, 0.75);
                color: white;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                font-weight: bold;
                transform: translate(-50%, -100%);
                opacity: 0;
                transition: opacity 0.2s;
                z-index: 1000;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                pointer-events: none;
                margin-top: -10px;
              }
              
              .globe-marker {
                cursor: pointer;
                position: relative;
                width: 30px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              
              .globe-marker-dot {
                width: 12px;
                height: 12px;
                background: radial-gradient(circle at 40% 40%, #ff5252, #d32f2f);
                border-radius: 50%;
                box-shadow: 0 0 0 4px rgba(255,255,255,0.6), 0 0 8px 3px rgba(255,41,41,0.6), inset 0 3px 2px rgba(255,255,255,0.4);
              }
              
              .globe-marker:hover .location-label {
                opacity: 1;
              }
              
              .globe-marker.active .location-label {
                opacity: 0;
              }
              
              .globe-tooltip {
                position: absolute;
                bottom: 120%;
                left: 50%;
                transform: translateX(-50%);
                background-color: white;
                color: black;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                width: 250px;
                text-align: center;
                z-index: 2000;
                opacity: 0;
                display: none;
                pointer-events: auto;
              }
              
              .globe-marker.active .globe-tooltip {
                opacity: 1;
                display: block;
              }
              
              .globe-tooltip::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -8px;
                border-width: 8px;
                border-style: solid;
                border-color: white transparent transparent transparent;
              }
              
              .tooltip-close {
                position: absolute;
                top: 5px;
                right: 5px;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-weight: bold;
                font-size: 14px;
                line-height: 1;
                border: none;
              }
            `}</style>
            <GlobeGL
              ref={globeRef}
              globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
              bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
              backgroundColor="rgba(0,0,0,0)"
              enablePointerInteraction={true}
              htmlElementsData={travelLocations}
              htmlLat="lat"
              htmlLng="lng"
              htmlAltitude={0.015}
              htmlElement={(d: any) => {
                // Creamos un elemento simple con estilos directos
                const el = document.createElement('div');
                
                // Crear el contenedor con estilos para mostrar nombre siempre
                el.style.position = 'relative';
                el.style.width = 'auto'; // Auto-ajuste al contenido
                el.style.height = 'auto'; // Auto-ajuste al contenido
                el.style.cursor = 'pointer';
                el.style.display = 'flex';
                el.style.flexDirection = 'column';
                el.style.alignItems = 'center';
                el.setAttribute('data-name', d.name);
                
                // Crear el punto rojo (chincheta)
                const dot = document.createElement('div');
                dot.style.width = '10px';
                dot.style.height = '10px';
                dot.style.borderRadius = '50%';
                dot.style.background = 'radial-gradient(circle at 40% 40%, #ff5252, #d32f2f)';
                dot.style.boxShadow = '0 0 0 2px rgba(255,255,255,0.6), 0 0 8px 2px rgba(255,41,41,0.6)';
                dot.style.marginTop = '2px'; // Pequeño espacio entre la etiqueta y el punto
                
                // Crear la etiqueta permanente con el nombre
                const nameLabel = document.createElement('div');
                nameLabel.textContent = d.name;
                nameLabel.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                nameLabel.style.color = 'white';
                nameLabel.style.padding = '2px 5px';
                nameLabel.style.borderRadius = '3px';
                nameLabel.style.fontSize = '10px';
                nameLabel.style.fontWeight = 'bold';
                nameLabel.style.whiteSpace = 'nowrap'; // Mantener el texto en una sola línea
                nameLabel.style.textAlign = 'center';
                nameLabel.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
                nameLabel.style.pointerEvents = 'none'; // Para que no interfiera con los eventos
                nameLabel.style.display = 'block'; // Para que se ajuste al contenido
                nameLabel.style.maxWidth = '100px'; // Ancho máximo por si hay nombres muy largos
                
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
                  detailTooltip.style.bottom = '30px';
                  detailTooltip.style.left = '50%';
                  detailTooltip.style.transform = 'translateX(-50%)';
                  detailTooltip.style.backgroundColor = 'white';
                  detailTooltip.style.color = 'black';
                  detailTooltip.style.padding = '10px';
                  detailTooltip.style.borderRadius = '6px';
                  detailTooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
                  detailTooltip.style.width = '220px';
                  detailTooltip.style.zIndex = '10000';
                  
                  // Contenido
                  detailTooltip.innerHTML = `
                    <div style="position:relative; padding-right:20px;">
                      <button id="close-btn-${d.id}" style="position:absolute; top:0; right:0; background:#eee; border:none; border-radius:50%; width:18px; height:18px; font-size:12px; line-height:1; cursor:pointer;">×</button>
                      <h3 style="margin:0 0 5px; font-size:14px; font-weight:bold;">${d.name}</h3>
                      <div style="color:#4299e1; font-size:11px; margin-bottom:5px;">${d.cityInfo || ''}</div>
                      <hr style="margin:5px 0; border:none; height:1px; background:#eee;">
                      <div style="font-size:11px; margin:3px 0; font-weight:500;">${d.event || ''}</div>
                      <div style="font-size:11px; color:#666;">${d.date || ''}</div>
                      <p style="font-size:11px; font-style:italic; margin:5px 0;">${d.description || ''}</p>
                      ${d.additionalInfo ? 
                        `<div style="margin-top:5px; padding-top:5px; border-top:1px solid #eee; font-size:10px; color:#555;">${d.additionalInfo}</div>` 
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
                el.addEventListener('click', () => {
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
              width={dimensions.width}
              height={dimensions.height}
            />
          </Suspense>
        </div>
      </motion.div>
    </div>
  )
} 