import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectMetadata, getAllProjectSlugs } from '@/lib/projects-metadata'
import { ResponsiveDesktop } from '@/components/desktop/responsive-desktop'

export const dynamic = 'force-static'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectMetadata(params.slug)
  
  if (!project) {
    return {
      title: 'Proyecto no encontrado | Irene MG'
    }
  }

  const baseUrl = 'https://irenemg8.github.io'
  const projectUrl = `${baseUrl}/project/${project.slug}`
  const imageUrl = `${baseUrl}${project.image}`

  return {
    title: `${project.title} | Irene MG`,
    description: project.description,
    keywords: `${project.technologies.join(', ')}, ${project.category}, diseño ux ui, desarrollo frontend`,
    authors: [{ name: 'Irene Medina García' }],
    creator: 'Irene Medina García',
    publisher: 'Irene Medina García',
    
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: projectUrl,
    },
    
    openGraph: {
      title: project.title,
      description: project.description,
      url: projectUrl,
      siteName: 'Irene Medina García Portfolio',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${project.title} - ${project.description}`,
        },
      ],
      locale: 'es_ES',
      type: 'website',
    },
    
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [imageUrl],
    },
    
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs()
  
  return slugs.map((slug) => ({
    slug: slug,
  }))
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectMetadata(params.slug)
  
  if (!project) {
    notFound()
  }

  // Por ahora, renderizamos el escritorio completo
  // En el futuro podrías crear una vista específica del proyecto
  return (
    <div>
      <ResponsiveDesktop />
      
      {/* Datos estructurados JSON-LD para mejor SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.title,
            description: project.description,
            author: {
              '@type': 'Person',
              name: 'Irene Medina García',
              jobTitle: 'UX/UI Designer & Frontend Developer',
            },
            url: `https://irenemg8.github.io/project/${project.slug}`,
            image: `https://irenemg8.github.io${project.image}`,
            dateCreated: new Date().toISOString(),
            inLanguage: 'es-ES',
            isPartOf: {
              '@type': 'WebSite',
              name: 'Irene Medina García Portfolio',
              url: 'https://irenemg8.github.io'
            },
            ...(project.githubUrl && {
              codeRepository: project.githubUrl
            }),
            ...(project.liveUrl && {
              sameAs: project.liveUrl
            })
          })
        }}
      />
    </div>
  )
}
