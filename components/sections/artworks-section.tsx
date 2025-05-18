"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArtworkCard } from "@/components/shared/artwork-card"
import { Badge } from "@/components/ui/badge"

interface ArtworksSectionProps {
  openModal: (type: "artwork", content: any) => void
  title?: string
}

export function ArtworksSection({ openModal, title = "Artworks" }: ArtworksSectionProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const artworks = [
    {
      id: 1,
      title: "Neon City",
      type: "3D Low Poly",
      image: "/placeholder.svg?height=600&width=800",
      year: "2023",
      description: "A low poly 3D cityscape with neon lighting effects",
      fullDescription:
        "A detailed low poly 3D cityscape featuring neon lighting effects and atmospheric fog. Created as an exploration of mood and lighting in stylized environments.",
      tools: ["Blender", "Substance Painter", "Photoshop"],
      designNotes:
        "The goal was to create a visually striking environment with minimal geometry. The color palette was inspired by cyberpunk aesthetics with a focus on contrasting cool and warm tones.",
    },
    {
      id: 2,
      title: "UI Component Library",
      type: "UI Kit",
      image: "/placeholder.svg?height=600&width=800",
      year: "2023",
      description: "A comprehensive UI kit with over 50 components",
      fullDescription:
        "A comprehensive UI component library designed for modern web applications. Includes over 50 components with various states, dark/light mode variants, and responsive layouts.",
      tools: ["Figma", "Illustrator"],
      designNotes:
        "Designed with accessibility and flexibility in mind. Each component follows a consistent 8px grid system and uses a modular color system that can be easily customized.",
    },
    {
      id: 3,
      title: "Abstract Shapes",
      type: "Digital Art",
      image: "/placeholder.svg?height=600&width=800",
      year: "2022",
      description: "Series of abstract compositions with geometric shapes",
      fullDescription:
        "A series of abstract digital compositions exploring the relationship between geometric shapes, color, and texture. Each piece was created through a process of digital collage and manipulation.",
      tools: ["Photoshop", "Illustrator", "Procreate"],
      designNotes:
        "This series explores the tension between order and chaos. The geometric shapes provide structure while organic textures and color gradients add unpredictability.",
    },
    {
      id: 4,
      title: "Character Design",
      type: "3D Character",
      image: "/placeholder.svg?height=600&width=800",
      year: "2022",
      description: "Stylized 3D character design for animation",
      fullDescription:
        "A stylized 3D character designed for animation and game development. Features a complete rig with facial expressions and customizable outfits.",
      tools: ["Blender", "ZBrush", "Substance Painter"],
      designNotes:
        "The character design focuses on readability and expressiveness. The silhouette was carefully crafted to be recognizable from different angles and distances.",
    },
    {
      id: 5,
      title: "Mobile App Redesign",
      type: "UI Kit",
      image: "/placeholder.svg?height=600&width=800",
      year: "2021",
      description: "Complete redesign of a fitness tracking mobile app",
      fullDescription:
        "A comprehensive redesign of a fitness tracking mobile application. The project included user research, wireframing, visual design, and interactive prototyping.",
      tools: ["Figma", "Protopie", "Illustrator"],
      designNotes:
        "The redesign focused on improving usability and engagement. Key improvements included a simplified navigation system, more visual data representations, and a more motivating reward system.",
    },
    {
      id: 6,
      title: "Isometric Room",
      type: "3D Low Poly",
      image: "/placeholder.svg?height=600&width=800",
      year: "2021",
      description: "Isometric 3D room with detailed furnishings",
      fullDescription:
        "An isometric 3D room scene with detailed furnishings and lighting. Created as an exploration of composition and storytelling through environmental design.",
      tools: ["Blender", "Substance Painter", "Photoshop"],
      designNotes:
        "The scene was designed to tell a story about its inhabitant through carefully placed objects and details. The color palette was chosen to create a warm, lived-in atmosphere.",
    },
  ]

  const artworkTypes = Array.from(new Set(artworks.map((artwork) => artwork.type))).sort()

  const filteredArtworks = selectedType ? artworks.filter((artwork) => artwork.type === selectedType) : artworks

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of my creative work including 3D models, UI designs, and digital art.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {selectedType && (
          <Badge variant="outline" className="cursor-pointer" onClick={() => setSelectedType(null)}>
            Clear filter
          </Badge>
        )}
        {artworkTypes.map((type) => (
          <Badge
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedType(type === selectedType ? null : type)}
          >
            {type}
          </Badge>
        ))}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredArtworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} onClick={() => openModal("artwork", artwork)} />
        ))}
      </motion.div>
    </div>
  )
}
