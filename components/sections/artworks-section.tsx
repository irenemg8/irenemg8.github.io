"use client"

import { motion } from "framer-motion"
import Masonry from "@/components/shared/Masonry"

interface ArtworksSectionProps {
  openModal?: (type: "artwork", content: any) => void
  title?: string
}

export function ArtworksSection({ title = "Arte Digital" }: ArtworksSectionProps) {
  // Artworks items para el masonry
  const artworkItems = [
    {
      id: "1",
      img: "/art/urbancity.png",
      /*url: "https://example.com/urbancity",*/
      height: 600,
    },
    {
      id: "2", 
      img: "/art/nemo.png",
      /*url: "https://example.com/urbancity",*/
      height: 400,
    },
    {
      id: "3",
      img: "/art/doll.png", 
      /*url: "https://example.com/urbancity",*/
      height: 700,
    },
    {
      id: "4",
      img: "/art/luna.png",
      /*url: "https://example.com/urbancity",*/
      height: 500,
    },
    {
      id: "5",
      img: "/art/mario.png",
      /*url: "https://example.com/urbancity",*/
      height: 450,
    },
    {
      id: "6", 
      img: "/art/pulpo.png",
      /*url: "https://example.com/urbancity",*/
      height: 550,
    },
    {
      id: "7",
      img: "/art/champinon.png",
      /*url: "https://example.com/urbancity",*/
      height: 650,
    },
    {
      id: "8",
      img: "/art/forest.gif",
      /*url: "https://example.com/urbancity",*/
      height: 800,
    }
  ]

  return (
    <div id="artworks" className="py-20 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/50 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-orange-900/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-pecita bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explora mi colección de arte digital. Desde modelos 3D hasta ilustraciones, 
            cada obra refleja mi pasión por el diseño y la creatividad digital.
          </p>
        </motion.div>

        {/* Masonry Gallery */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[800px] w-full"
        >
          <Masonry
            items={artworkItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
          />
        </motion.div>
      </div>
    </div>
  )
}