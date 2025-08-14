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
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 border border-border bg-background rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <VisuallyHidden.Root>
          <DialogTitle>Galería de Arte Digital</DialogTitle>
        </VisuallyHidden.Root>
        
        {/* Barra superior estilo macOS - consistente con tu web */}
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
            Galería de Arte - {currentIndex + 1} de {artworks.length}
          </div>
          <div className="w-16"></div>
        </div>

        {/* Galería principal - completamente responsive */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-muted/20 to-background">
          
          {/* Panel de imagen principal */}
          <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 min-h-0">
            <div className="relative group cursor-pointer w-full max-w-2xl" onClick={() => openArtworkDetail(artworks[currentIndex])}>
              {/* Card container responsive */}
              <div className="relative bg-card border border-border/50 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-2 sm:p-3 md:p-4 lg:p-6 group-hover:-translate-y-1">
                <div className="relative bg-muted/30 rounded-lg sm:rounded-xl overflow-hidden">
                  <Image
                    src={artworks[currentIndex].image}
                    alt={artworks[currentIndex].title}
                    width={600}
                    height={450}
                    className="object-contain w-full h-auto max-h-[35vh] sm:max-h-[45vh] md:max-h-[55vh] lg:max-h-[60vh] rounded-lg sm:rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Información de la obra - responsive */}
                <div className="mt-2 sm:mt-3 md:mt-4 text-center">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">{artworks[currentIndex].title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{artworks[currentIndex].type} • {artworks[currentIndex].year}</p>
                </div>
                
                {/* Hover overlay - solo en desktop */}
                <div className="hidden md:flex absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl items-center justify-center">
                  <div className="bg-background/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-lg border border-border/50">
                    Click para ver detalles
                  </div>
                </div>
              </div>
            </div>

            {/* Controles de navegación móvil */}
            <div className="flex md:hidden items-center justify-between w-full mt-4 px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevArtwork}
                className="flex items-center space-x-1 rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  {currentIndex + 1} de {artworks.length}
                </div>
                <h4 className="text-sm font-semibold truncate max-w-[150px]">{artworks[currentIndex].title}</h4>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextArtwork}
                className="flex items-center space-x-1 rounded-xl"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Panel inferior/lateral responsive */}
          <div className="w-full bg-card/50 border-t border-border/50 p-3 sm:p-4 md:hidden">
            {/* Información compacta móvil */}
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-xs leading-relaxed text-foreground">{artworks[currentIndex].description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {artworks[currentIndex].tools.slice(0, 4).map((tool: string) => (
                  <Badge key={tool} variant="secondary" className="text-xs rounded-lg">
                    {tool}
                  </Badge>
                ))}
                {artworks[currentIndex].tools.length > 4 && (
                  <Badge variant="secondary" className="text-xs rounded-lg">
                    +{artworks[currentIndex].tools.length - 4}
                  </Badge>
                )}
              </div>

              <Button 
                onClick={() => openArtworkDetail(artworks[currentIndex])}
                className="w-full rounded-xl"
                variant="default"
                size="sm"
              >
                Ver Detalles
              </Button>
            </div>

            {/* Carrusel horizontal de miniaturas móvil */}
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">Todas las Obras</h4>
              <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
                {artworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentIndex 
                        ? 'border-primary ring-2 ring-primary/20 shadow-lg' 
                        : 'border-border/50'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      width={60}
                      height={60}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel lateral desktop */}
          <div className="hidden md:block w-80 lg:w-96 bg-card/50 border-l border-border/50 p-4 lg:p-6 overflow-y-auto">
            {/* Controles de navegación desktop */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={prevArtwork}
                className="flex items-center space-x-1 rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  {currentIndex + 1} de {artworks.length}
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextArtwork}
                className="flex items-center space-x-1 rounded-xl"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Información completa desktop */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Descripción</h4>
                <p className="text-sm leading-relaxed text-foreground">{artworks[currentIndex].description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Herramientas</h4>
                <div className="flex flex-wrap gap-2">
                  {artworks[currentIndex].tools.map((tool: string) => (
                    <Badge key={tool} variant="secondary" className="text-xs rounded-lg">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => openArtworkDetail(artworks[currentIndex])}
                className="w-full rounded-xl"
                variant="default"
              >
                Ver Detalles Completos
              </Button>
            </div>

            {/* Grid de miniaturas desktop */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Todas las Obras</h4>
              <div className="grid grid-cols-3 gap-3">
                {artworks.map((artwork, index) => (
                  <div
                    key={artwork.id}
                    className={`aspect-square cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 hover:-translate-y-1 ${
                      index === currentIndex 
                        ? 'border-primary ring-2 ring-primary/20 shadow-lg' 
                        : 'border-border/50 hover:border-primary/50 hover:shadow-md'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Modal de detalle individual */}
      <AnimatePresence>
        {selectedArtwork && (
          <Dialog open={!!selectedArtwork} onOpenChange={() => setSelectedArtwork(null)}>
            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] sm:h-[85vh] p-0 overflow-hidden bg-background border border-border rounded-lg sm:rounded-xl">
              <VisuallyHidden.Root>
                <DialogTitle>{selectedArtwork.title}</DialogTitle>
              </VisuallyHidden.Root>
              
              <div className="relative h-full flex flex-col">
                {/* Imagen principal responsive */}
                <div className="relative flex-1 min-h-0 flex items-center justify-center bg-gradient-to-br from-muted/20 to-background p-3 sm:p-4 md:p-6">
                  <div className="relative bg-card border border-border/50 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-2 sm:p-3 md:p-4 max-w-full max-h-full">
                    <div className="relative bg-muted/20 rounded-lg sm:rounded-xl overflow-hidden">
                      <Image
                        src={selectedArtwork.image}
                        alt={selectedArtwork.title}
                        width={800}
                        height={600}
                        className="max-w-[85vw] max-h-[50vh] sm:max-h-[55vh] md:max-h-[60vh] object-contain rounded-lg sm:rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 rounded-full bg-background/80 hover:bg-background/90 backdrop-blur-sm border border-border/50"
                    onClick={() => setSelectedArtwork(null)}
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>

                {/* Panel de información responsive */}
                <div className="p-3 sm:p-4 md:p-6 bg-card border-t border-border/50 flex-shrink-0 max-h-[35vh] sm:max-h-none overflow-y-auto">
                  <div className="text-center mb-4 md:mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 text-foreground">{selectedArtwork.title}</h2>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Badge variant="secondary" className="rounded-lg text-xs">{selectedArtwork.type}</Badge>
                      <span className="text-muted-foreground text-sm">{selectedArtwork.year}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                    <div>
                      <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-foreground">Descripción Completa</h3>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{selectedArtwork.fullDescription}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 md:mb-3 text-sm md:text-base text-foreground">Notas de Diseño</h3>
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{selectedArtwork.designNotes}</p>
                    </div>
                  </div>

                  <div className="text-center mt-4 md:mt-6">
                    <h4 className="font-semibold mb-2 md:mb-3 text-xs md:text-sm text-muted-foreground uppercase tracking-wide">Herramientas</h4>
                    <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center">
                      {selectedArtwork.tools.map((tool: string) => (
                        <Badge key={tool} variant="outline" className="text-xs rounded-lg">
                          {tool}
                        </Badge>
                      ))}
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