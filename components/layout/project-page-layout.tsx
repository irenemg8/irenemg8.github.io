'use client'

import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Calendar, Code, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ProjectMetadata } from '@/lib/projects-metadata'
import Image from 'next/image'

interface ProjectPageLayoutProps {
  project: ProjectMetadata
}

export function ProjectPageLayout({ project }: ProjectPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-x-hidden overflow-y-auto">
      {/* Header con navegación */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Volver al Portfolio
              </Link>
            </Button>
            
            <div className="flex gap-2">
              {project.githubUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button size="sm" asChild>
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Ver Proyecto
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl pb-32 min-h-[calc(100vh-80px)]">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Columna izquierda: Imagen */}
          <div className="space-y-6 lg:space-y-8">
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3] lg:aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
            
            {/* Enlaces adicionales en móvil */}
            <div className="flex flex-wrap gap-3 lg:hidden">
              {project.githubUrl && (
                <Button variant="outline" asChild className="flex-1 min-w-[140px]">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Github className="h-4 w-4" />
                    Ver Código
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild className="flex-1 min-w-[140px]">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Ver en Vivo
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Columna derecha: Información */}
          <div className="space-y-6 lg:space-y-8">
            {/* Título y categoría */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 flex-wrap">
                <Badge variant="secondary" className="gap-1 text-sm px-3 py-1">
                  <Tag className="h-3 w-3" />
                  {project.category}
                </Badge>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {project.title}
              </h1>
              
              <p className="text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Tecnologías */}
            <Card className="p-4 lg:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Code className="h-5 w-5" />
                Tecnologías Utilizadas
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="default" className="text-sm px-3 py-1">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Información adicional */}
            <Card className="p-4 lg:p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Detalles del Proyecto
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Categoría</h3>
                    <p className="text-sm">{project.category}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Estado</h3>
                    <Badge variant="outline" className="text-sm">
                      {project.liveUrl ? 'Desplegado' : 'En desarrollo'}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Descripción Técnica</h3>
                  <p className="text-sm leading-relaxed">
                    Este proyecto forma parte de mi portfolio como {project.category === 'Portfolio' ? 'experiencia inmersiva' : 
                    project.category === 'Game Development' ? 'desarrolladora de juegos' :
                    project.category === 'AI/ML' ? 'especialista en inteligencia artificial' :
                    project.category === 'Web Development' ? 'desarrolladora frontend' :
                    project.category === 'Hackathon' ? 'participante en hackathons' :
                    'desarrolladora de software'}, 
                    utilizando las mejores prácticas de desarrollo y diseño UX/UI.
                  </p>
                </div>
              </div>
            </Card>

            {/* Enlaces principales para desktop */}
            <div className="hidden lg:flex flex-wrap gap-4">
              {project.githubUrl && (
                <Button variant="outline" asChild className="gap-2 flex-1">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    Ver Código en GitHub
                  </a>
                </Button>
              )}
              {project.liveUrl && (
                <Button asChild className="gap-2 flex-1">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Ver Proyecto en Vivo
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sección inferior con navegación */}
        <div className="mt-12 lg:mt-16 pt-8 lg:pt-12 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ¿Te interesa este proyecto? 
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Explora más proyectos en mi portfolio
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link href="/#projects">
                  Ver Todos los Proyectos
                </Link>
              </Button>
              <Button asChild>
                <Link href="/#contact">
                  Contactar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
