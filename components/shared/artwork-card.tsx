"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ExpandableBadges } from "./expandable-badges"

interface Artwork {
  id: number
  title: string
  type: string
  image: string
  year: string
  description: string
  tools: string[]
}

interface ArtworkCardProps {
  artwork: Artwork
  onClick: () => void
}

export function ArtworkCard({ artwork, onClick }: ArtworkCardProps) {
  const [toolsExpanded, setToolsExpanded] = useState(false)

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
      <Card
        className="overflow-hidden cursor-pointer hover:shadow-md transition-all duration-300 rounded-2xl border border-border/50 h-full flex flex-col"
        onClick={onClick}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={artwork.image || "/placeholder.svg"}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <CardContent className="p-6 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold">{artwork.title}</h3>
            <span className="text-sm text-muted-foreground">{artwork.year}</span>
          </div>
          <Badge variant="secondary" className="mb-3 font-normal">
            {artwork.type}
          </Badge>
          <p className="text-muted-foreground line-clamp-2 mb-4">{artwork.description}</p>

          <ExpandableBadges 
            items={artwork.tools || []} 
            expanded={toolsExpanded} 
            setExpanded={setToolsExpanded}
            title="Tools Used"
            itemVariant="outline"
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
