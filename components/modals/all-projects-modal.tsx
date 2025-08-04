"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'

interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  date: string
}

interface AllProjectsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AllProjectsModal({ isOpen, onClose }: AllProjectsModalProps) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')

  // All projects data (you can move this to a separate file later)
  const allProjects: Project[] = [
    {
      id: 1,
      title: "AidGuide",
      description: "An autonomous navigation system for visually impaired users, combining AI, robotics and real-time urban perception",
      image: "/aidguide/logo.svg",
      tags: ["ROS2", "Python", "AI", "Computer Vision"],
      githubUrl: "https://github.com/vjrivmon/aidguide_04",
      liveUrl: "/under-construction",
      date: "Feb 2025 - Jun 2025"
    },
    {
      id: 2,
      title: "VIMYP",
      description: "A web-app platform for real-time multimodal route optimization and urban mobility analysis",
      image: "/aidguide/logo_vimyp.svg",
      tags: ["HTML", "CSS", "JS", "Smart Cities"],
      githubUrl: "https://github.com/vjrivmon/Codigos_Generales_PBIO_Sprint0",
      liveUrl: "https://vimyp.divdev.es/",
      date: "Sept 2024 - Feb 2025"
    },
    {
      id: 3,
      title: "NeuroSpot",
      description: "An interactive assessment platform using cognitive games and AWS cloud services to screen for early ADHD indicators in children",
      image: "/aidguide/neurospot.svg",
      tags: ["AWS", "React", "Node.js", "AI"],
      githubUrl: "https://github.com/vjrivmon/NeuroSpot",
      liveUrl: "/under-construction",
      date: "May 2025"
    },
    {
      id: 4,
      title: "3D Portfolio Demo",
      description: "Personal portfolio that blends advanced 3D graphics with UX/UI best practices",
      image: "/aidguide/portfolio.png",
      tags: ["3D", "UX/UI", "Three.js", "React"],
      githubUrl: "https://github.com/irenemg8/Portfolio",
      liveUrl: "https://irene.divdev.es/",
      date: "Mar 2025"
    },
    {
      id: 5,
      title: "Geospatial Repository",
      description: "A digital platform for exploring and analyzing thematic cartographic studies",
      image: "/aidguide/repo_carto.png",
      tags: ["QGIS", "Python", "GeoJSON"],
      githubUrl: "https://github.com/irenemg8/Repo-Cartografia",
      liveUrl: "https://cartografia.divdev.es/",
      date: "Jan 2025 - Feb 2025"
    },
    {
      id: 6,
      title: "EcoCity",
      description: "A connected streetlight network with air quality sensors and surveillance for safer, healthier cities",
      image: "/aidguide/logo_ecocity.png",
      tags: ["Android", "Java", "MQTT", "IoT"],
      githubUrl: "https://github.com/vjrivmon/IoT_Farola_",
      liveUrl: "/under-construction",
      date: "Sept 2023 - Feb 2024"
    }
  ]

  const filteredProjects = allProjects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Todos los {t('projects.title')}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 group"
                >
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

                  {/* Project info */}
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {project.date}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
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
                        onClick={() => window.open(project.githubUrl, '_blank')}
                        className="flex-1"
                      >
                        <Github className="h-3 w-3 mr-1" />
                        Code
                      </Button>
                    )}
                    {project.liveUrl && project.liveUrl !== "/under-construction" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.liveUrl, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Live
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No se encontraron proyectos que coincidan con tu búsqueda.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}