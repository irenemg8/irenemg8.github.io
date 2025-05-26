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
  const artworks = [
    {
      id: 1,
      title: "UrbanCity",
      type: "Interactive App",
      image: "/art/urbancity.png?height=600&width=800",
      year: "2025",
      description: "An interactive app promoting urban walking routes in Valencia.",
      fullDescription:
        "An interactive project designed to encourage walking as a sustainable and healthy means of transportation in Valencia. The visualization highlights key urban routes, green areas, and landmarks, offering an immersive experience to motivate citizens to discover their city on foot. Developed with a focus on user engagement and accessibility.",
      tools: ["V0", "Figma", "React", "Typescript", "TailwindCSS"],
      designNotes:
        "The main objective was to create an appealing and informative visual tool that would lower the barrier for citizens to choose walking over other modes of transport. The design leverages a stylized low poly aesthetic inspired by Mediterranean urban landscapes, with a vibrant color palette evoking energy and movement. Interactive elements guide users through the city and showcase benefits of walking for health and the environment.",
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

  const artworkTypes = Array.from(new Set(artworks.map((artwork) => artwork.type || ""))).sort()

  const tagColorSchemes = [
    {
      light: 'hover:bg-pink-50 hover:text-pink-600 hover:border-pink-300 hover:shadow-lg hover:shadow-pink-500/30',
      dark: 'dark:hover:bg-pink-900/70 dark:hover:text-pink-300 dark:hover:border-pink-700 dark:hover:shadow-lg dark:hover:shadow-pink-600/40'
    },
    {
      light: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/30',
      dark: 'dark:hover:bg-blue-900/70 dark:hover:text-blue-300 dark:hover:border-blue-700 dark:hover:shadow-lg dark:hover:shadow-blue-600/40'
    },
    {
      light: 'hover:bg-green-50 hover:text-green-600 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/30',
      dark: 'dark:hover:bg-green-900/70 dark:hover:text-green-300 dark:hover:border-green-700 dark:hover:shadow-lg dark:hover:shadow-green-600/40'
    },
    {
      light: 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/30',
      dark: 'dark:hover:bg-purple-900/70 dark:hover:text-purple-300 dark:hover:border-purple-700 dark:hover:shadow-lg dark:hover:shadow-purple-600/40'
    },
    {
      light: 'hover:bg-teal-50 hover:text-teal-600 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/30',
      dark: 'dark:hover:bg-teal-900/70 dark:hover:text-teal-300 dark:hover:border-teal-700 dark:hover:shadow-lg dark:hover:shadow-teal-600/40'
    },
    {
      light: 'hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-500/30',
      dark: 'dark:hover:bg-yellow-900/70 dark:hover:text-yellow-300 dark:hover:border-yellow-700 dark:hover:shadow-lg dark:hover:shadow-yellow-600/40'
    },
    {
      light: 'hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/30',
      dark: 'dark:hover:bg-indigo-900/70 dark:hover:text-indigo-300 dark:hover:border-indigo-700 dark:hover:shadow-lg dark:hover:shadow-indigo-600/40'
    },
    {
      light: 'hover:bg-slate-100 hover:text-slate-600 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-500/20',
      dark: 'dark:hover:bg-slate-800/70 dark:hover:text-slate-300 dark:hover:border-slate-600 dark:hover:shadow-lg dark:hover:shadow-slate-600/30'
    }
  ];

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
        <h2 className="text-3xl font-bold mb-4 font-pecita">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A curated collection of creative works ranging from 3D models to UI kits and digital art.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {artworkTypes.map((type, index) => {
          const scheme = tagColorSchemes[index % tagColorSchemes.length];
          const hoverClasses = `${scheme.light} ${scheme.dark}`;
          return (
            <Badge
              key={type}
              variant={"outline"} 
              className={`cursor-default transition-all duration-200 ease-in-out ${hoverClasses}`}
            >
              {type}
            </Badge>
          );
        })}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} onClick={() => openModal("artwork", artwork)} />
        ))}
      </motion.div>
    </div>
  )
}
