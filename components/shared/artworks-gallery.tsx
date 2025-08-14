"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut, X } from "lucide-react"
import Image from "next/image"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

interface Artwork {
  id: number
  title: string
  type: string
  image: string
  year: string
  description: string
  fullDescription: string
  tools: string[]
  designNotes: string
}

export function ArtworksGallery() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const artworks: Artwork[] = [
    {
      id: 1,
      title: "UrbanCity",
      type: "Interactive App",
      image: "/art/urbancity.png",
      year: "2025",
      description: "An interactive app promoting urban walking routes in Valencia.",
      fullDescription: "Una aplicación interactiva diseñada para fomentar el caminar como medio de transporte sostenible y saludable en Valencia. La visualización destaca rutas urbanas clave, áreas verdes y puntos de referencia, ofreciendo una experiencia inmersiva para motivar a los ciudadanos a descubrir su ciudad a pie.",
      tools: ["V0", "Figma", "React", "Typescript", "TailwindCSS"],
      designNotes: "El objetivo principal era crear una herramienta visual atractiva e informativa que reduzca las barreras para que los ciudadanos elijan caminar sobre otros modos de transporte."
    },
    {
      id: 2,
      title: "Icon Library",
      type: "UI Kit",
      image: "/art/icon.svg",
      year: "2025",
      description: "A comprehensive UI kit with over 50 components",
      fullDescription: "Una biblioteca completa de componentes UI diseñada para aplicaciones web modernas. Incluye más de 50 componentes con varios estados, variantes de modo claro/oscuro y layouts responsivos.",
      tools: ["Figma", "Illustrator"],
      designNotes: "Diseñado pensando en accesibilidad y flexibilidad. Cada componente sigue un sistema de grilla consistente de 8px y usa un sistema de colores modular que puede ser fácilmente personalizado."
    },
    {
      id: 3,
      title: "Nemo - Yummy Fish",
      type: "Low Poly",
      image: "/art/nemo.png",
      year: "2024",
      description: "Low poly 3D model of Nemo, designed for the Yummy Fish game.",
      fullDescription: "Un modelo 3D estilizado de low poly de Nemo, creado como personaje jugable para el videojuego Yummy Fish. El modelo enfatiza colores vibrantes y geometría mínima para asegurar rendimiento óptimo en entornos en tiempo real.",
      tools: ["Blender", "3ds Max", "Photoshop"],
      designNotes: "El objetivo del diseño era capturar el look icónico de Nemo usando la menor cantidad de polígonos posible, equilibrando la fidelidad visual con la eficiencia en el juego."
    },
    {
      id: 4,
      title: "Mario Bros's World",
      type: "3D",
      image: "/art/mario.png",
      year: "2024",
      description: "A realistic 3D character model, reimagined for a next-generation game environment.",
      fullDescription: "Un modelo 3D realista de alta fidelidad de Mario Bros, diseñado como exploración del rediseño de personajes clásicos para plataformas de gaming modernas.",
      tools: ["Blender", "Photoshop"],
      designNotes: "El principal desafío creativo fue preservar la silueta y personalidad instantáneamente reconocible de Mario mientras se traduce a un estilo artístico realista."
    },
    {
      id: 5,
      title: "Realistic Moon",
      type: "3D",
      image: "/art/luna.png",
      year: "2024",
      description: "A photorealistic 3D model of the Moon, animated to rotate on its axis.",
      fullDescription: "Un modelo 3D altamente detallado y realista de la Luna, diseñado para mostrar texturas avanzadas, detalles de superficie y precisión astronómica.",
      tools: ["Blender", "Photoshop"],
      designNotes: "El principal desafío creativo fue lograr un equilibrio entre precisión científica y atractivo visual."
    },
    {
      id: 6,
      title: "Yarn Mushroom",
      type: "3D",
      image: "/art/champinon.png",
      year: "2024",
      description: "A stylized 3D mushroom character created with a realistic yarn effect.",
      fullDescription: "Un modelo 3D encantador y divertido de un personaje hongo, diseñado para emular la apariencia y sensación del arte de lana suave o crochet.",
      tools: ["Blender", "Photoshop"],
      designNotes: "El principal desafío creativo fue lograr una textura de lana convincente que evoque tanto realismo como fantasía."
    },
    {
      id: 7,
      title: "Clay Octopus",
      type: "3D",
      image: "/art/pulpo.png",
      year: "2024",
      description: "A cute, stylized 3D octopus character designed with a soft, approachable aesthetic.",
      fullDescription: "Un encantador modelo 3D de un personaje pulpo inspirado en kawaii, creado para evocar diversión y amistad.",
      tools: ["Blender", "Photoshop"],
      designNotes: "El principal desafío de diseño fue lograr un equilibrio delicado entre simplicidad y carácter."
    },
    {
      id: 8,
      title: "Kawaii Forest Doll",
      type: "3D",
      image: "/art/doll.png",
      year: "2025",
      description: "A whimsical 3D stylized doll character, set in a magical forest scene.",
      fullDescription: "Un encantador modelo 3D de una muñeca inspirada en kawaii, presentada dentro de un ambiente de bosque onírico.",
      tools: ["Blender", "Photoshop"],
      designNotes: "El desafío central del diseño fue capturar inocencia y asombro a través del minimalismo y la armonía de colores."
    },
    {
      id: 9,
      title: "Enchanted Forest",
      type: "3D",
      image: "/art/forest.gif",
      year: "2025",
      description: "A looping 3D animation of a mystical forest with a stylized character centerpiece.",
      fullDescription: "Una escena 3D animada visualmente cautivadora ambientada en un bosque encantado, con un personaje estilizado sobre un pedestal antiguo.",
      tools: ["Blender", "AI"],
      designNotes: "El principal desafío creativo fue equilibrar detalles ambientales intrincados con una paleta de colores suave e invitante."
    }
  ]

  const nextArtwork = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length)
  }

  const prevArtwork = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length)
  }

  const openArtworkDetail = (artwork: Artwork) => {
    setSelectedArtwork(artwork)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className="focus:outline-none opacity-0 pointer-events-none absolute"
          data-artworks-trigger
        >
          Art Gallery Trigger
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 border border-border bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <VisuallyHidden.Root>
          <DialogTitle>Galería de Arte Digital</DialogTitle>
        </VisuallyHidden.Root>
        
        {/* Barra superior estilo macOS con 3 botones */}
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 h-12 flex-shrink-0 rounded-t-xl">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
                title="Cerrar"
              />
              <div className="w-3 h-3 bg-yellow-500 hover:bg-yellow-600 rounded-full transition-colors duration-200" title="Minimizar" />
              <div className="w-3 h-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-200" title="Maximizar" />
            </div>
          </div>
          <div className="text-foreground text-sm font-medium">
            Galería de Arte - Mis Obras ({currentIndex + 1}/{artworks.length})
          </div>
          <div className="w-16"></div>
        </div>

        {/* Galería principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Controles de navegación */}
          <div className="flex items-center justify-between p-4 bg-background/50 border-b border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={prevArtwork}
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold">{artworks[currentIndex].title}</h3>
              <p className="text-sm text-muted-foreground">{artworks[currentIndex].type} • {artworks[currentIndex].year}</p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextArtwork}
              className="flex items-center space-x-1"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Artwork principal */}
          <div className="flex-1 flex relative">
            {/* Imagen principal */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
              <div className="relative max-w-full max-h-full group cursor-pointer" onClick={() => openArtworkDetail(artworks[currentIndex])}>
                {/* Marco del cuadro */}
                <div className="relative bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-800 dark:to-amber-900 p-6 rounded-lg shadow-2xl">
                  <div className="relative bg-white dark:bg-gray-100 p-3 rounded">
                    <Image
                      src={artworks[currentIndex].image}
                      alt={artworks[currentIndex].title}
                      width={500}
                      height={400}
                      className="object-contain rounded max-w-full h-auto group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                  {/* Placa informativa */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-700 dark:bg-amber-800 text-white text-sm px-4 py-2 rounded shadow-lg">
                    {artworks[currentIndex].title} ({artworks[currentIndex].year})
                  </div>
                </div>
                
                {/* Overlay de interacción */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white dark:bg-black text-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                    Click para ver detalles
                  </div>
                </div>
              </div>
            </div>

            {/* Panel de información */}
            <div className="w-80 bg-background/95 border-l border-border/50 p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Descripción</h4>
                  <p className="text-sm mt-2 leading-relaxed">{artworks[currentIndex].description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Herramientas</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {artworks[currentIndex].tools.map((tool: string) => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => openArtworkDetail(artworks[currentIndex])}
                  className="w-full"
                  variant="default"
                >
                  Ver Detalles Completos
                </Button>
              </div>

              {/* Miniaturas */}
              <div className="mt-6 pt-6 border-t border-border/50">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">Todas las Obras</h4>
                <div className="grid grid-cols-3 gap-2">
                  {artworks.map((artwork, index) => (
                    <div
                      key={artwork.id}
                      className={`aspect-square cursor-pointer rounded border-2 overflow-hidden transition-all duration-200 ${
                        index === currentIndex 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Modal de detalle individual */}
      <AnimatePresence>
        {selectedArtwork && (
          <Dialog open={!!selectedArtwork} onOpenChange={() => setSelectedArtwork(null)}>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden">
              <VisuallyHidden.Root>
                <DialogTitle>{selectedArtwork.title}</DialogTitle>
              </VisuallyHidden.Root>
              
              <div className="relative h-full flex flex-col">
                {/* Imagen */}
                <div className="relative flex-1">
                  <Image
                    src={selectedArtwork.image}
                    alt={selectedArtwork.title}
                    fill
                    className="object-contain bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 rounded-full bg-background/80 hover:bg-background/90"
                    onClick={() => setSelectedArtwork(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Información */}
                <div className="p-6 bg-background border-t">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedArtwork.title}</h2>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{selectedArtwork.type}</Badge>
                        <span className="text-muted-foreground">{selectedArtwork.year}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Descripción Completa</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{selectedArtwork.fullDescription}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Notas de Diseño</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{selectedArtwork.designNotes}</p>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Dialog>
  )
}