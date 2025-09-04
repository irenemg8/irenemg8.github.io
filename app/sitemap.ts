import { MetadataRoute } from 'next'
import { getAllProjectSlugs } from '@/lib/projects-metadata'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://irenemg8.github.io'
  const projectSlugs = getAllProjectSlugs()

  // Página principal
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  // Páginas de proyectos
  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${baseUrl}/project/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.8,
  }))

  return [...routes, ...projectRoutes]
}
