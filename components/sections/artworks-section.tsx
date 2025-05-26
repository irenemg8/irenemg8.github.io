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
      title: "Icon Library",
      type: "UI Kit",
      image: "/art/icon.svg?height=600&width=800",
      year: "2025",
      description: "A comprehensive UI kit with over 50 components",
      fullDescription:
        "A comprehensive UI component library designed for modern web applications. Includes over 50 components with various states, dark/light mode variants, and responsive layouts.",
      tools: ["Figma", "Illustrator"],
      designNotes:
        "Designed with accessibility and flexibility in mind. Each component follows a consistent 8px grid system and uses a modular color system that can be easily customized.",
    },
        

    {
      id: 3,
      title: "Nemo - Yummy Fish",
      type: "Low Poly",
      image: "/art/nemo.png?height=600&width=800",
      year: "2024",
      description: "Low poly 3D model of Nemo, designed for the Yummy Fish game.",
      fullDescription:
        "A stylized, low poly 3D model of Nemo, created as a playable character for the video game Yummy Fish. The model emphasizes vibrant colors and minimal geometry to ensure optimal performance in real-time environments, while retaining character expressiveness and appeal. Developed through a process of concept sketching, digital sculpting, and texturing, the model fits seamlessly into the playful and dynamic aesthetic of the game.",
      tools: ["Blender", "3ds Max", "Photoshop"],
      designNotes:
        "The design goal was to capture the iconic look of Nemo using as few polygons as possible, balancing visual fidelity with in-game efficiency. The color palette was selected to maximize readability and player engagement, while the proportions and details were stylized to match the fun, accessible world of Yummy Fish.",
    },

    {
      id: 4,
      title: "Mario Bros's World",
      type: "3D",
      image: "/art/mario.png?height=600&width=800",
      year: "2024",
      description: "A realistic 3D character model, reimagined for a next-generation game environment.",
      fullDescription:
        "A high-fidelity, realistic 3D model of Mario Bros, designed as an exploration of classic character redesign for modern gaming platforms. This version maintains Mario's iconic features. The modeling pipeline included advanced sculpting, materials, and rigging for full animation compatibility. The result is a visually immersive take on an iconic character, suitable for use in cinematic trailers or game environments.",
      tools: ["Blender", "Photoshop"],
      designNotes:
        "The main creative challenge was preserving Mario's world instantly recognizable silhouette and personality while translating it into a realistic art style. Special attention was paid to material lighting to ensure a believable yet appealing result. The color palette references the original games, but is enhanced with nuanced shading for added realism.",
    },

    {
      id: 5,
      title: "Realistic Moon",
      type: "3D",
      image: "/art/luna.png?height=600&width=800",
      year: "2024",
      description: "A photorealistic 3D model of the Moon, animated to rotate on its axis for immersive visualizations.",
      fullDescription:
        "A highly detailed, realistic 3D model of the Moon, designed to showcase advanced texturing, surface detail, and astronomical accuracy. The model features true-to-life lunar surface textures, craters, and shading, with a physically accurate rotation animation. Developed for use in scientific visualization, planetarium software, and high-end animation projects, this asset demonstrates expertise in both realism and real-time rendering techniques.",
      tools: ["Blender", "Photoshop"],
      designNotes:
        "The main creative challenge was achieving a balance between scientific accuracy and visual appeal. High-resolution displacement and normal maps were employed to recreate the Moon's topography, while physically based lighting ensures the lunar surface responds realistically under various illumination conditions. The rotation animation is set to reflect the Moon’s natural axial movement, enhancing realism and educational value.",
    },

    {
      id: 6,
      title: "Yarn Mushroom",
      type: "3D",
      image: "/art/champinon.png?height=600&width=800",
      year: "2024",
      description: "A stylized 3D mushroom character created with a realistic yarn effect.",
      fullDescription:
        "A playful and charming 3D model of a mushroom character, designed to emulate the look and feel of soft yarn or crochet art. Created using advanced hair and fur simulation techniques in Blender, the model features a vibrant red cap and a fuzzy beige stem, complete with expressive eyes and a friendly smile. This piece explores the intersection of digital sculpting and tactile aesthetics, bringing a handcrafted warmth into the digital realm. The model is suitable for use in stylized animations, games, or collectibles visualization.",
      tools: ["Blender", "Photoshop"],
      designNotes:
        "The main creative challenge was achieving a convincing yarn texture that evokes both realism and whimsy. Special attention was given to the grooming of individual fibers and to the lighting setup, enhancing the cozy, approachable feel. The color palette and proportions were carefully selected to maximize character appeal and visual softness.",
    },
    
    {
      id: 7,
      title: "Clay Octopus",
      type: "3D",
      image: "/art/pulpo.png?height=600&width=800",
      year: "2024",
      description: "A cute, stylized 3D octopus character designed with a soft, approachable aesthetic.",
      fullDescription:
        "A charming 3D model of a kawaii-inspired octopus character, crafted to evoke playfulness and friendliness. Featuring rounded forms, vibrant green hues, and expressive facial details, this model embodies the 'soft toy' aesthetic popular in stylized animation and games. Designed with simplicity in mind, the geometry is optimized for both real-time rendering and high-quality stills. The project explores the use of color, shape, and minimalism to maximize emotional appeal and versatility in various digital applications.",
      tools: ["Blender", "Photoshop"],
      designNotes:
        "The main design challenge was achieving a delicate balance between simplicity and character. Strategic use of shading, soft gradients, and exaggerated proportions help bring out the octopus's personality. The model is ideal for use in mobile games, animations, or digital collectibles aimed at a broad audience.",
    },

    
    {
      id: 8,
      title: "Kawaii Forest Doll",
      type: "3D",
      image: "/art/doll.png?height=600&width=800",
      year: "2025",
      description: "A whimsical 3D stylized doll character, set in a magical forest scene.",
      fullDescription:
        "A charming 3D model of a kawaii-inspired doll, presented within a dreamy forest environment. The scene features the main character surrounded by playful forest creatures and whimsical flora, all rendered in a soft monochromatic palette to enhance the storybook atmosphere. Attention to rounded forms, gentle lighting, and expressive facial details creates a warm and inviting aesthetic. This piece explores the intersection of toy design and narrative illustration, making it ideal for animation, games, or collectible design.",
      tools: ["Blender", "Photoshop"],
      designNotes:
        "The core design challenge was to capture innocence and wonder through minimalism and color harmony. Each element—from the doll's gentle features to the playful forest animals—was sculpted to evoke friendliness and emotional resonance. Soft shading and balanced composition ensure the scene feels both cohesive and magical.",
    },
    
    {
      id: 9,
      title: "Enchanted Forest",
      type: "3D",
      image: "/art/forest.gif?height=600&width=800",
      year: "2024",
      description: "A looping 3D animation of a mystical forest with a stylized character centerpiece.",
      fullDescription:
        "A visually captivating 3D animated scene set in an enchanted forest, featuring a stylized character atop an ancient pedestal. The environment is rich with organic details—twisted trees, glowing plants, and atmospheric lighting—that create a sense of magic and wonder. Animated lighting transitions and subtle environmental movements enhance the immersion, while the gentle loop invites continuous viewing. This piece was designed as both an exercise in environmental storytelling and a showcase of real-time animation techniques.",
      tools: ["Blender", "AI"],
      designNotes:
        "The main creative challenge was balancing intricate environmental details with a soft, inviting color palette. Dynamic lighting and animated elements were used to convey a sense of wonder without overwhelming the viewer. The stylized character serves as a focal point, anchoring the scene in a narrative that suggests mystery and discovery.",
    }
    

    
    
    
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
