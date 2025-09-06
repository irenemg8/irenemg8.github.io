"use client"

import { motion } from "framer-motion"
import Masonry from "@/components/shared/Masonry"
import { useLanguage } from '@/contexts/language-context'

interface ArtworksSectionProps {
  openModal?: (type: "artwork", content: any) => void
  title?: string
}

export function ArtworksSection({ title }: ArtworksSectionProps) {
  const { t } = useLanguage()
  // Artworks items para masonry - proporciones naturales sin recorte
  const artworkItems = [
    {
      id: "urbancity",
      img: "/art/urbancity.png",
      url: "https://example.com/urbancity",
      width: 400,
      height: 300,
    },
    {
      id: "nemo", 
      img: "/art/nemo.png",
      url: "https://example.com/nemo",
      width: 350,
      height: 350,
    },
    {
      id: "doll",
      img: "/art/doll.png", 
      url: "https://example.com/doll",
      width: 300,
      height: 400,
    },
    {
      id: "luna",
      img: "/art/luna.png",
      url: "https://example.com/luna",
      width: 380,
      height: 380,
    },
    {
      id: "mario",
      img: "/art/mario.png",
      url: "https://example.com/mario",
      width: 320,
      height: 320,
    },
    {
      id: "pulpo", 
      img: "/art/pulpo.png",
      url: "https://example.com/pulpo",
      width: 360,
      height: 280,
    },
    {
      id: "champinon",
      img: "/art/champinon.png",
      url: "https://example.com/champinon",
      width: 340,
      height: 340,
    },
    {
      id: "forest",
      img: "/art/forest.gif",
      url: "https://example.com/forest",
      width: 280,
      height: 350,
    }
  ]

  return (
    <div id="artworks" className="py-12 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-orange-50/50 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-orange-900/20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-pecita bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            {title || t('sections.artworks.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('sections.artworks.description')}
          </p>
        </motion.div>

        {/* Masonry Gallery - React-bits style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[600px] w-full"
        >
          <Masonry
            items={artworkItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.08}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.96}
            blurToFocus={false}
            colorShiftOnHover={false}
          />
        </motion.div>
      </div>
    </div>
  )
}