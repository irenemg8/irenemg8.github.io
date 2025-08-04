"use client"

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface ProjectFolder {
  id: string
  name: string
  icon: string
  color: string
}

export function ProjectFolders() {
  const { t } = useLanguage()
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null)
  
  const projects: ProjectFolder[] = [
    { id: '1', name: 'Project 02 (Simplingo)', icon: '📁', color: 'bg-blue-400' },
    { id: '2', name: 'Project 01 (AbsolutMess)', icon: '📁', color: 'bg-blue-400' },
    { id: '3', name: 'Project 03', icon: '📁', color: 'bg-blue-400' },
    { id: '4', name: 'Project 04 (Amazon)', icon: '📁', color: 'bg-blue-400' },
    { id: '5', name: "Don't Look", icon: '⚫', color: 'bg-gray-400' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="absolute top-8 right-8 z-20"
    >
      <div className="space-y-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center cursor-pointer group"
            onMouseEnter={() => setHoveredFolder(project.id)}
            onMouseLeave={() => setHoveredFolder(null)}
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`w-16 h-16 ${project.color} rounded-lg flex items-center justify-center text-3xl shadow-lg mb-2 transition-all duration-200`}
            >
              {project.icon}
            </motion.div>
            <motion.span
              initial={{ opacity: 0.8 }}
              animate={{ opacity: hoveredFolder === project.id ? 1 : 0.8 }}
              className="text-xs macos-text text-gray-700 dark:text-gray-300 text-center max-w-20 leading-tight"
            >
              {project.name}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}