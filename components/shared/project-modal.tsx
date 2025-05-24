"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { X, Github, ExternalLink, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ExpandableBadges } from "./expandable-badges"

interface ProjectModalProps {
  content: any
  onClose: () => void
}

export function ProjectModal({ content, onClose }: ProjectModalProps) {
  if (!content) return null

  const [techStackExpanded, setTechStackExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-background border rounded-2xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="h-64 md:h-80 relative">
            <Image
              src={content.image || "/placeholder.svg"}
              alt={content.title}
              fill
              className="object-cover rounded-t-2xl"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-background/80 hover:bg-background/90"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{content.title}</h2>
                <p className="text-muted-foreground">{content.date}</p>
              </div>
              <div className="md:w-auto md:max-w-xs lg:max-w-sm flex-shrink-0">
                <ExpandableBadges 
                  items={content.techStack || []} 
                  expanded={techStackExpanded} 
                  setExpanded={setTechStackExpanded}
                  itemVariant="outline"
                  expandButtonVariant="default"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Overview</h3>
                <p className="text-muted-foreground">{content.fullDescription}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Challenges</h3>
                <p className="text-muted-foreground">{content.challenges}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Role</h3>
                <p className="text-muted-foreground">{content.role}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              {content.demoUrl && (
                <Button asChild>
                  <a href={content.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Play className="mr-2 h-4 w-4" />
                    View Demo
                  </a>
                </Button>
              )}

              <Button variant="outline" asChild>
                <a href={content.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View Code
                </a>
              </Button>

              <Button variant="outline" asChild>
                <a href={content.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Website
                </a>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
