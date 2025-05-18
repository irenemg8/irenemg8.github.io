"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ProjectCard } from "@/components/shared/project-card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ProjectsSectionProps {
  openModal: (type: "project", content: any) => void
  title?: string
}

export function ProjectsSection({ openModal, title = "Projects" }: ProjectsSectionProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const projects = [
    {
      id: 1,
      title: "E-commerce Dashboard",
      description: "A modern dashboard for managing online stores with real-time analytics",
      image: "/placeholder.svg?height=600&width=800",
      date: "2023",
      tags: ["React", "TypeScript", "Tailwind CSS", "Firebase"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      fullDescription:
        "A comprehensive dashboard for e-commerce businesses that provides real-time analytics, inventory management, and customer insights. Built with performance and scalability in mind.",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Firebase", "Chart.js", "React Query"],
      challenges:
        "Implementing real-time data synchronization while maintaining performance was challenging. Used Firebase listeners with careful optimization to prevent unnecessary re-renders.",
      role: "Lead Frontend Developer",
      demoUrl: "https://example.com/demo",
    },
    {
      id: 2,
      title: "3D Product Configurator",
      description: "Interactive 3D product customization tool for furniture",
      image: "/placeholder.svg?height=600&width=800",
      date: "2023",
      tags: ["Three.js", "React", "WebGL", "UX/UI"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      fullDescription:
        "An interactive 3D product configurator that allows users to customize furniture in real-time. Features include material selection, color changes, and component swapping.",
      techStack: ["Three.js", "React Three Fiber", "React", "TypeScript", "Zustand"],
      challenges:
        "Optimizing 3D model loading and rendering for web performance. Implemented progressive loading and LOD (Level of Detail) techniques.",
      role: "3D Developer & UX Designer",
      demoUrl: "https://example.com/demo",
    },
    {
      id: 3,
      title: "AI Content Generator",
      description: "Web app that generates marketing content using AI",
      image: "/placeholder.svg?height=600&width=800",
      date: "2022",
      tags: ["Next.js", "OpenAI", "Vercel AI SDK", "UX/UI"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      fullDescription:
        "A web application that leverages AI to generate marketing content for various platforms. Users can specify tone, length, and target audience to get tailored results.",
      techStack: ["Next.js", "TypeScript", "OpenAI API", "Vercel AI SDK", "Tailwind CSS"],
      challenges:
        "Creating a user-friendly interface for complex AI parameters while ensuring fast response times and handling API rate limits.",
      role: "Full Stack Developer",
      demoUrl: "https://example.com/demo",
    },
    {
      id: 4,
      title: "Design System",
      description: "Comprehensive design system with components and guidelines",
      image: "/placeholder.svg?height=600&width=800",
      date: "2022",
      tags: ["Figma", "React", "Storybook", "UX/UI"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      fullDescription:
        "A comprehensive design system that includes UI components, design tokens, and documentation. Built to ensure consistency across multiple products and teams.",
      techStack: ["Figma", "React", "TypeScript", "Storybook", "styled-components"],
      challenges:
        "Balancing flexibility and consistency while ensuring the system works across different product needs. Created a modular architecture that allows for customization without breaking the core design principles.",
      role: "UI Designer & Frontend Developer",
      demoUrl: "https://example.com/figma",
    },
  ]

  const allTags = Array.from(new Set(projects.flatMap((project) => project.tags))).sort()

  const filteredProjects =
    selectedTags.length > 0
      ? projects.filter((project) => selectedTags.some((tag) => project.tags.includes(tag)))
      : projects

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
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A collection of my recent work spanning web applications, 3D experiences, and design systems.
        </p>
      </motion.div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {selectedTags.length > 0 && (
          <Badge
            variant="secondary"
            className="cursor-pointer flex items-center gap-1"
            onClick={() => setSelectedTags([])}
          >
            <X className="h-3 w-3" />
            <span>Clear filters ({selectedTags.length})</span>
          </Badge>
        )}

        {allTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => {
              setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
            }}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => openModal("project", project)} />
        ))}
      </motion.div>
    </div>
  )
}
