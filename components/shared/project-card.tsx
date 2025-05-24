"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useState } from "react"
import { ExpandableBadges } from "./expandable-badges"

interface Project {
  id: number
  title: string
  description: string
  image: string
  date: string
  tags: string[]
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
}

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [techStackExpanded, setTechStackExpanded] = useState(false);

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div variants={item} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="h-full">
      <Card
        className="overflow-hidden h-full cursor-pointer hover:shadow-md transition-all duration-300 rounded-2xl border border-border/50 flex flex-col"
        onClick={onClick}
      >
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <CardContent className="p-6 flex-grow">
          <div className="mb-2">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-sm text-muted-foreground text-right">{project.date}</p>
          </div>
          <p className="text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
          
          <ExpandableBadges 
            items={project.tags} 
            expanded={tagsExpanded} 
            setExpanded={setTagsExpanded} 
            title="Tags"
          />

        </CardContent>
        <CardFooter className="px-6 py-4 border-t flex justify-between mt-auto">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
              <span className="sr-only">Live Demo</span>
            </a>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
