"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Building, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { ExpandableBadges } from "./expandable-badges"

interface GeItem {
  id: number
  title: string
  position: string
  description: string
  image: string
  date: string
  location: string
  tags: string[]
  techStack: string[]
  company: string
  type: string
}

interface GeCardProps {
  item: GeItem
  onClick: () => void
}

export function GeCard({ item, onClick }: GeCardProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const cardItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={cardItem} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
      <Card
        className="overflow-hidden h-full cursor-pointer hover:shadow-md transition-all duration-300 rounded-2xl border border-border/50 flex flex-col"
        onClick={onClick}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <CardContent className="p-6 flex-grow">
          <div className="mb-3">
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-lg font-semibold text-primary">{item.position}</p>
            <p className="text-sm text-muted-foreground text-right">{item.date}</p>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {item.location}
          </div>
          
          <p className="text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
          
          <ExpandableBadges 
            items={item.tags || []} 
            expanded={tagsExpanded} 
            setExpanded={setTagsExpanded} 
            title="Skills"
          />

        </CardContent>
        <CardFooter className="px-6 py-4 border-t flex justify-between mt-auto">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="h-4 w-4 mr-1" />
            {item.company}
          </div>
          <Badge variant="secondary" className="text-xs">
            {item.type}
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  )
} 