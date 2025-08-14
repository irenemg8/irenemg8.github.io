"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ExternalLink, Palette } from "lucide-react"

interface ArtworksSectionProps {
  openModal?: (type: "artwork", content: any) => void
  title?: string
}

export function ArtworksSection({ title = "Arte Digital" }: ArtworksSectionProps) {
  const handleOpenGallery = () => {
    const button = document.querySelector('[data-artworks-trigger]') as HTMLButtonElement;
    if (button) button.click();
  }

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
            Explora mi colección de arte digital en una galería inmersiva 3D. 
            Desde modelos low-poly hasta escenas fotorealistas, cada obra cuenta una historia única.
          </p>
        </motion.div>

        {/* Preview de algunas obras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { image: "/art/urbancity.png", title: "UrbanCity", type: "Interactive App" },
            { image: "/art/nemo.png", title: "Nemo - Yummy Fish", type: "Low Poly 3D" },
            { image: "/art/luna.png", title: "Realistic Moon", type: "3D Render" }
          ].map((artwork, index) => (
            <motion.div
              key={artwork.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="relative group cursor-pointer"
              onClick={handleOpenGallery}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 p-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="aspect-video relative overflow-hidden rounded-xl bg-white dark:bg-gray-100">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="font-semibold text-sm">{artwork.title}</h3>
                      <p className="text-xs opacity-80">{artwork.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center"
        >
          <Button 
            onClick={handleOpenGallery}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <Palette className="mr-2 h-5 w-5" />
            Explorar Galería 3D
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="mt-4 text-sm text-muted-foreground">
            🎨 9 obras • 📱 Interactiva • 🌟 Experiencia inmersiva
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          {[
            { icon: "🖼️", title: "Galería Inmersiva", desc: "Navega por un espacio 3D como un museo real" },
            { icon: "🎭", title: "Obras Detalladas", desc: "Información completa de cada creación" },
            { icon: "🖱️", title: "Interactiva", desc: "Controla la cámara y explora libremente" }
          ].map((feature, index) => (
            <div key={feature.title} className="text-center">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}