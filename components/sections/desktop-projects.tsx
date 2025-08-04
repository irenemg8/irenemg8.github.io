"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AllProjectsModal } from '@/components/modals/all-projects-modal'

interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
}

export function DesktopProjects() {
  const { t } = useLanguage()
  const [showAllProjects, setShowAllProjects] = useState(false)

  // Select top 4 projects based on priority/importance
  const featuredProjects: Project[] = [
    {
      id: 1,
      title: "AidGuide",
      description: "An autonomous navigation system for visually impaired users, combining AI, robotics and real-time urban perception",
      image: "/aidguide/logo.svg",
      tags: ["ROS2", "Python", "AI", "Computer Vision"],
      githubUrl: "https://github.com/vjrivmon/aidguide_04",
      liveUrl: "/under-construction"
    },
    {
      id: 2,
      title: "VIMYP",
      description: "A web-app platform for real-time multimodal route optimization and urban mobility analysis",
      image: "/aidguide/logo_vimyp.svg",
      tags: ["HTML", "CSS", "JS", "Smart Cities"],
      githubUrl: "https://github.com/vjrivmon/Codigos_Generales_PBIO_Sprint0",
      liveUrl: "https://vimyp.divdev.es/"
    },
    {
      id: 3,
      title: "NeuroSpot",
      description: "An interactive assessment platform using cognitive games and AWS cloud services to screen for early ADHD indicators in children",
      image: "/aidguide/neurospot.svg",
      tags: ["AWS", "React", "Node.js", "AI"],
      githubUrl: "https://github.com/vjrivmon/NeuroSpot",
      liveUrl: "/under-construction"
    },
    {
      id: 4,
      title: "3D Portfolio Demo",
      description: "Personal portfolio that blends advanced 3D graphics with UX/UI best practices, redefining how creative professionals showcase work online",
      image: "/aidguide/portfolio.png",
      tags: ["3D", "UX/UI", "Three.js", "React"],
      githubUrl: "https://github.com/irenemg8/Portfolio",
      liveUrl: "https://irene.divdev.es/"
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="px-6 md:px-12 py-12">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            variants={item}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="macos-project-card macos-glass rounded-xl p-6 group cursor-pointer macos-shadow"
          >
            {/* Project number */}
            <div className="text-xs macos-text font-medium text-gray-500 dark:text-gray-400 mb-3">
              {t('projects.project')} {String(index + 1).padStart(2, '0')}
            </div>

            {/* Project image */}
            <div className="w-full h-32 mb-4 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg'
                }}
              />
            </div>

            {/* Project title */}
            <h3 className="macos-text-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>

            {/* Project description */}
            <p className="text-sm macos-text text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs macos-text px-2 py-1 bg-gray-200/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-300 rounded-full backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>

            {/* Links */}
            <div className="flex gap-2">
              {project.githubUrl && project.githubUrl !== "/under-construction" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.githubUrl, '_blank')
                  }}
                  className="flex-1 macos-button macos-text-semibold"
                >
                  <Github className="h-3 w-3 mr-1" />
                  Code
                </Button>
              )}
              {project.liveUrl && project.liveUrl !== "/under-construction" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(project.liveUrl, '_blank')
                  }}
                  className="flex-1 macos-button macos-text-semibold"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Live
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* View more projects link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mt-8"
      >
        <Button
          variant="ghost"
          onClick={() => setShowAllProjects(true)}
          className="macos-text-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        >
          {t('projects.viewMore')} →
        </Button>
      </motion.div>

      {/* All Projects Modal */}
      <AllProjectsModal 
        isOpen={showAllProjects} 
        onClose={() => setShowAllProjects(false)} 
      />
    </div>
  )
}