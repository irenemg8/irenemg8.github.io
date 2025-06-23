"use client"

import { motion } from "framer-motion"
import { X, Building, MapPin, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface GeModalProps {
  content: {
    id: number
    title: string
    position: string
    description: string
    image: string
    date: string
    location: string
    tags: string[]
    fullDescription: string
    techStack: string[]
    challenges: string
    role: string
    company: string
    type: string
  }
  onClose: () => void
}

export function GeModal({ content, onClose }: GeModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-64 md:h-80">
          <Image
            src={content.image || "/placeholder.svg"}
            alt={content.title}
            fill
            className="object-cover"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-background/80 hover:bg-background"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-16rem)] md:max-h-[calc(90vh-20rem)]">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{content.title}</h1>
            <p className="text-xl font-semibold text-primary mb-2">{content.position}</p>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {content.date}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {content.location}
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-1" />
                {content.company}
              </div>
            </div>
            
            <Badge variant="secondary" className="mb-4">
              {content.type}
            </Badge>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">About the Role</h3>
              <p className="text-muted-foreground leading-relaxed">{content.fullDescription}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Key Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {content.techStack.map((tech, index) => (
                  <Badge key={index} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Challenges & Solutions</h3>
              <p className="text-muted-foreground leading-relaxed">{content.challenges}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
              <p className="text-muted-foreground leading-relaxed">{content.role}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag, index) => (
                  <Badge key={index}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 