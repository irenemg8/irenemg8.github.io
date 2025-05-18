"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { X, Github, ExternalLink, Youtube, Users, Award, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HackathonModalProps {
  content: any
  onClose: () => void
}

export function HackathonModal({ content, onClose }: HackathonModalProps) {
  if (!content) return null

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
        <div className="p-6 md:p-8 relative">
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 rounded-full" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              <Image src={content.logo || "/placeholder.svg"} alt={content.eventName} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{content.eventName}</h2>
              <p className="text-muted-foreground">{content.date}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2">{content.projectTitle}</h3>
            <p className="text-muted-foreground mb-4">Role: {content.role}</p>

            {content.awards.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-primary" />
                <div className="flex flex-wrap gap-2">
                  {content.awards.map((award: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {award}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Project Story</h4>
              <p className="text-muted-foreground">{content.fullStory}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5" />
                <h4 className="text-lg font-semibold">Technologies</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {content.technologies?.map((tech: string, index: number) => (
                  <Badge key={index} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <h4 className="text-lg font-semibold">Team</h4>
              </div>
              <ul className="list-disc list-inside text-muted-foreground pl-2">
                {content.team?.map((member: string, index: number) => (
                  <li key={index}>{member}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Challenges</h4>
              <p className="text-muted-foreground">{content.challenges}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {content.mediaUrl && (
              <Button asChild>
                <a href={content.mediaUrl} target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-4 w-4" />
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
                Live Project
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
